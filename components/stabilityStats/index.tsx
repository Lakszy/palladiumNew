/* eslint-disable */

"use client";

import stabilityPoolAbi from "../../app/src/constants/abi/StabilityPool.sol.json";
import { BOTANIX_RPC_URL } from "../../app/src/constants/botanixRpcUrl";
import botanixTestnet from "../../app/src/constants/botanixTestnet.json";
import { getContract } from "../../app/src/utils/getContract";
import Decimal from "decimal.js";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import web3 from "web3";
import { Button } from "../ui/button";
import { CustomConnectButton } from "../connectBtn";

const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);

export const StabilityStats = () => {
	const [loanRewards, setLoanRewards] = useState("0");
	const { address, isConnected } = useAccount();

	const [liquidGains, setLiquidGains] = useState("0");

	const [totalStakedValue, setTotalStakedValue] = useState("0");
	const [totalStabilityPool, setTotalStabilityPool] = useState("0");
	const [totalPoolShare, setTotalPoolShare] = useState("0");



	const { data: walletClient } = useWalletClient();

	const stabilityPoolContractReadOnly = getContract(
		botanixTestnet.addresses.stabilityPool,
		stabilityPoolAbi,
		provider
	);

	const { toWei, toBigInt } = web3.utils;

	useEffect(() => {
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

		const totalStabilityPool = async () => {
			if (!walletClient) return null;
			const fetchedTotalStakedValue =
				await stabilityPoolContractReadOnly.getTotalLUSDDeposits();

			const fixedtotal = ethers.formatUnits(fetchedTotalStakedValue, 18);
			setTotalStabilityPool(fixedtotal);
			console.log(fixedtotal, "Lkahsya");
			console.log(fetchedTotalStakedValue, "fetchedTotalStakedValue");
			console.log(totalStakedValue, "totalStaked");
		};

		getStakedValue();
		totalStabilityPool();
	}, [walletClient]);

	const stakedValue = parseFloat(totalStakedValue);
	const stabilityPoolValue = parseFloat(totalStabilityPool);
	const poolShare = (stakedValue / stabilityPoolValue)*100;

	return (
		<div className="">
			<div>
				<div className="flex justify-center">
					<h2 className="font-bold text-xl my-3 text-yellow-400 title-text">Stability Pool</h2>
				</div>

				<div className="flex justify-between py-2">
					<span className="text-yellow-100 font-medium text-base ml body-text">Your Total Staking Balance</span>
					<span className="text-white font-medium ml-7 body-text whitespace-nowrap">{(Number(totalStakedValue).toFixed(2)).toString()} PUSD</span>
				</div>

				<div className="flex justify-between py-2">
					<span className="text-yellow-100 text-base font-medium body-text">Total Stability Pool Staked</span>
					<span className="text-white font-medium body-text">{(Number(totalStabilityPool).toFixed(2)).toString()} PUSD</span>
				</div>

				<div className="flex justify-between py-2">
					<span className="text-yellow-100 text-lg font-medium body-text">Your Pool Share</span>
					<span className="text-white font-medium body-text">{isNaN(poolShare) ? "0" : poolShare.toFixed(2)} %</span>
				</div>

				<div className="flex justify-center">
					<h2 className="font-bold text-xl text-yellow-400 my-3 title-text">Your Rewards</h2>
				</div>
				<div className="flex justify-between py-2">
					<span className="text-yellow-100 text-lg font-medium body-text">Liquidation Gains</span>
					<span className="text-white font-medium body-text">{liquidGains.toString()} BTC</span>
				</div>

				<div className="flex justify-between py-2">
					<span className="text-yellow-100 text-lg font-medium body-text">PDM Rewards</span>
					<span className="text-white font-medium body-text">{loanRewards.toString()} PDM</span>
				</div>
			</div>
		</div>
	);
};
