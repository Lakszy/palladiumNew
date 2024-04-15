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

	const { data: walletClient } = useWalletClient();

	const stabilityPoolContractReadOnly = getContract(
		botanixTestnet.addresses.stabilityPool,
		stabilityPoolAbi,
		provider
	);

	const { toWei, toBigInt } = web3.utils;
	// const stabilityPoolContract = getContract(
	// 	botanixTestnet.addresses.stabilityPool,
	// 	stabilityPoolAbi,
	// 	walletClient
	// );

	// useEffect(() => {
	// 	const fetchedData = async () => {
	// 		try {
	// 			if (!walletClient) return null;
	// 		} catch (error) {
	// 			console.error(error);
	// 		}
	// 		if (!walletClient) return null;
	// 		const fetchedLiquidGains =
	// 			await stabilityPoolContractReadOnly.getDepositorETHGain(
	// 				walletClient?.account.address
	// 			);
	// 		setLiquidGains(fetchedLiquidGains);
	// 		console.log(fetchedLiquidGains, "fetchedLiquidGains");
	// 	};
	// 	fetchedData();
	// }, [walletClient]);

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
		getStakedValue();
	}, [walletClient]);

	const handleConfirmClick = async () => {
		const pow = Decimal.pow(10, 18);
		const _1e18 = toBigInt(pow.toFixed());
		try {
			if (!walletClient) return null;
			const fetchedLiquidGains =
				await stabilityPoolContractReadOnly.getDepositorETHGain(
					walletClient?.account.address
				);
			setLiquidGains(fetchedLiquidGains);
			console.log(fetchedLiquidGains, "fetchedLiquidGains");

			const fetchedLoanReward =
				await stabilityPoolContractReadOnly.getDepositorLQTYGain(
					walletClient.account.address
				);
			setLoanRewards(fetchedLoanReward);
			console.log(fetchedLoanReward, "fetchedLoanReward");

			// const fetchedTotalStakedValue =
			// 	await stabilityPoolContractReadOnly.getCompoundedLUSDDeposit(
			// 		walletClient.account.address
			// 	);
			// console.log(fetchedTotalStakedValue, "fetchedTotalStakedValue");
			// const fixedtotal = (toBigInt(fetchedTotalStakedValue) / _1e18).toString();
			// const fixedtotal = ethers.formatUnits(fetchedTotalStakedValue, 18);
			// setTotalStakedValue(fixedtotal);
			// console.log(fixedtotal, "fixedtotal");
			// console.log(fetchedTotalStakedValue, "fetchedTotalStakedValue");
			// console.log(totalStakedValue, "totalStaked");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="min-w-96">
			<h2 className="font-bold text-xl my-3 text-yellow-400">Stability Pool</h2>

			<div className="flex justify-between py-2">
				<span className="text-yellow-100 text-lg ">Your Total Staking Balance</span>
				<span className="text-white font-medium ml-7">{totalStakedValue.toString()} PUSD</span>
			</div>

			<div className="flex justify-between py-2">
				<span className="text-yellow-100 text-lg font-medium">Your Pool Share</span>
				<span className="text-white font-medium">0.00 PUSD</span>
			</div>

			<h2 className="font-bold text-xl text-yellow-400 my-3">Your Rewards</h2>
			<div className="flex justify-between py-2">
				<span className="text-yellow-100 text-lg">Liquidation Gains</span>
				<span className="text-white font-medium">{liquidGains.toString()} PUSD</span>
			</div>

			<div className="flex justify-between py-2">
				<span className="text-yellow-100 text-lg">PDM Rewards</span>
				<span className="text-white font-medium">{loanRewards.toString()} PUSD</span>
			</div>
			{isConnected ? (
				<div className="">
					<button
						style={{ backgroundColor: "#f5d64e" }}
						onClick={handleConfirmClick}
						className="mt-5 text-black text-md font-semibold w-full border border-black h-10 border-none"
					>
						Claim
					</button>
				</div>
			) : (
				<CustomConnectButton />
			)}
		</div>
	);
};
