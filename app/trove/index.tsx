/* eslint-disable */
"use client";

import borrowerOperationAbi from "../src/constants/abi/BorrowerOperations.sol.json";
import hintHelpersAbi from "../src/constants/abi/HintHelpers.sol.json";
import sortedTroveAbi from "../src/constants/abi/SortedTroves.sol.json";
import troveManagerAbi from "../src/constants/abi/TroveManager.sol.json";
import { BOTANIX_RPC_URL } from "../src/constants/botanixRpcUrl";
import BotanixLOGO from "../../app/assets/images/newpalladium.svg"
import botanixTestnet from "../src/constants/botanixTestnet.json";
import { getContract } from "../src/utils/getContract";
import { Label } from "@radix-ui/react-label";
import Decimal from "decimal.js";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { useBalance, useWalletClient } from "wagmi";
import web3 from "web3";
import { Button } from "@/components/ui/button";
import OpenTroveNotConnected from "./openTroveNotConnected";
import Image from "next/image";
import img1 from "../assets/images/Group 771.png";
import img2 from "../assets/images/Group 663.svg";
import img3 from "../assets/images/Group 661.svg";
import img4 from "../assets/images/Group 666.svg";
import { Knob } from "primereact/knob";
import { TabView, TabPanel } from "primereact/tabview";
import { Repay } from "./Repay";
import { CloseTrove } from "./Close";
import { OpenTrove } from "./OpenTrove";
import Layout from "./layout";
import "../App.css";
import "../../app/App.css"
import "../../components/stabilityPool/Modal.css"
import FullScreenLoader from "@/components/FullScreenLoader";
import { Dialog } from "primereact/dialog";

const Borrow = () => {
  const [userInputs, setUserInputs] = useState({
    depositCollateral: "",
    borrow: "",
  });
  const [rejectionMessage, setRejectionMessage] = useState<string>("");
  const [troveStatus, setTroveStatus] = useState("");
  const [borrowingFee, setBorrowingFee] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  const [ltv, setLtv] = useState(0);
  const [price, setPrice] = useState<number>(0);

  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [hasPriceFetched, setHasPriceFetched] = useState(false);
  const [hasGotStaticData, setHasGotStaticData] = useState(false);
  const [newDebt, setNewDebt] = useState(0);
  const [totalCollateral, setTotalCollateral] = useState(0);
  const [availableBorrow, setAvailableBorrow] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // static
  const [staticLiquidationPrice, setStaticLiquidationPrice] = useState(0);
  const [staticLtv, setStaticLtv] = useState(0);
  const [newUserColl, setNewUserColl] = useState("0")

  const [userInputColl, setUserInputColl] = useState(0)
  const [userInputDebt, setUserInputDebt] = useState(0)

  // API
  const [minDebt, setMinDebt] = useState(0)
  const [borrowRate, setBorrowRate] = useState(0)
  const [lr, setLR] = useState(0)
  const [cCr, setCCR] = useState(0)
  const [mCR, setMCR] = useState(0)
  const [fetchedPrice, setFetchedPrice] = useState(0)
  const [recoveryMode, setRecoveryMode] = useState<boolean>(false)

  const [entireDebtAndColl, setEntireDebtAndColl] = useState({
    debt: "0",
    coll: "0",
    pendingLUSDDebtReward: "0",
    pendingETHReward: "0",
  });
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

  const { data: isConnected } = useWalletClient();
  const { toBigInt } = web3.utils;
  const pow20 = Decimal.pow(10, 20);
  const pow18 = Decimal.pow(10, 18);

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


  useEffect(() => {
    const pow = Decimal.pow(10, 18);
    const _1e18 = toBigInt(pow.toFixed());
    const fetchedData = async () => {
      if (!walletClient) return null;

      const {
        0: debt,
        1: coll,
        2: pendingLUSDDebtReward,
        3: pendingETHReward,
      } = await troveManagerContract.getEntireDebtAndColl(
        walletClient?.account.address
      );
      const collDecimal = new Decimal(coll.toString()); // Convert coll to a Decimal
      const collFormatted = collDecimal.div(_1e18.toString()).toString(); // Divide coll by _1e18 and convert to string

      setEntireDebtAndColl({
        debt: (debt / _1e18).toString(),
        coll: collFormatted,
        pendingLUSDDebtReward: (pendingLUSDDebtReward / _1e18).toString(),
        pendingETHReward: (pendingETHReward / _1e18).toString(),
      });

      if (!hasPriceFetched) {
        try {
          const updatedCollFormatted = new Decimal(entireDebtAndColl.coll).mul(fetchedPrice);
          const updatedPrice = parseFloat(updatedCollFormatted.toString());
          setPrice(updatedPrice);
          setHasPriceFetched(true);
        } catch (error) {
          console.error(error, "Error fetching price");
          setHasPriceFetched(true);
        }
      }
    };

    const getTroveStatus = async () => {
      try {
        if (!walletClient) return null;
        const troveStatusBigInt = await troveManagerContract.getTroveStatus(
          walletClient?.account.address
        );
        const troveStatus =
          troveStatusBigInt.toString() === "1" ? "ACTIVE" : "INACTIVE";
        setTroveStatus(troveStatus)
      } catch (error) {
        console.log(error)
      }
      finally {
        setIsLoading(false);
      }
    }

    const getStaticData = async () => {
      if (!walletClient) return null;
      if (!provider || hasGotStaticData) return null;


      const ltvValue = (Number(entireDebtAndColl.debt) * 100) / ((Number(entireDebtAndColl.coll) * Number(fetchedPrice)) || 1); // if collTotal is 0/null/undefined then it will be divided by 1
      setStaticLtv(ltvValue);

      const divideBy = recoveryMode ? cCr : mCR;
      const liquidationPriceValue = (Number(divideBy) * Number(entireDebtAndColl.debt)) / Number(entireDebtAndColl.coll);
      setStaticLiquidationPrice(liquidationPriceValue);
      setHasGotStaticData(true);
    };

    getTroveStatus();
    fetchedData();
    getStaticData();
  }, [walletClient]);

  useDebounce(
    () => {
      makeCalculations(userInputs.borrow, userInputs.depositCollateral);
    },
    10,
    [userInputs.borrow, userInputs.depositCollateral]
  );

  const handleConfirmClick = async (xBorrow: string, xCollatoral: string) => {
    try {
      setIsModalVisible(true)
      const borrowValue = Number(xBorrow);
      const collValue = Number(xCollatoral);

      if (!walletClient) return null;

      const newDebtValue = Number(entireDebtAndColl.debt) + borrowValue;
      const newCollValue = Number(entireDebtAndColl.coll) + collValue;

      setNewDebt(newDebtValue);

      let NICR = newCollValue / newDebtValue;

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

      const maxFee = "6".concat("0".repeat(16));
      const collDecimal = new Decimal(collValue.toString());
      const collBigint = BigInt(collDecimal.mul(pow18).toFixed());

      const borrowDecimal = new Decimal(borrowValue.toString());
      const borrowBigint = BigInt(borrowDecimal.mul(pow18).toFixed());

      const borrowOpt = await borrowerOperationsContract.adjustTrove(
        maxFee,
        0,
        borrowBigint,
        borrowValue === 0 ? false : true,
        upperHint,
        lowerHint,
        { value: collBigint }
      );
      setIsModalVisible(false)

    } catch (error) {
      console.error(error, "Error");
    }
  };

  const makeCalculations = async (xBorrow: string, xCollatoral: string) => {

    const borrowValue = Number(xBorrow);
    const collValue = Number(xCollatoral);

    if (!walletClient) return null;

    const expectedFeeFormatted = (borrowRate * borrowValue);
    const totalColl = (Number(entireDebtAndColl.coll) + collValue) * Number(fetchedPrice);
    const userColl = (collValue) * Number(fetchedPrice);

    setNewUserColl(String(Number(entireDebtAndColl.coll) + collValue))

    setTotalCollateral(userColl);
    const debtTotal = expectedFeeFormatted + borrowValue + Number(entireDebtAndColl.debt);
    const divideBy = recoveryMode ? cCr : mCR;

    const liquidationPriceValue = (Number(divideBy) * debtTotal) / (Number(entireDebtAndColl.coll) + collValue);

    const ltvValue = ((Number(debtTotal) * 100) / (((Number(entireDebtAndColl.coll) + collValue) * Number(fetchedPrice)))).toFixed(2)
    setLtv(Number(ltvValue));

    const availBorrowValue = totalColl / Number(divideBy) - Number(entireDebtAndColl.debt) - expectedFeeFormatted;
    setAvailableBorrow(Number(availBorrowValue.toFixed(2)));

    setBorrowingFee(Number(expectedFeeFormatted.toFixed(2)));
    setTotalDebt(Number(debtTotal.toFixed(2)));

    { parseFloat(userInputs.depositCollateral) > 0 ? setUserInputColl(1) : setUserInputColl(0) }
    { parseFloat(userInputs.borrow) > 0 ? setUserInputDebt(1) : setUserInputDebt(0) }

    setLiquidationPrice(Number(liquidationPriceValue.toFixed(2)));
  };

  const handlePercentageClick = (percentage: any) => {
    const percentageDecimal = new Decimal(percentage).div(100);
    const pusdBalanceNumber = parseFloat(totalAvailableBorrow.toString());
    if (!isNaN(pusdBalanceNumber)) {
      const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
      const stakeFixed = maxStake;
      setUserInputs({ depositCollateral: userInputs.depositCollateral, borrow: String(stakeFixed) });

    } else {
      console.error("Invalid PUSD balance:", availableToBorrow);
    }
  };

  const handlePercentageClickBTC = (percentage: any) => {
    const percentageDecimal = new Decimal(percentage).div(100);

    const pusdBalanceNumber = parseFloat(balanceData?.formatted || '0');

    if (!isNaN(pusdBalanceNumber)) {
      const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
      const stakeFixed = maxStake.toFixed(8);
      setUserInputs({ depositCollateral: stakeFixed, borrow: userInputs.borrow });
    } else {
      console.error("Invalid PUSD balance:", balanceData?.formatted);
    }
  };

  const divideBy = recoveryMode ? cCr : mCR;
  const availableToBorrow = (Number(entireDebtAndColl.coll) * Number(fetchedPrice)) / Number(divideBy) - Number(entireDebtAndColl.debt);
  const liquidation = Number(divideBy) * (Number(entireDebtAndColl.debt) / Number(entireDebtAndColl.coll));
  const totalAvailableBorrow = Number(newUserColl) * Number(fetchedPrice) / Number(divideBy) - Number(entireDebtAndColl.debt)
  const newLTV = ((Number(entireDebtAndColl.debt) * 100) / ((Number(entireDebtAndColl.coll) * Number(fetchedPrice)))).toFixed(2)

  const isCollInValid = parseFloat(userInputs.depositCollateral) > Number(balanceData?.formatted)
  const isDebtInValid = parseFloat(userInputs.borrow) > totalAvailableBorrow

  return (
    <div>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <Layout>
          {troveStatus === "ACTIVE" && (
            <div style={{ backgroundColor: "#272315" }} className="p-6 ">
              <div className=" flex flex-col md:flex-row gap-10" style={{ backgroundColor: "#2e2a1c" }}>
                <div className="p-2 px-4 ">
                  <p className=" title-text text-gray-500 text-base mb-4">
                    Available to borrow
                  </p>
                  <div className="flex flex-row gap-2 items-center ">
                    <Image src={img2} alt="home" />
                    {Number(availableToBorrow) >= 0 && (
                      <h6 className={`text-white tracking-wider title-text text-3xl`}>
                        {Number(availableToBorrow).toFixed(2)}
                      </h6>
                    )}
                  </div>
                  <div className="flex flex-row justify-between mt-5 gap-4">
                    <div className="flex flex-col text-white  h-28 p-5" style={{ backgroundColor: "" }}>
                      <span className="body-text text-xs text-gray-500">Collateral</span>
                      <span className="body-text text-xl">{Number(entireDebtAndColl.coll).toFixed(8)} BTC</span>
                      <span className="body-text text-xs  p-1 text-gray-500">${(Number(fetchedPrice) * Number(entireDebtAndColl.coll)).toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col text-white w-[9rem]  h-28 p-5" style={{ backgroundColor: "" }} >
                      <span className="body-text text-gray-500 text-xs">Debt</span>
                      <span className="body-text text-xl whitespace-nowrap">{Number(entireDebtAndColl.debt).toFixed(2)} PUSD</span>
                      <span className="body-text text-gray-500 text-xs">${Number(entireDebtAndColl.debt).toFixed(2)}</span>

                    </div>{" "}
                  </div>
                </div>

                <div className="md:w-[14rem]  md:h-[13rem] mt-4" style={{ backgroundColor: "" }}>
                  <div className="flex md:flex-col md:gap-x-0 gap-x-10 gap-y-14 text-white  px-5 py-4">
                    <span></span>
                    <span></span>
                    <div className="flex flex-col">
                      <span className="text-gray-500 body-text">Trove Status</span>
                      <div className={`mt-2 flex p-2 justify-center items-center title-text text-center ${troveStatus === "ACTIVE" ? 'border-lime-400 rounded-sm border title-text' : 'border-red-300 rounded-sm border title-text'}`}>
                        {troveStatus === "ACTIVE" ? (
                          <div className="w-4 h-4 bg-lime-500 title-text border border-lime-500 rounded-full"></div>
                        ) : (
                          <div className="w-4 h-4 bg-red-300 title-text border border-red-300 rounded-full"></div>
                        )}
                        <span className="text-lime-500 title-text ml-1">{troveStatus}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:w-[25rem] h-[13rem] mt-3 px-8 py-4" style={{ backgroundColor: "#343127" }}>
                  <div className="flex justify-between text-white">
                    <div className="flex flex-col gap-y-16 ">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 body-text">Liquidation</span>
                        <span className="body-text body-text">${liquidation.toFixed(2)} USD</span>
                        <span className="text-sm text-gray-500 body-text">${Number(fetchedPrice).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col  items-center">
                      <span className=" text-gray-500 body-text ml-[0.5rem] text-sm -mt-3">loan to value</span>
                      <Knob value={Number(newLTV) || 0} size={135} rangeColor="#78887f" valueColor="#3dde84" strokeWidth={7} readOnly className="text-white" />
                      <div className="flex-col flex items-center space-y-1 -mt-4  w-[4.5rem]">
                        <span className="text-base  ml-[0.5rem] body-text">{Number(newLTV).toFixed(2) || 0}%</span>
                        <span className="text-xs ml-[0.5rem] text-gray-500 body-text">/100%</span>
                        <span className="text-xs text-gray-500 body-text ">YOUR LTV</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="" style={{ backgroundColor: "#272315" }}>
                <div className="md:p-5 pt-20 flex-col flex gap-x-36">
                  <div className=" border w-23rem] border-yellow-800">
                    <TabView className="md:-ml-0 -ml-2">
                      <TabPanel
                        className=" p-1 bg-yellow-400 text-xl title-text "
                        header="Borrow">
                        <div className="pb-10"
                          style={{ backgroundColor: "#272315" }}>
                          <div className="flex-col flex md:flex-row justify-between gap-32">
                            <div>
                              <div className="grid w-full max-w-sm items-start gap-2 mx-auto   p-5">
                                <div className="relative">
                                  <Label
                                    htmlFor="items"
                                    className="text-white body-text text-sm mb-2"
                                  >
                                    Deposit Collatoral
                                  </Label>
                                  <div className="flex items-center  md:w-full md:-ml-0 -ml-3  border border-yellow-300 " style={{ backgroundColor: "#3f3b2d" }}>
                                    <div className='flex items-center h-[3.5rem] '>
                                      <Image src={img3} alt="home" className='ml-1' />
                                      <h3 className='text-white body-text ml-1 '>BTC</h3>
                                      <h3 className='h-full border mx-4'></h3>
                                    </div>
                                    <div className=" justify-between items-center flex gap-x-24">
                                      <input id="items" placeholder='Enter Collateral Amount'
                                        disabled={!isConnected} value={userInputs.depositCollateral}
                                        onChange={(e) => {
                                          const newCollValue = e.target.value;
                                          setUserInputs({ ...userInputs, depositCollateral: newCollValue, });
                                        }}
                                        className="body-text text-sm whitespace-nowrap ml-1 h-[4rem] text-white" style={{ backgroundColor: "#3f3b2d" }}
                                      />
                                      <span className="text-sm body-text">
                                        ${totalCollateral.toFixed(2)}
                                      </span>
                                    </div>

                                  </div>
                                  <div className="flex flex-col md:flex-row gap-x-5 justify-between">
                                    <span className="text-white gap-x-2 flex md:flex-row md:w-full w-20 flex-col ">
                                      <h6 className="text-gray-500 body-text text-sm">
                                        Available{" "}
                                      </h6>
                                      <span className={`text-sm body-text whitespace-nowrap ${parseFloat(userInputs.depositCollateral) > Number(balanceData?.formatted) ? 'text-red-500' : 'text-white'}`}>
                                        Available {Number(balanceData?.formatted).toFixed(8)}{" "}
                                      </span>
                                    </span>
                                    <div className="flex w-full gap-x-3 mt-2">
                                      <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900  body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(25)}>25%</Button>
                                      <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(50)}>50%</Button>
                                      <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(75)}>75%</Button>
                                      <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(100)}>100%</Button>
                                    </div>
                                  </div>
                                </div>

                                <div className="relative">
                                  <Label htmlFor="quantity" className="text-white body-text text-sm mb-2">
                                    Borrow
                                  </Label>

                                  <div className="flex items-center w-[20rem] md:w-full md:-ml-0 -ml-3  border border-yellow-300 " style={{ backgroundColor: "#3f3b2d" }}>
                                    <div className='flex items-center h-[3.5rem] '>
                                      <Image src={img4} alt="home" className='ml-1' />
                                      <h3 className='text-white body-text ml-1 '>PUSD</h3>
                                      <h3 className='h-full border mx-4'></h3>
                                    </div>
                                    <input id="quantity" placeholder="Enter Borrow Amount" value={Math.trunc(Number(userInputs.borrow) * 100) / 100} onChange={(e) => { const newBorrowValue = e.target.value; setUserInputs({ ...userInputs, borrow: newBorrowValue, }); }} className="w-[23.75rem] ml-1 h-[4rem] body-text text-sm whitespace-nowrap text-white" style={{ backgroundColor: "#3f3b2d" }} />
                                  </div>
                                  <div className="flex flex-col  md:flex-row gap-x-5  justify-between">
                                    <span className="text-white gap-x-2 flex md:flex-row  md:w-full w-20 flex-col">
                                      <h6 className="text-gray-500 body-text  text-sm">
                                        Available{" "}
                                      </h6>
                                      {Number(totalAvailableBorrow) >= 0 && (
                                        <h6 className={`text-sm body-text whitespace-nowrap ${parseFloat(userInputs.borrow) > totalAvailableBorrow ? 'text-red-500' : 'text-white'}`}>
                                          {Math.trunc(Number(totalAvailableBorrow) * 100) / 100}
                                          <div></div>
                                        </h6>
                                      )}
                                    </span>
                                    <div className="flex w-full gap-x-3 mt-2">
                                      <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900  body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(25)}>25%</Button>
                                      <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(50)}>50%</Button>
                                      <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(75)}>75%</Button>
                                      <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(100)}>100%</Button>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleConfirmClick(userInputs.borrow, userInputs.depositCollateral)}
                                    className={`mt-5 w-full title-text h-[3rem]
                                   ${isDebtInValid || isCollInValid || (userInputColl + userInputDebt == 0)
                                        ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer bg-yellow-300 text-black'}`}
                                    disabled={(isDebtInValid || isCollInValid || (userInputColl + userInputDebt == 0))}>
                                    UPDATE TROVE
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="w-fit p-6 md:pt-12  mx-2 md:mx-4  md:mt-10 text-sm"
                              style={{ backgroundColor: "#2e2a1c" }}>

                              <div className="mb-4 space-y-4">
                                <div className="flex md:gap-28 text-white mb-2 justify-between">
                                  <span className="body-text text-xs whitespace-nowrap text-gray-500">Loan-To-Value</span>
                                  <span className="text-xs whitespace-nowrap body-text">
                                    <div className="flex items-center gap-x-3">
                                      <span className=" w-28 p-1">
                                        {Number(newLTV).toFixed(2)} %
                                      </span>
                                      <>
                                        {userInputColl + userInputDebt >= 1 && (
                                          <>
                                            <span className="text-yellow-300 text-lg">
                                              {`--->`}
                                            </span>
                                            <span className={`overflow-x-clip text-sm body-text  w-28 p-1 ${ltv > (100 / Number(divideBy)) ? 'text-red-500' : ''}`}>{" "}{Number(ltv).toFixed(2)} %</span>
                                          </>
                                        )}
                                      </>
                                    </div>
                                  </span>
                                </div>
                                <div className="flex md:gap-30 text-white mb-2 justify-between">
                                  <span className="body-text text-xs whitespace-nowrap text-gray-500">Liquidation Price</span>
                                  <span className="body-text text-xs whitespace-nowrap">
                                    <div className="flex items-center gap-x-3">
                                      <span className=" w-28 p-1">
                                        {Number(liquidation).toFixed(2)} PUSD
                                      </span>
                                      <>
                                        {userInputColl + userInputDebt >= 1 && (
                                          <>
                                            <span className="text-yellow-300 text-lg">
                                              {`--->`}
                                            </span>
                                            <span className="body-text text-xs whitespace-nowrap w-28  p-1">{" "}{Number(liquidationPrice).toFixed(2)} PUSD</span>
                                          </>
                                        )}
                                      </>
                                    </div>
                                  </span>
                                </div>
                                <div className="flex  text-white mb-2 justify-between">
                                  <span className="body-text text-xs whitespace-nowrap text-gray-500">Total Debt</span>
                                  <span className="body-text text-xs whitespace-nowrap">
                                    <div className="flex items-center gap-x-2">
                                      <span className=" w-28 p-1">
                                        {Number(entireDebtAndColl.debt).toFixed(2)} PUSD
                                      </span>
                                      <>
                                        {userInputColl == 1 && (
                                          <>
                                            <span className="text-yellow-300 text-lg">
                                              {`--->`}
                                            </span>
                                            <span className="ml-05 w-28  p-1">{" "}{Number(totalDebt).toFixed(2)} PUSD</span>
                                          </>
                                        )}
                                      </>
                                    </div>
                                  </span>
                                </div>
                                <div className="flex  text-white mb-2 justify-between">
                                  <span className="text-xs whitespace-nowrap body-text text-gray-500">Total Collateral</span>
                                  <span className="body-text text-xs whitespace-nowrap">
                                    <div className="flex items-center gap-x-2">
                                      <span className=" p-1 w-28">
                                        {Number(entireDebtAndColl.coll).toFixed(8)} BTC
                                      </span>
                                      <>
                                        {userInputColl == 1 && (
                                          <>
                                            <span className="text-yellow-300 text-lg">
                                              {`--->`}
                                            </span>
                                            <span className="ml-05  p-1 w-28">{" "}{Number(newUserColl).toFixed(8)} BTC</span>
                                          </>
                                        )}
                                      </>
                                    </div>
                                  </span>
                                </div>
                              </div>
                              {userInputDebt == 1 && (
                                <div className=" space-y-4">
                                  <div className="flex  text-white mb-2 justify-between">
                                    <span className="body-text body-text text-xs whitespace-nowrap text-gray-500">Borrowing Fee</span>
                                    <span className="body-text body-text p-1 w-28 text-xs whitespace-nowrap">
                                      {Number(borrowingFee).toFixed(2)} PUSD
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </TabPanel>
                      <TabPanel className="p-1 bg-yellow-400 text-xl  title-text " header="Repay">
                        <div className="w-full h-full border p-4 border-yellow-400" style={{ backgroundColor: "#272315" }}>
                          <Repay coll={parseFloat(entireDebtAndColl.coll)} debt={parseFloat(entireDebtAndColl.debt)} lr={lr}
                            fetchedPrice={Number(fetchedPrice)} borrowRate={borrowRate} minDebt={minDebt} recoveryMode={recoveryMode} cCR={cCr} mCR={mCR} />
                        </div>
                      </TabPanel>
                      <TabPanel className="p-1 bg-yellow-400 text-xl title-text" header="Close">
                        <div className="w-full h-full" style={{ backgroundColor: "#272315" }}  >
                          <CloseTrove entireDebtAndColl={parseFloat(entireDebtAndColl.coll)} debt={parseFloat(entireDebtAndColl.debt)} liquidationReserve={lr} />
                        </div>
                      </TabPanel>
                    </TabView>
                  </div>
                </div>
              </div>
              <Dialog visible={isModalVisible} onHide={() => setIsModalVisible(false)}>
                <>
                  <div className="waiting-container bg-white">
                    <div className="waiting-message text-lg title-text text-white whitespace-nowrap">Waiting for Confirmation... ✨.</div>
                    <Image src={BotanixLOGO} className="waiting-image" alt="gif" />
                  </div>
                </>
              </Dialog>
            </div>
          )}
          {troveStatus === "INACTIVE" && (
            <div className="w-full h-auto" style={{ backgroundColor: "#272315" }}>
              <OpenTrove />
            </div>
          )}
          {!isConnected && (
            <OpenTroveNotConnected />
          )}
        </Layout>
      )}
    </div>
  );
};

export default Borrow;