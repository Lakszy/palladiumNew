"use client";

import stabilityPoolAbi from "../../app/src/constants/abi/StabilityPool.sol.json";
import { BOTANIX_RPC_URL } from "../../app/src/constants/botanixRpcUrl";
import botanixTestnet from "../../app/src/constants/botanixTestnet.json";
import { getContract } from "../../app/src/utils/getContract";

import Decimal from "decimal.js";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useWaitForTransactionReceipt, useWalletClient, useWriteContract } from "wagmi";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog } from 'primereact/dialog';
import Image from "next/image";
import BotanixLOGO from "../../app/assets/images/newpalladium.svg"
import { CustomConnectButton } from "../connectBtn";
import "../../app/App.css"
import "../../components/stabilityPool/Modal.css"
import { StabilityPoolbi } from "@/app/src/constants/abi/StabilityPoolbi";

export const Unstake = () => {
	const [userInput, setUserInput] = useState("0");
	const [isLowPUSD, setIsLowPUSD] = useState(false);
	const [stakedValue, setStakedValue] = useState(0);
	const [pusdBalance, setPusdBalance] = useState(0);
	const { isConnected } = useAccount();
	const [loadingModalVisible, setLoadingModalVisible] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState("");
	const [userModal, setUserModal] = useState(false);


	const [isStateLoading, setIsStateLoading] = useState(true);
	const [totalStakedValue, setTotalStakedValue] = useState("0");
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [message, setMessage] = useState("");
	const [showCloseButton, setShowCloseButton] = useState(false);

	const [afterLoad, setAfterload] = useState(false);
	const { data: walletClient } = useWalletClient();
	const { data: hash, writeContract } = useWriteContract()
	const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

	useEffect(() => {
		if (isLoading) {
			setIsModalVisible(false);
			setLoadingMessage("Loading Your Transaction.......");
			setLoadingModalVisible(true);
		} else if (isSuccess) {
			setLoadingMessage("Transaction Done...");
			setLoadingModalVisible(true);
		} else {
			setLoadingModalVisible(false);
		}
	}, [isSuccess, isLoading]);

	const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);
	const stabilityPoolContractReadOnly = getContract(botanixTestnet.addresses.stabilityPool, stabilityPoolAbi, provider);
	const stabilityPoolContract = getContract(botanixTestnet.addresses.stabilityPool, stabilityPoolAbi, walletClient);

	const fetchStakedValue = async () => {
		try {
			if (!walletClient) return null;
			const fetchedPUSD =
				await stabilityPoolContractReadOnly.getCompoundedLUSDDeposit(
					walletClient?.account.address
				);
			setStakedValue(fetchedPUSD);
			setAfterload(false);
		} catch (error) {
			console.error("Error fetching staked value:", error);
		}
	};
	useEffect(() => {
		fetchStakedValue();
	}, [walletClient, stabilityPoolContractReadOnly, writeContract, hash]);

	const handleClose = () => {
		setAfterload(true)
		setLoadingModalVisible(false);
		fetchStakedValue();
	};

	useEffect(() => {
		const getStakedValue = async () => {
			if (!walletClient) return null;
			const fetchedTotalStakedValue =
				await stabilityPoolContractReadOnly.getCompoundedLUSDDeposit(
					walletClient?.account.address
				);
			const fixedtotal = ethers.formatUnits(fetchedTotalStakedValue, 18);
			setTotalStakedValue(fixedtotal);
			setIsStateLoading(false)
		};
		getStakedValue();
	}, [walletClient, stabilityPoolContractReadOnly]);

	const handlePercentageClick = (percentage: any) => {
		const percentageDecimal = new Decimal(percentage).div(100);
		const pusdBalanceNumber = parseFloat(stakedValue.toString());
		if (!isNaN(pusdBalanceNumber)) {
			const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
			const stakeFixed = maxStake.div(Decimal.pow(10, 18));
			const roundedStakeFixed = Number(stakeFixed.toFixed(2))
			setUserInput(String(roundedStakeFixed));
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
			const inputBigInt = BigInt(inputValue);

			const stake = writeContract({
				abi: StabilityPoolbi,
				address: '0xb5d2f71f2B1506Ec243D0B232EB15492d685B689',
				functionName: 'withdrawFromSP',
				args: [inputBigInt]
			});

		} catch (error) {
			console.error('Error sending transaction:', error);
			setMessage('Transaction rejected');
			setUserModal(true);
			setIsModalVisible(false);
		}
	};

	useEffect(() => {
		if (hash) {
			setIsModalVisible(false);
		}
	}, [hash]);

	const renderHeader = () => {
		return (
			<div className="flex justify-content-between align-items-center">
				<Button className="p-button-rounded p-button-text" onClick={() => setUserModal(false)}>
					Close
				</Button>
			</div>
		);
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowCloseButton(true);
		}, 90000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="grid  bg-[#3b351b] items-start h-64 gap-2 mx-auto  border border-yellow-400 p-5">
			<div className="">
				<div className="flex -mt-2 mb-2  items-center">
					<Input id="items" placeholder="0.000 BTC" disabled={!isConnected} value={userInput} onChange={(e) => { const input = e.target.value; setUserInput(input); }} className="bg-[#3b351b] body-text text-lg h-14 border border-yellow-300 text-white px-3 " />
				</div>
			{afterLoad ? (
				<div className="text-left w-full -mt-6 h-2">
					<div className="hex-loader"></div>
				</div>
			) : (
				<span className={"md:ml-[55%] ml-[35%] font-medium balance body-text " + (Number(userInput) > Math.trunc(Number(totalStakedValue) * 100) / 100 ? "text-red-500" : "text-yellow-300")}>
					{isStateLoading ?
						(
						<div className="-mt-6 h-3 rounded-xl">
							<div className="hex-loader"></div>
						</div>
						) : (
							<span className="whitespace-nowrap">
								<span className="text-gray-400 body-text">
									Your Stake: {" "}
								</span>
								{Math.trunc(Number(totalStakedValue) * 100) / 100} PUSD</span>
						)}
				</span>
			)}
			</div>
			<div className="flex w-full gap-x-4 md:gap-x-6  mt-2">
				<Button disabled={!isConnected || isStateLoading} className={`text-xs md:text-lg  border-2 ${isStateLoading ? "cursor-not-allowed" : "cursor-pointer"} border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(25)}>25%</Button>
				<Button disabled={!isConnected || isStateLoading} className={`text-xs md:text-lg  border-2 ${isStateLoading ? "cursor-not-allowed" : "cursor-pointer"} border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(50)}>50%</Button>
				<Button disabled={!isConnected || isStateLoading} className={` text-xs md:text-lg  border-2 ${isStateLoading ? "cursor-not-allowed" : "cursor-pointer"} border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(75)}>75%</Button>
				<Button disabled={!isConnected || isStateLoading} className={` text-xs md:text-lg  border-2 ${isStateLoading ? "cursor-not-allowed" : "cursor-pointer"} border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(100)}>100%</Button>
			</div>
			{isConnected ? (
				<div className="">
					<button style={{ backgroundColor: "#f5d64e" }} onClick={handleConfirmClick} className={`mt-2 text-black text-md font-semibold w-full border border-black h-10 border-none body-text
					 ${isStateLoading
							|| Math.trunc(Number(totalStakedValue) * 100) / 100 === 0
							|| Number(userInput) > Number(Math.trunc(Number(totalStakedValue) * 100) / 100) ? 'cursor-not-allowed opacity-50' : ''}`}
						disabled={isStateLoading || Math.trunc(Number(totalStakedValue) * 100) / 100 === 0 || Number(userInput) > Number(Math.trunc(Number(totalStakedValue) * 100) / 100)}>	{isStateLoading ? 'LOADING...' : 'UNSTAKE'}</button>
				</div>
			) : (
				<CustomConnectButton className="" />
			)}
			<Dialog visible={isModalVisible} onHide={() => setIsModalVisible(false)}>
				<div className="waiting-container bg-white">
					<div className="waiting-message text-lg title-text text-white whitespace-nowrap">Waiting for Confirmation... ✨</div>
					<Image src={BotanixLOGO} className="waiting-image" alt="gif" />
				</div>
			</Dialog>
			<Dialog visible={userModal} onHide={() => setUserModal(false)} header={renderHeader}>
				<div className="waiting-container bg-white">
					<div className="waiting-message text-lg title-text text-white whitespace-nowrap">{message}</div>
					<Button className="p-button-rounded p-button-text" onClick={() => setUserModal(false)}>Close</Button>
				</div>
			</Dialog>
			<Dialog visible={loadingModalVisible} onHide={() => setLoadingModalVisible(false)}>
				<div className="waiting-container bg-white">
					<div className="waiting-message text-lg title-text text-white whitespace-nowrap">{loadingMessage}</div>
					{isSuccess && (<Button className="p-button-rounded p-button-text" onClick={handleClose}>Close</Button>
					)}
					{!isSuccess && showCloseButton && (
						<Button className="p-button-rounded p-button-text" onClick={handleClose}>Close</Button>
					)}
				</div>
			</Dialog>
		</div>
	);
};
