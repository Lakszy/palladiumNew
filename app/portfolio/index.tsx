/* eslint-disable */

"use client";
import troveManagerAbi from "../src/constants/abi/TroveManager.sol.json";
import stabilityPoolAbi from "../src/constants/abi/StabilityPool.sol.json";
import { BOTANIX_RPC_URL } from "../src/constants/botanixRpcUrl";
import botanixTestnet from "../src/constants/botanixTestnet.json";
import { getContract } from "../src/utils/getContract";
import Decimal from "decimal.js";
import { EVMConnect } from "@/components/EVMConnect";
import { ethers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import web3 from "web3";
import Link from "next/link";
import Image from "next/image";
import img1 from "../assets/images/portfolioCoin.png";
import { Knob } from "primereact/knob";
import Progress from "./Progress";
import Layout from "./layout";
import floatPUSD from "../assets/images/floatPUSD3.png";
import macPUSD from "../assets/images/floatPUSD3.png";
import FullScreenLoader from "@/components/FullScreenLoader";
import "../App.css";
import "./Portfolio.css"

const Portfolio = () => {

  const { isConnected } = useAccount();
  const [price, setPrice] = useState<number>(0);
  const [hasPriceFetched, setHasPriceFetched] = useState(false);
  const [hasGotStaticData, setHasGotStaticData] = useState(false);

  // static
  const [staticLiquidationPrice, setStaticLiquidationPrice] = useState(0);
  const [staticLtv, setStaticLtv] = useState(0);
  const [staticTotalCollateral, setStaticTotalCollateral] = useState(0);
  const [staticTotalDebt, setStaticTotalDebt] = useState(0);
  const [staticCollAmount, setStaticCollAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false)

  const [systemLTV, setSystemLTV] = useState("0");

  const [entireDebtAndCollCore, setEntireDebtAndCollCore] = useState({
    debtCore: "0",
    collCore: "0",
    pendingLUSDDebtReward: "0",
    pendingETHReward: "0",
  });

  const [entireDebtAndCollBTC, setEntireDebtAndCollBTC] = useState({
    debtBTC: "0",
    collBTC: "0",
    pendingLUSDDebtRewardBTC: "0",
    pendingETHRewardBTC: "0",
  });

  const { data: walletClient } = useWalletClient();
  const BOTANIX_RPC_URL2 = "https://rpc.test.btcs.network";
  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL2);

  const troveManagerContract = getContract(
    botanixTestnet.addresses.VesselManager,
    troveManagerAbi,
    provider
  );

  const stabilityPoolContractReadOnly = useMemo(() => getContract(
    botanixTestnet.addresses.StabilityPool,
    stabilityPoolAbi,
    provider
  ), [provider]);

  const [activeTab, setActiveTab] = useState('tab1');

  const [totalStakedValue, setTotalStakedValue] = useState("0");
  const { toBigInt } = web3.utils;
  const [lr, setLR] = useState(0)
  const [minDebt, setMinDebt] = useState(0)

  const [borrowRate, setBorrowRate] = useState(0)
  const [borrowRateBTC, setBorrowRateBTC] = useState(0)


  const [minDebtBTC, setMinDebtBTC] = useState(0)
  const [cCr, setCCR] = useState(0)

  const [mCR, setMCR] = useState(0)
  const [mCRBTC, setMCRBTC] = useState(0)

  const [fetchedPrice, setFetchedPrice] = useState(0)
  const [fetchedPriceBTC, setFetchedPriceBTC] = useState(0)


  const [systemCollRatio, setSystemCollRatio] = useState(0);
  const [systemCollRatioBTC, setSystemCollRatioBTC] = useState(0);


  const [recoveryMode, setRecoveryMode] = useState<boolean>(false)

  const [troveStatusBTC, setTroveStatusBTC] = useState("");
  const [troveStatuscore, setTroveStatuscore] = useState("");

  const [pusdMintedCore, setPusdMintedCore] = useState(0)
  const [pusdMintedBTC, setPusdMintedBTC] = useState(0)
  const [totalStabilityPool, setTotalStabilityPool] = useState("0");
  const [depositorGains, setDepositorGains] = useState<{
    [key: string]: string;
  }>({});
  
  const collateralTokens = [
    {
      name: "WCORE",
      address: "0x5FB4E66C918f155a42d4551e871AD3b70c52275d",
      oracle: "0xdd68eE1b8b48e63909e29379dBe427f47CFf6BD0",
    },
    {
      name: "WBTC",
      address: "0x4CE937EBAD7ff419ec291dE9b7BEc227e191883f",
      oracle: "0x81A64473D102b38eDcf35A7675654768D11d7e24",
    },

  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.palladiumlabs.org/core/protocol/metrics");
        const data = await response.json();
        const protocolMetrics = data[0].metrics[1]; // Fetch the metrics for WCORE (at index 1)
        const protocolMetricsBTC = data[0].metrics[0]; // Fetch the metrics for WBTC (at index 0)

        setRecoveryMode(protocolMetrics.recoveryMode);

        setFetchedPrice(protocolMetrics.price);
        setFetchedPriceBTC(protocolMetricsBTC.price)
        setPusdMintedBTC(protocolMetricsBTC.totaldebt)
        setPusdMintedCore(protocolMetrics.totaldebt)

        setMCR(protocolMetrics.MCR);
        setMCRBTC(protocolMetricsBTC.MCR);

        setCCR(protocolMetrics.CCR);
        setLR(protocolMetrics.LR);

        setMinDebt(protocolMetrics.minDebt);
        setMinDebtBTC(protocolMetricsBTC.minDebt);

        setBorrowRate(protocolMetrics.borrowRate);
        setBorrowRateBTC(protocolMetricsBTC.borrowRate);

        setSystemCollRatio(protocolMetrics.TCR);
        setSystemCollRatioBTC(protocolMetricsBTC.TCR)


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    const getTroveStatus = async () => {
      try {
        if (!walletClient) return null;
        const troveStatusBigInt = await troveManagerContract.getVesselStatus(
          "0x4CE937EBAD7ff419ec291dE9b7BEc227e191883f",
          walletClient?.account.address
        );
        const troveStatus =
          troveStatusBigInt.toString() === "1" ? "ACTIVE" : "INACTIVE";
        setTroveStatusBTC(troveStatus)

        const troveStatusBigIntcore = await troveManagerContract.getVesselStatus(
          "0x5FB4E66C918f155a42d4551e871AD3b70c52275d",
          walletClient?.account.address
        );
        const troveStatuscore =
          troveStatusBigIntcore.toString() === "1" ? "ACTIVE" : "INACTIVE";
        setTroveStatuscore(troveStatuscore)
      } catch (error) {
        console.error(error)
      }
    }
    const getStakedValue = async () => {
      if (!walletClient) return null;
      const fetchedTotalStakedValue =
        await stabilityPoolContractReadOnly.getCompoundedDebtTokenDeposits(
          walletClient?.account.address
        );
      const fixedtotal = ethers.formatUnits(fetchedTotalStakedValue, 18);
      setTotalStakedValue(fixedtotal);
      setIsLoading(false);
    };
    getStakedValue();
    getTroveStatus();
    fetchData();
  }, [walletClient]);

  const fetchDepositorGains = useCallback(async () => {
    if (!walletClient) return;

    try {
      const sortedAssets = [...collateralTokens].sort((a, b) =>
        a.address.toLowerCase().localeCompare(b.address.toLowerCase())
      );

      const assets = sortedAssets.map((token) => token.address);
      const [returnedAssets, gains] =
        await stabilityPoolContractReadOnly.getDepositorGains(
          walletClient.account.address,
          assets
        );

      const gainsObject: { [key: string]: string } = {};
      returnedAssets.forEach((asset: string, index: number) => {
        const gain = gains[index];
        if (gain > BigInt(0)) {
          const token = sortedAssets.find(
            (t) => t.address.toLowerCase() === asset.toLowerCase()
          );
          if (token) {
            gainsObject[token.name] = ethers.formatUnits(gain, 18);
          }
        }
      });
      setDepositorGains(gainsObject);
    } catch (error) {
      console.error("Error fetching depositor gains:", error);
    }
  }, [walletClient, stabilityPoolContractReadOnly, collateralTokens]);



  useEffect(() => {
    const pow = Decimal.pow(10, 18);
    const pow16 = Decimal.pow(10, 16);
    const _1e18 = toBigInt(pow.toFixed());
    const _1e16 = toBigInt(pow16.toFixed());

    const fetchedData = async () => {

      if (!walletClient) {
        return null;
      }

      const {
        0: debtCore,
        1: collCore,
        2: pendingLUSDDebtReward,
        3: pendingETHReward,
      } = await troveManagerContract.getEntireDebtAndColl(
        "0x5FB4E66C918f155a42d4551e871AD3b70c52275d",
        walletClient?.account.address
      );

      const {
        0: debtBTC,
        1: collBTC,
        2: pendingLUSDDebtRewardBTC,
        3: pendingETHRewardBTC,
      } = await troveManagerContract.getEntireDebtAndColl(
        "0x4CE937EBAD7ff419ec291dE9b7BEc227e191883f",
        walletClient?.account.address
      );


      const collDecimal = new Decimal(collCore.toString());
      const collFormatted = collDecimal.div(_1e18.toString()).toString();

      setEntireDebtAndCollCore({
        debtCore: (debtCore / _1e18).toString(),
        collCore: collFormatted,
        pendingLUSDDebtReward: (pendingLUSDDebtReward / _1e18).toString(),
        pendingETHReward: (pendingETHReward / _1e18).toString(),
      });

      const collDecimalBTC = new Decimal(collBTC.toString());
      const collFormattedBTC = collDecimalBTC.div(_1e18.toString()).toString();

      setEntireDebtAndCollBTC({
        debtBTC: (debtBTC / _1e18).toString(),
        collBTC: collFormattedBTC,
        pendingLUSDDebtRewardBTC: (pendingLUSDDebtRewardBTC / _1e18).toString(),
        pendingETHRewardBTC: (pendingETHRewardBTC / _1e18).toString(),
      });

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


    const getStaticData = async () => {
      if (!walletClient) return null;
      if (!provider || hasGotStaticData) return null;
      setStaticCollAmount(Number(entireDebtAndCollCore.collCore));
      const totalColl = Number(entireDebtAndCollCore.collCore) * price;
      setStaticTotalCollateral(totalColl);
      setStaticTotalDebt(Number(entireDebtAndCollCore.collCore));

      const ltvValue = (Number(entireDebtAndCollCore.collCore) * 100) / (totalColl || 1);
      setStaticLtv(ltvValue);
      const divideBy = recoveryMode ? cCr : mCR;
      const liquidationPriceValue = (divideBy * Number(entireDebtAndCollCore.collCore)) / Number(entireDebtAndCollCore.collCore);
      setStaticLiquidationPrice(liquidationPriceValue);
      setHasGotStaticData(true);
    };

    getStaticData();
    fetchedData();
  }, [walletClient,]);

  const divideBy = recoveryMode ? cCr : mCR;
  // const availableToBorrow = (Number(entireDebtAndColl.coll) * Number(fetchedPrice)) / Number(divideBy) - Number(entireDebtAndColl.debt);
  const newLTV = ((Number(entireDebtAndCollCore.debtCore) * 100) / ((Number(entireDebtAndCollCore.collCore) * Number(fetchedPrice)))).toFixed(2)
  const newLTVBTC = ((Number(entireDebtAndCollBTC.debtBTC) * 100) / ((Number(entireDebtAndCollBTC.collBTC) * Number(fetchedPriceBTC)))).toFixed(2)

  const portfolioValue = ((Number(entireDebtAndCollCore.collCore) * fetchedPrice) + (Number(entireDebtAndCollBTC.collBTC) * fetchedPriceBTC) - Number(entireDebtAndCollCore.debtCore) - Number(entireDebtAndCollBTC.debtBTC)).toFixed(2);
  const totalSupply = (
    Number(entireDebtAndCollCore.collCore) * fetchedPrice +
    Number(entireDebtAndCollBTC.collBTC) * fetchedPriceBTC
  ).toFixed(2);

  const suppliedAmount = (
    Number(entireDebtAndCollCore.debtCore) +
    Number(entireDebtAndCollBTC.debtBTC)
  ).toFixed(2)


  const suppliedAmountProgress = ((Number(entireDebtAndCollCore.debtCore) + Number(entireDebtAndCollBTC.debtBTC)) * 0.9).toFixed(2)

  useEffect(() => {
    fetchDepositorGains();
  }, []);

  const allTokenGains = collateralTokens.reduce((acc, token) => {
    acc[token.name] = depositorGains[token.name] || "0";
    return acc;
  }, {} as { [key: string]: string });

  const wcoreGains = Number(allTokenGains["WCORE"]);
  const wbtcGains = Number(allTokenGains["WBTC"]);

  return (
    <div>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <div>
          <Layout>
            {isConnected && (
              <div className=" flex  p-6 flex-col">
                <div className="flex flex-col md:flex-row items-center md:gap-x-0 gap-x-2 md:w-full justify-between">
                  <div className="md:ml-[1.5rem] items-start">
                    <h6 className="text-[#565348] title-text text-md font-bold mt-1 mb-4 text-left">
                      Portfolio Value
                    </h6>
                    <span className="text-white body-text text-2xl font-bold whitespace-nowrap flex text-left">
                      {portfolioValue} ORE
                    </span>
                  </div>
                  <div className="w-5/12 h-2 -ml-[12rem] md:ml-0 md:mr-10 mt-10 pb-12">
                    <Progress total={Number(totalSupply)} supplied={Number(suppliedAmountProgress)} />
                    <div className="flex flex-row md:gap-x-0 gap-x-28 items-center justify-between">

                      {/* Borrowed Section */}
                      <div className="text-white flex flex-col mt-05">
                        <div className="flex items-center gap-x-1">
                          <div className="w-2 rounded-full h-2 bg-[#88e273]"></div>
                          <span className="body-text font-normal">Borrowed</span>
                        </div>
                        <span className="body-text text-right whitespace-nowrap font-medium">
                          {(
                            Number(entireDebtAndCollCore.debtCore) +
                            Number(entireDebtAndCollBTC.debtBTC)
                          ).toFixed(2)} ORE
                        </span>
                      </div>

                      {/* Supplied Section */}
                      <div className="text-white flex flex-col mt-05">
                        <div className="flex items-center gap-x-1">
                          <div className="w-2 rounded-full h-2 bg-green-400"></div>
                          <span className="body-text font-normal">Supplied</span>
                        </div>
                        <span className="body-text text-right whitespace-nowrap font-medium">
                          {(
                            Number(entireDebtAndCollCore.collCore) * fetchedPrice +
                            Number(entireDebtAndCollBTC.collBTC) * fetchedPriceBTC
                          ).toFixed(2)} ORE
                        </span>
                      </div>

                    </div>
                  </div>

                </div>

                <div className="tab_container">
                  <input
                    id="tab1"
                    type="radio"
                    name="tabs"
                    checked={activeTab === 'tab1'}
                    onChange={() => setActiveTab('tab1')}
                    style={{ backgroundColor: "#272315" }}
                  />
                  <label htmlFor="tab1"><span className="md:body-text body-textsm">Troves</span></label>

                  <input
                    id="tab2"
                    type="radio"
                    name="tabs"
                    checked={activeTab === 'tab2'}
                    onChange={() => setActiveTab('tab2')}
                    style={{ backgroundColor: "#272315" }}
                  />
                  <label htmlFor="tab2"><span className="whitespace-nowrap md:body-text body-textsm">STABILITY POOL</span></label>

                  {activeTab === 'tab1' && (
                    <section id="content1" className="tab-content flex md:flex-row flex-col" style={{ borderTop: "1px solid #88e273", backgroundColor: "black", display: "flex", gap: "1rem" }}>
                      {/* Card1 */}
                      {troveStatuscore === "INACTIVE" ? (
                        <div className={`px-3 md:-ml-5 h-full space-y-10 md:space-y-0 gap-x-[3rem] flex flex-col md:flex-row ${troveStatusBTC === "INACTIVE" ? 'w-[100%]' : ''}`}>
                          <div className="  md:w-full w-[19rem]  md:h-[25rem]  md:ml-[2.5rem] rounded-sm" style={{ backgroundColor: "#222222" }}>
                            <div className="flex flex-row justify-between p-5" style={{ backgroundColor: "#282828" }}>
                              <span className="title-text2 text-white">WCORE VESSEL</span>
                              <button className="h-10 px-8 bg-[#88e273] hover:scale-x-95 text-black font-bold title-text">
                                <Link className="title-text text-sm text-black" href="/trove/wcore">OPEN VESSEL</Link>
                              </button>
                            </div>
                            <div className="grid place-items-center mb-[0.5rem] p-3">
                              <Image src={floatPUSD} alt="home" width={220} className="" />
                              <p className="text-gray-400 mt-10 mx-1 title-text2 text-center font-semibold text-lg pt-5">
                                You don't have an active WCORE vessel
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 w-[100%]  h-auto rounded-sm" style={{ backgroundColor: "#222222" }}>
                          <div className=" flex items-center flex-row justify-between p-5" style={{ backgroundColor: "#282828" }}>
                            <span className="body-text text-white ml-1">WCORE VESSEL</span>
                            <Link href="/trove/wcore">
                              <button
                                className="h-8 px-8 border-[#88e273] text-[#88e273] border title-text2 bg-transparent  title-text font-bold">
                                Details
                              </button>
                            </Link>
                          </div>
                          <div>
                            <div className="w-fit md:space-x-32 flex items-center justify-between h-full">

                              <div className="text-white w-fit space-y-20 mt-5 items-center  mb-6 p-2 flex flex-col  justify-between md:mx-[2.5rem] mx-[1.5rem]">
                                {" "}
                                <div className="flex  flex-col">
                                  <span className="body-text font-semibold text-gray-500">Collateral</span>
                                  <span className="body-text font-semibold whitespace-nowrap ">{Number(entireDebtAndCollCore.collCore).toFixed(2)} WCORE</span>
                                  <span className="text-xs font-semibold body-text text-gray-500">${(Number(entireDebtAndCollCore.collCore) * fetchedPrice).toFixed(2)}</span>
                                </div>
                                <div className="flex -ml-8 flex-col whitespace-nowrap">
                                  {" "}
                                  <span className="body-text font-semibold text-gray-500">Debt</span>
                                  <span className="body-text font-semibold whitespace-nowrap">{Number(entireDebtAndCollCore.debtCore).toFixed(2)} ORE</span>
                                </div>
                              </div>
                              <div className="flex -ml-10 md:-ml-0 flex-col mb-2  items-center">
                                <Knob value={Number(newLTV) || 0} showValue={true} size={175} rangeColor="#78887f" valueColor="#3dde84" strokeWidth={7} readOnly className="text-[#88e273]" />
                                <div className="flex-col flex items-center space-y-1 -mt-4  w-[4.5rem]">
                                  <span className="text-sm whitespace-nowrap text-[#565348] body-text ">YOUR LTV</span>
                                  <div className="flex items-center justify-center gap-x-2">
                                    <span className="text-lg text-white  ml-[0.5rem] body-text">{90}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      )}
                      {/* Card2 */}
                      {troveStatusBTC === "INACTIVE" ? (
                        <div className={`px-3 md:-ml-5 h-full space-y-10 md:space-y-0 gap-x-[3rem] flex flex-col md:flex-row ${troveStatuscore === "INACTIVE" ? 'w-[100%]' : ''}`}>
                          <div className="  md:h-[25rem]  md:w-full w-[21rem] -ml-3 md:ml-[2.5rem] rounded-sm" style={{ backgroundColor: "#222222" }}>
                            <div className="flex flex-row justify-between p-5" style={{ backgroundColor: "#282828" }}>
                              <span className="title-text2 text-white">WBTC VESSEL</span>
                              <button className="h-10 px-8 bg-[#88e273] hover:scale-x-95 text-black font-bold title-text">
                                <Link className="title-text text-sm text-black" href="/trove/wbtc">OPEN VESSEL</Link>
                              </button>
                            </div>
                            <div className="grid place-items-center mb-[0.5rem] p-3">
                              <Image src={floatPUSD} alt="home" width={220} className="" />
                              <p className="text-gray-400 title-text2 text-center font-semibold text-lg pt-5 mt-10 mx-1">
                                You don't have an active WBTC vessel
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 lg:w-[20rem] h-auto rounded-sm" style={{ backgroundColor: "#222222" }}>
                          <div className=" flex items-center flex-row justify-between p-5" style={{ backgroundColor: "#282828" }}>
                            <span className="body-text text-white ml-1">WBTC VESSEL</span>
                            <Link href="/trove/wbtc">
                              <button
                                className="h-8 px-8 border-[#88e273] text-[#88e273] border title-text2 bg-transparent  title-text font-bold">
                                Details
                              </button>
                            </Link>
                          </div>
                          <div>
                            <div className="w-fit md:space-x-32  flex items-center justify-between h-full">

                              <div className="text-white w-fit  space-y-20 mt-5 items-center  mb-6 p-2 flex flex-col  justify-between md:mx-[2.5rem] mx-[1.5rem]">
                                {" "}
                                <div className="flex  flex-col">
                                  <span className="body-text font-semibold text-gray-500">Collateral</span>
                                  <span className="body-text font-semibold whitespace-nowrap ">{Number(entireDebtAndCollBTC.collBTC).toFixed(2)} WBTC</span>
                                  <span className="text-xs font-semibold body-text text-gray-500">${(Number(entireDebtAndCollBTC.collBTC) * fetchedPriceBTC).toFixed(2)}</span>
                                </div>
                                <div className="flex  flex-col whitespace-nowrap">
                                  {" "}
                                  <span className="body-text font-semibold text-gray-500">Debt</span>
                                  <span className="body-text font-semibold whitespace-nowrap">{Number(entireDebtAndCollBTC.debtBTC).toFixed(2)} ORE</span>
                                </div>
                              </div>
                              <div className="flex flex-col mb-2 -ml-10 md:-ml-0  items-center">
                                <Knob value={Number(newLTVBTC) || 0} showValue={true} size={175} rangeColor="#78887f" valueColor="#3dde84" strokeWidth={7} readOnly className="text-[#88e273]" />
                                <div className="flex-col flex items-center space-y-1 -mt-4  w-[4.5rem]">
                                  <span className="text-sm whitespace-nowrap text-[#565348] body-text ">YOUR LTV</span>
                                  <div className="flex items-center justify-center gap-x-2">
                                    <span className="text-lg text-white  ml-[0.5rem] body-text">{90}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </section>
                  )}

                  {activeTab === 'tab2' && (
                    <section id="content2" className="tab-content">
                      <div className="lg:w-[25rem] h-auto rounded-sm" style={{ backgroundColor: "#222222" }}>
                        <div className="flex items-center flex-row justify-between p-5 border-b-1" style={{ backgroundColor: "#282828" }}>
                          <span className="text-white title-text2 ml-[10px]">STABILITY POOL</span>
                          <Link href="/stake">
                            <button className="h-8 px-6 title-text2 border-[#88e273] border bg-transparent text-[#88e273] font-bold">
                              {troveStatuscore === 'INACTIVE' && troveStatusBTC === 'INACTIVE' ? 'STAKE ORE' : 'Details'}
                            </button>
                          </Link>
                        </div>

                        {troveStatuscore === 'ACTIVE' || troveStatusBTC === 'ACTIVE' ? (
                          <div className="text-white ml-5 p-3">
                            <div className="mb-[2rem] mt-2 whitespace-nowrap">
                              <p className="body-text text-sm text-[#565348]">Deposited</p>
                              <p className="body-text font-medium whitespace-nowrap">{Number(totalStakedValue).toFixed(2)} ORE</p>
                            </div>
                            <div className="flex flex-row gap-10">
                              <div className="flex-col gap-y-5 flex">
                                <div className="flex flex-col whitespace-nowrap">
                                  <span className="body-text text-sm text-[#565348]">WCORE Gains</span>
                                  <span className="body-text font-medium whitespace-nowrap">
                                    {Number(wcoreGains).toFixed(2)} WCORE
                                  </span>
                                </div>
                                <div className="flex flex-col whitespace-nowrap">
                                  <span className="body-text text-sm text-[#565348]">WBTC Gains</span>
                                  <span className="body-text font-medium whitespace-nowrap">
                                  {Number(wbtcGains).toFixed(8)} WBTC
                                  </span>
                                </div>
                              </div>
                              <Image className="-ml-16 md:-ml-4" src={macPUSD} alt="home" width={200} />
                            </div>
                          </div>
                        ) : (
                          <div className="grid place-items-center mt-[2rem]">
                            <Image src={macPUSD} alt="home" width={200} />
                            <p className="text-gray-400 title-text2 text-center font-semibold text-lg mt-4">
                              You have not Staked
                            </p>
                          </div>
                        )}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            )}

            {!isConnected && (
              <div className="md:p-10 flex flex-col md:flex-row justify-around gap-y-8 md:gap-10">
                <div className="md:w-[35rem] md:h-[23.6rem] md:mx-0 mx-3 mt-4 md:ml-[2.5rem] rounded-sm" style={{ backgroundColor: "#222222" }}>
                  <div className=" items-center  flex flex-row justify-between p-5" style={{ backgroundColor: "" }}>
                    <span className="text-white title-text2 ">VESSEL</span>
                    <EVMConnect className="" />
                  </div>
                  <div className="grid  md:my-0 my-5 place-items-center">
                    <Image src={img1} alt="home" width={200} />
                    <p className="mt-4 font-medium text-gray-400 title-text2 text-center pt-5">
                      You don't have an active Vessel
                    </p>
                  </div>
                </div>
                <div className="md:w-[22rem]  md:h-[23.6rem] mt-[15px] md:ml-[2.5rem] md:mx-0 mx-3 rounded-sm" style={{ backgroundColor: "#222222" }}>
                  <div className=" items-center flex flex-row justify-between p-5" style={{ backgroundColor: "#222222" }}>
                    <span className="text-white title-text2">STABILITY POOL</span>
                    <EVMConnect className="" />
                  </div>
                  <div className="grid md:my-7 my-5 place-items-center mt-[1rem]">
                    <Image src={macPUSD} alt="home" width={200} />
                    <h6 className="mt-4 pt-5 font-medium text-gray-400 title-text2 text-center">
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
