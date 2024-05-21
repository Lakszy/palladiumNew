// /* eslint-disable */

// "use client";

// import stabilityPoolAbi from "../../app/src/constants/abi/StabilityPool.sol.json";
// import erc20Abi from "../../app/src/constants/abi/ERC20.sol.json";
// import { StabilityPoolbi } from "@/app/src/constants/abi/StabilityPoolbi";
// import { BOTANIX_RPC_URL } from "../../app/src/constants/botanixRpcUrl";
// import { config } from "@/app/src/config/config";
// import botanixTestnet from "../../app/src/constants/botanixTestnet.json";
// import { getContract } from "../../app/src/utils/getContract";
// import Decimal from "decimal.js";
// import { ethers } from "ethers";
// import { useEffect, useState } from "react";
// import { useWalletClient, useWaitForTransactionReceipt, useWriteContract, useContractWrite } from "wagmi";
// import { CustomConnectButton } from "../connectBtn";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { useAccount } from 'wagmi';
// import { Dialog } from 'primereact/dialog';
// import BotanixLOGO from "../../app/assets/images/newpalladium.svg"
// import Image from "next/image";
// import "./Modal.css"
// import "../../app/App.css"



// export const StabilityPool = () => {
// 	const [userInput, setUserInput] = useState("0");
// 	const [isLowDebt, setIsLowDebt] = useState(false);
// 	const [pusdBalance, setPusdBalance] = useState("0");
// 	const { address, isConnected } = useAccount();
// 	const [isDataLoading, setIsDataLoading] = useState(true);
// 	const [isModalVisible, setIsModalVisible] = useState(false);
// 	const [userModal, setUserModal] = useState(false);
// 	const [message, setMessage] = useState("Transaction accepted")


// 	const { data: walletClient } = useWalletClient();
// 	const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);

// 	const stabilityPoolContract = getContract(botanixTestnet.addresses.stabilityPool, stabilityPoolAbi, walletClient);
// 	const erc20Contract = getContract(botanixTestnet.addresses.pusdToken, erc20Abi, provider);

// 	const { data: hash, writeContract } = useWriteContract()
// 	const { isLoading, isSuccess } =
// 		useWaitForTransactionReceipt({ hash })

// 	const handlePercentageClick = (percentage: any) => {
// 		const pow = Decimal.pow(10, 18);
// 		const percentageDecimal = new Decimal(percentage).div(100);
// 		const pusdBalanceNumber = parseFloat(pusdBalance);
// 		if (!isNaN(pusdBalanceNumber)) {
// 			const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
// 			const stakeFixed = maxStake;
// 			const roundedStakeFixed = Number(stakeFixed.toFixed(2))
// 			setUserInput(String(roundedStakeFixed));
// 		} else {
// 			console.error("Invalid PUSD balance:", pusdBalance);
// 		}
// 	};

// 	useEffect(() => {
// 		const fetchPrice = async () => {
// 			const pusdBalanceValue = await erc20Contract.balanceOf(address);
// 			const pusdBalanceFormatted = ethers.formatUnits(pusdBalanceValue, 18);
// 			setPusdBalance(pusdBalanceFormatted);
// 			setIsDataLoading(false);
// 		};
// 		fetchPrice();
// 	}, [address, walletClient]);


// 	const handleConfirmClick = async () => {
// 		try {
// 			setIsModalVisible(true);
// 			const pow = Decimal.pow(10, 18);
// 			const inputBeforeConv = new Decimal(userInput);
// 			const inputValue = inputBeforeConv.mul(pow).toFixed();
// 			const inputBigInt = BigInt(inputValue);

// 			let addressToPass = "0x0000000000000000000000000000000000000000";

// 			console.log("start")

// 			const result =  writeContract({
// 				abi: StabilityPoolbi,
// 				address: '0xb5d2f71f2B1506Ec243D0B232EB15492d685B689',
// 				functionName: 'provideToSP',
// 				args: [
// 					inputBigInt,
// 					'0x0000000000000000000000000000000000000000',
// 				],
// 			})
// 			console.log('Transaction hash:', hash);
// 			setIsModalVisible(false);
// 		} catch (error) {
// 			console.error(error);
// 		}
// 	};


// 	// const handleConfirmClick = async () => {
// 	// 	try {
// 	// 		console.log('Starting transaction...');
// 	// 		setIsModalVisible(true);
// 	// 		const pow = Decimal.pow(10, 18);
// 	// 		const inputBeforeConv = new Decimal(userInput);
// 	// 		const inputValue = inputBeforeConv.mul(pow).toFixed();

// 	// 		let addressToPass = "0x0000000000000000000000000000000000000000";

// 	// 		console.log(`Sending transaction with value: ${inputValue}`);

// 	// 		const txResponse = await stabilityPoolContract.provideToSP(
// 	// 			inputValue,
// 	// 			addressToPass
// 	// 		);

// 	// 		if (txResponse && txResponse.hash) {
// 	// 			console.log(`Transaction sent, waiting for receipt. Hash: ${txResponse.hash}`);

// 	// 			const txReceipt = await provider.waitForTransaction(txResponse.hash);

// 	// 			if (txReceipt && txReceipt.status === 1) {
// 	// 				console.log('Transaction mined, checking logs...');

// 	// 				const event = stabilityPoolContract.interface.parseLog(txReceipt.logs[0]);

// 	// 				if (event?.name === 'expectedEventName') {
// 	// 					console.log('Expected event found, transaction successful');

// 	// 					setMessage('Transaction accepted');

// 	// 				} else {

// 	// 					console.log('Expected event not found, transaction failed');
// 	// 					setMessage('Transaction failed or rejected');
// 	// 				}
// 	// 			} else {

// 	// 				console.log('Transaction mined but failed');
// 	// 				setMessage('Transaction failed or rejected');
// 	// 			}

// 	// 			setUserModal(true);

// 	// 		} else {
// 	// 			console.error('Invalid transaction response:', txResponse);
// 	// 		}
// 	// 		setIsModalVisible(false);

// 	// 	} catch (error) {
// 	// 		console.error('Error sending transaction:', error);
// 	// 		setMessage('Transaction rejected');
// 	// 		setUserModal(true)
// 	// 		setIsModalVisible(false);
// 	// 	}
// 	// };

// 	useEffect(() => {
// 		if (isSuccess) {
// 			setIsModalVisible(false);
// 		}
// 	}, [isSuccess]);

// 	useEffect(() => {
// 		if (isLoading) {
// 			setIsModalVisible(true);
// 		}
// 	}, [isLoading]);

// 	console.log(isSuccess, isLoading, " opF")
// 	const renderHeader = () => {
// 		return (
// 			<div className="flex justify-content-between align-items-center">
// 				<Button className="p-button-rounded p-button-text" onClick={() => setUserModal(false)}>
// 					Close
// 				</Button>
// 			</div>
// 		);
// 	};
// 	return (
// 		<div className="grid  bg-[#3b351b] items-start h-64 gap-2 mx-auto border border-yellow-400 p-5">
// 			<div className="">
// 				<div className="flex -mt-2 mb-2  items-center">
// 					<Input id="items"
// 						placeholder="0.000 BTC"
// 						disabled={!isConnected}
// 						value={userInput}
// 						onChange={(e) => {
// 							const input = e.target.value;
// 							setUserInput(input);
// 						}}
// 						className="bg-[#3b351b] body-text text-lg h-14 border border-yellow-300 text-white px-3 " />
// 				</div>
// 				<span className={"ml-[55%] body-text font-medium balance " + (Number(userInput) > Math.trunc(Number(pusdBalance) * 100) / 100 ? "text-red-500" : "text-yellow-300")}>
// 					{isDataLoading ? (
// 						<div className="text-left w-full  -mt-6 h-2">
// 							<div className="hex-loader"></div>
// 						</div>
// 					) : (
// 						< span className="whitespace-nowrap body-text">
// 							<span className="text-gray-400 body-text">
// 								Wallet:{" "}
// 							</span>
// 							{Math.trunc(Number(pusdBalance) * 100) / 100} PUSD</  span>
// 					)}
// 				</span>
// 			</div>
// 			<div className="flex w-full gap-x-4 md:gap-x-6  mt-2">
// 				<Button disabled={!isConnected || isDataLoading} className={`text-xs md:text-lg border-2 border-yellow-900 body-text ${isDataLoading ? 'cursor-not-allowed' : ''}`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(25)}>25%</Button>
// 				<Button disabled={!isConnected || isDataLoading} className={`text-xs md:text-lg border-2 border-yellow-900 body-text ${isDataLoading ? 'cursor-not-allowed' : ''}`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(50)}>50%</Button>
// 				<Button disabled={!isConnected || isDataLoading} className={`text-xs md:text-lg border-2 border-yellow-900 body-text ${isDataLoading ? 'cursor-not-allowed' : ''}`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(75)}>75%</Button>
// 				<Button disabled={!isConnected || isDataLoading} className={`text-xs md:text-lg border-2 border-yellow-900 body-text ${isDataLoading ? 'cursor-not-allowed' : ''}`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(100)}>100%</Button>
// 			</div>
// 			{isConnected ? (
// 				<div className="">
// 					<button

// 						style={{ backgroundColor: "#f5d64e" }}
// 						onClick={handleConfirmClick}
// 						className={`mt-2 text-black text-md font-semibold w-full border border-black h-10 body-text border-none 
// 						${isDataLoading || Number(userInput) > Number(Math.trunc(Number(pusdBalance) * 100) / 100)
// 								? 'cursor-not-allowed opacity-50' : ''
// 							}`}
// 						disabled={isDataLoading || Number(userInput) > Number(Math.trunc(Number(pusdBalance) * 100) / 100)}
// 					>
// 						{isDataLoading ? 'LOADING...' : 'STAKE'}
// 					</button>

// 				</div>
// 			) : (
// 				<CustomConnectButton className="" />
// 			)}
// 			<Dialog visible={isModalVisible} onHide={() => setIsModalVisible(false)}>
// 				<>
// 					<div className="waiting-container bg-white">
// 						<div className="waiting-message text-lg title-text text-white whitespace-nowrap">Waiting for Confirmation... ✨.</div>
// 						<Image src={BotanixLOGO} className="waiting-image" alt="gif" />
// 					</div>
// 				</>
// 			</Dialog>
// 			<Dialog visible={userModal} onHide={() => setUserModal(false)} header={renderHeader}>
// 				<div className="waiting-container bg-white">
// 					<div className="waiting-message text-lg title-text text-white whitespace-nowrap">
// 						{message}
// 					</div>
// 				</div>
// 			</Dialog>
// 		</div>
// 	);
// };

