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
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog } from 'primereact/dialog';
import Image from "next/image";
import BotanixLOGO from "../../app/assets/images/newpalladium.svg"
import { CustomConnectButton } from "../connectBtn";
import "../../app/App.css"
import "../../components/stabilityPool/Modal.css"

export const Unstake = () => {
	const [userInput, setUserInput] = useState("0");
	const [isLowPUSD, setIsLowPUSD] = useState(false);
	const [stakedValue, setStakedValue] = useState(0);
	const [pusdBalance, setPusdBalance] = useState(0);
	const { isConnected } = useAccount();
	const [isLoading, setIsLoading] = useState(true);
	const [totalStakedValue, setTotalStakedValue] = useState("0");
	const [isModalVisible, setIsModalVisible] = useState(false);


	const { data: walletClient } = useWalletClient();

	const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);

	const stabilityPoolContractReadOnly = getContract(
		botanixTestnet.addresses.stabilityPool,
		stabilityPoolAbi,
		provider
	);

	const stabilityPoolContract = getContract(
		botanixTestnet.addresses.stabilityPool,
		stabilityPoolAbi,
		walletClient
	);

	useEffect(() => {
		const fetchStakedValue = async () => {
			try {
				if (!walletClient) return null;
				const fetchedPUSD =
					await stabilityPoolContractReadOnly.getCompoundedLUSDDeposit(
						walletClient?.account.address
					);
				setStakedValue(fetchedPUSD);
			} catch (error) {
				console.error("Error fetching staked value:", error);
			}
		};
		fetchStakedValue();
	}, [walletClient, stabilityPoolContractReadOnly]);

	useEffect(() => {
		const getStakedValue = async () => {
			if (!walletClient) return null;
			const fetchedTotalStakedValue =
				await stabilityPoolContractReadOnly.getCompoundedLUSDDeposit(
					walletClient?.account.address
				);
			const fixedtotal = ethers.formatUnits(fetchedTotalStakedValue, 18);
			setTotalStakedValue(fixedtotal);
			setIsLoading(false)
		};
		getStakedValue();
	}, [walletClient, stabilityPoolContractReadOnly, totalStakedValue]);


	const handlePercentageClick = (percentage: any) => {
		const percentageDecimal = new Decimal(percentage).div(100);
		const pusdBalanceNumber = parseFloat(stakedValue.toString());
		if (!isNaN(pusdBalanceNumber)) {
			const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
			const stakeFixed = maxStake.div(Decimal.pow(10, 18));
			setUserInput(String(stakeFixed));
		} else {
			console.error("Invalid PUSD balance:", pusdBalance);
		}
	};

	const handleConfirmClick = async () => {
		try {
			setIsModalVisible(true);

			const pow = Decimal.pow(10, 18);
			const inputBeforeConv = new Decimal(userInput);

			const inputValue = inputBeforeConv.mul(pow).toFixed();
			if (stakedValue >= Number(userInput)) {
				const unstake = await stabilityPoolContract.withdrawFromSP(inputValue);
			} else {
				setIsLowPUSD(true);
			}
			setIsModalVisible(false);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="grid  bg-[#3b351b] items-start h-64 gap-2 mx-auto  border border-yellow-400 p-5">
			<div className="">
				<div className="flex -mt-2 mb-2  items-center">
					<Input id="items" placeholder="0.000 BTC" disabled={!isConnected} value={userInput} onChange={(e) => { const input = e.target.value; setUserInput(input); }} className="bg-[#3b351b] body-text text-lg h-14 border border-yellow-300 text-white px-3 " />
				</div>
				<span className="md:ml-[55%] ml-[35%] text-yellow-300 font-medium balance body-text">
					{isLoading ?
						(<div className="-mt-6 h-3 rounded-xl">
							<div className="hex-loader"></div>
						</div>
						) : (
							<span className="whitespace-nowrap">Your Stake: {Math.trunc(Number(totalStakedValue) * 100) / 100} PUSD</span>
						)}
				</span>
			</div>
			<div className="flex w-full gap-x-4 md:gap-x-6  mt-2">
				<Button disabled={!isConnected} className=" text-xs md:text-lg  border-2 border-yellow-900 body-text" style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(25)}>25%</Button>
				<Button disabled={!isConnected} className=" text-xs md:text-lg  border-2 border-yellow-900 body-text" style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(50)}>50%</Button>
				<Button disabled={!isConnected} className=" text-xs md:text-lg  border-2 border-yellow-900 body-text" style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(75)}>75%</Button>
				<Button disabled={!isConnected} className=" text-xs md:text-lg  border-2 border-yellow-900 body-text" style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(100)}>100%</Button>
			</div>
			{isConnected ? (
				<div className="">
					<button style={{ backgroundColor: "#f5d64e" }} onClick={handleConfirmClick} className={`mt-2 text-black text-md font-semibold w-full border border-black h-10 border-none body-text ${isLoading || Math.trunc(Number(totalStakedValue) * 100) / 100 === 0 ? 'cursor-not-allowed opacity-50' : ''}`} disabled={isLoading || Math.trunc(Number(totalStakedValue) * 100) / 100 === 0}>	{isLoading ? 'LOADING...' : 'UNSTAKE'}</button>
				</div>
			) : (
				<CustomConnectButton className="" />
			)}
			<Dialog visible={isModalVisible} onHide={() => setIsModalVisible(false)}>
				<>
					<div className="waiting-container bg-white">
						<div className="waiting-message text-lg title-text text-white whitespace-nowrap">Waiting for Confirmation... ✨.</div>
						<Image src={BotanixLOGO} className="waiting-image" alt="gif" />
					</div>
				</>
			</Dialog>
		</div>
	);
};
