/* eslint-disable */

"use client";

import { useEffect, useState } from "react";
import CB from "../app/assets/images/CB.svg"
import crate from "../app/assets/images/crate.svg"
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
import MINT from "../app/assets/images/MINT.svg"
import MINTED from "../app/assets/images/MINTED.svg"
import Image from "next/image";
import { useWalletClient } from "wagmi";
import troveManagerAbi from "../app/src/constants/abi/TroveManager.sol.json";
import { ethers } from "ethers";
import TargetArrow from "../app/assets/images/targetArrow.svg"
import OppositeDemo from "./Timeline";
import "./Loader.css"

interface ActivitiesData {
  points: number;
  badges: {
    troveMaster: "claimed" | "unclaimed";
    "2000Points": "claimed" | "unclaimed";
    badge3: "claimed" | "unclaimed" | "locked";
    badge4: "claimed" | "unclaimed" | "locked";
  };
  activities: {
    activeDeposit: number;
    troveVolume: number;
    stakingVolume: number;
    "3rdPartyVolume": number;
    nativeTxns: number;
    "3rdPartyTxns": number;
  };
  nfts: {
    genesisNft: boolean;
    nft2: boolean;
    nft3: boolean;
  };
}

export function CardDemo() {
  const { data: walletClient } = useWalletClient();
  const [troveStatus, setTroveStatus] = useState("");
  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);
  const [activitiesData, setActivitiesData] = useState<ActivitiesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const troveManagerContract = getContract(
    botanixTestnet.addresses.troveManager,
    troveManagerAbi,
    provider
  );

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
        "https://api.palladiumlabs.org/users/activities/0x6c47dcbe1985b717488a2aa6aeed209618d93c5e"
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
      setIsLoading(false); // Update loading state once fetching is complete
    }
  };

  useEffect(() => {
    getTroveStatus();
    fetchActivitiesData();
  }, [walletClient]);

  console.log(activitiesData?.nfts.genesisNft, "lashayaya")
  return (
    <div>
      {isLoading && ( // Render loading message if data is still being fetched
        <div className="flex items-center justify-center font-mono h-screen" style={{ backgroundColor: '#1C1A0F' }}>
          <div className="w-32 h-32 border-[3rem] border-dashed rounded-full animate-spin border-yellow-300"></div>
        </div>

      )}
      {!isLoading && activitiesData && (
        <div>
          <div className="font-mono h-full pt-10 pb-10 pl-4 pr-4" style={{ backgroundColor: '#1C1A0F' }}>
            <div className="w-full h-[20rem] gap-3 flex border-2 pl-2 border-yellow-300 mb-10 justify-between items-center">
              <div className="flex w-1/3 p-2">
                <Image src={robo} alt="robot" className="mt-16 -ml-[3rem]" />
                <Image src={circuitBreaker} alt="text" className="-ml-12 mt-20" />
              </div>

              <div className="w-3/4 sticky h-[19rem] p-2 text-white gap-y-10">
                <div className="absolute ml-[24rem] -mt-[2rem] flex items-center gap-x-2">
                  <Image src={points} alt="points" />
                  <div>
                    <h6 className="text-7xl  font-extrabold text-yellow-300">{activitiesData?.points || 0}</h6>
                    <h5 className="text-2xl  font-extrabold text-yellow-300">POINTS</h5>
                  </div>
                </div>
                <div className="absolute  h-24 w-[16rem] ml-[10rem] mt-[12rem] bg-gradient-to-l from-yellow-100 border-yellow-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h6 className="text-5xl text-yellow-300">1</h6>
                      <h6 className="text-3xl text-yellow-300">NFTs</h6>
                    </div>
                    <Image src={card2} alt="robo2" />
                  </div>
                </div>
                <div className="absolute ml-[28rem] mt-[12rem] h-24 w-[16rem] bg-gradient-to-l from-yellow-100 border-yellow-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="text-5xl text-yellow-300">2</h5>
                      <h6 className="text-3xl text-yellow-300">BAGDES</h6>
                    </div>
                    <Image src={card0} alt="robo2" />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full mb-10 upper mr-10 border-yellow-300 pt-10 mt-10 p-6 border items-center justify-center" style={{ backgroundColor: '#272315' }}>
              <OppositeDemo badges={activitiesData.badges} />
              <div className=" h-20 flex gap-x-3">
                <div className=" h-20 w-1/4 flex justify-between p-2">
                  <div>
                    <Image src={TargetArrow} alt="arrow" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-500 font-mono">Next Challenge</h5>
                    <h5 className="font-bold text-white font-mono">Make a 3rd party txn</h5>
                  </div>
                  <div>
                  </div>
                </div>
                <div className="h-20 w-4/5  p-2">
                  <h5 className="font-bold text-2xl font-mono ml-[15rem] text-yellow-300">EARN EXCLUSIVE REWARDS BY COMPLETING CHALLENGES</h5>
                </div>
              </div>
            </div>
            <div className="w-full upper mr-10 border-yellow-300  p-6 border items-center justify-center" style={{ backgroundColor: '#272315' }}>
              <div className="flex justify-between  ">
                <div className="box-1 w-[20rem] space-y-3">
                  <Image src={CB} alt="circuit breaker" />
                  <h1 className="text-yellow-300 text-5xl font-extrabold font-mono">Genesis NFT</h1>
                  <h3 className="text-gray-300 font-mono">Collect the very first Circuit Breaker NFT and join the elite OGs of Palladium.</h3>
                  <div className="pt-10">
                    <h3 className="text-gray-300 font-mono text-xl font-semibold">Available till</h3>
                    <h3 className="text-yellow-300 text-2xl font-semibold">21 April 2024 12PM GMT</h3>
                  </div>
                </div>
                <div>
                  {activitiesData && activitiesData?.nfts?.genesisNft ?
                    <Image className="hover:cursor-pointer " src={crate} alt="MINT" />
                    :
                    <Image className="hover:cursor-pointer " src={MINT} alt="MINT" />
                  }
                </div>
              </div>
            </div>
            <div className="w-full flex items-center justify-center">
              <div>
                {activitiesData && activitiesData?.nfts?.genesisNft ?
                  <Image className="hover:cursor-pointer " src={MINTED} alt="MINT" />
                  :
                  <Image className="hover:cursor-pointer " src={MINT} alt="MINT" />
                }
              </div>
            </div>

            <div className="w-full pt-10 pl-5 gap-x-5 pr-5 flex">
              <div className="w-[30%] border border-yellow-300  h-fit pl-1 pb-7" style={{ backgroundColor: '#272315' }}>
                <div className="p-2 gap-x-1 flex justify-between">
                  <h1 className="font-mono text-yellow-300 text-2xl font-bold">Trove Status</h1>
                  <div className={`border-[3px] flex items-center justify-center h-10  w-32 p-2 ${troveStatus === "ACTIVE" ? "border-green-800 bg-green-100" : "border-red-800  bg-red-100"}`} style={{ borderTopRightRadius: "10px" }}>
                    {troveStatus === "ACTIVE" ? (
                      <h6 className="w-2 h-2 rounded-full bg-green-400 mr-1"></h6>
                    ) : (
                      <h6 className="w-2 h-2 rounded-full bg-red-400 mr-1 font-bold text-black"></h6>
                    )}
                    <h6>{troveStatus}</h6>
                  </div>

                  <div className="bent-corner"></div>
                </div>
                <div className="space-y-6 pt-12">
                  <div className="flex gap-x-14">
                    <Image src={btc} alt="coin" />
                    <div className="">
                      <h1 className="text-gray-500 font-bold font-mono">Collateral</h1>
                      <h1 className="text-gray-100 font-bold text-xl font-mono">0.460BTC</h1>
                      <h1 className="text-gray-500 font-bold font-mono">$341.46</h1>
                    </div>
                  </div>
                  <div className=" flex gap-x-6">
                    <Image src={doubleCoin} alt="coin" />
                    <div className="">
                      <h1 className="text-gray-500 font-bold font-mono">Debt</h1>
                      <h1 className="text-gray-100 font-bold text-xl font-mono">0.460BTC</h1>
                    </div>
                  </div>
                  <div className="flex gap-x-10">
                    <Image src={tripleCoin} alt="coin" />
                    <div className="">
                      <h1 className="text-gray-500 font-bold font-mono">YOUR LTV</h1>
                      <h1 className="text-gray-100 font-bold text-xl font-mono">0.460BTC</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-2/3 border border-yellow-300 pb-[4.5rem] h-fit" style={{ backgroundColor: '#272315' }}>
                <div className="p-2 gap-x-1 flex justify-between">
                  <h1 className="font-mono text-yellow-300 text-2xl font-bold">ACTIVITIES STATS</h1>
                  <Image src={botanixLogo} alt="logo" className="-mt-4" />
                </div>
                <div className=" p-2 space-y-10">
                  <div className="w-full h-24 flex">
                    <div className="flex-1 h-fit  flex flex-col items-center justify-center text-center">
                      <Image src={giftBox} alt="giftBox" />
                      <h6 className="font-bold text-gray-400">Active Deposit</h6>
                      <h6 className="font-bold  text-gray-100">{activitiesData?.activities.activeDeposit}{" "} BTC</h6>
                    </div>
                    <div className="flex-1 h-fit  flex flex-col items-center justify-center text-center">
                      <Image src={giftBox} alt="giftBox" />
                      <h6 className="font-bold text-gray-400">Trove Volume</h6>
                      <h6 className="font-bold text-gray-100">{activitiesData?.activities.troveVolume}{" "} BTC</h6>
                    </div>
                    <div className="flex-1 h-fit  flex flex-col items-center justify-center text-center">
                      <Image src={giftBox} alt="giftBox" />
                      <h6 className="font-bold text-gray-400">Staking Volume</h6>
                      <h6 className="font-bold text-gray-100">{activitiesData?.activities.stakingVolume}{" "} BTC</h6>
                    </div>
                  </div>
                  <div className="w-full h-24 flex">
                    <div className="flex-1 h-fit  flex flex-col items-center justify-center text-center">
                      <Image src={giftBox} alt="giftBox" />
                      <h6 className="font-bold text-gray-400">3rd Party Volume</h6>
                      <h6 className="font-bold text-gray-100">{activitiesData?.activities["3rdPartyVolume"]}{" "}PUSD</h6>
                    </div>
                    <div className="flex-1 h-fit  flex flex-col items-center justify-center text-center">
                      <Image src={giftBox} alt="giftBox" />
                      <h6 className="font-bold text-gray-400">Native Txns</h6>
                      <h6 className="font-bold text-gray-100">{activitiesData?.activities.nativeTxns}</h6>
                    </div>
                    <div className="flex-1 h-fit  flex flex-col items-center justify-center text-center">
                      <Image src={giftBox} alt="giftBox" />
                      <h6 className="font-bold text-gray-400">3rd Party Txns</h6>
                      <h6 className="font-bold text-gray-100">{activitiesData?.activities["3rdPartyTxns"]}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

