/* eslint-disable */

"use client";

import { Label } from "@/components/ui/label";
import borrowerOperationAbi from "../src/constants/abi/BorrowerOperations.sol.json";
import hintHelpersAbi from "../src/constants/abi/HintHelpers.sol.json";
import priceFeedAbi from "../src/constants/abi/PriceFeedTestnet.sol.json";
import sortedTroveAbi from "../src/constants/abi/SortedTroves.sol.json";
import troveManagerAbi from "../src/constants/abi/TroveManager.sol.json";
import { BOTANIX_RPC_URL } from "../src/constants/botanixRpcUrl";
import botanixTestnet from "../src/constants/botanixTestnet.json";
import { getContract } from "../src/utils/getContract";
import Decimal from "decimal.js";
import { readContract } from '@wagmi/core'
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { useBalance, useWalletClient } from "wagmi";
import Image from "next/image";
import img1 from "../assets/images/Group 771.png";
import img3 from "../assets/images/Group 661.svg";
import img4 from "../assets/images/Group 666.svg";
import { wagmiConfig } from "../src/config/config";
import { borrowerOperations } from "../src/constants/abi/borrowerOperations";

export const OpenTrove = () => {
  const [userInputs, setUserInputs] = useState({
    collatoral: "0",
    borrow: "0",
  });

  const [calculatedValues, setCalculatedValues] = useState({
    liquidationReserve: 0,
    expectedFee: 0,
    expectedDebt: 0,
    collateralRatio: 0,
  });

  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [price, setPrice] = useState<number>(0);
  const [hasPriceFetched, setHasPriceFetched] = useState(false);
  const [minimumBorrow, setMinimumBorrow] = useState("0");

  const { data: walletClient } = useWalletClient();

  const { data: balanceData } = useBalance({
    address: walletClient?.account.address,
  });

  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);

  const troveManagerContract = getContract(
    botanixTestnet.addresses.troveManager,
    troveManagerAbi,
    provider
  );

  const sortedTrovesContract = getContract(
    botanixTestnet.addresses.sortedTroves,
    sortedTroveAbi,
    provider
  );

  const hintHelpersContract = getContract(
    botanixTestnet.addresses.hintHelpers,
    hintHelpersAbi,
    provider
  );

  const borrowerOperationsContract = getContract(
    botanixTestnet.addresses.borrowerOperations,
    borrowerOperationAbi,
    walletClient // We are using walletClient because we need to update/modify data in blockchain.
  );

  const priceFeedContract = getContract(
    botanixTestnet.addresses.priceFeed,
    priceFeedAbi,
    provider
  );
  const pow18 = Decimal.pow(10, 18);
  const pow20 = Decimal.pow(10, 20);

  useEffect(() => {
    const getPrice = async () => {
      try {
        if (!provider || hasPriceFetched) return null;
        const fetchedPrice = await priceFeedContract.getPrice();
        const convertedFetchedPrice = ethers.formatUnits(fetchedPrice, 18);
        setPrice(Number(convertedFetchedPrice));

        const minDebt = await readContract(wagmiConfig, {
          abi: borrowerOperations,
          address: '0x46ECf770a99d5d81056243deA22ecaB7271a43C7',
          functionName: 'MIN_NET_DEBT',
        })
        const formattedMInDebt = ethers.formatUnits(minDebt, 18)
        setMinimumBorrow(formattedMInDebt)


      }
      catch (error) {
        console.error(error, "error");
      } finally {
        setHasPriceFetched(true);
      }
    };

    const getRecoveryModeStatus = async () => {
      const fetchPrice: bigint = await priceFeedContract.getPrice();
      const status: boolean = await troveManagerContract.checkRecoveryMode(
        fetchPrice
      );
      setIsRecoveryMode(status);
    };

    getRecoveryModeStatus();
    getPrice();
  }, []);

  useDebounce(
    () => {
      makeCalculations(userInputs.borrow, userInputs.collatoral);
    },
    10,
    [userInputs.borrow, userInputs.collatoral]
  );

  const handleConfirmClick = async (xBorrow: string, xCollatoral: string) => {
    const collValue = Number(xCollatoral);
    const borrowValue = Number(xBorrow);

    const liquidationReserve =
      await troveManagerContract.LUSD_GAS_COMPENSATION();
    const liquidationReserveFormated = Number(
      ethers.formatUnits(liquidationReserve, 18)
    );

    const expectedBorrowingRate = await troveManagerContract.getBorrowingRateWithDecay();

    const borrowingRate = Number(ethers.formatUnits(expectedBorrowingRate, 18));

    const expectedFeeFormatted = (borrowingRate * borrowValue) / 100;

    const expectedDebt = borrowValue + expectedFeeFormatted + liquidationReserveFormated;

    let NICR = collValue / expectedDebt;

    const NICRDecimal = new Decimal(NICR.toString());
    const NICRBigint = BigInt(NICRDecimal.mul(pow20).toFixed());

    const numTroves = await sortedTrovesContract.getSize();
    const numTrials = numTroves * BigInt("15");

    const { 0: approxHint } = await hintHelpersContract.getApproxHint(
      NICRBigint,
      numTrials,
      42
    ); // random seed of 42

    const { 0: upperHint, 1: lowerHint } =
      await sortedTrovesContract.findInsertPosition(
        NICRBigint,
        approxHint,
        approxHint
      );

    const collDecimal = new Decimal(collValue.toString());
    const collBigint = BigInt(collDecimal.mul(pow18).toFixed());

    const borrowDecimal = new Decimal(borrowValue.toString());
    const borrowBigint = BigInt(borrowDecimal.mul(pow18).toFixed());

    const maxFee = "6".concat("0".repeat(16)); // Slippage protection: 5%
    await borrowerOperationsContract.openTrove(
      maxFee,
      borrowBigint,
      upperHint,
      lowerHint,
      { value: collBigint }
    );

  };

  const makeCalculations = async (xBorrow: string, xCollatoral: string) => {
    const collValue = Number(xCollatoral);
    const borrowValue = Number(xBorrow);

    const liquidationReserve =
      await troveManagerContract.LUSD_GAS_COMPENSATION();
    const liquidationReserveFormated = Number(
      ethers.formatUnits(liquidationReserve, 18)
    );
    const expectedBorrowingRate = await troveManagerContract.getBorrowingRateWithDecay();

    const borrowingRate = Number(ethers.formatUnits(expectedBorrowingRate, 18));
    const expectedFeeFormatted = (borrowingRate * borrowValue) / 100;
    const expectedDebt = borrowValue + expectedFeeFormatted + liquidationReserveFormated;
    const collRatio = (collValue * price * 100) / expectedDebt;

    setCalculatedValues({
      ...calculatedValues,
      expectedFee: expectedFeeFormatted,
      expectedDebt,
      liquidationReserve: liquidationReserveFormated,
      collateralRatio: collRatio,
    });
  };

  const totalCollateral = Number(userInputs.collatoral) * price;

  const divideBy = isRecoveryMode ? 1.5 : 1.1;
  const maxBorrow = totalCollateral / divideBy - (calculatedValues.liquidationReserve + calculatedValues.expectedFee);

  const loanToValue = (calculatedValues.expectedDebt * 100) / (totalCollateral || 1);

  const liquidationPrice = (1.1 * calculatedValues.expectedDebt) / (Number(Number(userInputs.collatoral)) || 1);

  const bothInputsEntered = userInputs.collatoral !== "0" && userInputs.borrow !== "0";
  return (
    <div className="h-full body-text ">
      <div className="p-4 ">
        <div
          className="ml-1 md:ml-2 p-4 md:w-full w-[22rem]"
          style={{ backgroundColor: "#3f3b2d" }}
        >
          <div className="flex  w-full">
            <div className="h-[172px] notMobileDevice w-[22%]">
              <Image src={img1} alt="home" className="-mt-5" />
            </div>
            <div className=" h-fit py-2 space-y-10">
              <div>
                <p className="text-white title-text  text-2xl font-bold ">
                  You dont have an existing trove
                </p>
              </div>
              <div>
                <p className="text-yellow-300 body-text text-left text-xl mb-2">
                  Open a zero interest trove
                </p>
                <p className="text-gray-200 body-text text-left text-base">
                  Borrow against BTCs interest free
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container flex flex-row justify-between gap-x-24 mt-2">

        <div className="grid w-1/2 items-start gap-2 text-white md:p-5">
          <div className="pb-3 w-[20rem] md:w-full">
            <Label htmlFor="items" className="body-text mb-2 text-gray-500">
              Deposit Collatoral
            </Label>
            <div className="flex p-1 items-center space-x-2 border border-yellow-300">
              <Image src={img3} alt="home" />
              <span className="text-white body-text text-sm">BTC</span>
              <input
                id="items"
                placeholder="0.000 BTC"
                type="number"
                value={userInputs.collatoral}
                onChange={(e) => {
                  const newCollValue = e.target.value;
                  setUserInputs({ ...userInputs, collatoral: newCollValue });
                  makeCalculations(userInputs.borrow, newCollValue || "0");
                }}
                className="w-[23.75rem] h-[4rem] text-white"
                style={{ backgroundColor: "#272315" }}
              />
              <span className="md:max-w-[5rem] md:p-2  h-full">{totalCollateral.toFixed(2)}</span>
            </div>
            <div className="pt-2">
              <span className="body-text  text-gray-500">
                Available {Number(balanceData?.formatted).toFixed(6)}{" "}
                {balanceData?.symbol}
              </span>
            </div>
          </div>
          <div className="w-[20rem] md:w-full">
            <Label className="body-text mb-2" htmlFor="quantity">Borrow PUSD</Label>
            <div className="flex p-1 items-center md:space-x-2 border border-yellow-300">
              <Image className="" src={img4} alt="home" />
              <span className="text-white body-text text-sm">PSUD</span>
              <input
                id="quantity"
                placeholder="Enter Borrow Amount"
                type="number"
                value={userInputs.borrow}
                onChange={(e) => {
                  const newBorrowValue = e.target.value;
                  setUserInputs({ ...userInputs, borrow: newBorrowValue });
                  makeCalculations(
                    newBorrowValue || "0",
                    userInputs.collatoral
                  );
                }}
                className="md:w-[23.75rem] h-[4rem] text-white body-text"
                style={{ backgroundColor: "#272315" }}
              />
            </div>
            <div className="pt-2 flex items-center justify-between borde2 p-2">
              <span className="w-1/2 body-text text-gray-500">Available {maxBorrow.toFixed(2)}</span>{" "}
              {Number(userInputs.borrow) < Number(minimumBorrow) && (
                <span className="text-red-500 ml-1 body-text md:w-1/2">
                  Borrow amount should be greater than {Number(minimumBorrow).toFixed(0)}
                </span>
              )}
            </div>
          </div>
          <button onClick={() => handleConfirmClick(userInputs.borrow, userInputs.collatoral)}
            className="mt-10 h-[3rem] bg-yellow-300 hover:bg-yellow-400 body-text text-black font-bold">
            Open Trove
          </button>
        </div>
        {bothInputsEntered && Number(userInputs.borrow) >= 500 ? (
          <div className="w-4/5 notMobileDevice mt-8 p-5 border-yellow-200 h-fit space-y-10  text-white"
            style={{ backgroundColor: "#3f3b2d" }}
          >
            <div className="flex whitespace-nowrap justify-between">
              <span className="body-text text-sm text-gray-500">Loan-To-Value</span>
              <span className={`overflow-x-clip text-sm body-text ${loanToValue > 91 ? 'text-red-500' : ''}`}>{loanToValue.toFixed(2)} % </span>
            </div>
            <div className="flex body-text whitespace-nowrap justify-between">
              <span className="body-text text-sm text-gray-500">Liq. Reserve</span>
              <span className="body-text text-sm body-text">
                {Number(calculatedValues.liquidationReserve).toFixed(2)} {" "} PUSD
              </span>
            </div>
            <div className="flex justify-between">
              <span className=" text-sm text-gray-500">Liquidation Price</span>
              <span className=" text-sm body-text">{liquidationPrice.toFixed(2)} PUSD</span>
            </div>
            <div className="flex justify-between">
              <span className=" text-gray-500">Borrowing Fee</span>
              <span className=" text-sm body-text">{(Number(calculatedValues.expectedFee) * 100).toFixed(2)} {" "} PUSD</span>
            </div>
            <div className="flex justify-between">
              <span className=" text-sm body-text text-gray-500">Total Debt</span>
              <span className=" text-sm body-text">{(calculatedValues.expectedDebt).toFixed(2)} {" "} PUSD</span>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
