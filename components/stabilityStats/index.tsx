/* eslint-disable */
"use client";
import { useCallback } from "react";
import stabilityPoolAbi from "../../app/src/constants/abi/StabilityPool.sol.json";
import { BOTANIX_RPC_URL } from "../../app/src/constants/botanixRpcUrl";
import botanixTestnet from "../../app/src/constants/botanixTestnet.json";
import info from "../../app/assets/images/info.svg";
import { getContract } from "../../app/src/utils/getContract";
import { ethers } from "ethers";
import Image from "next/image";
import "../../components/stabilityPool/Modal.css";
import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import "../../app/App.css";
import { Tooltip } from "primereact/tooltip";


const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);
export const StabilityStats = () => {
  const { isConnected } = useAccount();
  const [totalStakedValue, setTotalStakedValue] = useState("0");
  const [totalStabilityPool, setTotalStabilityPool] = useState("0");
  const [isLoading, setIsLoading] = useState(true);
  const [isPoolLoading, setIsPoolLoading] = useState(true);
  const { data: walletClient } = useWalletClient();
  const [depositorGains, setDepositorGains] = useState<{
    [key: string]: string;
  }>({});

  const stabilityPoolContractReadOnly = getContract(
    botanixTestnet.addresses.StabilityPool,
    stabilityPoolAbi,
    provider
  );
  const collateralTokens = [
    {
      name: "earthBTC",
      address: "0x222c21111dDde68e6eaC2fCde374761E72c45FFe",
    },

  ];
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
    const totalStabilityPool = async () => {
      const fetchedTotalStakedValue =
        await stabilityPoolContractReadOnly.getTotalDebtTokenDeposits();

      const fixedtotal = ethers.formatUnits(fetchedTotalStakedValue, 18);
      setTotalStabilityPool(fixedtotal);
      setIsPoolLoading(false);
    };
    getStakedValue();
    totalStabilityPool();
  }, [walletClient]);

  const stakedValue = parseFloat(totalStakedValue);
  const stabilityPoolValue = parseFloat(totalStabilityPool);
  const poolShare = (stakedValue / stabilityPoolValue) * 100;
  useEffect(() => {
    fetchDepositorGains();
  }, []);
  const allTokenGains = collateralTokens.reduce((acc, token) => {
    acc[token.name] = depositorGains[token.name] || "0";
    return acc;
  }, {} as { [key: string]: string });
  return (
    <div className="bg-black">
      <div>
        <div className="flex justify-center">
          <h2 className="font-bold text-sm my-3 text-[#88e273] title-text">
            STABILITY POOL
          </h2>
        </div>

        <div className="flex justify-between py-2">
          <div className="flex">
            <span className="text-[#827f77] font-medium text-sm ml body-text">
              Your Staking Balance
            </span>
          </div>
          <span className="text-white font-medium ml-7 text-sm body-text whitespace-nowrap">
            {isLoading && isConnected ? (
              <div className="h-3 rounded-xl">
                <div className="hex2-loader"></div>
              </div>
            ) : (
              <>{Number(totalStakedValue).toFixed(2).toString()} ORE</>
            )}
          </span>
        </div>

        <div className="flex justify-between py-2">
          <div className="flex">
            <span className="text-[#827f77] text-sm font-medium body-text">
              Total Pool Staked
            </span>
            <Image
              width={15}
              className="toolTipHolding17 ml_5 "
              src={info}
              data-pr-tooltip=""
              alt="info"
            />
            <Tooltip
              className="custom-tooltip title-text2"
              target=".toolTipHolding17"
              content="The total amount of LOAN tokens staked in the Staking Pool."
              mouseTrack
              mouseTrackLeft={10}
            />
          </div>
          <span className="text-white  font-medium text-sm body-text">
            {isPoolLoading && isConnected ? (
              <div className="h-3 rounded-xl">
                <div className="hex2-loader"></div>
              </div>
            ) : (
              <>{Number(totalStabilityPool).toFixed(2).toString()} ORE</>
            )}
          </span>
        </div>

        <div className="flex justify-between py-2">
          <div className="flex">
            <span className="text-[#827f77] text-sm font-medium body-text">
              Your Pool Share
            </span>
            <Image
              width={15}
              className="toolTipHolding18 ml_5"
              src={info}
              data-pr-tooltip=""
              alt="info"
            />
            <Tooltip
              className="custom-tooltip title-text2"
              target=".toolTipHolding18"
              content="If your pool share size is smaller than 0.000000% the system will display 0.00%."
              mouseTrack
              mouseTrackLeft={10}
            />
          </div>
          <span className="text-white text-sm font-medium body-text">
            {isLoading && isPoolLoading && isConnected ? (
              <div className="h-3 rounded-xl">
                <div className="hex2-loader"></div>
              </div>
            ) : (
              <>{isNaN(poolShare) ? "0" : poolShare.toFixed(2)}%</>
            )}
          </span>
        </div>

        <div className="flex justify-center">
          <h2 className="font-bold text-[#88e273] my-3 text-sm title-text">
            Your Rewards
          </h2>
        </div>

        <div className="flex justify-between py-2">
          <div className="flex">
            <span className="text-[#827f77] text-sm font-medium body-text">
              Liquidation Gains
            </span>
          </div>
          <span className="text-white font-medium text-sm body-text"></span>
        </div>

        {/* Display all tokens, including those with 0 gains */}
        {Object.entries(allTokenGains).map(([token, amount]) => {
          let formattedAmount;
          if (token === "earthBTC") {
            formattedAmount = parseFloat(amount).toFixed(8);
          } else {
            formattedAmount = parseFloat(amount).toFixed(6);
          }

          return (
            <div key={token} className="flex justify-between py-2">
              <div className="flex">
                <span className="text-[#827f77] text-sm font-medium body-text">
                  {token} Gains
                </span>
              </div>
              <span className="text-white font-medium text-sm body-text">
                {formattedAmount} {token}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
