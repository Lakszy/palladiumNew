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
import { useEffect, useState, useCallback } from "react";
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

const ClaimDashboard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transactionRejected, setTransactionRejected] = useState(false);
  const { data: hash, writeContract, error: writeError } = useWriteContract();
  const assets = [
    { name: "wETH", amount: 0.001, marketPrice: 2247.89, claimValue: 0.55 },
    { name: "weETH", amount: 0.001, marketPrice: 2247.89, claimValue: 13.25 },
  ];

  const totalValueToClaim = 14; // USD
  const wethBalance = 0.0; // WETH
  const weethBalance = 0.01; // weETH
  const handleConfirmClick = async () => {
    try {
      setIsModalVisible(true);

      // Set the input amount to 0 as per your requirement
      const inputBigInt = BigInt(0);

      // Call withdrawFromSP with amount 0 and collateral tokens
      await writeContract({
        abi: StabilityPoolbi,
        address: "0x0F8D43b7792c3D297dDf285f357d3DA6970EDe5e", // stability pool contract address
        functionName: "withdrawFromSP",
        args: [
          BigInt(0), // amount as 0
          [
            "0x3786495F5d8a83B7bacD78E2A0c61ca20722Cce3", // collateral tokens
            "0x4CE937EBAD7ff419ec291dE9b7BEc227e191883f",
            "0x5FB4E66C918f155a42d4551e871AD3b70c52275d",
          ],
        ],
      });
    } catch (error) {
      console.error("Error sending transaction:", error);
      setTransactionRejected(true);
      //   setUserModal(true);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-[#272315] text-white border border-[#333333] rounded-sm">
      <div className="flex flex-col md:flex-row gap-y-4 md:gap-x-2">
        {/* Box 1: Assets Table */}
        <div
          className="flex-1 pr-0 "
          style={{ backgroundColor: "rgb(56,52,39)" }}
        >
          {/* <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 title-text">
                <th className="pb-4">Assets</th>
                <th className="pb-4">Market Price</th>
                <th className="pb-4">Claim Value</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, index) => (
                <tr key={index}>
                  <td className="py-2 title-text">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                      <span>
                        {asset.amount} {asset.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 title-text">
                    ${asset.marketPrice.toFixed(2)}
                  </td>
                  <td className="py-2 title-text">
                    ${asset.claimValue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table> */}
          <div className="w-full grid grid-cols-3 gap-4 text-left">
            {/* Header */}
            <div className="text-gray-400 title-text pb-4 pl-2">Assets</div>
            <div className="text-gray-400 title-text pb-4">Market Price</div>
            <div className="text-gray-400 title-text pb-4">Claim Value</div>

            {/* Rows */}
            {assets.map((asset, index) => (
              <React.Fragment key={index}>
                {/* Asset */}
                <div className="py-2 px-2 title-text flex items-center">
                  {/* <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div> */}
                  <span>
                    {asset.amount} {asset.name}
                  </span>
                </div>

                {/* Market Price */}
                <div className="py-2 title-text">
                  ${asset.marketPrice.toFixed(2)}
                </div>

                {/* Claim Value */}
                <div className="py-2 title-text">
                  ${asset.claimValue.toFixed(2)}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Box 2: Claim Summary */}
        <div
          className="flex-1 p-4"
          style={{ backgroundColor: "rgb(56,52,39)" }}
        >
          <div className="mb-6 mt-2">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 title-text">
                Total Value to claim
              </span>
              <span className="font-bold title-text">
                {totalValueToClaim} USD
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 title-text">WETH</span>
              <span className="title-text">{wethBalance.toFixed(2)} WETH</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 title-text">weETH</span>
              <span className="title-text">
                {weethBalance.toFixed(2)} weETH
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Claim Button Outside Box 2 */}
      <button
        className="w-full bg-yellow-400 text-black py-3 rounded font-bold hover:bg-yellow-500 transition-colors mt-4 title-text"
        onClick={handleConfirmClick}
      >
        CLAIM
      </button>
    </div>
  );
};

export default ClaimDashboard;
