"use client";

import { useEffect, useState } from "react";
import btc from "../app/assets/images/btc.svg";
import doubleCoin from "../app/assets/images/doubleCoin.svg";
import badge from "../app/assets/images/Badge2.png";
import nft from "../app/assets/images/nft2.png";
import points from "../app/assets/images/points.svg";
import circuitBreaker from "../app/assets/images/cbcb.png";
import tripleCoin from "../app/assets/images/tripleCoin.svg";
import botanixLogo from "../app/assets/images/botanixLogo.svg";
import botanixTestnet from "@/app/src/constants/botanixTestnet.json";
import { BOTANIX_RPC_URL } from "../app/src/constants/botanixRpcUrl";
import CHART from "../app/assets/images/CHART.png";
import { getContract } from "@/app/src/utils/getContract";
import giftBox from "../app/assets/images/giftBox.svg";
import setPUSD from "../app/assets/images/setPUSD.png";
import PUSDglass from "../app/assets/images/PUSDglass.png";
import PUSDexc from "../app/assets/images/PUSDexc.png";
import coinStack from "../app/assets/images/coinStack.png";
import PUSDCrate from "../app/assets/images/PUSDCrate.png";
import Image from "next/image";
import { useAccount, useWalletClient } from "wagmi";
import troveManagerAbi from "../app/src/constants/abi/TroveManager.sol.json";
import { ethers } from "ethers";
import TargetArrow from "../app/assets/images/targetArrow.svg";
import Decimal from "decimal.js";
import web3 from "web3";
import floatPUSD from "../app/assets/images/floatPUSD.png";
import "./Loader.css";
import { CustomConnectButton } from "./connectBtn";
import ProgBar from "./ProgBar";
import NFT2 from "./NFT2/page";
import "../app/App.css"
interface Task {
  rewardType: string;
  rewardValue: string | number;
  status: string;
}

interface NFTs {
  genesisNft: boolean;
  nft2: boolean;
  nft3: boolean;
}

interface ActivitiesData {
  point: number;
  continuousActivity: {
    activeDeposit: number;
    troveVolume: number;
    stakingVolume: number;
    "3rdPartyVolume": number;
    nativeTxns: number;
    "3rdPartyTxns": number;
    activeDays: number;
  };
  nfts: NFTs;
  task: {
    [key: string]: Task;
  };
}
interface Props {
  userExists?: boolean;
}

export const CardDemo: React.FC<Props> = ({ userExists }) => {
  const { data: walletClient } = useWalletClient();
  const [troveStatus, setTroveStatus] = useState("");
  const { address, isConnected } = useAccount();
  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);
  const [activitiesData, setActivitiesData] = useState<ActivitiesData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [firstTask, setFirstTask] = useState<string | null>("");
  const [fetchedPrice, setFetchedPrice] = useState("0");
  const [isStateLoading, setIsStateLoading] = useState(false);

  const [entireDebtAndColl, setEntireDebtAndColl] = useState({
    debt: "0",
    coll: "0",
    pendingLUSDDebtReward: "0",
    pendingETHReward: "0",
  });

  const troveManagerContract = getContract(
    botanixTestnet.addresses.troveManager,
    troveManagerAbi,
    provider
  );

  const { toBigInt } = web3.utils;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.palladiumlabs.org/sepolia/protocol/metrics");
        const data = await response.json();
        const protocolMetrics = data[0];
        setFetchedPrice(protocolMetrics.priceBTC);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const newLTV = ((Number(entireDebtAndColl.debt) * 100) / ((Number(entireDebtAndColl.coll) * Number(fetchedPrice)))).toFixed(2)
  const getTroveStatus = async () => {
    if (!walletClient) return null;
    const troveStatusBigInt = await troveManagerContract.getTroveStatus(
      walletClient?.account.address
    );
    const troveStatus = troveStatusBigInt.toString() === "1" ? "ACTIVE" : "INACTIVE";
    setTroveStatus(troveStatus);
  };

  const fetchActivitiesData = async () => {
    try {
      const response = await fetch(
        `https://api.palladiumlabs.org/sepolia/users/activities/${address}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch activities data");
      }
      const data = await response.json();
      setActivitiesData(data);
      const firstLockedTask = getFirstLockedTask(data.task);
      setFirstTask(firstLockedTask);
    } catch (error) {
      console.error("Error fetching activities data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchedData = async () => {
    if (!walletClient) return null;
    setIsStateLoading(true)
    const pow = Decimal.pow(10, 18);
    const _1e18 = toBigInt(pow.toFixed());
    const {
      0: debt,
      1: coll,
      2: pendingLUSDDebtReward,
      3: pendingETHReward,
    } = await troveManagerContract.getEntireDebtAndColl(address);
    const collDecimal = new Decimal(coll.toString()); // Convert coll to a Decimal
    const collFormatted = collDecimal.div(_1e18.toString()).toString(); // Divide coll by _1e18 and convert to string
    setEntireDebtAndColl({
      debt: (debt / _1e18).toString(),
      coll: collFormatted,
      pendingLUSDDebtReward: (pendingLUSDDebtReward / _1e18).toString(),
      pendingETHReward: (pendingETHReward / _1e18).toString(),
    });
    setIsStateLoading(false)

  };


  const getFirstLockedTask = (tasks: { [x: string]: Task | { status: string } }) => {
    for (let task in tasks) {
      if (tasks[task].status === "locked") {
        return task.replace(/_/g, " ");
      }
    }
    return null;
  };

  useEffect(() => {
    getTroveStatus();
    fetchedData();
    fetchActivitiesData().then(() => {
      if (activitiesData) {
        const firstLockedTask = getFirstLockedTask(activitiesData.task);
        console.log(firstLockedTask, "l")
        // if (firstLockedTask !== null) {
        setFirstTask(firstLockedTask);
        // }
      }
    });
  }, [walletClient, address, isConnected, troveStatus]);

  const countClaimedBadges = (activitiesData: ActivitiesData): number => {
    if (!activitiesData || !activitiesData.task) return 0;
    let count = 0;
    const tasks = activitiesData.task
    for (const taskKey in tasks) {
      const task = tasks[taskKey];
      if (task.rewardType === "badge" && task.status === "claimed") {
        count++;
      }
    }
    return count;
  };

  return (
    <>
      <div className="w-[25rem]  md:w-full">
        <div className="title-text h-full w-full pt-10 p-10" style={{ backgroundColor: "#1C1A0F" }}>
          <div className="w-full  md:p-5 md:h-[14rem] md:flex pl-2 justify-between md:items-center" style={{ backgroundColor: "#272315" }}>
            <div className="flex w-[60%]   md:p-2">
              <Image src={circuitBreaker} alt="text" className="-ml-8 md:-ml-16" width={1200} />
            </div>
            <div className="w-[50%]  sticky pl-10 h-[19rem] p-2 text-white gap-y-10">
              <div className="absolute -ml-[5rem]  md:ml-[9rem] flex items-center gap-x-2">
                <Image src={points} alt="points" className="ml-[60%] md:ml-0 mt-[15px]" />
                <div>
                  <h6 className="text-4xl mt-1 font-light title-text2 text-yellow-300">
                    {activitiesData?.point?.toLocaleString() || '0'}
                  </h6>
                  <h5 className="text-2xl title-text2 font-semibold  text-yellow-300">
                    JOULES
                  </h5>
                </div>
              </div>
              <div className="absolute  overflow-hidden  px-6 md:p-0  h-20 md:w-[14rem] md:-ml-[3rem]  mt-[10rem] bg-gradient-to-r from-[#272315] to-[#3F3A21] border-yellow-200">
                <div className="flex justify-between -mt-7 ml-6 items-center">
                  <div className="p-2 mt-5">
                    <h5 className="text-2xl mt-[10px] md:-mt-4 title-text2 text-yellow-300">
                      1
                    </h5>
                    <div className="flex">
                      <h6 className="text-xl text-yellow-300 title-text2">NFT</h6>
                      <h6 className="text-sm mt-[6px] text-yellow-300 title-text2">s</h6>
                    </div>
                  </div>
                  <Image width={140} src={nft} alt="robo2" className="hidden md:block mt-2 ml-5" />
                </div>
              </div>
              <div className="absolute  overflow-hidden p-2 md:p-0 ml-[10rem] w-[8rem] md:ml-[12rem]  mt-[10rem] h-20 md:w-[14rem] bg-gradient-to-r from-[#272315] to-[#3F3A21] border-yellow-200">
                <div className="flex justify-between  -mt-8 md:-mt-7 ml-[30px] md:ml-5 items-center">
                  <div className=" mt-[10px]">
                    <h5 className="text-2xl mt-5 title-text2 text-yellow-300">
                      {(activitiesData && countClaimedBadges(activitiesData)) ||
                        0}
                    </h5>
                    <h6 className="text-xl text-yellow-300 title-text2">
                      BADGES
                    </h6>
                  </div>
                  <Image width={90} src={badge} alt="robo2" className="hidden md:block mt-8 transform " />
                </div>
              </div>
            </div>
          </div>
          <div className="py-10">
            <div className="w-full p-5 h-[20rem] mt-10 upper mr-10   items-center justify-center" style={{ backgroundColor: "#272315" }}>
              <div className=" pt-3.5">
                <ProgBar />
              </div>
              <div className="md:mt-10  justify-between h-20 md flex gap-x-3">
                <div className=" h-20 w-1/4 flex justify-between p-2">
                  <div>
                    <Image src={TargetArrow} alt="arrow" className="md:ml-6 mt-[4px]" />
                  </div>
                  <div className="space-y-1 h-fit">
                    <h5 className=" text-gray-600 body-text font-semibold text-md whitespace-nowrap">
                      Next Challenge
                    </h5>
                    <h5 className="font-medium text-white body-text whitespace-nowrap text-sm">
                      {firstTask || "- - - - - - - -"}
                    </h5>
                  </div>
                  <div></div>
                </div>
                <div className=" md:w-[85%]  md:p-2">
                  <h5 className=" title-text2 -mt-[10px]  md:mt-[5px] text-[10px] md:text-lg ml-[6rem] md:ml-[14rem] text-yellow-300">
                    EaRN EXCLUSIVE REWaRDS BY COMPLETING CHaLLENGES
                  </h5>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:gap-y-0 gap-5 mt-10 flex flex-col md:flex-row">
            <div className="w-full md:w-[40%] pl-1 pb-7" style={{ backgroundColor: "#272315" }}>
              <div className="p-4  items-center flex justify-between">
                <h1 className="title-text2 whitespace-nowrap font-semibold text-yellow-300 text-md ">
                  TROVE STATS
                </h1>
                {isConnected ? (
                  <>
                    {troveStatus === "ACTIVE" ? (
                      <div className={`border-[3px] ml-8 title-text2 p-4 flex items-center justify-center h-10 title-text2  w-30  ${troveStatus === "ACTIVE"
                        ? "border-green-800 title-text2 bg-green-100"
                        : "border-red-800 title-text2 bg-red-100"
                        }`}
                        style={{ borderTopRightRadius: "15px" }} >
                        {troveStatus === "ACTIVE" ? (
                          <h6 className="w-3 h-3 rounded-full bg-green-400 mr-1"></h6>
                        ) : (<h6 className="w-3 h-3 rounded-full bg-red-400 mr-1"></h6>)}
                        <h6 className="title-text2 text-md">{troveStatus}</h6>
                      </div>
                    ) : (<></>)}
                  </>
                ) : (
                  <CustomConnectButton className="" />
                )}
                <div className="bent-corner"></div>
              </div>
              {troveStatus === "ACTIVE" ? (
                <div className="space-y-6  ml-1 pt-12">
                  <div className="flex gap-x-[6rem]">
                    <Image src={btc} alt="coin" />
                    <div className=" flex flex-col">
                      <h1 className="text-gray-500 text-sm title-text2">Collateral</h1>
                      <h1 className="text-gray-100 text-sm  title-text2">
                        {isStateLoading ?
                          (
                            <div className="text-left w-full -mt-6 h-2">
                              <div className="hex-loader"></div>
                            </div>)
                          : `${Number(entireDebtAndColl.coll).toFixed(8)} BTC`}
                      </h1>
                    </div>
                  </div>
                  <div className="flex gap-x-[4.4rem]">
                    <Image src={doubleCoin} alt="coin" />
                    <div className=" flex flex-col">
                      <h1 className="text-gray-500 text-sm title-text2">Debt</h1>
                      <h1 className="text-gray-100 text-sm title-text2">
                        {isStateLoading ?
                          (<div className="text-left w-full -mt-6 h-2">
                            <div className="hex-loader"></div>
                          </div>)
                          : `${Number(entireDebtAndColl.debt).toFixed(2)} PUSD`}
                      </h1>
                    </div>
                  </div>
                  <div className="flex gap-x-[5.6rem]">
                    <Image src={tripleCoin} alt="coin" />
                    <div className=" flex flex-col">
                      <h1 className="text-gray-500 text-sm title-text2">YOUR LTV</h1>
                      <h1 className="text-gray-100 text-sm title-text2">
                        {isStateLoading ?
                          (<div className="text-left w-full -mt-6 h-2">
                            <div className="hex-loader"></div>
                          </div>)
                          : `${Number(newLTV).toFixed(2) || 0}%`}
                      </h1>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid place-items-center">
                  <Image src={floatPUSD} alt="home" width={220} />
                  <p className="text-gray-400 text-sm title-text2 text-center font-medium  pt-5">
                    `You don&apos;t have an Active Trove`
                  </p>
                </div>
              )}
            </div>
            <div className="w-full pb-[2.5rem] h-fit" style={{ backgroundColor: "#272315" }} >
              <div className="pt-4 pl-4 pr-4  gap-x-1 flex  justify-between">
                <h1 className="title-text2 text-yellow-300 text-md">
                  aCTIVITIES STaTS
                </h1>
                <Image src={botanixLogo} alt="logo" className="-mt-4" />
              </div>
              {isConnected ? (
                <div className=" my-5 pb-6 md:my-0 space-y-16">
                  <div className="w-full h-24 flex">
                    <div className="flex-1 h-fit -mt-4  flex flex-col items-center justify-center text-center">
                      <Image src={PUSDCrate} alt="giftBox" />
                      <h6 className="body-text font-semibold text-sm text-gray-400">Active Deposit</h6>
                      <h6 className="body-text font-semibold text-sm  text-gray-100">  {activitiesData?.continuousActivity.activeDeposit?.toFixed(8) || 0}{" "}  BTC</h6>
                    </div>
                    <div className="flex-1 h-fit  flex flex-col items-center justify-center text-center">
                      <Image src={coinStack} alt="giftBox" />
                      <div className=" mt-[26px] ">
                        <h6 className="body-text font-semibold text-sm text-gray-400">Trove Volume</h6>
                        <h6 className="body-text font-semibold text-sm text-gray-100 ">  {activitiesData?.continuousActivity.troveVolume?.toFixed(8) || 0}{" "}  BTC  </h6>
                      </div>
                    </div>
                    <div className="flex-1 h-fit  flex flex-col items-center justify-center text-center">
                      <Image src={PUSDglass} alt="giftBox" />
                      <div className=" mt-[15px] ">
                        <h6 className="body-text font-semibold text-sm text-gray-400 text">Staking Volume</h6>
                        <h6 className="body-text font-semibold text-sm text-gray-100"> {activitiesData?.continuousActivity.stakingVolume?.toFixed(2) || 0}{" "}  PUSD</h6>
                      </div>
                    </div>
                  </div>
                  <div className="w-full  h-24 flex">
                    <div className="flex-1 h-fit  flex flex-col items-center justify-center text-center">
                      <Image src={giftBox} alt="giftBox" />
                      <div className=" mt-[10px]">

                      </div>
                      <h6 className="body-text font-semibold text-sm text-gray-400">3rd Party Volume</h6>
                      <h6 className="body-text font-semibold text-sm text-gray-100">  {activitiesData?.continuousActivity["3rdPartyVolume"]?.toFixed(2) || 0}{" "}  PUSD</h6>
                    </div>
                    <div className="flex-1 h-fit  flex flex-col items-center justify-center text-center">
                      <Image src={PUSDexc} alt="giftBox" className="mt-[10px]" />
                      <div className=" mt-[15px] ">
                        <h6 className="body-text font-semibold text-sm text-gray-400">Native Txns</h6>
                        <h6 className="body-text font-semibold text-sm text-gray-100"> {activitiesData?.continuousActivity.nativeTxns || 0} </h6>
                      </div>
                    </div>
                    <div className="flex-1 h-fit  flex flex-col items-center justify-center text-center">
                      <Image src={setPUSD} alt="giftBox" />
                      <div className=" mt-[5px]">
                        <h6 className="body-text font-semibold text-sm text-gray-400">3rd Party Txns</h6>
                        <h6 className="body-text font-semibold text-sm text-gray-100">  {activitiesData?.continuousActivity["3rdPartyTxns"] || 0}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid place-items-center p-3">
                  <Image src={CHART} alt="home" width={200} />
                  <p className="text-gray-400 text-sm title-text2 text-center font-medium  pt-5">
                    Connect your wallet to see your stats
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="pt-10  w-100%">  <NFT2 /></div>
        </div>
      </div>
    </>
  );
};
