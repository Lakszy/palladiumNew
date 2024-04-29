/* eslint-disable */
"use client";

import borrowerOperationAbi from "../src/constants/abi/BorrowerOperations.sol.json";
import hintHelpersAbi from "../src/constants/abi/HintHelpers.sol.json";
import priceFeedAbi from "../src/constants/abi/PriceFeedTestnet.sol.json";
import sortedTroveAbi from "../src/constants/abi/SortedTroves.sol.json";
import troveManagerAbi from "../src/constants/abi/TroveManager.sol.json";
import { BOTANIX_RPC_URL } from "../src/constants/botanixRpcUrl";
import botanixTestnet from "../src/constants/botanixTestnet.json";
import { getContract } from "../src/utils/getContract";
import { Label } from "@radix-ui/react-label";
import Decimal from "decimal.js";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { useAccount, useBalance, useWalletClient } from "wagmi";
import web3 from "web3";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomConnectButton } from "@/components/connectBtn";
import Image from "next/image";
import img1 from "../assets/images/Group 771.png";
import img2 from "../assets/images/Group 663.svg";
import img3 from "../assets/images/Group 661.svg";
import img4 from "../assets/images/Group 666.svg";
import { Knob } from "primereact/knob";
import { TabView, TabPanel } from "primereact/tabview";
import Repay from "./Repay";
import { CloseTrove } from "./Close";
import { OpenTrove } from "./OpenTrove";
import Layout from "./layout";
import "../App.css";
import { Dialog } from 'primereact/dialog';
import BotanixLOGO from "../../app/assets/images/newpalladium.svg"
import "../../app/App.css"
import "../../components/stabilityPool/Modal.css"

const Borrow = () => {
  const [userInputs, setUserInputs] = useState({
    depositCollateral: "0",
    borrow: "0",
  });
  const [troveStatus, setTroveStatus] = useState("");
  const [borrowingFee, setBorrowingFee] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  const [ltv, setLtv] = useState(0);
  const [lr, setLr] = useState(0);
  const [price, setPrice] = useState<number>(0);

  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
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
  const [staticTotalCollateral, setStaticTotalCollateral] = useState(0);
  const [staticTotalDebt, setStaticTotalDebt] = useState(0);
  const [staticCollAmount, setStaticCollAmount] = useState(0);
  const [staticBorrowingFee, setStaticBorrowingFee] = useState(0);
  const [value, setValue] = useState("0");
  const [userInput, setUserInput] = useState("0");
  const [newUserColl, setNewUserColl] = useState("0")
  const [isLtvLoading, setIsLtvLoading] = useState(false);
  const [isTotalCollateralLoading, setIsTotalCollateralLoading] = useState(false);


  const [userInputBTC, setUserInputBTC] = useState("0");


  const [systemLTV, setSystemLTV] = useState("0");
  const [entireDebtAndColl, setEntireDebtAndColl] = useState({
    debt: "0",
    coll: "0",
    pendingLUSDDebtReward: "0",
    pendingETHReward: "0",
  });
  const [fetchedPrice, setFetchedPrice] = useState("0");

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
  const { data: isConnected } = useWalletClient();
  const { toWei, toBigInt } = web3.utils;
  const pow20 = Decimal.pow(10, 20);
  const pow18 = Decimal.pow(10, 18);

  useEffect(() => {
    const pow = Decimal.pow(10, 18);
    const pow16 = Decimal.pow(10, 16);
    const _1e18 = toBigInt(pow.toFixed());
    const _1e16 = toBigInt(pow16.toFixed());
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
          const fetchPrice: bigint = await priceFeedContract.getPrice();

          const fetchPriceDecimal = new Decimal(fetchPrice.toString());
          const fetchPriceFormatted = fetchPriceDecimal
            .div(_1e18.toString())
            .toString();
          // setPriceBTC()
          setFetchedPrice(fetchPriceFormatted);

          const updatedCollFormatted = new Decimal(collFormatted).mul(fetchPriceFormatted);
          const updatedPrice = parseFloat(updatedCollFormatted.toString());

          setPrice(updatedPrice);
          setHasPriceFetched(true);
        } catch (error) {
          console.error(error, "Error fetching price");
          setHasPriceFetched(true);
        }
        finally {
          setIsLoading(false);
        }
      }
    };

    const getLiquidationReserve = async () => {
      const lr = await troveManagerContract.LUSD_GAS_COMPENSATION();
      const lrFormatted = Number(ethers.formatUnits(lr, 18));
      setLr(lrFormatted);
    };

    const getRecoveryModeStatus = async () => {
      const fetchPrice: bigint = await priceFeedContract.getPrice();
      const status: boolean = await troveManagerContract.checkRecoveryMode(
        fetchPrice
      );
      setIsRecoveryMode(status);
    };

    const getStaticData = async () => {
      if (!walletClient) return null;
      if (!provider || hasGotStaticData) return null;

      const { 0: debt, 1: coll } = await troveManagerContract.getEntireDebtAndColl(walletClient.account.address);

      const expectedBorrowingRate = await troveManagerContract.getBorrowingRateWithDecay();

      const borrowingRate = Number(ethers.formatUnits(expectedBorrowingRate, 18));
      const expectedFeeFormatted = borrowingRate / 100;
      setStaticBorrowingFee(expectedFeeFormatted);

      const debtFormatted = Number(ethers.formatUnits(debt, 18));
      const collFormatted = Number(ethers.formatUnits(coll, 18));

      setStaticCollAmount(collFormatted);

      const totalColl = collFormatted * price;
      setStaticTotalCollateral(totalColl);
      setStaticTotalDebt(debtFormatted);

      const ltvValue = (debtFormatted * 100) / (totalColl || 1); // if collTotal is 0/null/undefined then it will be divided by 1
      setStaticLtv(ltvValue);

      const divideBy = isRecoveryMode ? 1.5 : 1.1;
      const liquidationPriceValue = (1.1 * debtFormatted) / collFormatted;
      setStaticLiquidationPrice(liquidationPriceValue);
      setHasGotStaticData(true);
    };

    getRecoveryModeStatus();
    getLiquidationReserve();
    fetchedData();
    getTroveStatus();
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
      const { 0: debt, 1: coll } =
        await troveManagerContract.getEntireDebtAndColl(
          walletClient.account.address
        );

      const debtFormatted = Number(ethers.formatUnits(debt, 18));
      const collFormatted = Number(ethers.formatUnits(coll, 18));

      const newDebtValue = debtFormatted + borrowValue;
      const newCollValue = collFormatted + collValue;

      setNewDebt(newDebtValue);

      let NICR = newCollValue / newDebtValue;

      const NICRDecimal = new Decimal(NICR.toString());
      const NICRBigint = BigInt(NICRDecimal.mul(pow20).toFixed(0));

      const numTroves = await sortedTrovesContract.getSize();
      const numTrials = numTroves * BigInt("15");

      const { 0: approxHint } = await hintHelpersContract.getApproxHint(
        // NICR,
        NICRBigint,
        numTrials,
        42
      );

      const { 0: upperHint, 1: lowerHint } =
        await sortedTrovesContract.findInsertPosition(
          // NICR,
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
    finally {
      setIsLoading(false); // Update loading state once fetching is complete
    }
  };

  const makeCalculations = async (xBorrow: string, xCollatoral: string) => {
    setIsLtvLoading(true);
    setIsTotalCollateralLoading(true);

    try {
      const borrowValue = Number(xBorrow);
      const collValue = Number(xCollatoral);

      if (!walletClient) return null;

      const { 0: debt, 1: coll } =
        await troveManagerContract.getEntireDebtAndColl(
          walletClient.account.address
        );

      const expectedBorrowingRate =
        await troveManagerContract.getBorrowingRateWithDecay();

      const borrowingRate = Number(ethers.formatUnits(expectedBorrowingRate, 18));
      const debtFormatted = Number(ethers.formatUnits(debt, 18));
      const collFormatted = Number(ethers.formatUnits(coll, 18));

      const expectedFeeFormatted = (borrowingRate * borrowValue);
      const totalColl = (collFormatted + collValue) * Number(fetchedPrice);

      const userColl = (collValue) * Number(fetchedPrice);

      setNewUserColl(String(collFormatted + collValue))

      setTotalCollateral(userColl);
      const debtTotal = expectedFeeFormatted + borrowValue + debtFormatted;

      const ltvValue = (debtTotal * 100) / ((Number(newUserColl) || 1) * Number(fetchedPrice));
      const divideBy = isRecoveryMode ? 1.1 : 1.5;

      const liquidationPriceValue = (1.1 * debtTotal) / (collFormatted + collValue);
      const availBorrowValue = totalColl / divideBy - debtFormatted - expectedFeeFormatted;
      setAvailableBorrow(Number(availBorrowValue.toFixed(3)));

      setBorrowingFee(Number(expectedFeeFormatted.toFixed(3)));
      setTotalDebt(Number(debtTotal.toFixed(3)));
      setLtv(Number(ltvValue.toFixed(3)));
      setLiquidationPrice(Number(liquidationPriceValue.toFixed(3)));
    }
    catch (error) {
      console.error("Error while making calculations:", error);
    }
    finally {
      setIsLtvLoading(false);
      setIsTotalCollateralLoading(false);

    }
  };

  const divideBy = isRecoveryMode ? 1.5 : 1.1;
  const availableToBorrow = price / divideBy - Number(entireDebtAndColl.debt);
  const liquidation = 1.1 * (Number(entireDebtAndColl.debt) / Number(entireDebtAndColl.coll));


  const handlePercentageClick = (percentage: any) => {
    const pow = Decimal.pow(10, 18);
    const _1e18 = toBigInt(pow.toFixed());
    const percentageDecimal = new Decimal(percentage).div(100);


    const pusdBalanceNumber = parseFloat(availableToBorrow.toString());
    if (!isNaN(pusdBalanceNumber)) {
      const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
      const stakeFixed = maxStake.toFixed();
      setUserInput(stakeFixed);
    } else {
      console.error("Invalid PUSD balance:", availableToBorrow);
    }
  };

  const handlePercentageClickBTC = (percentage: any) => {
    const pow = Decimal.pow(10, 18);
    const percentageDecimal = new Decimal(percentage).div(100);

    const pusdBalanceNumber = parseFloat(balanceData?.formatted || '0');

    if (!isNaN(pusdBalanceNumber)) {
      const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
      const stakeFixed = maxStake.toFixed();
      setUserInputBTC(stakeFixed);
    } else {
      console.error("Invalid PUSD balance:", balanceData?.formatted);
    }
  };

  const getTroveStatus = async () => {
    if (!walletClient) return null;
    const troveStatusBigInt = await troveManagerContract.getTroveStatus(
      walletClient?.account.address
    );
    const troveStatus =
      troveStatusBigInt.toString() === "1" ? "ACTIVE" : "INACTIVE";
    setTroveStatus(troveStatus);

    setValue((Number(entireDebtAndColl.debt) / (Number(entireDebtAndColl.coll) * Number(fetchedPrice)) * 100).toFixed(3));

  };
  getTroveStatus();

  const isUpdateDisabled = parseFloat(userInputs.borrow) > availableToBorrow || parseFloat(userInputs.depositCollateral) > totalCollateral;
  return (
    <div>
      <Layout>
        {troveStatus === "ACTIVE" && (
          <div style={{ backgroundColor: "#272315" }} className="p-6 ">
            <div className=" flex flex-col md:flex-row gap-10" style={{ backgroundColor: "#2b2924" }}>
              <div className="p-2">
                <p className=" title-text text-gray-500 text-base mb-4">
                  Available to borrow
                </p>
                <div className="flex flex-row gap-2 items-center ">
                  <Image src={img2} alt="home" />
                  <span className="text-white tracking-wider title-text text-3xl">
                    {availableToBorrow.toFixed(2)} PUSD
                  </span>
                </div>
                <div className="flex flex-row justify-between mt-5 gap-4">
                  <div className="flex flex-col text-white  h-28 p-5" style={{ backgroundColor: "#343127" }}>
                    <span className="body-text text-gray-500">Collateral</span>
                    <span className="body-text ">{Number(entireDebtAndColl.coll).toFixed(4)} BTC</span>
                    <span className="body-text text-sm p-1 text-gray-500">${price.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col text-white w-[9rem]  h-28 p-5" style={{ backgroundColor: "#343127" }} >
                    <span className="body-text text-gray-500">Debt</span>
                    <span className="body-text whitespace-nowrap">{Number(entireDebtAndColl.debt).toFixed(2)} PUSD</span>
                    <span className="body-text text-gray-500 text-sm ">${Number(entireDebtAndColl.debt).toFixed(2)}</span>

                  </div>{" "}
                </div>
              </div>

              <div className="md:w-[14rem]  md:h-[13rem] mt-4" style={{ backgroundColor: "#343127" }}>
                <div className="flex md:flex-col md:gap-x-0 gap-x-10 gap-y-14 text-white px-5 py-4">
                  <div className="flex flex-col">
                    <span className="text-gray-500 body-text">System LTV</span>
                    <span className="text-gray-500 body-text ">{systemLTV}%</span>
                  </div>
                  <div className="flex flex-col ">
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
                    <Knob value={Number(value) || 0} size={135} rangeColor="#78887f" valueColor="#3dde84" strokeWidth={7} readOnly className="text-white" />
                    <div className="flex-col flex items-center space-y-1 -mt-4  w-[4.5rem]">
                      <span className="text-base  ml-[0.5rem] body-text">{value || 0}%</span>
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
                                <div
                                  className="flex items-center w-[20rem] md:w-full md:-ml-0 -ml-3  border border-yellow-300 "
                                  style={{ backgroundColor: "#3f3b2d" }}
                                >
                                  <Image src={img3} alt="home" />{" "}
                                  <span className="text-white body-text text-sm">
                                    BTC
                                  </span>
                                  <input id="items" placeholder="0.000 BTC" type="number" disabled={!isConnected} value={userInputs.depositCollateral} onChange={(e) => { const newCollValue = e.target.value; setUserInputs({ ...userInputs, depositCollateral: newCollValue, }); }} className="body-text text-sm whitespace-nowrap ml-1 h-[4rem] text-white" style={{ backgroundColor: "#3f3b2d" }}
                                  />
                                  <span className="w-8 text-white body-text text-xs whitespace-nowrap mr-3" style={{ backgroundColor: "#3f3b2d" }}  >
                                    ${totalCollateral.toFixed(2)}
                                  </span>
                                </div>

                              </div>
                              <div className="flex flex-col md:flex-row gap-x-5 justify-between">
                                <span className="text-white gap-x-2 flex md:flex-row md:w-full w-20 flex-col ">
                                  <h6 className="text-gray-500 body-text text-sm">
                                    Available{" "}
                                  </h6>
                                  <h6 className="mt-5 body-text text-sm">
                                    {Number(balanceData?.formatted).toFixed(3)}{" "}
                                  </h6>
                                </span>
                                <div className="flex w-full gap-x-3 mt-2">
                                  <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900  body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(25)}>25%</Button>
                                  <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(50)}>50%</Button>
                                  <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(75)}>75%</Button>
                                  <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(100)}>100%</Button>
                                </div>
                              </div>

                              <div className="relative">
                                <Label htmlFor="quantity" className="text-white body-text text-sm mb-2">
                                  Borrow
                                </Label>
                                <div
                                  className="flex items-center w-[20rem] md:w-full md:-ml-0 -ml-3  border border-yellow-300 "
                                  style={{ backgroundColor: "#3f3b2d" }}
                                >
                                  <Image src={img4} alt="home" />{" "}
                                  <span className="text-white  text-sm body-text ml-1">
                                    PSUD
                                  </span>
                                  <input id="quantity" placeholder="0.00 PUSD" type="number" value={userInputs.borrow} onChange={(e) => { const newBorrowValue = e.target.value; setUserInputs({ ...userInputs, borrow: newBorrowValue, }); }} className="w-[23.75rem] ml-1 h-[4rem] body-text text-sm whitespace-nowrap text-white" style={{ backgroundColor: "#3f3b2d" }} />
                                </div>
                                <div className="flex flex-col  md:flex-row gap-x-5  justify-between">
                                  <span className="text-white gap-x-2 flex md:flex-row  md:w-full w-20 flex-col">
                                    <h6 className="text-gray-500 body-text  text-sm">
                                      Available{" "}
                                    </h6>
                                    <h6 className={`text-sm body-text whitespace-nowrap ${parseFloat(userInputs.borrow) > availableToBorrow ? 'text-red-500' : 'text-white'}`}>
                                      {Number(availableToBorrow).toFixed(3)}{" "}
                                    </h6>
                                  </span>
                                  <div className="flex w-full gap-x-3 mt-2">
                                    <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900  body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(25)}>25%</Button>
                                    <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(50)}>50%</Button>
                                    <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(75)}>75%</Button>
                                    <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(100)}>100%</Button>
                                  </div>
                                </div>
                                <button onClick={() => handleConfirmClick(userInputs.borrow, userInputs.depositCollateral)} className={`mt-5 w-full title-text h-[3rem] ${isUpdateDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-yellow-300'} text-black`} disabled={isUpdateDisabled}>  UPDATE TROVE</button>
                              </div>
                            </div>
                          </div>
                          <div className="w-fit p-10 border mx-2 md:mx-4 border-black  md:mt-10 text-sm"
                            style={{ backgroundColor: "#" }}>

                            <div className="mb-4 space-y-4">
                              <div className="flex md:gap-40 text-white mb-2 justify-between">
                                <span className="body-text text-xs whitespace-nowrap">Loan-To-Value</span>
                                <span className="text-xs whitespace-nowrap body-text">
                                  {Number(value).toFixed(2)} % {isLtvLoading ? (
                                    <h2 className="title-text animate-ping">--</h2>
                                  ) : (
                                    <>
                                      {`-->`}<span className="ml-05">{" "}{Number(ltv).toFixed(2)} %</span>
                                    </>
                                  )}
                                </span>
                              </div>
                              <div className="flex md:gap-20 text-white mb-2 justify-between">
                                <span className="body-text text-xs whitespace-nowrap">Liquidation Price</span>
                                <span className="body-text text-xs whitespace-nowrap">
                                  {Number(liquidation).toFixed(2)} PUSD
                                  {Number(value).toFixed(2)} % {isLtvLoading ? (
                                    <h2 className="title-text animate-ping">--</h2>
                                  ) : (
                                    <>
                                      {`-->`}<span className="ml-05">{" "}{Number(liquidationPrice).toFixed(2)} PUSD</span>
                                    </>
                                  )}
                                </span>
                              </div>
                              <div className="flex md:gap-40 text-white mb-2 justify-between">
                                <span className="body-text text-xs whitespace-nowrap">Total Debt</span>
                                <span className="body-text text-xs whitespace-nowrap">
                                  {Number(staticTotalDebt).toFixed(2)} PUSD
                                  {Number(value).toFixed(2)} % {isLtvLoading ? (
                                    <h2 className="title-text animate-ping">--</h2>
                                  ) : (
                                    <>
                                      {`-->`}<span className="ml-05">{" "}{Number(totalDebt).toFixed(2)} PUSD</span>
                                    </>
                                  )}
                                </span>
                              </div>
                              <div className="flex md:gap-40 text-white mb-2 justify-between">
                                <span className="text-xs whitespace-nowrap body-text">Total Collateral</span>
                                <span className="body-text text-xs whitespace-nowrap">
                                  {Number(entireDebtAndColl.coll).toFixed(4)} BTC
                                  {`-->`}
                                  {isTotalCollateralLoading ? (
                                    <h2 className="animate-ping">---</h2>
                                  ) : (
                                    <span className="ml-05">{" "}{Number(newUserColl).toFixed(4)} BTC</span>
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="w-50 border mb-4 "></div>
                            <div className=" space-y-4">
                              <div className="flex md:gap-40 text-white mb-2 justify-between">
                                <span className="body-text body-text text-xs whitespace-nowrap">Borrowing Fee</span>
                                <span className="body-text body-text text-xs whitespace-nowrap">
                                  {Number(borrowingFee).toFixed(2)} PUSD
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel className="p-1 bg-yellow-400 text-xl  title-text " header="Repay">
                      <div className="w-full h-full pb-10" style={{ backgroundColor: "#272315" }}>
                        <Repay />
                      </div>
                    </TabPanel>
                    <TabPanel className="p-1 bg-yellow-400 text-xl title-text" header="Close">
                      <div className="w-full h-full" style={{ backgroundColor: "#272315" }}  >
                        <CloseTrove entireDebtAndColl={parseFloat(entireDebtAndColl.coll)} />
                      </div>
                    </TabPanel>
                  </TabView>
                </div>
              </div>
            </div>
          </div>
        )}
        {troveStatus === "INACTIVE" && (
          <div className="w-full h-auto" style={{ backgroundColor: "#272315" }}>
            <OpenTrove />
          </div>
        )}
        {!isConnected && (
          <>
            <div className="md:pt-10 w-fu md:p-5 h-full px-2 pt-4 md:h-screen">
              <div className=" border border-black shadow-lg w-full" style={{ backgroundColor: "#3f3b2d" }}>
                <div className="flex flex-col md:flex-row m-1  gap-x-12">
                  <div className="n">
                    <Image src={img1} alt="home" />
                  </div>
                  <div className=" h-fit space-y-20">
                    <div>  <h6 className="text-white  text-center text-3xl title-text  ">    You dont have an existing trove  </h6>
                    </div>
                    <div>
                      <h6 className="text-yellow-300 text-left title-text text-xl mb-2">
                        Open a zero interest trove
                      </h6>
                      <h6 className="text-white body-text text-left text-base">
                        Borrow against BTCs interest free
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-2 body-text flex flex-col md:flex-row justify-between">
                <div>
                  <div className="grid w-full max-w-sm items-start gap-2 mx-auto   p-5">
                    <div className="">
                      <Label htmlFor="items" className="body-text text-gray-500  body-text ">   Deposit Collatoral </Label>
                      <div
                        className="flex items-center border md:w-full w-[20rem] border-yellow-300 "
                        style={{ backgroundColor: "#3f3b2d" }}
                      >
                        <input id="items" placeholder="0.000 BTC" type="number" disabled value={userInputs.depositCollateral} onChange={(e) => { const newCollValue = e.target.value; setUserInputs({ ...userInputs, depositCollateral: newCollValue, }); }} className="md:w-[23.75rem] body-text text-sm text-gray-400 whitespace-nowrap cursor-not-allowed ml-1 h-[4rem] " style={{ backgroundColor: "#3f3b2d" }} />
                      </div>

                    </div>
                    <span className="body-text text-gray-500 text-sm">
                      Availabe {isNaN(Number(balanceData?.formatted)) ? "0" : Number(balanceData?.formatted).toFixed(3)}
                      {balanceData?.symbol}
                    </span>
                    <div className="">
                      <Label htmlFor="quantity" className="body-text text-gray-500 text-base body-text">
                        Borrow
                      </Label>
                      <div
                        className="flex items-center md:w-full w-[20rem] border border-yellow-300 "
                        style={{ backgroundColor: "#3f3b2d" }}>
                        <input id="quantity" placeholder="0.00 PUSD" type="number" disabled value={userInputs.borrow} onChange={(e) => { const newBorrowValue = e.target.value; setUserInputs({ ...userInputs, borrow: newBorrowValue, }); }} className="md:w-[23.75rem] ml-1 body-text text-base text-gray-400 whitespace-nowrap cursor-not-allowed h-[4rem]" style={{ backgroundColor: "#3f3b2d" }} />
                      </div>
                      <div className="mt-05 body-text text-gray-500 text-sm">
                        Available {availableBorrow}
                      </div>
                      <div className="mt-2">
                        <CustomConnectButton />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-fit  w-auto p-10 shadow-lg space-y-6 mt-2 " style={{ backgroundColor: "#3f3b2d" }}>
                  <div className="flex gap-40 body-text text-white justify-between">
                    <span className="body-text text-sm whitespace-nowrap text-gray-500">Loan-To-Value</span>
                    <span className="body-text text-sm">{Number(ltv).toFixed(2)} %</span>
                  </div>
                  <div className="flex gap-40 text-white body-text justify-between">
                    <span className="body-text text-sm whitespace-nowrap text-gray-500">Liq. Reserve</span>
                    <span className="body-text text-sm">{Number(lr).toFixed(2)} PUSD</span>
                  </div>
                  <div className="flex gap-20 text-white body-text justify-between">
                    <span className="body-text text-sm whitespace-nowrap text-gray-500">Liquidation Price</span>
                    <span className="body-text text-sm">{Number(liquidationPrice).toFixed(2)} PUSD</span>
                  </div>
                  <div className="flex gap-40 text-white  body-text justify-between">
                    <span className="body-text text-sm whitespace-nowrap text-gray-500">Borrowing Fee</span>
                    <span className="body-text text-sm">{Number(borrowingFee).toFixed(2)} PUSD</span>
                  </div>
                  <div className="flex gap-40 body-text text-white justify-between">
                    <span className="body-text text-sm whitespace-nowrap text-gray-500">Total Debt</span>
                    <span className="body-text text-sm">{Number(totalDebt).toFixed(2)}PUSD</span>
                  </div>
                  <div className="flex body-text gap-40 text-white justify-between">
                    <span className="body-text text-sm whitespace-nowrap text-gray-500">Total Collateral</span>
                    <span className="body-text text-sm">{Number(totalCollateral).toFixed(4)}BTC</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Layout>
    </div>
  );
};

export default Borrow;