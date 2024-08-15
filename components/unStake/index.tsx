"use client";

import stabilityPoolAbi from "../../app/src/constants/abi/StabilityPool.sol.json";
import { BOTANIX_RPC_URL } from "../../app/src/constants/botanixRpcUrl";
import botanixTestnet from "../../app/src/constants/botanixTestnet.json";
import { getContract } from "../../app/src/utils/getContract";
import img3 from "../../app/assets/images/Group 663.svg";
import conf from "../../app/assets/images/conf.gif"
import rec2 from "../../app/assets/images/rec2.gif"
import tick from "../../app/assets/images/tick.gif"
import rej from "../../app/assets/images/TxnError.gif";
import Decimal from "decimal.js";
import "./unstake.css"
import { ethers } from "ethers";
import { useEffect, useState, useCallback } from "react";
import { useAccount, useWaitForTransactionReceipt, useWalletClient, useWriteContract } from "wagmi";
import { Button } from "../ui/button";
import { Dialog } from 'primereact/dialog';
import Image from "next/image";
import { CustomConnectButton } from "../connectBtn";
import "../../app/App.css"
import "../../components/stabilityPool/Modal.css"
import { StabilityPoolbi } from "@/app/src/constants/abi/StabilityPoolbi";

export const Unstake = () => {
	const [userInput, setUserInput] = useState("0");
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
	const { data: walletClient } = useWalletClient();
	const { data: hash, writeContract, error: writeError } = useWriteContract()
	const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
	const [transactionRejected, setTransactionRejected] = useState(false);

	const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);
	const stabilityPoolContractReadOnly = getContract(botanixTestnet.addresses.stabilityPool, stabilityPoolAbi, provider);
	const stabilityPoolContract = getContract(botanixTestnet.addresses.stabilityPool, stabilityPoolAbi, walletClient);

	useEffect(() => {
		if (isLoading) {
			setIsModalVisible(false);
			setLoadingMessage("Waiting for transaction to confirm..");
			setLoadingModalVisible(true);
		} else if (isSuccess) {
			setLoadingMessage("Unstake Transaction completed successfully");
			setLoadingModalVisible(true);
		} else if (transactionRejected) {
			setLoadingMessage("Transaction was rejected");
			setLoadingModalVisible(true);
		} else {
			setLoadingModalVisible(false);
		}
	}, [isSuccess, isLoading, transactionRejected]);

	const fetchStakedValue = useCallback(async () => {
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
	}, [walletClient, stabilityPoolContractReadOnly]);

	useEffect(() => {
		fetchStakedValue();
	}, [fetchStakedValue, writeContract, hash]);

	const handleClose = useCallback(() => {
		setLoadingModalVisible(false);
		setUserModal(false);
		setIsModalVisible(false);
		setTransactionRejected(false);
		window.location.reload();
	}, []);

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

			await writeContract({
				abi: StabilityPoolbi,
				address: '0x8FBa9ab010923d3E1c60eD34DAE255A2E7b98Edc',
				functionName: 'withdrawFromSP',
				args: [inputBigInt]
			});

		} catch (error) {
			console.error('Error sending transaction:', error);
			setTransactionRejected(true);
			setUserModal(true);
		}
	};

	useEffect(() => {
		if (writeError) {
			console.error('Write contract error:', writeError);
			setTransactionRejected(true);
			setUserModal(true);
		}
	}, [writeError]);

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
		<>
			<div className="grid  bg-[#272315] items-start h-66 gap-2 mx-auto border-yellow-400 p-7">
				<div className="">
					<div className="flex items-center mt-4 mb-2  md:-ml-0 -ml-  border border-yellow-300 " style={{ backgroundColor: "#272315" }}>
						<div className='flex  items-center h-[3.5rem] '>
							<Image src={img3} alt="home" className='ml-1' width={30} />
							<h3 className='text-white body-text ml-1 hidden md:block'>PUSD</h3>
							<h3 className='h-full border border-yellow-300 mx-3 text-yellow-300'></h3>
							<div className=" justify-between items-center flex gap-x-24">
								<input id="items" placeholder="0.000 BTC" disabled={!isConnected} value={userInput} onChange={(e) => { const input = e.target.value; setUserInput(input); }} className="body-text text-sm whitespace-nowrap ml-1  text-white" style={{ backgroundColor: "#272315" }} />
							</div>
						</div>
					</div>
					<div className="flex justify-end">
						<span className={"font-medium balance body-text " + (Number(userInput) > Math.trunc(Number(totalStakedValue) * 100) / 100 ? "text-red-500" : "text-gray-400")}>
							{isStateLoading ?
								(
									<div className="mr-[82px]">
										<div className=" h-2 rounded-2xl">
											<div className="hex-loader"></div>
										</div>
									</div>
								) : (
									<span className="whitespace-nowrap"><span className="text-gray-400 body-text">	Your Stake: {" "}</span>
										<span className="body-text">
											{Math.trunc(Number(totalStakedValue) * 100) / 100} PUSD
										</span>
									</span>
								)}
						</span>
					</div>
				</div>
				<div className="flex w-full justify-between mt-2 mb-2">
					<Button disabled={!isConnected || isStateLoading} className={`text-xs md:text-lg  border-2 ${isStateLoading ? "cursor-not-allowed" : "cursor-pointer"} border-yellow-300 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(25)}>25%</Button>
					<Button disabled={!isConnected || isStateLoading} className={`text-xs md:text-lg  border-2 ${isStateLoading ? "cursor-not-allowed" : "cursor-pointer"} border-yellow-300 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(50)}>50%</Button>
					<Button disabled={!isConnected || isStateLoading} className={` text-xs md:text-lg  border-2 ${isStateLoading ? "cursor-not-allowed" : "cursor-pointer"} border-yellow-300 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(75)}>75%</Button>
					<Button disabled={!isConnected || isStateLoading} className={` text-xs md:text-lg  border-2 ${isStateLoading ? "cursor-not-allowed" : "cursor-pointer"} border-yellow-300 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(100)}>100%</Button>
				</div>
				{isConnected ? (
					<div className="my-2">
						<button style={{ backgroundColor: "#f5d64e" }} onClick={handleConfirmClick} className={`mt-2 text-black title-text font-semibold w-full border border-black h-10 border-none 
					 ${isStateLoading
								|| Number(userInput) == 0
								|| Math.trunc(Number(totalStakedValue) * 100) / 100 === 0
								|| Number(userInput) > Number(Math.trunc(Number(totalStakedValue) * 100) / 100) ? 'cursor-not-allowed opacity-50' : 'hover:scale-95 '}`}
							disabled={isStateLoading || Math.trunc(Number(totalStakedValue) * 100) / 100 === 0 || Number(userInput) > Number(Math.trunc(Number(totalStakedValue) * 100) / 100)}>{isStateLoading ? 'LOADING...' : 'UNSTAKE'}</button>
					</div>
				) : (
					<CustomConnectButton className="" />
				)}
				<Dialog visible={isModalVisible} onHide={() => setIsModalVisible(false)}>
					<div className="dialog-overlay">
						<div className="dialog-content">
							<div className="py-5">
								<Image src={rec2} alt="box" width={140} className="" />
							</div>
							<div className="p-5">
								<div className="waiting-message text-lg title-text2 text-yellow-300 whitespace-nowrap">Transaction is initiated</div>
								<div className="text-sm title-text2 text-[#bebdb9] whitespace-nowrap">Please confirm in Metamask.</div>
							</div>
						</div>
					</div>
				</Dialog>
				<Dialog visible={userModal} onHide={() => setUserModal(false)} header={renderHeader}>
					<div className="dialog-overlay">
						<div className="dialog-content">
							<div className="p-5">
								<div className="waiting-message text-lg title-text text-white whitespace-nowrap">Transaction rejected</div>
								<Button className="p-button-rounded p-button-text" onClick={() => setUserModal(false)}>Close</Button>
							</div>
						</div>
					</div>
				</Dialog>
				<Dialog visible={loadingModalVisible} onHide={() => setLoadingModalVisible(false)}>
					<div className="dialog-overlay">
						<div className="dialog-content">
							<div className="p-5">
								{loadingMessage === 'Waiting for transaction to confirm..' ? (
									<>
										<Image src={conf} alt="rectangle" width={150} />
										<div className="my-5 ml-[6rem] mb-5"></div>
									</>
								) : loadingMessage === 'Unstake Transaction completed successfully' ? (
									<Image src={tick} alt="tick" width={200} />
								) : transactionRejected ? (
									<Image src={rej} alt="rejected" width={140} />
								) : (
									<Image src={conf} alt="box" width={140} />
								)}
								<div className="waiting-message title-text2 text-yellow-300">{loadingMessage}</div>
								{isSuccess && (
									<button className="mt-1 p-3 text-black title-text2 hover:scale-95 bg-[#f5d64e]" onClick={handleClose}>Go Back to the Stake Page</button>
								)}
								{(transactionRejected || (!isSuccess && showCloseButton)) && (
									<>
										<p className="body-text text-xs text-white">{transactionRejected ? "Transaction was rejected. Please try again." : "Some Error Occurred On Network Please Try Again After Some Time.. 🤖"}</p>
										<Button className=" mt-1 p-3 rounded-none hover:bg-yellow-400 text-black md:w-[20rem] title-text2 hover:scale-95 bg-[#f5d64e]" onClick={handleClose}>TRY aGain</Button>
									</>
								)}
							</div>
						</div>
					</div>
				</Dialog>
			</div>
		</>
	);
};