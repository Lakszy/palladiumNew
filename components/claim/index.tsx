import React from "react";
import "../../app/App.css";
import stabilityPoolAbi from "../../app/src/constants/abi/StabilityPool.sol.json";
import { BOTANIX_RPC_URL } from "../../app/src/constants/botanixRpcUrl";
import botanixTestnet from "../../app/src/constants/botanixTestnet.json";
import { getContract } from "../../app/src/utils/getContract";
import img3 from "../../app/assets/images/Group 663.svg";
import conf from "../../app/assets/images/conf.gif";
import rec2 from "../../app/assets/images/rec2.gif";
import tick from "../../app/assets/images/tick.gif";
import rej from "../../app/assets/images/TxnError.gif";
import Decimal from "decimal.js";

import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWalletClient,
  useWriteContract,
} from "wagmi";
import { Button } from "../ui/button";
import { Dialog } from "primereact/dialog";
import Image from "next/image";
import "../../app/App.css";
import "../../components/stabilityPool/Modal.css";
import { StabilityPoolbi } from "@/app/src/constants/abi/StabilityPoolbi";
import { EVMConnect } from "../EVMConnect";

const Claim = () => {
  const BOTANIX_RPC_URL2 = "https://rpc.test.btcs.network";
  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL2);

  const stabilityPoolContractReadOnly = getContract(
    botanixTestnet.addresses.StabilityPool,
    stabilityPoolAbi,
    provider
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transactionRejected, setTransactionRejected] = useState(false);
  const { data: hash, writeContract, error: writeError } = useWriteContract();
  const [fetchedPrice, setFetchedPrice] = useState(0);
  const [fetchedPriceBTC, setFetchedPriceBTC] = useState(0);
  const { data: walletClient } = useWalletClient();

  const [wcoreBalance, setWcoreBalance] = useState(0.0)
  const [wbtcBalance, setWbtcBalance] = useState(0.0)

  const [depositorAssets, setDepositorAssets] = useState([]);
  const [depositorGains, setDepositorGains] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.palladiumlabs.org/core/protocol/metrics");
        const data = await response.json();
        const protocolMetrics = data[0].metrics[1];
        const protocolMetricsBTC = data[0].metrics[0];
        setFetchedPriceBTC(protocolMetricsBTC.price);
        setFetchedPrice(protocolMetrics.price);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [walletClient, hash, fetchedPrice, fetchedPriceBTC]);


  // Maybe Useful
  // const assets = [
  //   { name: "wCore", amount: depositorAssets[0] || 0, marketPrice: fetchedPrice, decimals: 2 },
  //   { name: "wBTC", amount: depositorAssets[1] || 0, marketPrice: fetchedPriceBTC, decimals: 2 },
  // ];

  const assets = [
    { name: "wCore", amount: 0, marketPrice: fetchedPrice, decimals: 2 },
    { name: "wBTC", amount: 0, marketPrice: fetchedPriceBTC, decimals: 2 },
  ];


  const calculateTotalClaimValue = () => {
    return assets.reduce((total, asset) => {
      const claimValue = asset.amount * asset.marketPrice;
      return total + claimValue;
    }, 0);
  };

  const totalClaimValue = calculateTotalClaimValue().toFixed(2);


  useEffect(() => {
    console.log("starting")
    const fetchDepositorGains = async () => {
      try {
        const [returnedAssets, gains] =
          await stabilityPoolContractReadOnly.getDepositorGains(
            walletClient?.account.address,
            [
              "0x4CE937EBAD7ff419ec291dE9b7BEc227e191883f",
              "0x5FB4E66C918f155a42d4551e871AD3b70c52275d",
            ],
          );
        console.log("Returned Claim:", returnedAssets)
        console.log("Gains Claim:", gains)

        setDepositorAssets(returnedAssets);
        setDepositorGains(gains);

        setWcoreBalance(Number(gains[0]));
        setWbtcBalance(Number(gains[1]));

      } catch (error) {
        console.error("Error fetching depositor gains:", error);
      }
    };

    fetchDepositorGains();
  }, [walletClient]);

  const handleConfirmClick = async () => {
    try {
      if (!walletClient) {
        return null;
      }

      setIsModalVisible(true);

      const inputBigInt = BigInt(0);

      await writeContract({
        abi: StabilityPoolbi,
        address: "0x7779C10ae22632955846fa8c8EfA4cBd241f1659", // stability pool contract address
        functionName: "withdrawFromSP",
        args: [
          inputBigInt,
          [
            "0x4CE937EBAD7ff419ec291dE9b7BEc227e191883f",
            "0x5FB4E66C918f155a42d4551e871AD3b70c52275d",
          ],
        ],
        value: undefined,
      });
    } catch (error) {
      console.error("Error sending transaction:", error);
      setTransactionRejected(true);
    }
  };

  return (
    <div className="p-4 md:p-8 w-full md:h-[25.6rem] border-[#88e273] bg-black text-white border rounded-none">
      <div className="flex flex-col md:flex-row gap-y-4 md:gap-x-2">
        <div className="flex-1 pr-0 " style={{ backgroundColor: "" }}>
          <div className="w-full grid grid-cols-3 gap-4 text-left">
            <div className="text-gray-400 body-text font-medium pb-4 pl-2">Assets</div>
            <div className="text-gray-400 body-text font-medium whitespace-nowrap pb-4">Market Price</div>
            <div className="text-gray-400 body-text font-medium pb-4">Claim Value</div>

            {assets.map((asset, index) => (
              <React.Fragment key={index}>
                <div className="py-2 px-1 md:px-2 body-text font-medium flex items-center">
                  <span className=" whitespace-nowrap">
                    {Number(asset.amount).toFixed(2)} {asset.name}
                  </span>
                </div>
                <div className="py-2 body-text font-medium ">
                  ${asset.marketPrice.toFixed(2)}
                </div>
                <div className="py-2 body-text font-medium ">
                  ${(asset.amount * asset.marketPrice).toFixed(asset.decimals)}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex-1 px-2 py-4" style={{ backgroundColor: "" }}>
            <div className="mb-6 mt-2">
              <div className="flex justify-between gap-x-16 mb-2">
                <span className="text-gray-400 body-text font-medium ">
                  Total Value to claim
                </span>
                <span className="body-text font-medium ">
                  {totalClaimValue} USD
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 body-text font-medium ">WCORE</span>
                <span className="body-text font-medium ">
                  {wcoreBalance.toFixed(2)} WCORE
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 body-text font-medium ">wBTC</span>
                <span className="body-text font-medium ">
                  {wbtcBalance.toFixed(2)} wBTC
                </span>
              </div>

            </div>
          </div>
          <button className="w-full bg-[#88e273] text-black py-3 rounded title-text2 transition-colors mt-4  font-medium" onClick={handleConfirmClick}>
            CLaIM
          </button>
        </div>
      </div>
    </div>
  );
};

export default Claim;
