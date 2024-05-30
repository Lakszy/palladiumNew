/* eslint-disable */

"use client";

import { Label } from "@/components/ui/label";
import borrowerOperationAbi from "../src/constants/abi/BorrowerOperations.sol.json";
import hintHelpersAbi from "../src/constants/abi/HintHelpers.sol.json";
import sortedTroveAbi from "../src/constants/abi/SortedTroves.sol.json";
import { borrowerOperationsABI } from "../src/constants/abi/borrowerOperations";
import { BOTANIX_RPC_URL } from "../src/constants/botanixRpcUrl";
import botanixTestnet from "../src/constants/botanixTestnet.json";
import { getContract } from "../src/utils/getContract";
import Decimal from "decimal.js";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { useBalance, useWalletClient, useWriteContract } from "wagmi";
import Image from "next/image";
import img1 from "../assets/images/Group 771.png";
import img3 from "../assets/images/Group 661.svg";
import img4 from "../assets/images/Group 666.svg";
import floatPUSD from "../assets/images/floatPUSD.png";
import { Button } from "@/components/ui/button";

export const OpenTrove = () => {
  const [userInputs, setUserInputs] = useState({
    collatoral: "",
    borrow: "",
  });
  const [isloading, setIsLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [minDebt, setMinDebt] = useState(0)
  const [borrowRate, setBorrowRate] = useState(0)
  const [lr, setLR] = useState(0)
  const [cCr, setCCR] = useState(0)
  const [mCR, setMCR] = useState(0)
  const { data: hash, writeContract } = useWriteContract()
  const [fetchedPrice, setFetchedPrice] = useState(0)
  const [recoveryMode, setRecoveryMode] = useState<boolean>()


  const [calculatedValues, setCalculatedValues] = useState({
    expectedFee: 0,
    expectedDebt: 0,
    collateralRatio: 0,
  });

  const { data: isConnected } = useWalletClient();
  const { data: walletClient } = useWalletClient();
  const { data: balanceData } = useBalance({
    address: walletClient?.account.address,
  });

  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);

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
    walletClient
  );

  const pow18 = Decimal.pow(10, 18);
  const pow20 = Decimal.pow(10, 20);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.palladiumlabs.org/protocol/metrics");
        const data = await response.json();
        const protocolMetrics = data[0];

        setRecoveryMode(protocolMetrics.recoveryMode);
        setFetchedPrice(protocolMetrics.priceBTC);
        setMCR(protocolMetrics.MCR)
        setCCR(protocolMetrics.CCR)
        setLR(protocolMetrics.LR)
        setBorrowRate(protocolMetrics.borrowRate)
        setMinDebt(protocolMetrics.minDebt)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


  const handleConfirmClick = async (xBorrow: string, xCollatoral: string) => {

    setIsModalVisible(true);
    const collValue = Number(xCollatoral);
    const borrowValue = Number(xBorrow);

    const expectedFeeFormatted = (borrowRate * borrowValue) / 100;
    const expectedDebt = borrowValue + expectedFeeFormatted + lr;

    let NICR = collValue / expectedDebt;

    const NICRDecimal = new Decimal(NICR.toString());
    const NICRBigint = BigInt(NICRDecimal.mul(pow20).toFixed(0));
    const numTroves = await sortedTrovesContract.getSize();
    const numTrials = numTroves * BigInt("15");

    const { 0: approxHint } = await hintHelpersContract.getApproxHint(
      NICRBigint,
      numTrials,
      42
    );

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

    const maxFee = "6".concat("0".repeat(16));
    await borrowerOperationsContract.openTrove(
      maxFee,
      borrowBigint,
      upperHint,
      lowerHint,
      { value: collBigint }
    );

    setIsModalVisible(false)
  };

  const makeCalculations = async (xBorrow: string, xCollatoral: string) => {
    setIsLoading(true)
    try {
      const collValue = Number(xCollatoral);
      const borrowValue = Number(xBorrow);

      const expectedFeeFormatted = (borrowRate * borrowValue);
      const expectedDebt = Number(borrowValue + expectedFeeFormatted + lr);

      const collRatio = (collValue * fetchedPrice * 100) / Number(expectedDebt);

      setCalculatedValues({
        ...calculatedValues,
        expectedFee: expectedFeeFormatted,
        expectedDebt,
        collateralRatio: collRatio,
      });
    }
    catch (error) {
      console.error(error)
    }
    finally {
      setIsLoading(false)
    }
  };

  const handlePercentageClick = (percentage: any) => {
    const percentageDecimal = new Decimal(percentage).div(100);
    const pusdBalanceNumber = parseFloat(maxBorrow.toString());
    if (!isNaN(pusdBalanceNumber)) {
      const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
      const stakeFixed = maxStake.toFixed(2);
      setUserInputs({ collatoral: userInputs.collatoral, borrow: stakeFixed });

    } else {
      console.error("Invalid PUSD balance:");
    }
  };

  const handlePercentageClickBTC = (percentage: any) => {
    const percentageDecimal = new Decimal(percentage).div(100);

    const pusdBalanceNumber = parseFloat(balanceData?.formatted || '0');

    if (!isNaN(pusdBalanceNumber)) {
      const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
      const stakeFixed = maxStake.toFixed(8);

      setUserInputs({ collatoral: stakeFixed, borrow: userInputs.borrow });
    } else {
      console.error("Invalid PUSD balance:", balanceData?.formatted);
    }
  };

  useDebounce(() => {
    makeCalculations(userInputs.borrow, userInputs.collatoral);
  }, 10, [userInputs.borrow, userInputs.collatoral]
  );

  const totalCollateral = Number(userInputs.collatoral) * fetchedPrice;
  const divideBy = recoveryMode ? cCr : mCR;
  const maxBorrow = totalCollateral / Number(divideBy) - (lr + calculatedValues.expectedFee);
  const loanToValue = (calculatedValues.expectedDebt * 100) / (totalCollateral || 1);
  const liquidationPrice = (Number(divideBy) * calculatedValues.expectedDebt) / (Number(Number(userInputs.collatoral)) || 1);
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
              <Image src={floatPUSD} alt="home" className="-mt-12" />
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
            <div className="flex p-1 w-[21rem] md:w-full items-center space-x-2 border border-yellow-300">
              <div className='flex items-center h-[3.5rem] '>
                <Image src={img3} alt="home" className='ml-1' />
                <h3 className='text-white body-text ml-1 mr-3 '>BTC</h3>
                <h3 className='h-full border mx-4'></h3>
              </div>
              <input id="items" placeholder="Enter Collateral Amount" value={userInputs.collatoral} onChange={(e) => { const newCollValue = e.target.value; setUserInputs({ ...userInputs, collatoral: newCollValue }); makeCalculations(userInputs.borrow, newCollValue || "0"); }} className=" w-full md:w-[23.75rem]  h-[4rem] text-white" style={{ backgroundColor: "#272315" }} />
              <span className="md:max-w-[5rem] md:p-2  h-full">${totalCollateral.toFixed(2)}</span>
            </div>
            <div className="pt-2 flex md:flex-row flex-col  items-center justify-between ">
              <span className={`text-sm w-full body-text whitespace-nowrap ${parseFloat(userInputs.collatoral) > Number(balanceData?.formatted) ? 'text-red-500' : 'text-white'}`}>
                Available {Number(balanceData?.formatted).toFixed(8)}{" "}
              </span>
              <div className="flex  gap-x-3 mt-2">
                <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900  body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(25)}>25%</Button>
                <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(50)}>50%</Button>
                <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(75)}>75%</Button>
                <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(100)}>100%</Button>
              </div>
            </div>
          </div>
          <div className="w-[20rem] md:w-full">
            <Label className="body-text mb-2" htmlFor="quantity">Borrow PUSD</Label>
            <div className="flex p-1 items-center md:space-x-2 border border-yellow-300">
              <div className='flex items-center h-[3.5rem] '>
                <Image src={img4} alt="home" className='ml-1' />
                <h3 className='text-white body-text mx-1'>PUSD</h3>
                <h3 className='h-full border mx-4'></h3>
              </div>
              <input id="quantity" placeholder="Enter Borrow Amount" value={userInputs.borrow} onChange={(e) => { const newBorrowValue = e.target.value; setUserInputs({ ...userInputs, borrow: newBorrowValue }); makeCalculations(userInputs.collatoral, newBorrowValue || "0"); }} className="md:w-[23.75rem] h-[4rem] text-white body-text" style={{ backgroundColor: "#272315" }} />
            </div>
            <div className="pt-2 flex flex-col md:flex-row items-center justify-between borde2 p-2">
              <span className={`text-sm w-full body-text whitespace-nowrap ${parseFloat(userInputs.borrow) > maxBorrow ? 'text-red-500' : 'text-white'}`}>
                Available {maxBorrow >= 0 ? Math.floor(maxBorrow * 100) / 100 : "0.00"}
              </span>
              <div className="flex gap-x-3 mt-2">
                <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900  body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(25)}>25%</Button>
                <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(50)}>50%</Button>
                <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(75)}>75%</Button>
                <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(100)}>100%</Button>
              </div>
              {Number(userInputs.borrow) < minDebt && (Number(userInputs.borrow) > 0) && (
                <span className="text-red-500 ml-1 body-text md:w-1/2">Borrow amount should be greater than {minDebt} </span>
              )}
            </div>
          </div>
          <button
            onClick={() => handleConfirmClick(userInputs.borrow, userInputs.collatoral)}
            className={`mt-10 h-[3rem] bg-yellow-300 title-text text-black font-bold ${(!userInputs.borrow || !userInputs.collatoral) ? ' cursor-not-allowed opacity-50' : 'hover:scale-95 bg-yellow-300'}`}
            disabled={!userInputs.borrow || !userInputs.collatoral || loanToValue > (100 / Number(divideBy))
              || parseFloat(userInputs.borrow) > maxBorrow || parseFloat(userInputs.collatoral) > Number(balanceData?.formatted)
              || parseFloat(userInputs.borrow) <= minDebt || isModalVisible}
            style={{
              cursor: (!userInputs.borrow || isModalVisible ||
                !userInputs.collatoral ||
                loanToValue > (100 / Number(divideBy)) ||
                parseFloat(userInputs.borrow) > maxBorrow ||
                parseFloat(userInputs.collatoral) > Number(balanceData?.formatted) ||
                parseFloat(userInputs.borrow) <= minDebt)
                ? 'not-allowed' : 'pointer',
              opacity: (!userInputs.borrow || isModalVisible ||
                !userInputs.collatoral ||
                loanToValue > (100 / Number(divideBy)) ||
                parseFloat(userInputs.borrow) > maxBorrow ||
                parseFloat(userInputs.collatoral) > Number(balanceData?.formatted) ||
                parseFloat(userInputs.borrow) <= minDebt)
                ? 0.5 : 1
            }}>
            {isModalVisible ? "Opening Trove..." : "Open Trove"}
          </button>
        </div>
        {bothInputsEntered && Number(userInputs.borrow) >= minDebt && parseFloat(userInputs.collatoral) < Number(balanceData?.formatted) ? (
          <div className="w-4/5 notMobileDevice mt-8 p-5 border-yellow-200 h-fit space-y-10  text-white"
            style={{ backgroundColor: "#3f3b2d" }}
          >
            <div className="flex whitespace-nowrap justify-between">
              <span className="body-text text-sm text-gray-500">Loan-To-Value</span>
              {!isloading ? <span className={`overflow-x-clip text-sm body-text ${loanToValue > (100 / Number(divideBy)) ? 'text-red-500' : ''}`}>{loanToValue.toFixed(2)} % </span> : "--"}
            </div>
            <div className="flex body-text whitespace-nowrap justify-between">
              <span className="body-text text-sm text-gray-500">Liq. Reserve</span>
              <span className="body-text text-sm body-text">
                {lr} PUSD
              </span>
            </div>
            <div className="flex justify-between">
              <span className=" text-sm text-gray-500">Liquidation Price</span>
              <span className=" text-sm body-text">{liquidationPrice.toFixed(2)} PUSD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm body-text text-gray-500">Borrowing Fee</span>
              <span className="text-sm body-text">
                {calculatedValues.expectedFee.toFixed(2)} PUSD
              </span>
            </div>
            <div className="flex justify-between">
              <span className=" text-sm body-text text-gray-500">Total Debt</span>
              {Number((calculatedValues.expectedDebt)) > lr ? <span className=" text-sm body-text">{(calculatedValues.expectedDebt).toFixed(2)} {" "} PUSD</span> : "---"}
            </div>
            <div className="flex justify-between">
              <span className=" text-sm body-text text-gray-500">Total Collateral</span>
              <span className=" text-sm body-text">{(totalCollateral).toFixed(2)} {" "} PUSD</span>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div >
  );
};
