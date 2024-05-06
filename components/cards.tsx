/* eslint-disable */

"use client";

import { useEffect, useState } from "react";
import btc from "../app/assets/images/btc.svg"
import doubleCoin from "../app/assets/images/doubleCoin.svg"
import robo from "../app/assets/images/robo.svg"
import card2 from "../app/assets/images/card2.svg"
import card0 from "../app/assets/images/card0.svg"
import points from "../app/assets/images/points.svg"
import circuitBreaker from "../app/assets/images/circuitBreaker.svg"
import tripleCoin from "../app/assets/images/tripleCoin.svg"
import botanixLogo from "../app/assets/images/botanixLogo.svg"
import botanixTestnet from "@/app/src/constants/botanixTestnet.json";
import { BOTANIX_RPC_URL } from "../app/src/constants/botanixRpcUrl";
import { getContract } from "@/app/src/utils/getContract";
import giftBox from "../app/assets/images/giftBox.svg"
import Image from "next/image";
import { useAccount, useWalletClient } from "wagmi";
import troveManagerAbi from "../app/src/constants/abi/TroveManager.sol.json";
import priceFeedAbi from "../app/src/constants/abi/PriceFeedTestnet.sol.json";
import { ethers } from "ethers";
import TargetArrow from "../app/assets/images/targetArrow.svg"
import Decimal from "decimal.js";
import web3 from "web3";
import "./Loader.css"
import { CustomConnectButton } from "./connectBtn";
import ProgBar from "./ProgBar";
import NFT from "./NFT/page";


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
  points: number;
  continuousActivity: {
    "activeDeposit": number,
    "troveVolume": number,
    "stakingVolume": number,
    "3rdPartyVolume": number,
    "nativeTxns": number,
    "3rdPartyTxns": number,
    "activeDays": number
  },
  nfts: NFTs;
  tasks: {
    [key: string]: Task;
  };
}
interface Props {
  userExists: boolean
}

export const CardDemo: React.FC<Props> = ({ userExists }) =>{
  const { data: walletClient } = useWalletClient();
  const [troveStatus, setTroveStatus] = useState("");
  const { address, isConnected } = useAccount();
  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);
  const [activitiesData, setActivitiesData] = useState<ActivitiesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPriceFetched, setHasPriceFetched] = useState(false);
  const [value, setValue] = useState("0");
  const [firstTask, setFirstTask] = useState<string>("")
  const [fetchedPrice, setFetchedPrice] = useState("0");

  const [entireDebtAndColl, setEntireDebtAndColl] = useState({
    debt: "0",
    coll: "0",
    pendingLUSDDebtReward: "0",
    pendingETHReward: "0",
  });

  const priceFeedContract = getContract(
    botanixTestnet.addresses.priceFeed,
    priceFeedAbi,
    provider
  );

  const troveManagerContract = getContract(
    botanixTestnet.addresses.troveManager,
    troveManagerAbi,
    provider
  );

  const { toBigInt } = web3.utils;

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
      try {
        const fetchPrice: bigint = await priceFeedContract.getPrice();

        const fetchPriceDecimal = new Decimal(fetchPrice.toString()); // Convert coll to a Decimal
        const fetchPriceFormatted = fetchPriceDecimal
          .div(_1e18.toString())
          .toString();
        setFetchedPrice(fetchPriceFormatted);

        setHasPriceFetched(true);
      } catch (error) {
        console.error(error, "Error fetching price");
        setHasPriceFetched(true);
      }
      finally {
        setIsLoading(false); // Update loading state once fetching is complete
      }
    };

    fetchedData()

  }, [isConnected]);


  const getTroveStatus = async () => {
    if (!walletClient) return null;
    const troveStatusBigInt = await troveManagerContract.getTroveStatus(
      walletClient?.account.address
    );
    const troveStatus =
      troveStatusBigInt.toString() === "1" ? "ACTIVE" : "INACTIVE";
    setTroveStatus(troveStatus);
  };

  const fetchActivitiesData = async () => {
    try {
      const response = await fetch(
        `https://api.palladiumlabs.org/users/activities/${address}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch activities data");
      }
      const data = await response.json();
      setActivitiesData(data);
    } catch (error) {
      console.error("Error fetching activities data:", error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const getFirstLockedTask = (tasks: { [key: string]: { status: string } }) => {
    for (let task in tasks) {
      if (tasks[task].status === "locked") {
        return task.replace(/_/g, ' ');
      }
    }
    return null;
  };

  useEffect(() => {
    getTroveStatus();
    fetchActivitiesData().then(() => {
      if (activitiesData) {
        const firstLockedTask = getFirstLockedTask(activitiesData.tasks);
        if (firstLockedTask !== null) {
          setFirstTask(firstLockedTask);
        }
      }
    });
  }, [walletClient, getTroveStatus, fetchActivitiesData]);

  useEffect(() => {
    setValue((Number(entireDebtAndColl.debt) / (Number(entireDebtAndColl.coll) * Number(fetchedPrice)) * 100).toFixed(3));
  }, [entireDebtAndColl, fetchedPrice, isConnected, walletClient]);

  // const countFalseNFTs = () => {
  //   if (!activitiesData) return 0;
  //   let count = 0;
  //   const nfts = activitiesData.nfts as NFTs;
  //   for (const nft in nfts) {
  //     if (nfts[nft as keyof NFTs]) {
  //       count++;
  //     }
  //   }
  //   return count;
  // };

  const countClaimedBadges = (activitiesData: { tasks: any; } | undefined) => {
    if (!activitiesData || !activitiesData.tasks) return 0;

    let count = 0;
    const tasks = activitiesData.tasks;

    for (const taskKey in tasks) {
      const task = tasks[taskKey];
      if (task.rewardType === "badge" && task.status === "claimed") {
        count++;
      }
    }
    return count;
  };

  return (
    <div className="w-[25rem] md:w-full">
      <div className="title-text h-full w-full -mt-28 pt-10 pb-10 pl-4 pr-4" style={{ backgroundColor: '#1C1A0F' }}>
        <div className="w-full h-[20rem] gap-3 flex border-2 pl-2 border-yellow-300 mb-10 justify-between items-center">
          <div className="flex w-1/3 p-2 notMobileDevice">
            <Image src={robo} alt="robot" className="mt-16 -ml-[3rem]" />
            <Image src={circuitBreaker} alt="text" className="-ml-12 mt-20" />
          </div>
          <div className="w-3/4 -ml-[10rem] md:-ml-0 sticky h-[19rem] p-2 text-white gap-y-10">
            <div className="absolute md:ml-[24rem] -mt-[2rem] flex items-center gap-x-2">
              <Image src={points} alt="points" className="ml-[60%] md:ml-0" />
              <div>
                <h6 className="text-7xl  font-extrabold title-text text-yellow-300">{activitiesData?.points || 0}</h6>
                <h5 className="text-2xl  font-extrabold title-text text-yellow-300">POINTS</h5>
              </div>
            </div>
            <div className="absolute px-6 md:p-0 h-24 md:w-[16rem] ml-[10rem] mt-[12rem] bg-gradient-to-l from-yellow-100 border-yellow-200">
              <div className="flex justify-between items-center">
                <div>
                  <h6 className="text-5xl text-yellow-300 title-text">{userExists ? 1 : 0}</h6>
                  <h6 className="text-3xl text-yellow-300 title-text">NFTs</h6>
                </div>
                <Image src={card2} alt="robo2" className="notMobileDevice" />
              </div>
            </div>
            <div className="absolute p-2 md:p-0 ml-[20rem] md:ml-[28rem] mt-[12rem] h-24 md:w-[16rem] bg-gradient-to-l from-yellow-100 border-yellow-200">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="text-5xl text-yellow-300 title-text">{activitiesData && countClaimedBadges(activitiesData) || 0}</h5>
                  <h6 className="text-3xl text-yellow-300 title-text">BAGDES</h6>
                </div>
                <Image src={card0} alt="robo2" className="notMobileDevice" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full  mb-10 upper mr-10 border-yellow-300 pt-10 mt-10  p-6  border items-center justify-center" style={{ backgroundColor: '#272315' }}>
          <ProgBar />
          <div className="mt-10 h-20 md flex gap-x-3">
            <div className=" h-20 w-1/4 flex justify-between p-2">
              <div>
                <Image src={TargetArrow} alt="arrow" />
              </div>
              <div>
                <h5 className="font-bold text-gray-500 body-text whitespace-nowrap">Next Challenge</h5>
                <h5 className="font-bold text-white body-text whitespace-nowrap">{firstTask || "- - - - - - - -"}</h5>
              </div>
              <div>
              </div>
            </div>
            <div className="h-20 w-4/5  p-2">
              <h5 className="font-bold text-2xl title-text ml-[15rem] text-yellow-300 notMobileDevice">EARN EXCLUSIVE REWARDS BY COMPLETING CHALLENGES</h5>
            </div>
          </div>
        </div>

        <div className="w-full md:gap-y-0 gap-y-5 pt-10 md:pl-5 gap-x-5 pr-5 flex flex-col md:flex-row">
          <div className="w-full md:w-[30%] border border-yellow-300 pl-1 pb-7" style={{ backgroundColor: '#272315' }}>
            <div className="p-2 gap-x-1 flex justify-between">
              <h1 className="title-text text-yellow-300 text-2xl font-bold">Trove Status</h1>
              {isConnected ? (
                <div className={`border-[3px] flex items-center justify-center h-10 title-text  w-32 p-2 ${troveStatus === "ACTIVE" ? "border-green-800 t title-text bg-green-100" : "border-red-800  bg-red-100"}`} style={{ borderTopRightRadius: "10px" }}>
                  {troveStatus === "ACTIVE" ? (
                    <h6 className="w-2 h-2 rounded-full bg-green-400 mr-1 title-text text-green-900"></h6>
                  ) : (
                    <h6 className="w-2 h-2 rounded-full bg-red-400 mr-1 title-text  text-black"></h6>
                  )}
                  <h6>{troveStatus}</h6>
                </div>
              ) : (
                <CustomConnectButton className="" />
              )}
              <div className="bent-corner"></div>
            </div>
            <div className="space-y-6 pt-12">
              <div className="flex gap-x-14">
                <Image src={btc} alt="coin" />
                <div className="">
                  <h1 className="text-gray-500 font-bold title-text">Collateral</h1>
                  <h1 className="text-gray-100 font-bold text-lg title-text">{Number(entireDebtAndColl.coll).toFixed(8)} BTC</h1>
                </div>
              </div>
              <div className=" flex gap-x-6">
                <Image src={doubleCoin} alt="coin" />
                <div className="">
                  <h1 className="text-gray-500 font-bold title-text">Debt</h1>
                  <h1 className="text-gray-100 font-bold text-lg title-text">{Number(entireDebtAndColl.debt).toFixed(2)} PUSD</h1>
                </div>
              </div>
              <div className="flex gap-x-10">
                <Image src={tripleCoin} alt="coin" />
                <div className="">
                  <h1 className="text-gray-500 font-bold title-text">YOUR LTV</h1>
                  <h1 className="text-gray-100 font-bold text-lg title-text">{isNaN(Number(value)) ? "0.00 %" : `${value} %`}</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-2/3 border border-yellow-300 pb-[4.5rem] h-fit" style={{ backgroundColor: '#272315' }}>
            <div className="p-2 gap-x-1 flex  justify-between">
              <h1 className="font-mono text-yellow-300 text-2xl font-bold">ACTIVITIES STATS</h1>
              <Image src={botanixLogo} alt="logo" className="-mt-4" />
            </div>
            <div className=" p-2 space-y-10">
              <div className="w-full h-24 flex">
                <div className="flex-1 h-fit  flex flex-col items-center justify-center text-center">
                  <Image src={giftBox} alt="giftBox" />
                  <h6 className="font-bold text-gray-400">Active Deposit</h6>
                  <h6 className="font-bold  text-gray-100">{(activitiesData?.continuousActivity.activeDeposit)?.toFixed(8) || 0}{" "} BTC</h6>
                </div>
                <div className="flex-1 h-fit  flex flex-col items-center justify-center text-center">
                  <Image src={giftBox} alt="giftBox" />
                  <h6 className="font-bold text-gray-400">Trove Volume</h6>
                  <h6 className="font-bold text-gray-100">{(activitiesData?.continuousActivity.troveVolume)?.toFixed(8) || 0}{" "} BTC</h6>
                </div>
                <div className="flex-1 h-fit  flex flex-col items-center justify-center text-center">
                  <Image src={giftBox} alt="giftBox" />
                  <h6 className="font-bold text-gray-400">Staking Volume</h6>
                  <h6 className="font-bold text-gray-100">{(activitiesData?.continuousActivity.stakingVolume)?.toFixed(2) || 0}{" "} PUSD</h6>
                </div>
              </div>
              <div className="w-full h-24 flex">
                <div className="flex-1 h-fit  flex flex-col items-center justify-center text-center">
                  <Image src={giftBox} alt="giftBox" />
                  <h6 className="font-bold text-gray-400">3rd Party Volume</h6>
                  <h6 className="font-bold text-gray-100">{(activitiesData?.continuousActivity["3rdPartyVolume"])?.toFixed(2) || 0}{" "}PUSD</h6>
                </div>
                <div className="flex-1 h-fit  flex flex-col items-center justify-center text-center">
                  <Image src={giftBox} alt="giftBox" />
                  <h6 className="font-bold text-gray-400">Native Txns</h6>
                  <h6 className="font-bold text-gray-100">{activitiesData?.continuousActivity.nativeTxns || 0}</h6>
                </div>
                <div className="flex-1 h-fit  flex flex-col items-center justify-center text-center">
                  <Image src={giftBox} alt="giftBox" />
                  <h6 className="font-bold text-gray-400">3rd Party Txns</h6>
                  <h6 className="font-bold text-gray-100">{activitiesData?.continuousActivity["3rdPartyTxns"] || 0}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-3">
          <NFT />
        </div>

      </div>
    </div>
  )
}