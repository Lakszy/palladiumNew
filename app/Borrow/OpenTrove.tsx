/* eslint-disable */

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { useBalance, useWalletClient } from "wagmi";
import Image from "next/image";
import img1 from "../assets/images/Group 771.png";
import img2 from "../assets/images/Group 663.png";
import img3 from "../assets/images/Group 661.svg";
import img4 from "../assets/images/Group 666.svg";
import web3 from "web3";

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
    // const _1e18 = toBigInt(pow.toFixed());
    const getPrice = async () => {
      try {
        if (!provider || hasPriceFetched) return null;
        const fetchedPrice = await priceFeedContract.getPrice();
        // const convertedFetchedPrice = (fetchedPrice / _1e18).toString();
        const convertedFetchedPrice = ethers.formatUnits(fetchedPrice, 18);
        setPrice(Number(convertedFetchedPrice));
      } catch (error) {
        console.error(error, "error");
      } finally {
        setHasPriceFetched(true);
      }
    };

    const getRecoveryModeStatus = async () => {
      const status: boolean = await troveManagerContract.checkRecoveryMode(
        price
      );
      setIsRecoveryMode(status);
    };

    console.log(walletClient, "walletClient");
    getRecoveryModeStatus();
    getPrice();
  }, []);

  useDebounce(
    () => {
      makeCalculations(userInputs.borrow, userInputs.collatoral);
    },
    1000,
    [userInputs.borrow, userInputs.collatoral]
  );

  const { toBigInt } = web3.utils;

  const handleConfirmClick = async (xBorrow: string, xCollatoral: string) => {
    const collValue = Number(xCollatoral);
    const borrowValue = Number(xBorrow);

    const liquidationReserve =
      await troveManagerContract.LUSD_GAS_COMPENSATION();
    const liquidationReserveFormated = Number(
      ethers.formatUnits(liquidationReserve, 18)
    );

    const expectedBorrowingRate =
      await troveManagerContract.getBorrowingRateWithDecay();

    const borrowingRate = Number(ethers.formatUnits(expectedBorrowingRate, 18));

    const expectedFeeFormatted = (borrowingRate * borrowValue) / 100;
    console.log(expectedFeeFormatted, "fefeefefef", xBorrow);

    const expectedDebt =
      borrowValue + expectedFeeFormatted + liquidationReserveFormated;

    // let NICR = collValue / borrowValue;
    // console.log(NICR, "NICR");

    let NICR = collValue / expectedDebt;
    console.log(NICR, "NICR");

    const NICRDecimal = new Decimal(NICR.toString());
    const NICRBigint = BigInt(NICRDecimal.mul(pow20).toFixed());
    console.log(NICRBigint, "NICRBigint");

    // const bigNICRWithDecimals = BigInt(ethers.parseUnits(NICR.toString(), 20));

    // console.log(bigNICRWithDecimals);

    const numTroves = await sortedTrovesContract.getSize();
    const numTrials = numTroves * BigInt("15");
    console.log(numTrials, "numTrials");

    const { 0: approxHint } = await hintHelpersContract.getApproxHint(
      NICRBigint,
      numTrials,
      42
    ); // random seed of 42

    console.log(approxHint, "approxHint");

    // Use the approximate hint to get the exact upper and lower hints from the deployed SortedTroves contract
    const { 0: upperHint, 1: lowerHint } =
      await sortedTrovesContract.findInsertPosition(
        NICRBigint,
        approxHint,
        approxHint
      );

    console.log(upperHint, lowerHint, "upperHint", "lowerHint");

    const collDecimal = new Decimal(collValue.toString());
    const collBigint = BigInt(collDecimal.mul(pow18).toFixed());
    console.log(collBigint, "collBigint");

    const borrowDecimal = new Decimal(borrowValue.toString());
    const borrowBigint = BigInt(borrowDecimal.mul(pow18).toFixed());
    console.log(borrowBigint, "borrowBigint");

    // Finally, call openTrove with the exact upperHint and lowerHint
    const maxFee = "5".concat("0".repeat(16)); // Slippage protection: 5%
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

    const expectedBorrowingRate =
      await troveManagerContract.getBorrowingRateWithDecay();

    const borrowingRate = Number(ethers.formatUnits(expectedBorrowingRate, 18));

    const expectedFeeFormatted = (borrowingRate * borrowValue) / 100;
    console.log(expectedFeeFormatted, "fefeefefef", xBorrow);

    const expectedDebt =
      borrowValue + expectedFeeFormatted + liquidationReserveFormated;

    const collRatio = (collValue * price * 100) / expectedDebt;
    console.log(collRatio, "collRatio");

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
  const maxBorrow =
    totalCollateral / divideBy -
    (calculatedValues.liquidationReserve + calculatedValues.expectedFee);

  const loanToValue =
    (calculatedValues.expectedDebt * 100) / (totalCollateral || 1);

  const liquidationPrice =
    (divideBy * calculatedValues.expectedDebt) /
    Number(Number(userInputs.collatoral) || 1);

  return (
    <div className=" h-full font-mono pl-5 pr-10 pt-10 pb-10">
      <div
        className="ml-2 border p-2 border-yellow-300"
        style={{ backgroundColor: "#3f3b2d" }}
      >
        <div className="flex gap-x-4 ">
          <div className="h-[192px]  w-1/3">
            <Image src={img1} alt="home" />
          </div>
          <div className="">
            <p className="font-mono  text-white text-center text-3xl font-bold mb-[1.25rem]">
              You dont have an existing trove
            </p>
            <p className=" font-mono text-yellow-300 text-left text-2xl mb-2">
              Open a zero interest trove
            </p>
            <p className="text-white font-mono font-semibold text-left text-lg">
              Borrow against BTCs interest free
            </p>
          </div>
        </div>
      </div>

      <div className="container  flex flex-row justify-between gap-32 mt-2">

        <div className="grid w-1/2 items-start gap-2 mx-auto  text-white p-5">
          <div className="pb-3">
            <Label htmlFor="items" className="font-mono mb-2">
              Deposit Collatoral
            </Label>
            <div className="flex p-1 items-center space-x-2 border border-yellow-300">
              <Image src={img3} alt="home" />
              <span className="text-white text-sm">BTC</span>
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
              <span className="w-[5rem] p-2 h-full">{totalCollateral}</span>
            </div>
            <div className="pt-2">
              <span>
                Available {Number(balanceData?.formatted).toFixed(3)}{" "}
                {balanceData?.symbol}
              </span>
            </div>
          </div>
          <div className="">
            <Label className="font-mono mb-2" htmlFor="quantity">Borrow PUSD</Label>
            <div className="flex p-1 items-center space-x-2 border border-yellow-300">
              <Image className="" src={img4} alt="home" />
              <span className="text-white text-sm">PSUD</span>
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

                className="w-[23.75rem] h-[4rem] text-white"
                style={{ backgroundColor: "#272315" }}
              />
            </div>
            <div className="pt-2 flex items-center justify-between borde2 p-2">
              <span className="w-1/2">Available {maxBorrow}</span>{" "}
              {Number(userInputs.borrow) < 500 && (
                <span className="text-red-500 ml-1 font-mono w-1/2">
                  Borrow amount should be greater than 500
                </span>
              )}
            </div>
          </div>
          <Button onClick={() =>
            handleConfirmClick(userInputs.borrow, userInputs.collatoral)
          }
            className="mt-10 w-[22rem] h-[3rem] bg-yellow-300 text-black font-bold"
          >
            Open Trove
          </Button>
        </div>

        <div className="w-4/5 mt-8 p-5 border-yellow-200 h-fit space-y-10  text-white"
          style={{ backgroundColor: "#3f3b2d" }}
        >
          <div className="flex whitespace-nowrap justify-between">
            <span className="">Loan-To-Value</span>
            <span className=" overflow-x-clip">{loanToValue.toFixed(2)} % </span>
          </div>
          <div className="flex whitespace-nowrap justify-between">
            <span>Liq. Reserve</span>
            <span>
              {Number(calculatedValues.liquidationReserve).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Liquidation Price</span>
            <span>{liquidationPrice} USD</span>
          </div>
          <div className="flex justify-between">
            <span>Borrowing Fee</span>
            <span>{calculatedValues.expectedFee}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Debt</span>
            <span>{calculatedValues.expectedDebt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};