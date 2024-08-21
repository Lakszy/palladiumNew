"use client";

import erc20Abi from "../../app/src/constants/abi/ERC20.sol.json";
import { StabilityPoolbi } from "@/app/src/constants/abi/StabilityPoolbi";
import { BOTANIX_RPC_URL } from "../../app/src/constants/botanixRpcUrl";
import botanixTestnet from "../../app/src/constants/botanixTestnet.json";
import { getContract } from "../../app/src/utils/getContract";
import Decimal from "decimal.js";
import { ethers } from "ethers";
import rej from "../../app/assets/images/TxnError.gif";
import { useCallback, useEffect, useState } from "react";
import { useWalletClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { CustomConnectButton } from "../connectBtn";
import { Button } from "../ui/button";
import { useAccount } from 'wagmi';
import { Dialog } from 'primereact/dialog';
import "./stake.css"
import img3 from "../../app/assets/images/Group 663.svg";
import conf from "../../app/assets/images/conf.gif"
import rec2 from "../../app/assets/images/rec2.gif"
import tick from "../../app/assets/images/tick.gif"
import Image from "next/image";
import "./Modal.css"
import "../../app/App.css"
import { useAccounts, useETHProvider } from "@particle-network/btc-connectkit";
import WalletConnection from "../Connect/MutliConnectModal";

export const StabilityPool = () => {
	const [userInput, setUserInput] = useState("0");
	const [pusdBalance, setPusdBalance] = useState("0");
	const { address, isConnected } = useAccount();
	const { accounts } = useAccounts();
	const [isDataLoading, setIsDataLoading] = useState(true);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [userModal, setUserModal] = useState(false);
	const [message, setMessage] = useState("");
	const { account, getSmartAccountInfo, chainId } = useETHProvider();
	const [loadingModalVisible, setLoadingModalVisible] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState("");
	const [showCloseButton, setShowCloseButton] = useState(false);
	const { data: walletClient } = useWalletClient();
	const [walletAdd, setWalletAdd] = useState<any>()
	const [transactionRejected, setTransactionRejected] = useState(false);
	const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);
	const erc20Contract = getContract(
		botanixTestnet.addresses.lusdToken,
		erc20Abi,
		provider
	);
	const { data: hash, writeContract, error: writeError } = useWriteContract()
	const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });


	useEffect(() => {
		if (isLoading) {
			setIsModalVisible(false);
			setLoadingMessage("Waiting for transaction to confirm..");
			setLoadingModalVisible(true);
		} else if (isSuccess) {
			setLoadingMessage("Stake Transaction completed successfully");
			setLoadingModalVisible(true);
		} else if (transactionRejected) {
			setLoadingMessage("Transaction was rejected");
			setLoadingModalVisible(true);
		} else {
			setLoadingModalVisible(false);
		}
	}, [isSuccess, isLoading, transactionRejected]);

	const handlePercentageClick = (percentage: any) => {
		const percentageDecimal = new Decimal(percentage).div(100);
		const pusdBalanceNumber = parseFloat(pusdBalance);
		if (!isNaN(pusdBalanceNumber)) {
			const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
			const stakeFixed = maxStake;
			const roundedStakeFixed = Number(stakeFixed.toFixed(2));
			setUserInput(String(roundedStakeFixed));
		} else {
			console.error("Invalid PUSD balance:", pusdBalance);
		}
	};

	const fetchPrice = async () => {
		const accountInfo = await getSmartAccountInfo();
		const walletAddress = accountInfo?.smartAccountAddress as unknown as `0x${string}`;
		setWalletAdd(walletAddress)
		const pusdBalanceValue = await erc20Contract.balanceOf(walletAddress);
		const pusdBalanceFormatted = ethers.formatUnits(pusdBalanceValue, 18);
		setPusdBalance(pusdBalanceFormatted);
		// setAfterload(false);
		setIsDataLoading(false);
	};
	useEffect(() => {
		fetchPrice();
	}, [fetchPrice, address, walletClient, writeContract, hash]);


	const handleClose = useCallback(() => {
		setLoadingModalVisible(false);
		setUserModal(false);
		setIsModalVisible(false);
		setTransactionRejected(false);
		window.location.reload();
	}, []);

	const handleConfirmClick = async () => {
		try {
			setIsModalVisible(true);
			const pow = Decimal.pow(10, 18);
			const inputBeforeConv = new Decimal(userInput);
			const inputValue = inputBeforeConv.mul(pow).toFixed();
			const inputBigInt = BigInt(inputValue);
			writeContract({
				abi: StabilityPoolbi,
				address: '0x8FBa9ab010923d3E1c60eD34DAE255A2E7b98Edc',
				functionName: 'provideToSP',
				args: [
					inputBigInt,
					'0x0000000000000000000000000000000000000000',
				],
			});
		} catch (error) {
			console.error('Error sending transaction:', error);
			setTransactionRejected(true);
			setUserModal(true)
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
		<div className="grid bg-[#272315] items-start h-66 gap-2 mx-auto border border-yellow-400 p-7">
			<div className="">
				<div className="flex items-center mb-2 mt-4 md:-ml-0 -ml- border border-yellow-300" style={{ backgroundColor: "#272315" }}>
					<div className='flex items-center h-[3.5rem]'>
						<Image src={img3} alt="home" className='ml-1' width={30} />
						<h3 className='text-white body-text ml-1 hidden md:block'>PUSD</h3>
						<h3 className='h-full border border-yellow-300 mx-3 text-yellow-300'></h3>
						<div className="justify-between items-center flex gap-x-24">
							<input id="items" placeholder='Enter Collateral Amount' disabled={!isConnected} value={userInput} onChange={(e) => { const input = e.target.value; setUserInput(input); }} className="body-text text-sm whitespace-nowrap ml-1 text-white" style={{ backgroundColor: "#272315" }} />
						</div>
					</div>
				</div>
				<div className="flex justify-end">
					<span className={"body-text font-medium balance " + (Number(userInput) > Math.trunc(Number(pusdBalance) * 100) / 100 ? "text-red-500" : "text-gray-400")}>
						{isDataLoading && (isConnected || accounts.length > 0) ? (
							<div className="mr-[82px]">
								<div className="text-left w-full h-2">
									<div className="hex-loader"></div>
								</div>
							</div>
						) : (
							<span className="whitespace-nowrap body-text">
								<span className="text-gray-400 body-text">Wallet:{" "}</span>
								{Math.trunc(Number(pusdBalance) * 100) / 100} PUSD
							</span>
						)}
					</span>
				</div>
			</div>
			<div className="flex w-full justify-between gap-x-2 md:gap-x-6  mt-2 mb-2">
				<Button>{walletAdd}</Button>
				<Button disabled={!isConnected || isDataLoading} className={`text-xs md:text-lg border-2 border-yellow-300 body-text ${isDataLoading ? 'cursor-not-allowed' : ''}`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(25)}>25%</Button>
				<Button disabled={!isConnected || isDataLoading} className={`text-xs md:text-lg border-2 border-yellow-300 body-text ${isDataLoading ? 'cursor-not-allowed' : ''}`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(50)}>50%</Button>
				<Button disabled={!isConnected || isDataLoading} className={`text-xs md:text-lg border-2 border-yellow-300 body-text ${isDataLoading ? 'cursor-not-allowed' : ''}`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(75)}>75%</Button>
				<Button disabled={!isConnected || isDataLoading} className={`text-xs md:text-lg border-2 border-yellow-300 body-text ${isDataLoading ? 'cursor-not-allowed' : ''}`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(100)}>100%</Button>
			</div>
			{isConnected || accounts.length > 0 ? (
				<div className=" my-2">
					<button style={{ backgroundColor: "#f5d64e" }} onClick={handleConfirmClick}
						className={`mt-2 text-black text-md font-semibold w-full border border-black h-10 title-text border-none 
                            ${isDataLoading || Number(userInput) <= 0 || Number(userInput) > Number(Math.trunc(Number(pusdBalance) * 100) / 100)
								? 'cursor-not-allowed opacity-50' : 'hover:scale-95 '}`}
						disabled={isDataLoading || Number(userInput) <= 0 || Number(userInput) > Number(Math.trunc(Number(pusdBalance) * 100) / 100)}>
						{isDataLoading ? 'LOADING...' : 'STAKE'}</button>
				</div>
			) : (
				<WalletConnection isConnected={isConnected} accounts={accounts} />
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
							) : loadingMessage === 'Stake Transaction completed successfully' ? (
								<Image src={tick} alt="tick" width={200} />
							) : transactionRejected ? (
								<Image src={rej} alt="rejected" width={140} />
							) : (
								<Image src={conf} alt="box" width={140} />
							)}
							<div className="waiting-message title-text2  text-yellow-300 ">{loadingMessage}</div>
							<div className="pb-5">
								{isSuccess && (
									<button className="mt-1 p-3 text-black title-text2 hover:scale-95 bg-[#f5d64e]" onClick={handleClose}>Go Back to the Stake Page</button>
								)}
								{(transactionRejected || (!isSuccess && showCloseButton)) && (
									<>
										<p className="body-text text-white text-xs">{transactionRejected ? "Transaction was rejected. Please try again." : "Some Error Occurred On Network Please Try Again After Some Time.. 🤖"}</p>
										<Button className=" mt-1 p-3 text-black rounded-none md:w-[20rem] hover:bg-yellow-400 title-text2 hover:scale-95 bg-[#f5d64e]" onClick={handleClose}>Try again</Button>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</Dialog>
		</div>
	);
};
