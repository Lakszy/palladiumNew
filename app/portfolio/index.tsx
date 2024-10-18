/* eslint-disable */

"use client";
import troveManagerAbi from "../src/constants/abi/TroveManager.sol.json";
import stabilityPoolAbi from "../src/constants/abi/StabilityPool.sol.json";
import { BOTANIX_RPC_URL } from "../src/constants/botanixRpcUrl";
import botanixTestnet from "../src/constants/botanixTestnet.json";
import { getContract } from "../src/utils/getContract";
import Decimal from "decimal.js";
import { EVMConnect } from "@/app/src/config/EVMConnect";
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
import trove2 from "../assets/images/Group 666.svg";
import trove1 from "../assets/images/wbtc.svg"
import collR from "../assets/images/mode.svg";
import ACTIVE from "../assets/images/AACTIVE.svg";
import macPUSD from "../assets/images/floatPUSD3.png";
import FullScreenLoader from "@/components/FullScreenLoader";
import "../App.css";
import "./Portfolio.css"
import { Button } from "@/components/ui/button";
import formatLargeNumber from "@/components/getActualDecimal";

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
  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);

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
                  <label htmlFor="tab1"><span className="md:body-text body-text">Troves</span></label>

                  <input
                    id="tab2"
                    type="radio"
                    name="tabs"
                    checked={activeTab === 'tab2'}
                    onChange={() => setActiveTab('tab2')}
                    style={{ backgroundColor: "#272315" }}
                  />
                  <label htmlFor="tab2"><span className="whitespace-nowrap md:body-text body-text">Stability Pool</span></label>

                  {activeTab === 'tab1' && (
                    <section id="content1" className="tab-content flex md:flex-row flex-col" style={{ borderTop: "1px solid #88e273", backgroundColor: "black", display: "flex", gap: "1rem" }}>

                      {/* CARD1 */}
                      <div className={`bg-[#222222]  rounded-lg text-white w-full md:p-6 md:mb-0 mb-3 p-3 md:h-[36.5rem]  flex-1 mx-2 ${troveStatuscore === "ACTIVE" ? "space-y-4" : "space-y-28"}`}>
                        <div className="flex  gap-x-2  justify-between items-center">
                          <div className='flex  items-center gap-x-1'>
                            <Image src={trove1} alt="btc" width={50} height={10} />
                            <h2 className="ml-4  text-xl font-medium body-text">WCORE Trove</h2>
                          </div>
                          <div className="items-center flex gap-x-2">
                            <Image src={collR} alt="btc" width={40} />
                            <div>
                              <div className="gap-1 flex">
                                <h1 className="text-white title-text2 text-xs">SCR</h1>
                                <h1 className="text-gray-400 body-text -mt-[4px] text-[10px]">(Normal Mode)</h1>
                              </div>
                              <div className="relative">
                                <div className="flex">
                                  <h1 className="text-gray-400 text-sm title-text2">
                                    {(systemCollRatio * 100).toFixed(2)} %
                                  </h1>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {troveStatuscore === "ACTIVE" ? (
                          <>
                            <div className="flex justify-around items-center">
                              <div className=' w-1/2 h-full space-y-1 md:-mt-10'>
                                <p className="text-gray-500 text-sm body-text">Trove Status</p>
                                {troveStatuscore === "ACTIVE" && (
                                  <Image src={ACTIVE} alt="status-icon" className='-ml-1' width={120} height={100} />
                                )}
                              </div>
                              <div className='flex items-center flex-col'>
                                <Knob value={Number(newLTV) || 0} min={0} max={90} showValue={true} size={135} valueColor="#3dde84" strokeWidth={7} readOnly className="text-[#88e273]" />
                                <p className="text-gray-500 body-text">Your LTV</p>
                              </div>
                            </div>
                            <div className='p-3 grid pt-1 grid-cols-3 gap-y-8 items-center justify-around'>
                              <div className="text-left">
                                <p className="text-gray-500 text-sm body-text  mt-[25px]">Collateral</p>
                                <p className="body-text font-medium text-[14px]  whitespace-nowrap">{Number(entireDebtAndCollCore.collCore).toFixed(2)} WCORE</p>
                                <p className="text-sm body-text text-gray-500">
                                  ${(Number(entireDebtAndCollCore.collCore) * fetchedPrice).toFixed(2)}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-500 text-sm body-text">Debt</p>
                                <p className="body-text font-medium text-[14px]">{entireDebtAndCollCore.debtCore} ORE</p>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-500 text-sm body-text">Max LTV</p>
                                <p className="body-text font-medium text-[14px]">{(100 / mCR).toFixed(2)}%</p>
                              </div>
                              <div className="text-left">
                                <p className="text-gray-500 text-sm body-text">One-time Fee</p>
                                <p className="body-text font-medium text-[14px]">{borrowRate * 100}%</p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-500 text-sm body-text">Min Debt</p>
                                <p className="body-text font-medium text-[14px]">{minDebt} ORE</p>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-500 text-sm body-text">ORE Minted</p>
                                <p className="body-text font-medium text-[14px]">{formatLargeNumber(pusdMintedCore)} / 2.5M</p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className='space-y-20'>
                              <div className="flex justify-between mb-4">
                                <div className='whitespace-nowrap'>
                                  <p className="body-text font-medium text-gray-400">MAX LTV</p>
                                  <p className="body-text font-medium">{(100 / mCR).toFixed(2)}%</p>
                                </div>
                                <div className='whitespace-nowrap'>
                                  <p className="body-text text-gray-400 body-text font-medium">One-time Fee</p>
                                  <p className="body-text text-right font-medium">{borrowRate * 100}%</p>
                                </div>
                              </div>
                              <div className="flex justify-between mb-4">
                                <div>
                                  <p className="body-text font-medium text-gray-400">Min Debt</p>
                                  <p className="body-text font-medium">{minDebt} ORE</p>
                                </div>
                                <div>
                                  <p className="body-text font-medium text-gray-400">ORE Minted</p>
                                  <p className="body-text font-medium">{formatLargeNumber(pusdMintedCore)} / 2.5M</p>
                                </div>
                              </div>
                            </div>
                          </>
                        )
                        }
                        <div className={`${troveStatusBTC === "ACTIVE" ? "py-10" : "py-5"}`}>
                          <>
                            <div className="border-t border-gray-400 mb-6 md:-ml-[1.5rem] md:w-[108.5%]"></div>
                            {isConnected ? (<>
                              <Link href="/trove/wcore/" passHref>
                                {troveStatuscore === "ACTIVE" ? (
                                  <Button className="border-[#88e273] h-12 border bg-transparent rounded-3xl font-semibold w-full title-text text-[#88e273] hover:scale-95 hover:bg-transparent transition">
                                    See Details
                                  </Button>
                                ) : (
                                  <Button className=" h-12 bg-gradient-to-r from-[#88e273] via-[#9cd685] to-[#b5f2a4] hover:from-[#6ab95b] hover:via-[#82c16a] hover:to-[#9cd685] rounded-3xl text-black font-semibold w-full title-text transition">
                                    Open Trove
                                  </Button>
                                )}
                              </Link>
                            </>) : (
                              <>
                                <EVMConnect className='w-full' />
                              </>
                            )}
                          </>
                        </div>
                      </div>

                      {/* Card 2 */}
                      <div className={`bg-[#222222]  rounded-lg text-white w-full md:p-6 md:mb-0 mb-3 p-3  md:h-[36.5rem] flex-1 mx-2 ${troveStatusBTC === "ACTIVE" ? "space-y-4" : "space-y-24"}`}>
                        <div className="flex  gap-x-2 justify-between items-center ">
                          <div className='flex  items-center gap-x-1'>
                            <Image src={trove2} alt="btc" />
                            <h2 className="ml-4  text-xl font-medium body-text">WBTC Trove</h2>
                          </div>
                          <div className="items-center  flex gap-x-2">
                            <Image src={collR} alt="btc" width={40} />
                            <div>
                              <div className="gap-1 flex">
                                <h1 className="text-white title-text2 text-xs">SCR</h1>
                                <h1 className="text-gray-400 body-text -mt-[4px] text-[10px]">(Normal Mode)</h1>
                              </div>
                              <div className="relative">
                                <div className="flex">
                                  <h1 className="text-gray-400 text-sm title-text2">
                                    {(systemCollRatioBTC * 100).toFixed(2)} %
                                  </h1>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {troveStatusBTC === "ACTIVE" ? (
                          <>
                            <div className="flex justify-around items-center">
                              <div className=' w-1/2 h-full space-y-1 md:-mt-10'>
                                <p className="text-gray-500 text-sm body-text">Trove Status</p>
                                {troveStatusBTC === "ACTIVE" && (
                                  <Image src={ACTIVE} alt="status-icon" className='-ml-1' width={120} height={100} />
                                )}
                              </div>
                              <div className=' flex items-center flex-col'>
                                <Knob value={Number(newLTVBTC) || 0} min={0} max={90} showValue={true} size={135} valueColor="#3dde84" strokeWidth={7} readOnly className="text-[#88e273]" />
                                <p className="text-gray-500 body-text">Your LTV</p>
                              </div>
                            </div>
                            <div className='p-3 grid grid-cols-3 pt-0 gap-y-8  items-center justify-around'>
                              <div className="text-left ">
                                <p className="text-gray-500 mt-[18px]  text-sm body-text">Collateral</p>
                                <p className="body-text font-medium text-[13px] whitespace-nowrap ">{Number(entireDebtAndCollBTC.collBTC).toFixed(8)} WBTC</p>
                                <p className=" body-text text-xs text-gray-500">
                                  ${(Number(entireDebtAndCollBTC.collBTC) * fetchedPriceBTC).toFixed(8)}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-500 text-sm body-text">Debt</p>
                                <p className="body-text font-medium text-[14px] " >{entireDebtAndCollBTC.debtBTC} ORE</p>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-500 text-sm body-text">Max LTV</p>
                                <p className="body-text font-medium text-[14px]">{(100 / mCRBTC).toFixed(2)}%</p>
                              </div>
                              <div className="text-left">
                                <p className="text-gray-500 text-sm body-text">One-time Fee</p>
                                <p className="body-text font-medium text-[14px]">{borrowRateBTC * 100}%</p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-500 text-sm body-text">Min Debt</p>
                                <p className="body-text font-medium text-[14px]">{minDebtBTC} ORE</p>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-500 text-sm body-text">ORE Minted</p>
                                <p className="body-text font-medium text-[14px]">{formatLargeNumber(pusdMintedBTC)} / 2.5M</p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className='space-y-24'>
                              <div className="flex justify-between mb-4">
                                <div className='whitespace-nowrap'>
                                  <p className="body-text font-medium text-gray-400">MAX LTV</p>
                                  <p className="body-text font-medium">{(100 / mCRBTC).toFixed(2)}%</p>
                                </div>
                                <div className='whitespace-nowrap'>
                                  <p className="body-text text-gray-400 body-text font-medium">One-time Fee</p>
                                  <p className="body-text font-medium">{borrowRateBTC * 100}%</p>
                                </div>
                              </div>
                              <div className="flex justify-between mb-4">
                                <div>
                                  <p className="body-text font-medium text-gray-400">Min Debt</p>
                                  <p className="body-text font-medium">{minDebtBTC} ORE</p>
                                </div>
                                <div>
                                  <p className="body-text font-medium text-gray-400">ORE Minted</p>
                                  <p className="body-text font-medium">{formatLargeNumber(pusdMintedBTC)} / 2.5M</p>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        <div className={`${troveStatuscore === "ACTIVE" ? "py-10" : "py-5"}`}>
                          <>
                            <div className="border-t border-gray-400 mb-6 md:-ml-[1.5rem] md:w-[108.5%]"></div>
                            {isConnected ? (<>
                              <Link href="/trove/wbtc/" passHref>
                                {troveStatusBTC === "ACTIVE" ? (
                                  <Button className="border-[#88e273] h-12 border bg-transparent rounded-3xl font-semibold w-full title-text text-[#88e273] hover:scale-95 hover:bg-transparent transition">
                                    See Details
                                  </Button>
                                ) : (
                                  <Button className=" h-12 bg-gradient-to-r from-[#88e273] via-[#9cd685] to-[#b5f2a4] hover:from-[#6ab95b] hover:via-[#82c16a] hover:to-[#9cd685] rounded-3xl text-black font-semibold w-full title-text transition">
                                    Open Trove
                                  </Button>
                                )}
                              </Link>
                            </>
                            ) : (
                              <>
                                <EVMConnect className='w-full' />
                              </>
                            )}
                          </>
                        </div>
                      </div>

                    </section>
                  )}

                  {activeTab === 'tab2' && (
                    <section id="content2" className="tab-content">
                      <div className="lg:w-[39rem]  h-[22rem] rounded-sm" style={{ backgroundColor: "#222222" }}>
                        <div className="flex items-center flex-row justify-between p-5 border-b-1" style={{ backgroundColor: "#282828" }}>
                          <span className="text-white title-text2 ml-[10px]">STABILITY POOL</span>
                          <Link href="/stake/">
                            <button className="h-8 px-6 title-text2 whitespace-nowrap border-[#88e273] border bg-transparent text-[#88e273] font-bold">
                              {troveStatuscore === 'INACTIVE' && troveStatusBTC === 'INACTIVE' ? 'STAKE ORE' : 'Details'}
                            </button>
                          </Link>
                        </div>

                        {troveStatuscore === 'ACTIVE' || troveStatusBTC === 'ACTIVE' ? (
                          <div className="text-white flex justify-between ml-5 p-3">
                          <div>
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
                              </div>
                            </div>
                            <Image className="-ml-16 md:-ml-4" src={macPUSD} alt="home" height={210} />
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
              <div className=" flex  p-6 flex-col">
              <div className="flex flex-col md:flex-row items-center md:gap-x-0 gap-x-2 md:w-full justify-between">
                <div className="md:ml-[1.5rem] items-start">
                  <h6 className="text-[#565348] title-text text-md font-bold mt-1 mb-4 text-left">
                    Portfolio Value
                  </h6>
                  <span className="text-white body-text text-2xl font-bold whitespace-nowrap flex text-left">
                    ${portfolioValue}
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
                        ${(
                          Number(entireDebtAndCollCore.debtCore) +
                          Number(entireDebtAndCollBTC.debtBTC)
                        ).toFixed(2)}
                      </span>
                    </div>

                    {/* Supplied Section */}
                    <div className="text-white flex flex-col mt-05">
                      <div className="flex items-center gap-x-1">
                        <div className="w-2 rounded-full h-2 bg-green-400"></div>
                        <span className="body-text font-normal">Supplied</span>
                      </div>
                      <span className="body-text text-right whitespace-nowrap font-medium">
                        ${(
                          Number(entireDebtAndCollCore.collCore) * fetchedPrice +
                          Number(entireDebtAndCollBTC.collBTC) * fetchedPriceBTC
                        ).toFixed(2)}
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
                <label htmlFor="tab1"><span className="md:body-text body-text">Troves</span></label>

                <input
                  id="tab2"
                  type="radio"
                  name="tabs"
                  checked={activeTab === 'tab2'}
                  onChange={() => setActiveTab('tab2')}
                  style={{ backgroundColor: "#272315" }}
                />
                <label htmlFor="tab2"><span className="whitespace-nowrap md:body-text body-text">Stability Pool</span></label>

                {activeTab === 'tab1' && (
                  <section id="content1" className="tab-content flex md:flex-row flex-col" style={{ borderTop: "1px solid #88e273", backgroundColor: "black", display: "flex", gap: "1rem" }}>

                    {/* CARD1 */}
                    <div className={`bg-[#222222]  rounded-lg text-white w-full md:p-6 md:mb-0 mb-3 p-3 md:h-[38rem]  flex-1 mx-2 ${troveStatuscore === "ACTIVE" ? "space-y-4" : "space-y-28"}`}>
                      <div className="flex  gap-x-2  justify-between items-center">
                        <div className='flex  items-center gap-x-1'>
                          <Image src={trove1} alt="btc" width={50} height={10} />
                          <h2 className="ml-4  text-xl font-medium body-text">WCORE Trove</h2>
                        </div>
                        <div className="items-center flex gap-x-2">
                          <Image src={collR} alt="btc" width={40} />
                          <div>
                            <div className="gap-1 flex">
                              <h1 className="text-white title-text2 text-xs">SCR</h1>
                              <h1 className="text-gray-400 body-text -mt-[4px] text-[10px]">(Normal Mode)</h1>
                            </div>
                            <div className="relative">
                              <div className="flex">
                                <h1 className="text-gray-400 text-sm title-text2">
                                  {(systemCollRatio * 100).toFixed(2)} %
                                </h1>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {troveStatuscore === "ACTIVE" ? (
                        <>
                          <div className="flex justify-around items-center">
                            <div className=' w-1/2 h-full space-y-1 md:-mt-10'>
                              <p className="text-gray-500 text-sm body-text">Trove Status</p>
                              {troveStatuscore === "ACTIVE" && (
                                <Image src={ACTIVE} alt="status-icon" className='-ml-1' width={120} height={100} />
                              )}
                            </div>
                            <div className='flex items-center flex-col'>
                              <Knob value={Number(newLTV) || 0} min={0} max={90} showValue={true} size={135} valueColor="#3dde84" strokeWidth={7} readOnly className="text-[#88e273]" />
                              <p className="text-gray-500 body-text">Your LTV</p>
                            </div>
                          </div>
                          <div className='p-3 grid grid-cols-3 space-y-8 items-center justify-around'>
                            <div className="text-left mt-1">
                              <p className="text-gray-500 text-sm body-text">Collateral</p>
                              <p className="body-text font-medium whitespace-nowrap">{Number(entireDebtAndCollCore.collCore).toFixed(2)} WCORE</p>
                              <p className="text-sm body-text text-gray-500">
                                ${(Number(entireDebtAndCollCore.collCore) * fetchedPrice).toFixed(2)}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-500 text-sm body-text">Debt</p>
                              <p className="body-text font-medium">{entireDebtAndCollCore.debtCore} ORE</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-500 text-sm body-text">Max LTV</p>
                              <p className="body-text font-medium ">{(100 / mCR).toFixed(2)}%</p>
                            </div>
                            <div className="text-left">
                              <p className="text-gray-500 text-sm body-text">One-time Fee</p>
                              <p className="body-text font-medium">{borrowRate * 100}%</p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-500 text-sm body-text">Min Debt</p>
                              <p className="body-text font-medium">{minDebt} ORE</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-500 text-sm body-text">ORE Minted</p>
                              <p className="body-text font-medium">{formatLargeNumber(pusdMintedCore)} / 2.5M</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className='space-y-20'>
                            <div className="flex justify-between mb-4">
                              <div className='whitespace-nowrap'>
                                <p className="body-text font-medium text-gray-400">MAX LTV</p>
                                <p className="body-text font-medium">{(100 / mCR).toFixed(2)}%</p>
                              </div>
                              <div className='whitespace-nowrap'>
                                <p className="body-text text-gray-400 body-text font-medium">One-time Fee</p>
                                <p className="body-text text-right font-medium">{borrowRate * 100}%</p>
                              </div>
                            </div>
                            <div className="flex justify-between mb-4">
                              <div>
                                <p className="body-text font-medium text-gray-400">Min Debt</p>
                                <p className="body-text font-medium">{minDebt} ORE</p>
                              </div>
                              <div>
                                <p className="body-text font-medium text-gray-400">ORE Minted</p>
                                <p className="body-text font-medium">{formatLargeNumber(pusdMintedCore)} / 2.5M</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )
                      }
                      <div className={`${troveStatusBTC === "ACTIVE" ? "py-10" : "py-5"}`}>
                        <>
                          <div className="border-t border-gray-400 mb-6 md:-ml-[1.5rem] md:w-[108.5%]"></div>
                          {isConnected ? (<>
                            <Link href="/trove/wcore/" passHref>
                              {troveStatuscore === "ACTIVE" ? (
                                <Button className="border-[#88e273] h-12 border bg-transparent rounded-3xl font-semibold w-full title-text text-[#88e273] hover:scale-95 hover:bg-transparent transition">
                                  See Details
                                </Button>
                              ) : (
                                <Button className=" h-12 bg-gradient-to-r from-[#88e273] via-[#9cd685] to-[#b5f2a4] hover:from-[#6ab95b] hover:via-[#82c16a] hover:to-[#9cd685] rounded-3xl text-black font-semibold w-full title-text transition">
                                  Open Trove
                                </Button>
                              )}
                            </Link>
                          </>) : (
                            <>
                              <EVMConnect className='w-full' />
                            </>
                          )}
                        </>
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className={`bg-[#222222] rounded-lg text-white w-full md:p-6 md:mb-0 mb-3 p-3  md:h-[38rem] flex-1 mx-2 ${troveStatusBTC === "ACTIVE" ? "space-y-4" : "space-y-24"}`}>
                      <div className="flex  gap-x-2 justify-between items-center ">
                        <div className='flex  items-center gap-x-1'>
                          <Image src={trove2} alt="btc" />
                          <h2 className="ml-4  text-xl font-medium body-text">WBTC Trove</h2>
                        </div>
                        <div className="items-center  flex gap-x-2">
                          <Image src={collR} alt="btc" width={40} />
                          <div>
                            <div className="gap-1 flex">
                              <h1 className="text-white title-text2 text-xs">SCR</h1>
                              <h1 className="text-gray-400 body-text -mt-[4px] text-[10px]">(Normal Mode)</h1>
                            </div>
                            <div className="relative">
                              <div className="flex">
                                <h1 className="text-gray-400 text-sm title-text2">
                                  {(systemCollRatioBTC * 100).toFixed(2)} %
                                </h1>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {troveStatusBTC === "ACTIVE" ? (
                        <>
                          <div className="flex justify-around items-center">
                            <div className=' w-1/2 h-full space-y-1 md:-mt-10'>
                              <p className="text-gray-500 text-sm body-text">Trove Status</p>
                              {troveStatusBTC === "ACTIVE" && (
                                <Image src={ACTIVE} alt="status-icon" className='-ml-1' width={120} height={100} />
                              )}
                            </div>
                            <div className=' flex items-center flex-col'>
                              <Knob value={Number(newLTVBTC) || 0} min={0} max={90} showValue={true} size={135} valueColor="#3dde84" strokeWidth={7} readOnly className="text-[#88e273]" />
                              <p className="text-gray-500 body-text">Your LTV</p>
                            </div>
                          </div>
                          <div className='p-3 grid grid-cols-3 space-y-8  items-center justify-around'>
                            <div className="text-left mt-1">
                              <p className="text-gray-500  text-sm body-text">Collateral</p>
                              <p className="body-text font-medium  whitespace-nowrap">{Number(entireDebtAndCollBTC.collBTC).toFixed(8)} WBTC</p>
                              <p className="text-sm body-text text-gray-500">
                                ${(Number(entireDebtAndCollBTC.collBTC) * fetchedPriceBTC).toFixed(8)}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-500 text-sm body-text">Debt</p>
                              <p className="body-text font-medium">{entireDebtAndCollBTC.debtBTC} ORE</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-500 text-sm body-text">Max LTV</p>
                              <p className="body-text font-medium ">{(100 / mCRBTC).toFixed(2)}%</p>
                            </div>
                            <div className="text-left">
                              <p className="text-gray-500 text-sm body-text">One-time Fee</p>
                              <p className="body-text font-medium">{borrowRateBTC * 100}%</p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-500 text-sm body-text">Min Debt</p>
                              <p className="body-text font-medium">{minDebtBTC} ORE</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-500 text-sm body-text">ORE Minted</p>
                              <p className="body-text font-medium">{formatLargeNumber(pusdMintedBTC)} / 2.5M</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className='space-y-24'>
                            <div className="flex justify-between mb-4">
                              <div className='whitespace-nowrap'>
                                <p className="body-text font-medium text-gray-400">MAX LTV</p>
                                <p className="body-text font-medium">{(100 / mCRBTC).toFixed(2)}%</p>
                              </div>
                              <div className='whitespace-nowrap'>
                                <p className="body-text text-gray-400 body-text font-medium">One-time Fee</p>
                                <p className="body-text font-medium">{borrowRateBTC * 100}%</p>
                              </div>
                            </div>
                            <div className="flex justify-between mb-4">
                              <div>
                                <p className="body-text font-medium text-gray-400">Min Debt</p>
                                <p className="body-text font-medium">{minDebtBTC} ORE</p>
                              </div>
                              <div>
                                <p className="body-text font-medium text-gray-400">ORE Minted</p>
                                <p className="body-text font-medium">{formatLargeNumber(pusdMintedBTC)} / 2.5M</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      <div className={`${troveStatuscore === "ACTIVE" ? "py-10" : "py-5"}`}>
                        <>
                          <div className="border-t border-gray-400 mb-6 md:-ml-[1.5rem] md:w-[108.5%]"></div>
                          {isConnected ? (<>
                            <Link href="/trove/wbtc/" passHref>
                              {troveStatusBTC === "ACTIVE" ? (
                                <Button className="border-[#88e273] h-12 border bg-transparent rounded-3xl font-semibold w-full title-text text-[#88e273] hover:scale-95 hover:bg-transparent transition">
                                  See Details
                                </Button>
                              ) : (
                                <Button className=" h-12 bg-gradient-to-r from-[#88e273] via-[#9cd685] to-[#b5f2a4] hover:from-[#6ab95b] hover:via-[#82c16a] hover:to-[#9cd685] rounded-3xl text-black font-semibold w-full title-text transition">
                                  Open Trove
                                </Button>
                              )}
                            </Link>
                          </>
                          ) : (
                            <>
                              <EVMConnect className='w-full' />
                            </>
                          )}
                        </>
                      </div>
                    </div>

                  </section>
                )}

                {activeTab === 'tab2' && (
                  <section id="content2" className="tab-content">
                    <div className="lg:w-[39rem]  h-auto rounded-sm" style={{ backgroundColor: "#222222" }}>
                      <div className="flex items-center flex-row justify-between p-5 border-b-1" style={{ backgroundColor: "#282828" }}>
                        <span className="text-white title-text2 ml-[10px]">STABILITY POOL</span>
                        <Link href="/stake/">
                          <button className="h-8 px-6 title-text2 whitespace-nowrap border-[#88e273] border bg-transparent text-[#88e273] font-bold">
                            {troveStatuscore === 'INACTIVE' && troveStatusBTC === 'INACTIVE' ? 'STAKE ORE' : 'Details'}
                          </button>
                        </Link>
                      </div>

                      {troveStatuscore === 'ACTIVE' || troveStatusBTC === 'ACTIVE' ? (
                        <div className="text-white flex  justify-between ml-5 p-3">
                        <div>
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
                            </div>
                          </div>
                          <Image className="-ml-16 md:-ml-4" src={macPUSD} alt="home" height={210} />
                        </div>
                      ) : (
                        <div className="grid h-[20rem] place-items-center mt-[2rem]">
                          <Image src={macPUSD} alt="home" width={200} />
                            <EVMConnect className="w-full"/>
                          <div>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                )}
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
