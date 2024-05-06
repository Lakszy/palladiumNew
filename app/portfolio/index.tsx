/* eslint-disable */


"use client";

import borrowerOperationAbi from "../src/constants/abi/BorrowerOperations.sol.json";
import hintHelpersAbi from "../src/constants/abi/HintHelpers.sol.json";
import priceFeedAbi from "../src/constants/abi/PriceFeedTestnet.sol.json";
import sortedTroveAbi from "../src/constants/abi/SortedTroves.sol.json";
import troveManagerAbi from "../src/constants/abi/TroveManager.sol.json";
import stabilityPoolAbi from "../src/constants/abi/StabilityPool.sol.json";
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
import Link from "next/link";
import Image from "next/image";
// import img1 from "../assets/images/port+.svg";
import img1 from "../assets/images/Group 771.png";
import port2 from "../assets/images/port2.svg";
import img2 from "../assets/images/Group 784.png";
import { Knob } from "primereact/knob";
// import { ProgressBar } from "primereact/progressbar";
import "../App.css";
import Progress from "./Progress";
import Layout from "./layout";
import { CustomConnectButton } from "@/components/connectBtn";

const Portfolio = () => {
  const [userInputs, setUserInputs] = useState({
    depositCollateral: "0",
    borrow: "0",
  });
  const { isConnected } = useAccount();
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


  // static
  const [staticLiquidationPrice, setStaticLiquidationPrice] = useState(0);
  const [staticLtv, setStaticLtv] = useState(0);
  const [staticTotalCollateral, setStaticTotalCollateral] = useState(0);
  const [staticTotalDebt, setStaticTotalDebt] = useState(0);
  const [staticCollAmount, setStaticCollAmount] = useState(0);
  const [staticBorrowingFee, setStaticBorrowingFee] = useState(0);
  const [value, setValue] = useState("0");
  let totalSupply = 50;
  let suppliedAmount = 40;

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

  const stabilityPoolContractReadOnly = getContract(
    botanixTestnet.addresses.stabilityPool,
    stabilityPoolAbi,
    provider
  );

  const [troveStatus, setTroveStatus] = useState("");
  const [totalStakedValue, setTotalStakedValue] = useState("0");

  //ACTIVE

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
        finally {
          setIsLoading(false); // Update loading state once fetching is complete
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

    const getStakedValue = async () => {
      if (!walletClient) return null;
      const fetchedTotalStakedValue =
        await stabilityPoolContractReadOnly.getCompoundedLUSDDeposit(
          walletClient?.account.address
        );
      console.log(fetchedTotalStakedValue, "fetchedTotalStakedValue");

      const fixedtotal = ethers.formatUnits(fetchedTotalStakedValue, 18);
      setTotalStakedValue(fixedtotal);
      console.log(fixedtotal, "fixedtotal");
      console.log(fetchedTotalStakedValue, "fetchedTotalStakedValue");
      console.log(totalStakedValue, "totalStaked");
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
      // PROGRESS BAR
      totalSupply = 100;
      suppliedAmount = Number(entireDebtAndColl.debt);

      //ltv
      const ltvValue = (debtFormatted * 100) / (totalColl || 1); // if collTotal is 0/null/undefined then it will be divided by 1
      setStaticLtv(ltvValue);

      //liquidationPrice
      const divideBy = isRecoveryMode ? 1.5 : 1.1;
      const liquidationPriceValue = (divideBy * debtFormatted) / collFormatted;
      setStaticLiquidationPrice(liquidationPriceValue);
      setHasGotStaticData(true);
    };

    // getPrice();
    getRecoveryModeStatus();
    getLiquidationReserve();
    getStaticData();
    fetchedData();
    getSystemLTV();
    getTroveStatus();
    getStakedValue();
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
    finally {
      setIsLoading(false); // Update loading state once fetching is complete
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
    const liquidationPriceValue = (divideBy * debtTotal) / (collFormatted + collValue);
    const availBorrowValue = totalColl / divideBy - debtFormatted - expectedFeeFormatted;
    setAvailableBorrow(Number(availBorrowValue.toFixed(2)));

    setBorrowingFee(Number(expectedFeeFormatted.toFixed(2)));
    setTotalDebt(Number(debtTotal.toFixed(2)));
    setLtv(Number(ltvValue.toFixed(2)));
    setLiquidationPrice(Number(liquidationPriceValue.toFixed(2)));
  };

  const divideBy = isRecoveryMode ? 1.5 : 1.1;
  const availableToBorrow = price / divideBy - Number(entireDebtAndColl.debt) || 0;

  const liquidation = divideBy * (Number(entireDebtAndColl.debt) / Number(entireDebtAndColl.coll));
  const getTroveStatus = async () => {
    console.log("nitu1", walletClient?.account.address);
    if (!walletClient) return null;
    const troveStatusBigInt = await troveManagerContract.getTroveStatus(
      walletClient?.account.address
    );
    const troveStatus =
      troveStatusBigInt.toString() === "1" ? "ACTIVE" : "INACTIVE";
    setTroveStatus(troveStatus);

    console.log("nitu3", { troveStatusBigInt, troveStatus });
    setValue((Number(entireDebtAndColl.debt) / (Number(entireDebtAndColl.coll) * Number(fetchedPrice)) * 100).toFixed(2));

  };

  getTroveStatus();

  return (
    <div>

      {/* {!isLoading && ( */}
      <div>
        <Layout>
          {troveStatus === "ACTIVE" && (
            <div className=" flex flex-col">
              <div className="flex flex-col md:flex-row items-center md:gap-x-0 gap-x-2 md:w-full justify-between">
                <div className=" md:-ml-0 -ml-6">
                  <h6 className="text-white title-text text-2xl mt-1 mb-4 ml-[1.25rem]">
                    Portfolio Value
                  </h6>

                  <span className="text-white body-text text-2xl font-bold ml-[1.25rem] flex justify-between">
                    ${availableToBorrow.toFixed(2)} PUSD
                  </span>
                </div>

                <div className="w-5/12 h-2 -ml-[12rem] md:ml-0 md:mr-10 mt-10">
                  <Progress total={totalSupply} supplied={suppliedAmount} />
                  <h1 className="text-white text-sm ">
                    <div className="flex flex-row md:gap-x-0 gap-x-28 items-center justify-between">
                      <div className="text-white flex flex-col mt-05">
                        <div className="flex items-center gap-x-1">
                          <div className="w-2 rounded-full h-2 bg-yellow-400"></div>
                          <span className="body-text">Borrowed</span>
                        </div>
                        <span className="body-text text-right">{Number(entireDebtAndColl.debt).toFixed(2)} PUSD</span>
                      </div>
                      <div className="text-white flex flex-col mt-05">
                        <div className="flex items-center gap-x-1">
                          <div className="w-2 rounded-full h-2  bg-green-400"></div>
                          <span className="body-text">Supplied</span>
                        </div>
                        <span className="body-text text-right whitespace-nowrap">{Number(entireDebtAndColl.coll).toFixed(8)} BTC</span>
                      </div>
                    </div>
                  </h1>
                </div>

              </div>
              <div className="mt-10 py-10 my-10 flex flex-col md:flex-row justify-between gap-10 md:w-full md:p-5  p-3 w-[24rem]">

                <div
                  className="flex-1 lg:w-[20rem] h-auto rounded-sm"
                  style={{ backgroundColor: "#3f3b2d" }}
                >
                  <div
                    className=" flex flex-row justify-between p-5"
                    style={{ backgroundColor: "#3d3f37" }}
                  >
                    <span className="title-text text-white">TROVE</span>
                    <Link href="/Borrow">
                      <button
                        className="h-10 px-8 border-yellow-400 text-yellow-400 border title-text bg-transparent  title-text font-bold"
                      >
                        Details
                      </button>
                    </Link>
                  </div>
                  {/* body */}
                  <div>
                    <div className="flex flex-col mb-2 items-center">
                      <Knob
                        value={Number(value)}
                        showValue={true}
                        size={175}
                        rangeColor="#78887f"
                        valueColor="#3dde84"
                        strokeWidth={7}
                        readOnly
                        className="text-white"
                      />
                      <div className="flex-col flex items-center space-y-1 -mt-4  w-[4.5rem]">
                        <span className="text-lg text-white  ml-[0.5rem] body-text">{Number(value).toFixed(2) || 0}%</span>
                        <span className="text-xs ml-[0.5rem] text-gray-500 body-text">/100%</span>
                        <span className="text-xs text-gray-500 body-text ">YOUR LTV</span>
                      </div>
                    </div>
                    <div className="text-white p-2 flex flex-row justify-between mx-[2.5rem]">
                      {" "}
                      <div className="flex flex-col">
                        <span className="body-text text-gray-500">Collateral</span>
                        <span className="body-text ">{Number(entireDebtAndColl.coll).toFixed(8)} BTC</span>
                        <span className="text-xs body-text text-gray-500">${price.toFixed(2)}</span>
                      </div>
                      <div className="flex  flex-col">
                        {" "}
                        <span className="body-text text-gray-500">Debt</span>
                        <span className="body-text">{Number(entireDebtAndColl.debt).toFixed(2)} PUSD</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className=" lg:w-[22rem] h-auto rounded-sm"
                  style={{ backgroundColor: "#3f3b2d" }}
                >
                  <div
                    className=" flex flex-row justify-between p-5"
                    style={{ backgroundColor: "#3d3f37" }}
                  >
                    <span className="text-white title-text">STABILITY POOL</span>
                    <Link href="/Stake">
                      <button
                        className="h-10 px-6 title-text border-yellow-400 border bg-transparent  text-yellow-400 font-bold"
                      >
                        Details
                      </button>
                    </Link>
                  </div>
                  <div className="text-white ml-3">
                    <div className="mb-[2rem] mt-2 whitespace-nowrap">
                      <p className="title-text text-gray-500">Deposited</p>
                      <p className="body-text">{Number(totalStakedValue).toFixed(2)} PUSD</p>
                    </div>
                    <div className="flex flex-row gap-10">
                      <div className="flex flex-col whitespace-nowrap">
                        <span className="title-text text-gray-500">Claimable</span>
                        <span className="body-text">{(lr).toFixed(2)} PUSD</span>
                      </div>
                      <Image src={port2} alt="home" width={200} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {troveStatus === "INACTIVE" && (
            <div className="pt-10 px-3 h-full space-y-10  md:space-y-0 gap-x-[5rem] flex flex-col md:flex-row w-[100%]">
              <div
                className="md:w-[55%] border  border-black shadow-lg  md:ml-[2.5rem] rounded-sm"
                style={{ backgroundColor: "#3f3b2d" }}
              >
                <div
                  className=" flex flex-row justify-between p-5"
                  style={{ backgroundColor: "#3d3f37" }}
                >
                  <span className="title-text text-xl text-white">TROVE</span>

                  <button
                    style={{ backgroundColor: "#f5d64e" }}
                    className="h-10 px-8 bg-yellow-300 text-black font-bold title-text"
                  >
                    <Link className="title-text" href="/Borrow">OPEN TROVE</Link>
                  </button>
                </div>
                <div className="grid place-items-center p-3">
                  <Image src={img1} alt="home" width={200} />
                  <p className="text-white title-text text-center font-semibold text-lg pt-5">
                    You don't have an Active Trove
                  </p>
                </div>
              </div>
              <div
                className="md:w-[30%]  md:mt-0  border border-black shadow-lg rounded-sm"
                style={{ backgroundColor: "#3f3b2d" }}
              >
                <div className=" items-center flex flex-row justify-between p-4" style={{ backgroundColor: "#3d3f37" }}>
                  <span className="text-white title-text">STABILITY POOL</span>

                  <button
                    style={{ backgroundColor: "#f5d64e" }}
                    className="h-10 px-6 bg-yellow-300 text-black font-bold"
                  >
                    <Link className="title-text" href="/Stake">STAKE PUSD</Link>
                  </button>
                </div>
                <div className="grid place-items-center mt-[1rem]">
                  <Image src={port2} alt="home" width={200} />
                  <p className="text-white title-text text-center font-semibold text-lg mt-4">
                    You have not Staked
                  </p>
                </div>
              </div>
            </div>
          )}
          {!isConnected && (
            <div className="md:p-10 flex flex-col md:flex-row justify-between gap-y-8 md:gap-10">
              <div
                className="md:w-[35rem] md:h-[23.6rem] md:mx-0 mx-3 mt-4 md:ml-[2.5rem] rounded-sm"
                style={{ backgroundColor: "#3f3b2d" }}
              >
                <div
                  className="  flex flex-row justify-between p-5"
                  style={{ backgroundColor: "#3d3f37" }}
                >
                  <span className="text-white title-text">TROVE</span>

                  <CustomConnectButton className="" />
                </div>
                <div className="grid place-items-center">
                  <Image src={img1} alt="home" width={200} />
                  <h6 className="text-white  body-text text-center font-semibold text-lg mt-4">
                    You don't have an Active Trove
                  </h6>
                </div>
              </div>
              <div
                className="md:w-[22rem] md:h-[23.6rem] md:ml-[2.5rem] md:mx-0 mx-3 rounded-sm"
                style={{ backgroundColor: "#3f3b2d" }}
              >
                <div
                  className="  flex flex-row justify-between p-5"
                  style={{ backgroundColor: "#3d3f37" }}
                >
                  <span className="text-white title-text">STABILITY POOL</span>
                  <CustomConnectButton className="" />
                </div>
                <div className="grid place-items-center mt-[1rem]">
                  <Image src={port2} alt="home" width={200} />
                  <h6 className="text-white text-center title-text font-semibold text-lg mt-4">
                    You have not Staked
                  </h6>
                </div>
              </div>
            </div>
          )}
        </Layout>
      </div>
      {/* // )} */}
    </div>
  );
};

export default Portfolio;