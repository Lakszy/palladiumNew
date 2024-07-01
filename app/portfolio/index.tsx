/* eslint-disable */

"use client";
import troveManagerAbi from "../src/constants/abi/TroveManager.sol.json";
import stabilityPoolAbi from "../src/constants/abi/StabilityPool.sol.json";
import { BOTANIX_RPC_URL } from "../src/constants/botanixRpcUrl";
import botanixTestnet from "../src/constants/botanixTestnet.json";
import { getContract } from "../src/utils/getContract";
import Decimal from "decimal.js";
import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useBalance, useWalletClient } from "wagmi";
import web3 from "web3";
import Link from "next/link";
import Image from "next/image";
import img1 from "../assets/images/Group 771.png";
import port2 from "../assets/images/port2.svg";
import { Knob } from "primereact/knob";
import "../App.css";
import Progress from "./Progress";
import Layout from "./layout";
import floatPUSD from "../assets/images/floatPUSD.png";
import macPUSD from "../assets/images/macPUSD.png";
import { CustomConnectButton } from "@/components/connectBtn";
import FullScreenLoader from "@/components/FullScreenLoader";

const Portfolio = () => {

  const { isConnected } = useAccount();
  const [ltv, setLtv] = useState(0);
  const [price, setPrice] = useState<number>(0);
  const [hasPriceFetched, setHasPriceFetched] = useState(false);
  const [hasGotStaticData, setHasGotStaticData] = useState(false);

  // static
  const [staticLiquidationPrice, setStaticLiquidationPrice] = useState(0);
  const [staticLtv, setStaticLtv] = useState(0);
  const [staticTotalCollateral, setStaticTotalCollateral] = useState(0);
  const [staticTotalDebt, setStaticTotalDebt] = useState(0);
  const [staticCollAmount, setStaticCollAmount] = useState(0);
  const [value, setValue] = useState("0");
  const [isLoading, setIsLoading] = useState(false)
  let totalSupply = 50;
  let suppliedAmount = 40;

  const [systemLTV, setSystemLTV] = useState("0");

  const [entireDebtAndColl, setEntireDebtAndColl] = useState({
    debt: "0",
    coll: "0",
    pendingLUSDDebtReward: "0",
    pendingETHReward: "0",
  });


  const { data: walletClient } = useWalletClient();

  const provider = useMemo(() => new ethers.JsonRpcProvider(BOTANIX_RPC_URL), []);

  const troveManagerContract = useMemo(() => getContract(
    botanixTestnet.addresses.troveManager,
    troveManagerAbi,
    provider
  ), [provider]);

  const stabilityPoolContractReadOnly = useMemo(() => getContract(
    botanixTestnet.addresses.stabilityPool,
    stabilityPoolAbi,
    provider
  ), [provider]);

  const [troveStatus, setTroveStatus] = useState("");
  const [totalStakedValue, setTotalStakedValue] = useState("0");

  const { toBigInt } = web3.utils;
  const [lr, setLR] = useState(0)
  const [cCr, setCCR] = useState(0)
  const [mCR, setMCR] = useState(0)
  const [fetchedPrice, setFetchedPrice] = useState(0)
  const [recoveryMode, setRecoveryMode] = useState<boolean>(false)
  const [afterLoad, setAfterload] = useState(false);


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

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    const getTroveStatus = async () => {
      if (!walletClient) return null;
      const troveStatusBigInt = await troveManagerContract.getTroveStatus(
        walletClient?.account.address
      );
      const troveStatus = troveStatusBigInt.toString() === "1" ? "ACTIVE" : "INACTIVE";
      setTroveStatus(troveStatus);
      setIsLoading(false)
    };
    setIsLoading(true)
    setAfterload(true)
    fetchData();
    getTroveStatus();
  }, []);

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
      setAfterload(false)

      if (!hasPriceFetched) {
        try {
          const updatedCollFormatted = new Decimal(collFormatted).mul(fetchedPrice);
          const updatedPrice = parseFloat(updatedCollFormatted.toString());
          setPrice(updatedPrice);
          setHasPriceFetched(true);
        } catch (error) {
          setHasPriceFetched(true);
        }
      }
    };

    const getSystemLTV = async () => {
      const systemLTV = await troveManagerContract.getTCR(price);
      const systemLTVDecimal = new Decimal(systemLTV.toString());
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
      const fixedtotal = ethers.formatUnits(fetchedTotalStakedValue, 18);
      setTotalStakedValue(fixedtotal);
    };

    const getStaticData = async () => {
      if (!walletClient) return null;
      if (!provider || hasGotStaticData) return null;
      setStaticCollAmount(Number(entireDebtAndColl.coll));
      const totalColl = Number(entireDebtAndColl.coll) * price;
      setStaticTotalCollateral(totalColl);
      setStaticTotalDebt(Number(entireDebtAndColl.coll));
      totalSupply = 100;
      suppliedAmount = Number(entireDebtAndColl.debt);

      const ltvValue = (Number(entireDebtAndColl.coll) * 100) / (totalColl || 1);
      setStaticLtv(ltvValue);
      const divideBy = recoveryMode ? cCr : mCR;
      const liquidationPriceValue = (divideBy * Number(entireDebtAndColl.coll)) / Number(entireDebtAndColl.coll);
      setStaticLiquidationPrice(liquidationPriceValue);
      setHasGotStaticData(true);
    };
    getStaticData();
    fetchedData();
    getSystemLTV();
    getStakedValue();
  }, [walletClient]);

  const divideBy = recoveryMode ? cCr : mCR;
  const availableToBorrow = (Number(entireDebtAndColl.coll) * Number(fetchedPrice)) / Number(divideBy) - Number(entireDebtAndColl.debt);
  const newLTV = ((Number(entireDebtAndColl.debt) * 100) / ((Number(entireDebtAndColl.coll) * Number(fetchedPrice)))).toFixed(2)

  return (
    <div>
      {isLoading && afterLoad ? (
        <FullScreenLoader />
      ) : (
        <div>
          <Layout>
            {troveStatus === "ACTIVE" && (
              <div className=" flex flex-col">
                <div className="flex flex-col md:flex-row items-center md:gap-x-0 gap-x-2 md:w-full justify-between">
                  <div className=" md:-ml-0 -ml-6">
                    <h6 className="text-gray-500 title-text text-sm mt-1 mb-4 ml-[1.25rem]">
                      Portfolio Value
                    </h6>
                    <span className="text-white body-text text-2xl font-bold ml-[1.5rem] flex justify-between">
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
                            <span className="body-text font-semibold">Borrowed</span>
                          </div>
                          <span className="body-text text-right font-semibold">{Number(entireDebtAndColl.debt).toFixed(2)} PUSD</span>
                        </div>
                        <div className="text-white flex flex-col mt-05">
                          <div className="flex items-center gap-x-1">
                            <div className="w-2 rounded-full h-2  bg-green-400"></div>
                            <span className="body-text font-semibold">Supplied</span>
                          </div>
                          <span className="body-text text-right whitespace-nowrap font-semibold">{Number(entireDebtAndColl.coll).toFixed(8)} BTC</span>
                        </div>
                      </div>
                    </h1>
                  </div>

                </div>
                <div className="mt-10 py-10 my-10 flex flex-col md:flex-row justify-between gap-10 md:w-full md:p-5  p-3 w-[24rem]">
                  <div className="flex-1 lg:w-[20rem] h-auto rounded-sm" style={{ backgroundColor: "#2e2a1c" }}>
                    <div className=" flex flex-row justify-between p-5" style={{ backgroundColor: "#353123" }}>
                      <span className="title-text2 text-white">TROVE</span>
                      <Link href="/trove">
                        <button
                          className="h-10 px-8 border-yellow-400 text-yellow-400 border title-text2 bg-transparent  title-text font-bold">
                          Details
                        </button>
                      </Link>
                    </div>
                    <div>
                      <div className="flex flex-col mb-2 items-center">
                        <Knob value={Number(newLTV) || 0} showValue={true} size={175} rangeColor="#78887f" valueColor="#3dde84" strokeWidth={7} readOnly className="text-white" />
                        <div className="flex-col flex items-center space-y-1 -mt-4  w-[4.5rem]">
                          <span className="text-lg text-white  ml-[0.5rem] body-text">{Number(newLTV).toFixed(2) || 0}%</span>
                          <span className="text-xs ml-[0.5rem] text-gray-500 body-text">/100%</span>
                          <span className="text-xs text-gray-500 body-text ">YOUR LTV</span>
                        </div>
                      </div>
                      <div className="text-white p-2 flex flex-row justify-between mx-[2.5rem]">
                        {" "}
                        <div className="flex flex-col">
                          <span className="body-text font-semibold text-gray-500">Collateral</span>
                          <span className="body-text font-semibold ">{Number(entireDebtAndColl.coll).toFixed(8)} BTC</span>
                          <span className="text-xs font-semibold body-text text-gray-500">${price.toFixed(2)}</span>
                        </div>
                        <div className="flex  flex-col">
                          {" "}
                          <span className="body-text font-semibold text-gray-500">Debt</span>
                          <span className="body-text font-semibold">{Number(entireDebtAndColl.debt).toFixed(2)} PUSD</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className=" lg:w-[22rem] h-auto rounded-sm" style={{ backgroundColor: "#2e2a1c" }}>
                    <div className=" flex flex-row justify-between p-5" style={{ backgroundColor: "#353123" }}>
                      <span className="text-white title-text2">STABILITY POOL</span>
                      <Link href="/stake">
                        <button className="h-10 px-6 title-text2 border-yellow-400 border bg-transparent  text-yellow-400 font-bold">
                          Details
                        </button>
                      </Link>
                    </div>
                    <div className="text-white ml-3">
                      <div className="mb-[2rem] mt-2 whitespace-nowrap">
                        <p className="body-text text-sm text-gray-500">Deposited</p>
                        <p className="body-text font-medium">{Number(totalStakedValue).toFixed(2)} PUSD</p>
                      </div>
                      <div className="flex flex-row gap-10">
                        <div className="flex flex-col whitespace-nowrap">
                          <span className="body-text text-sm text-gray-500">Claimable</span>
                          <span className="body-text font-medium">{(lr).toFixed(2)} PUSD</span>
                        </div>
                        <Image src={port2} alt="home" width={200} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {troveStatus === "INACTIVE" && (
              <div className="pt-10 px-3 -ml-5 h-full space-y-10  md:space-y-0 gap-x-[3rem] flex flex-col md:flex-row w-[100%]">
                <div className="md:w-[55%] shadow-lg  md:ml-[2.5rem] rounded-sm" style={{ backgroundColor: "#2e2a1c" }}>
                  <div className=" flex flex-row justify-between p-5" style={{ backgroundColor: "#353123" }}>
                    <span className="title-text2  text-xl text-white">TROVE</span>
                    <button className="h-10 px-8 bg-yellow-300 hover:scale-x-95  text-black font-bold title-text">
                      <Link className="title-text text-sm" href="/trove">OPEN TROVE</Link>
                    </button>
                  </div>
                  <div className="grid place-items-center mb-[0.5rem] p-3">
                    <Image src={floatPUSD} alt="home" width={220} className="-mt-10" />
                    <p className="text-gray-400 title-text2 text-center font-semibold text-lg pt-5 mt-2">
                      You don't have an Active Trove
                    </p>
                  </div>
                </div>
                <div className="md:w-[40%]  md:mt-0  shadow-lg rounded-sm" style={{ backgroundColor: "#2e2a1c" }}>
                  <div className=" items-center flex flex-row justify-between p-4" style={{ backgroundColor: "#353123" }}>
                    <span className="text-white title-text">STABILITY POOL</span>
                    <button style={{ backgroundColor: "#f5d64e" }} className="h-10 px-6 hover:scale-x-95 bg-yellow-300 text-black font-bold">
                      <Link className="title-text text-sm" href="/stake">STAKE PUSD</Link>
                    </button>
                  </div>
                  <div className="grid place-items-center mt-[2rem]">
                    <Image src={macPUSD} alt="home" width={200} />
                    <p className="text-gray-400 title-text2 text-center font-semibold text-lg mt-4">
                      You have not Staked
                    </p>
                  </div>
                </div>
              </div>
            )}
            {!isConnected && (
              <div className="md:p-10 flex flex-col md:flex-row justify-between gap-y-8 md:gap-10">
                <div className="md:w-[35rem] md:h-[23.6rem] md:mx-0 mx-3 mt-4 md:ml-[2.5rem] rounded-sm" style={{ backgroundColor: "#3f3b2d" }}>
                  <div className="  flex flex-row justify-between p-5" style={{ backgroundColor: "#3d3f37" }}>
                    <span className="text-white  title-text2">TROVE</span>

                    <CustomConnectButton className="" />
                  </div>
                  <div className="grid place-items-center">
                    <Image src={img1} alt="home" width={200} />
                    <h6 className="text-white  body-text text-center font-semibold text-lg mt-4">
                      You don't have an Active Trove
                    </h6>
                  </div>
                </div>
                <div className="md:w-[22rem] md:h-[23.6rem] md:ml-[2.5rem] md:mx-0 mx-3 rounded-sm" style={{ backgroundColor: "#3f3b2d" }}>
                  <div className="  flex flex-row justify-between p-5" style={{ backgroundColor: "#3d3f37" }}>
                    <span className="text-white title-text2">STABILITY POOL</span>
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
      )}
    </div>
  );
};

export default Portfolio;
