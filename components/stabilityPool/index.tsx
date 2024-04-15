/* eslint-disable */


"use client";

import borrowerOperationAbi from "../../app/src/constants/abi/BorrowerOperations.sol.json";
import stabilityPoolAbi from "../../app/src/constants/abi/StabilityPool.sol.json";
import { BOTANIX_RPC_URL } from "../../app/src/constants/botanixRpcUrl";
import botanixTestnet from "../../app/src/constants/botanixTestnet.json";
import { getContract } from "../../app/src/utils/getContract";
import Decimal from "decimal.js";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import web3 from "web3";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAccount } from 'wagmi';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CustomConnectButton } from "../connectBtn";


export const StabilityPool = () => {
	const [userInput, setUserInput] = useState("0");
	const [isLowDebt, setIsLowDebt] = useState(false);
	const [pusdBalance, setPusdBalance] = useState("0");
	const { address, isConnected } = useAccount();


	const { data: walletClient } = useWalletClient();

	const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);

	const stabilityPoolContract = getContract(
		botanixTestnet.addresses.stabilityPool,
		stabilityPoolAbi,
		walletClient
	);

	const borrowerOperationsContractReadOnly = getContract(
		botanixTestnet.addresses.borrowerOperations,
		borrowerOperationAbi,
		provider
	);

	const { toWei, toBigInt } = web3.utils;

	// Function to handle clicking on percentage buttons
	// const handlePercentageClick = (percentage: any) => {
	// 	const percentageDecimal = new Decimal(percentage).div(100);
	// 	const maxStake = new Decimal(pusdBalance).mul(percentageDecimal);
	// 	setUserInput(maxStake.toFixed());
	// };

	// const handlePercentageClick = (percentage: any) => {
	// 	const percentageDecimal = new Decimal(percentage).div(100);
	// 	const pusdBalanceNumber = parseFloat(pusdBalance);
	// 	if (!isNaN(pusdBalanceNumber)) {
	// 		const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
	// 		setUserInput(maxStake.toFixed());
	// 	} else {
	// 		console.error("Invalid PUSD balance:", pusdBalance);
	// 	}
	// };

	const handlePercentageClick = (percentage: any) => {
		const pow = Decimal.pow(10, 18);
		const _1e18 = toBigInt(pow.toFixed());
		const percentageDecimal = new Decimal(percentage).div(100);
		const pusdBalanceNumber = parseFloat(pusdBalance);
		if (!isNaN(pusdBalanceNumber)) {
			const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
			const stakeFixed = maxStake.toFixed();
			const stakeFixedConv = (toBigInt(stakeFixed) / _1e18).toString();
			setUserInput(stakeFixedConv);
		} else {
			console.error("Invalid PUSD balance:", pusdBalance);
		}
	};

	useEffect(() => {
		// Fetch user's PUSD balance from your API or blockchain
		const fetchPusdBalance = async () => {
			// Example: Fetch balance from your API or blockchain
			// const balance = await getUserPusdBalance();
			// setPusdBalance(balance);

			const minDebt = await borrowerOperationsContractReadOnly.MIN_NET_DEBT();
			setPusdBalance(minDebt);
			console.log(minDebt, "minDebt");
		};

		fetchPusdBalance();
	}, []);

	const handleConfirmClick = async () => {
		try {
			const pow = Decimal.pow(10, 18);
			const inputBeforeConv = new Decimal(userInput);

			const inputValue = inputBeforeConv.mul(pow).toFixed();

			console.log(inputValue, "inputValue");
			let addressToPass = "0x0000000000000000000000000000000000000000";
			// console.log(web3.utils.toBigInt(userInput), "webinput");

			const minDebt = await borrowerOperationsContractReadOnly.MIN_NET_DEBT();
			console.log(minDebt, "minDebt");

			if (minDebt <= inputValue) {
				return setIsLowDebt(true);
			}

			const x = await stabilityPoolContract.provideToSP(
				inputValue,
				addressToPass
			);
			console.log(x, "output");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="grid  bg-[#3b351b] items-start h-64 gap-2 mx-auto border-[2px] border border-yellow-400 p-5">
			<div className="">
				<div className="flex -mt-2 mb-2  items-center">
					<Input
						id="items"
						placeholder="0.000 BTC"
						type="number"
						value={userInput}
						onChange={(e) => {
							const input = e.target.value;
							setUserInput(input);
						}}
						className="bg-[#3b351b] h-14 border border-yellow-300 text-white px-3 "
					/>
				</div>
				<span className="ml-[65%] text-yellow-300 font-medium balance">Available {pusdBalance} PUSD</span>
			</div>
			<div className="flex w-full gap-x-6 mt-2">
				<Button className="text-lg  border-2 border-yellow-900" style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(25)}>25%</Button>
				<Button className="text-lg  border-2 border-yellow-900" style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(50)}>50%</Button>
				<Button className="text-lg  border-2 border-yellow-900" style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(75)}>75%</Button>
				<Button className="text-lg  border-2 border-yellow-900" style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(100)}>100%</Button>
			</div>
			{isConnected ? (
				<div className="">
					<button
						style={{ backgroundColor: "#f5d64e" }}
						onClick={handleConfirmClick}
						className="mt-2 text-black text-md font-semibold w-full border border-black h-10 border-none"
					>
						STAKE
					</button>
				</div>
			) : (
				<CustomConnectButton />
			)}
		</div>
	);
};
