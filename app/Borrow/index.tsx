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
// import img3 from "../assets/images/image 128.png";
// import img4 from "../assets/images/Group 666.svg";
import img3 from "../assets/images/Group 661.svg";
import img4 from "../assets/images/Group 666.svg";
import { Knob } from "primereact/knob";
import { TabView, TabPanel } from "primereact/tabview";
import Repay from "./Repay";
import { CloseTrove } from "./Close";
import { OpenTrove } from "./OpenTrove";
import "../App.css";
import Layout from "./layout";

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

  // static
  const [staticLiquidationPrice, setStaticLiquidationPrice] = useState(0);
  const [staticLtv, setStaticLtv] = useState(0);
  const [staticTotalCollateral, setStaticTotalCollateral] = useState(0);
  const [staticTotalDebt, setStaticTotalDebt] = useState(0);
  const [staticCollAmount, setStaticCollAmount] = useState(0);
  const [staticBorrowingFee, setStaticBorrowingFee] = useState(0);
  const [value, setValue] = useState(60);
  const [userInput, setUserInput] = useState("0");

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
      console.log(walletClient?.account.address, "walletClient");
      if (!walletClient) return null;
      const {
        0: debt,
        1: coll,
        2: pendingLUSDDebtReward,
        3: pendingETHReward,
      } = await troveManagerContract.getEntireDebtAndColl(
        walletClient?.account.address
      );
      console.log("hi", entireDebtAndColl.coll);

      console.log("Collateral (raw):", coll); // Log the raw collateral value
      const collDecimal = new Decimal(coll.toString()); // Convert coll to a Decimal
      const collFormatted = collDecimal.div(_1e18.toString()).toString(); // Divide coll by _1e18 and convert to string

      console.log(collFormatted, "collFormatted");
      setEntireDebtAndColl({
        debt: (debt / _1e18).toString(),
        coll: collFormatted,
        pendingLUSDDebtReward: (pendingLUSDDebtReward / _1e18).toString(),
        pendingETHReward: (pendingETHReward / _1e18).toString(),
      });

      if (!hasPriceFetched) {
        try {
          const fetchPrice: bigint = await priceFeedContract.getPrice();
          console.log(fetchPrice, "Fetching price");

          const fetchPriceDecimal = new Decimal(fetchPrice.toString()); // Convert coll to a Decimal
          const fetchPriceFormatted = fetchPriceDecimal
            .div(_1e18.toString())
            .toString();
          setFetchedPrice(fetchPriceFormatted);

          // Multiply collFormatted with fetchPrice
          const updatedCollFormatted = new Decimal(collFormatted).mul(
            fetchPriceFormatted
          );
          console.log(updatedCollFormatted, "updatedCollFormatted");

          // Convert the result back to a number before setting the state
          const updatedPrice = parseFloat(updatedCollFormatted.toString());

          // Update state with the multiplied value
          setPrice(updatedPrice);
          console.log(updatedPrice, "Multiplied collFormatted");
          setHasPriceFetched(true);
        } catch (error) {
          console.error(error, "Error fetching price");
          setHasPriceFetched(true);
        }
      }
    };

    const getSystemLTV = async () => {
      const systemLTV = await troveManagerContract.getTCR(price);
      console.log(systemLTV, "systemLTV");
      const systemLTVDecimal = new Decimal(systemLTV.toString()); // Convert coll to a Decimal
      const systemLTVFormatted = systemLTVDecimal
        .div(_1e16.toString())
        .toString();
      setSystemLTV(systemLTVFormatted);
    };
    ///////////////////
    const getLiquidationReserve = async () => {
      const lr = await troveManagerContract.LUSD_GAS_COMPENSATION();
      const lrFormatted = Number(ethers.formatUnits(lr, 18));
      setLr(lrFormatted);
      console.log({ lr, lrFormatted });
    };

    const getRecoveryModeStatus = async () => {
      const status: boolean = await troveManagerContract.checkRecoveryMode(
        price
      );
      setIsRecoveryMode(status);
    };

    const getStaticData = async () => {
      if (!walletClient) return null;
      if (!provider || hasGotStaticData) return null;

      const { 0: debt, 1: coll } =
        await troveManagerContract.getEntireDebtAndColl(
          walletClient.account.address
        );

      const expectedBorrowingRate =
        await troveManagerContract.getBorrowingRateWithDecay();

      const borrowingRate = Number(
        ethers.formatUnits(expectedBorrowingRate, 18)
      );
      const expectedFeeFormatted = borrowingRate / 100;

      setStaticBorrowingFee(expectedFeeFormatted);

      const debtFormatted = Number(ethers.formatUnits(debt, 18));
      const collFormatted = Number(ethers.formatUnits(coll, 18));

      setStaticCollAmount(collFormatted);

      // total coll
      const totalColl = collFormatted * price;
      setStaticTotalCollateral(totalColl);
      setStaticTotalDebt(debtFormatted);

      //ltv
      const ltvValue = (debtFormatted * 100) / (totalColl || 1); // if collTotal is 0/null/undefined then it will be divided by 1
      setStaticLtv(ltvValue);

      //liquidationPrice
      const divideBy = isRecoveryMode ? 1.5 : 1.1;
      const liquidationPriceValue = (divideBy * debtFormatted) / collFormatted;
      setStaticLiquidationPrice(liquidationPriceValue);

      console.log({
        debt,
        coll,
        collFormatted,
        debtFormatted,
        totalColl,
        ltvValue,
      });
      setHasGotStaticData(true);
    };

    getLiquidationReserve();
    getStaticData();
    ///////////////////
    fetchedData();
    getSystemLTV();
    getTroveStatus();
  }, [walletClient]);

  useDebounce(
    () => {
      makeCalculations(userInputs.borrow, userInputs.depositCollateral);
    },
    1000,
    [userInputs.borrow, userInputs.depositCollateral]
  );

  const handleConfirmClick = async (xBorrow: string, xCollatoral: string) => {
    try {
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
      console.log({
        borrowValue,
        collValue,
        debt,
        coll,
        debtFormatted,
        collFormatted,
        newDebtValue,
        newCollValue,
      });
      // const newDebtValue = Number(toBigInt(debt) + toBigInt(LUSDRepayment));
      setNewDebt(newDebtValue);

      let NICR = newCollValue / newDebtValue;
      console.log(NICR, "NICR");

      const NICRDecimal = new Decimal(NICR.toString());
      const NICRBigint = BigInt(NICRDecimal.mul(pow20).toFixed());
      console.log(NICRBigint, "NICRBigint");

      const numTroves = await sortedTrovesContract.getSize();
      const numTrials = numTroves * BigInt("15");
      console.log(numTrials, "numTrials");

      const { 0: approxHint } = await hintHelpersContract.getApproxHint(
        // NICR,
        NICRBigint,
        numTrials,
        42
      ); // random seed of 42
      // Use the approximate hint to get the exact upper and lower hints from the deployed SortedTroves contract
      const { 0: upperHint, 1: lowerHint } =
        await sortedTrovesContract.findInsertPosition(
          // NICR,
          NICRBigint,
          approxHint,
          approxHint
        );

      const maxFee = "5".concat("0".repeat(16));
      const collDecimal = new Decimal(collValue.toString());
      const collBigint = BigInt(collDecimal.mul(pow18).toFixed());
      console.log(collBigint, "collBigint");

      const borrowDecimal = new Decimal(borrowValue.toString());
      const borrowBigint = BigInt(borrowDecimal.mul(pow18).toFixed());
      console.log(borrowBigint, "borrowBigint");

      // Call adjustTrove with the exact upperHint and lowerHint
      const borrowOpt = await borrowerOperationsContract.adjustTrove(
        maxFee,
        0,
        // LUSDRepayment,
        borrowBigint,
        // Number(userInputs.borrow) === 0 ? false : true,
        borrowValue === 0 ? false : true,
        upperHint,
        lowerHint,
        { value: collBigint }
      );
    } catch (error) {
      console.error(error, "Error");
    }
  };

  const makeCalculations = async (xBorrow: string, xCollatoral: string) => {
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

    const expectedFeeFormatted = (borrowingRate * borrowValue) / 100;
    // const totalColl = collFormatted + collValue; //do we have to multiply it by price
    const totalColl = (collFormatted + collValue) * Number(price); // multiply it by price
    setTotalCollateral(totalColl);
    const debtTotal = expectedFeeFormatted + borrowValue + debtFormatted;

    const ltvValue = (debtTotal * 100) / (totalColl || 1);
    const divideBy = isRecoveryMode ? 1.5 : 1.1;
    const liquidationPriceValue =
      (divideBy * debtTotal) / (collFormatted + collValue);
    const availBorrowValue =
      totalColl / divideBy - debtFormatted - expectedFeeFormatted;
    setAvailableBorrow(Number(availBorrowValue.toFixed(3)));
    console.log({
      borrowingRate,
      totalColl,
      debtTotal,
      ltvValue,
      expectedFeeFormatted,
      collValue,
      borrowValue,
      liquidationPriceValue,
      availBorrowValue,
    });
    setBorrowingFee(Number(expectedFeeFormatted.toFixed(3)));
    setTotalDebt(Number(debtTotal.toFixed(3)));
    setLtv(Number(ltvValue.toFixed(3)));
    setLiquidationPrice(Number(liquidationPriceValue.toFixed(3)));
  };

  const divideBy = isRecoveryMode ? 1.5 : 1.1;

  const availableToBorrow = price / divideBy - Number(entireDebtAndColl.debt);

  const liquidation =
    divideBy *
    (Number(entireDebtAndColl.debt) / Number(entireDebtAndColl.coll));
  //   console.log("nk1", walletClient?.account.address);
  const handlePercentageClick = (percentage: any) => {
    const pow = Decimal.pow(10, 18);
    const _1e18 = toBigInt(pow.toFixed());
    const percentageDecimal = new Decimal(percentage).div(100);
    const pusdBalanceNumber = parseFloat(fetchedPrice);
    if (!isNaN(pusdBalanceNumber)) {
      const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
      const stakeFixed = maxStake.toFixed();
      const stakeFixedConv = (toBigInt(stakeFixed) / _1e18).toString();
      setUserInput(stakeFixedConv);
    } else {
      console.error("Not enough pusd to unstake:", pusdBalanceNumber);
    }
  };
  const getTroveStatus = async () => {
    console.log("nitu1", walletClient?.account.address);
    if (!walletClient) return null;
    const troveStatusBigInt = await troveManagerContract.getTroveStatus(
      walletClient?.account.address
    );
    const troveStatus =
      troveStatusBigInt.toString() === "1" ? "ACTIVE" : "INACTIVE";
    setTroveStatus(troveStatus);
    console.log("nitu2");
    console.log("nitu3", { troveStatusBigInt, troveStatus });
  };
  //   useEffect(() => {
  getTroveStatus();
  //   }, []);
  return (
    <div className="">
      <Layout>
        {troveStatus === "ACTIVE" && (
          <div style={{ backgroundColor: "#272315" }}>
            <div className="h-[15rem] flex flex-row  ml-16 gap-10">
              <div>
                <p className="text-white font-mono text-base mt-8 mb-4">
                  Available to borrow
                </p>
                <div className="flex flex-row gap-2">
                  <Image src={img2} alt="home" />
                  <span className="text-white text-3xl">
                    {availableToBorrow} PUSD
                  </span>
                </div>
                <div className="flex flex-row justify-between mt-5 gap-4">
                  <div
                    className="flex flex-col text-white  h-28 p-5"
                    style={{ backgroundColor: "#343127" }}
                  >
                    <span className="font-mono">Collateral</span>
                    <span>{Number(entireDebtAndColl.coll).toFixed(4)} BTC</span>
                    <span>${price}</span>
                  </div>
                  <div
                    className="flex flex-col text-white w-[10rem]  h-28 p-5"
                    style={{ backgroundColor: "#343127" }}
                  >
                    <span>Debt</span>
                    <span>{entireDebtAndColl.debt} PUSD</span>
                  </div>{" "}
                </div>
              </div>
              <div
                className="w-[12rem] h-[12rem] mt-16"
                style={{ backgroundColor: "#343127" }}
              >
                <div className="flex flex-col gap-8 text-white px-8 py-4">
                  <div className="flex flex-col">
                    <span className="font-mono">System LTV</span>
                    <span>{systemLTV}%</span>
                  </div>
                  <div className="flex flex-col ">
                    <span className="font-mono">Trove Status</span>
                    <div className="border border-lime-500 text-lime-500 justify-center items-center text-center mt-2">
                      {troveStatus}{" "}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="w-[21.5rem] h-[12rem] mt-16 px-8 py-4"
                style={{ backgroundColor: "#343127" }}
              >
                <div className="flex gap-16 text-white">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-mono">Liquidation</span>
                      <span className="font-mono">${liquidation} USD</span>
                      <span className="font-mono">${fetchedPrice}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs">Debt Ahead</span>
                      <span className="font-mono">{entireDebtAndColl.pendingETHReward} PUSD</span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className=" font-mono text-xs ml-[0.5rem]">loan to Value</span>
                    <Knob
                      value={value}
                      onChange={(e) => setValue(e.value)}
                      size={100}
                      // showValue={false}
                      rangeColor="#78887f"
                      valueColor="#3dde84"
                      strokeWidth={10}
                    />
                    <span className="text-xs font-mono ml-[0.5rem]">{value}%</span>
                    <span className="text-xs font-mono ml-[0.5rem]">/100%</span>
                    <span className="text-xs font-mono ml-[0.5rem]">YOUR LTV</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="" style={{ backgroundColor: "#272315" }}>
              <div className="p-10 pt-24 flex gap-x-36">
                <div className="  border border-yellow-800">
                  <TabView>
                    <TabPanel
                      className=" p-1 bg-yellow-400 text-xl  text-black "
                      header="Borrow"
                    >
                      <div
                        className="pb-10"
                        style={{ backgroundColor: "#272315" }}
                      >
                        <div className="container   flex flex-row justify-between gap-32">
                          <div>
                            <div className="grid w-full max-w-sm items-start gap-2 mx-auto   p-5">
                              <div className="relative">
                                <Label
                                  htmlFor="items"
                                  className="text-white font-mono text-sm mb-2"
                                >
                                  Deposit Collatoral
                                </Label>
                                <div
                                  className="flex items-center border border-yellow-300 "
                                  style={{ backgroundColor: "#3f3b2d" }}
                                >
                                  <Image src={img3} alt="home" />{" "}
                                  <span className="text-white font-mono text-sm">
                                    BTC
                                  </span>
                                  <input
                                    id="items"
                                    placeholder="0.000 BTC"
                                    type="number"
                                    value={userInputs.depositCollateral}
                                    onChange={(e) => {
                                      const newCollValue = e.target.value;
                                      setUserInputs({
                                        ...userInputs,
                                        depositCollateral: newCollValue,
                                      });
                                    }}
                                    className="w-[23.75rem] ml-1 h-[4rem] text-white"
                                    style={{ backgroundColor: "#3f3b2d" }}
                                  />
                                  <span
                                    className="w-8 text-white"
                                    style={{ backgroundColor: "#3f3b2d" }}
                                  >
                                    ${totalCollateral}
                                  </span>
                                </div>

                              </div>
                              <div className="flex flex-row justify-between">
                                <span className="text-white mt-2 font-mono">
                                  Available{" "}
                                  {Number(balanceData?.formatted).toFixed(3)}{" "}
                                  {/* {balanceData?.symbol} */}
                                </span>
                                <div className="flex gap-x-2 mt-2">
                                  <Button
                                    className=" w-5  font-mono text-sm font-semibold border-2 border-yellow-900"
                                    style={{
                                      backgroundColor: "#3b351b",
                                      borderRadius: "0",
                                    }}
                                    onClick={() => handlePercentageClick(25)}
                                  >
                                    25%
                                  </Button>
                                  <Button
                                    className="w-5 text-sm font-mono font-semibold border-2 border-yellow-900"
                                    style={{
                                      backgroundColor: "#3b351b",
                                      borderRadius: "0",
                                    }}
                                    onClick={() => handlePercentageClick(50)}
                                  >
                                    50%
                                  </Button>
                                  <Button
                                    className="w-5 text-sm font-mono font-semibold border-2 border-yellow-900"
                                    style={{
                                      backgroundColor: "#3b351b",
                                      borderRadius: "0",
                                    }}
                                    onClick={() => handlePercentageClick(75)}
                                  >
                                    75%
                                  </Button>
                                  <Button className="w-5 text-sm font-mono font-semibold border-2 border-yellow-900" style={{ backgroundColor: "#3b351b", borderRadius: "0", }} onClick={() => handlePercentageClick(100)}>100%</Button>
                                </div>
                              </div>

                              <div className="relative">
                                <Label
                                  htmlFor="quantity"
                                  className="text-white font-mono text-sm mb-2"
                                >
                                  Borrow
                                </Label>
                                <div
                                  className="flex items-center border p-1 border-yellow-300 "
                                  style={{ backgroundColor: "#3f3b2d" }}
                                >
                                  <Image src={img4} alt="home" />{" "}
                                  <span className="text-white  text-sm font-mono ml-1">
                                    PSUD
                                  </span>
                                  <input
                                    id="quantity"
                                    placeholder="0.00 PUSD"
                                    type="number"
                                    value={userInputs.borrow}
                                    onChange={(e) => {
                                      const newBorrowValue = e.target.value;
                                      setUserInputs({
                                        ...userInputs,
                                        borrow: newBorrowValue,
                                      });
                                    }}
                                    className="w-[23.75rem] ml-1 h-[4rem] text-white"
                                    style={{ backgroundColor: "#3f3b2d" }}
                                  />
                                  {/* <span className="text-white">0</span> */}
                                </div>
                                {/* <div className="text-white mt-2">
                                Available {availableBorrow}
                              </div> */}
                                <div className="flex flex-row justify-between">
                                  <span className="text-white font-mono mt-2">
                                    Available {Number(availableToBorrow)}{" "}
                                    {/* {balanceData?.symbol} */}
                                  </span>
                                  <div className="flex gap-x-2 mt-2">
                                    <Button
                                      className=" w-5 text-sm  font-mono font-semibold border-2 border-yellow-900"
                                      style={{
                                        backgroundColor: "#3b351b",
                                        borderRadius: "0",
                                      }}
                                      onClick={() => handlePercentageClick(25)}
                                    >
                                      25%
                                    </Button>
                                    <Button
                                      className="w-5 text-sm font-mono font-semibold border-2 border-yellow-900"
                                      style={{
                                        backgroundColor: "#3b351b",
                                        borderRadius: "0",
                                      }}
                                      onClick={() => handlePercentageClick(50)}
                                    >
                                      50%
                                    </Button>
                                    <Button
                                      className="w-5 text-sm font-mono font-semibold border-2 border-yellow-900"
                                      style={{
                                        backgroundColor: "#3b351b",
                                        borderRadius: "0",
                                      }}
                                      onClick={() => handlePercentageClick(75)}
                                    >
                                      75%
                                    </Button>
                                    <Button
                                      className="w-5 text-sm font-mono font-semibold border-2 border-yellow-900"
                                      style={{
                                        backgroundColor: "#3b351b",
                                        borderRadius: "0",
                                      }}
                                      onClick={() => handlePercentageClick(100)}
                                    >
                                      100%
                                    </Button>
                                  </div>
                                </div>
                                <Button
                                  onClick={() =>
                                    handleConfirmClick(
                                      userInputs.borrow,
                                      userInputs.depositCollateral
                                    )
                                  }
                                  className="mt-5 w-[22rem] font-mono h-[3rem] bg-yellow-300 text-black font-bold"
                                >
                                  UPDATE TROVE
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div
                            className="w-auto p-10  mt-10 text-sm"
                            style={{ backgroundColor: "#3f3b2d" }}
                          >
                            <div className="flex gap-40 text-white mb-2 justify-between">
                              <span className="font-mono">Loan-To-Value</span>

                              <span>{Number(staticLtv).toFixed(2)} %</span>
                            </div>

                            <div className="flex gap-40 text-white mb-2 justify-between">
                              <span className="font-mono">Liq. Reserve</span>

                              <span>{Number(lr).toFixed(2)} PUSD</span>
                            </div>
                            <div className="flex gap-20 text-white mb-2 justify-between">
                              <span className="font-mono">Liquidation Price</span>

                              <span className="font-mono">
                                {Number(staticLiquidationPrice).toFixed(2)} PUSD
                              </span>
                            </div>
                            <div className="flex gap-40 text-white mb-2 justify-between">
                              <span className="font-mono">Borrowing Fee</span>
                              <span className="font-mono">
                                {Number(staticBorrowingFee).toFixed(2)} PUSD
                              </span>
                            </div>
                            <div className="flex gap-40 text-white mb-2 justify-between">
                              <span className="font-mono">Total Debt</span>
                              <span className="font-mono">
                                {Number(staticTotalDebt).toFixed(2)} PUSD
                              </span>
                            </div>
                            <div className="flex gap-40 text-white mb-2 justify-between">
                              <span>Total Collateral</span>
                              <span className="font-mono">
                                {Number(staticTotalCollateral).toFixed(4)} BTC
                              </span>
                            </div>
                            <div className="w-50 border mb-2 "></div>

                            {/* DYANIC */}
                            <div className="flex gap-40 font-mono text-white mb-2 justify-between">
                              <span>Loan-To-Value</span>
                              <span>{Number(ltv).toFixed(2)} %</span>
                            </div>

                            <div className="flex gap-40 font-mono text-white mb-2 justify-between">
                              <span>Liq. Reserve</span>
                              <span>{Number(lr).toFixed(2)} PUSD</span>
                            </div>
                            <div className="flex gap-20 text-white mb-2 font-mono justify-between">
                              <span className="font-mono">Liquidation Price</span>
                              <span className="font-mono">
                                {Number(liquidationPrice).toFixed(2)} PUSD
                              </span>
                            </div>
                            <div className="flex gap-40 text-white mb-2 justify-between">
                              <span className="font-mono">Borrowing Fee</span>
                              <span className="font-mono">
                                {Number(borrowingFee).toFixed(2)} PUSD
                              </span>

                              {/* <span>{borrowingFee} PUSD</span> */}
                            </div>
                            <div className="flex gap-40 font-mono text-white mb-2 justify-between">
                              <span>Total Debt</span>
                              <span>{Number(totalDebt).toFixed(2)} PUSD</span>

                              {/* <span>{totalDebt} PUSD</span> */}
                            </div>
                            <div className="flex gap-40 font-mono text-white mb-2 justify-between">
                              <span>Total Collateral</span>
                              {/* <span>{totalCollateral} BTC</span> */}
                              <span>
                                {Number(totalCollateral).toFixed(4)} BTC
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel
                      className="p-1 bg-yellow-400 text-xl text-black"
                      header="Repay"
                    >
                      <div
                        className="w-full h-full pb-10"
                        style={{ backgroundColor: "#272315" }}
                      >
                        <Repay />
                      </div>
                    </TabPanel>
                    <TabPanel
                      className="p-1 bg-yellow-400 text-xl text-black"
                      header="Close"
                    >
                      <div
                        className="w-full h-full"
                        style={{ backgroundColor: "#272315" }}
                      >
                        <CloseTrove />
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
            <div
              className="w-screen max-w-screen-lg ml-[4rem] "
              style={{ backgroundColor: "#3f3b2d" }}
            >
              <div className=" mx-10 my-10 flex flex-row m-4 gap-12">
                <div className="h-[192px]">
                  <Image src={img1} alt="home" />
                </div>

                <div className="mt-4">
                  <p className="text-white font-mono text-center text-2xl font-bold mb-[1.25rem]">
                    You dont have an existing trove
                  </p>
                  <p className="text-yellow-300 font-mono text-left text-xl mb-2">
                    Open a zero interest trove
                  </p>
                  <p className="text-white font-mono text-left text-base">
                    Borrow against BTCs interest free
                  </p>
                </div>
              </div>
            </div>
            <div className="container mx-10 my-10 font-mono flex flex-row justify-between">
              <div>
                <div className="grid w-full max-w-sm items-start gap-2 mx-auto   p-5">
                  <div className="relative"></div>
                  <div className="relative">
                    <Label htmlFor="items" className="text-white font-mono ">
                      Deposit Collatoral
                    </Label>
                    <div
                      className="flex items-center border border-yellow-300 "
                      style={{ backgroundColor: "#3f3b2d" }}
                    >
                      <input
                        id="items"
                        placeholder="0.000 BTC"
                        type="number"
                        value={userInputs.depositCollateral}
                        onChange={(e) => {
                          const newCollValue = e.target.value;
                          setUserInputs({
                            ...userInputs,
                            depositCollateral: newCollValue,
                          });
                        }}
                        className="w-[23.75rem] h-[4rem] text-white"
                        style={{ backgroundColor: "#3f3b2d" }}
                      />
                      <span style={{ backgroundColor: "#3f3b2d" }}>
                        {totalCollateral}
                      </span>

                    </div>

                  </div>
                  <span className="text-white">
                    Available {Number(balanceData?.formatted).toFixed(3)}{" "}
                    {balanceData?.symbol}
                  </span>
                  <div className="relative">
                    <Label htmlFor="quantity" className="text-white font-mono">
                      Borrow
                    </Label>
                    <div
                      className="flex items-center border border-yellow-300 "
                      style={{ backgroundColor: "#3f3b2d" }}
                    >
                      <input
                        id="quantity"
                        placeholder="0.00 PUSD"
                        type="number"
                        value={userInputs.borrow}
                        onChange={(e) => {
                          const newBorrowValue = e.target.value;
                          setUserInputs({
                            ...userInputs,
                            borrow: newBorrowValue,
                          });
                        }}
                        className="w-[23.75rem] h-[4rem] text-white"
                        style={{ backgroundColor: "#3f3b2d" }}
                      />
                      {/* <span className="text-white">0</span> */}
                    </div>
                    <div className="text-white font-mono">
                      Available {availableBorrow}
                    </div>
                    <Button className="mt-5 w-[22rem] h-[3rem] bg-yellow-300 text-black font-bold">
                      Connect Wallet

                    </Button>
                  </div>
                </div>
              </div>
              <div
                className="h-[16rem] w-auto p-10  mt-10"
                style={{ backgroundColor: "#3f3b2d" }}
              >
                <div className="flex gap-40 font-mono text-white justify-between">
                  <span>Loan-To-Value</span>
                  <span>{Number(ltv).toFixed(2)} %</span>
                </div>

                <div className="flex gap-40 text-white font-mono justify-between">
                  <span>Liq. Reserve</span>
                  <span>{Number(lr).toFixed(2)} PUSD</span>
                </div>
                <div className="flex gap-20 text-white font-mono justify-between">
                  <span>Liquidation Price</span>
                  <span>{Number(liquidationPrice).toFixed(2)} PUSD</span>
                </div>
                <div className="flex gap-40 text-white  font-mono justify-between">
                  <span>Borrowing Fee</span>
                  <span>{Number(borrowingFee).toFixed(2)} PUSD</span>
                </div>
                <div className="flex gap-40 font-mono text-white justify-between">
                  <span>Total Debt</span>
                  <span>{Number(totalDebt).toFixed(2)}PUSD</span>
                </div>
                <div className="flex font-mono gap-40 text-white justify-between">
                  <span>Total Collateral</span>
                  <span>{Number(totalCollateral).toFixed(4)}BTC</span>
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