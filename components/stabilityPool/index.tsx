/* eslint-disable */


"use client";

import borrowerOperationAbi from "../../app/src/constants/abi/BorrowerOperations.sol.json";
import stabilityPoolAbi from "../../app/src/constants/abi/StabilityPool.sol.json";
import erc20Abi from "../../app/src/constants/abi/ERC20.sol.json";
import { BOTANIX_RPC_URL } from "../../app/src/constants/botanixRpcUrl";
import botanixTestnet from "../../app/src/constants/botanixTestnet.json";
import { getContract } from "../../app/src/utils/getContract";
import Decimal from "decimal.js";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useWalletClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import web3 from "web3";
import { CustomConnectButton } from "../connectBtn";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAccount } from 'wagmi';

import { Dialog } from 'primereact/dialog';
import BotanixLOGO from "../../app/assets/images/newpalladium.svg"
import Image from "next/image";
import "./Modal.css"
import "../../app/App.css"



export const StabilityPool = () => {
	const [userInput, setUserInput] = useState("0");
	const [isLowDebt, setIsLowDebt] = useState(false);
	const [pusdBalance, setPusdBalance] = useState("0");
	const { address, isConnected } = useAccount();
	const [isLoading, setIsLoading] = useState(true);
	const [isModalVisible, setIsModalVisible] = useState(false);

	const { data: walletClient } = useWalletClient();

	const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);

	const stabilityPoolContract = getContract(
		botanixTestnet.addresses.stabilityPool,
		stabilityPoolAbi,
		walletClient
	);
	const erc20Contract = getContract(
		botanixTestnet.addresses.pusdToken,
		erc20Abi,
		provider
	);

	const {
		data: hash,
		isPending,
		writeContract
	} = useWriteContract()

	const { isLoading: isConfirming, isSuccess: isConfirmed } =
		useWaitForTransactionReceipt({
			hash,
		})

	const borrowerOperationsContractReadOnly = getContract(
		botanixTestnet.addresses.borrowerOperations,
		borrowerOperationAbi,
		provider
	);

	const { toWei, toBigInt } = web3.utils;

	const handlePercentageClick = (percentage: any) => {
		const pow = Decimal.pow(10, 18);
		const _1e18 = toBigInt(pow.toFixed());
		const percentageDecimal = new Decimal(percentage).div(100);
		console.log(pusdBalance, "IMA FROM STEAKE")
		const pusdBalanceNumber = parseFloat(pusdBalance);
		if (!isNaN(pusdBalanceNumber)) {
			const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
			const stakeFixed = maxStake.toFixed();
			setUserInput(stakeFixed);
		} else {
			console.error("Invalid PUSD balance:", pusdBalance);
		}
	};

	useEffect(() => {
		const fetchPrice = async () => {
			const pusdBalanceValue = await erc20Contract.balanceOf(address);
			const pusdBalanceFormatted = ethers.formatUnits(pusdBalanceValue, 18);
			setPusdBalance(pusdBalanceFormatted);
		};
		fetchPrice();
		setIsLoading(false)
	}, [address, walletClient]);


	const handleConfirmClick = async () => {
		try {
			setIsModalVisible(true);

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
			setIsModalVisible(false);

		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (isConfirmed) {
			setIsModalVisible(false);
		}
	}, [isConfirmed]);

	useEffect(() => {
		if (isConfirming) {
			setIsModalVisible(true);
		}
	}, [isConfirming]);

	return (
		<div className="grid  bg-[#3b351b] items-start h-64 gap-2 mx-auto border border-yellow-400 p-5">
			<div className="">
				<div className="flex -mt-2 mb-2  items-center">
					<Input
						id="items"
						placeholder="0.000 BTC"
						disabled={!isConnected}
						value={userInput}
						onChange={(e) => {
							const input = e.target.value;
							setUserInput(input);
						}}
						className="bg-[#3b351b] body-text text-lg h-14 border border-yellow-300 text-white px-3 "
					/>
				</div>
				<span className="ml-[55%] body-text text-yellow-300 font-medium balance ">
					{isLoading ? (
						<div className="text-left w-full  -mt-6 h-2">
							<div className="hex-loader"></div>
						</div>
					) : (
						<>
							Wallet: {Number(pusdBalance).toFixed(2) || ".."} PUSD
						</>
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
					<button
						style={{ backgroundColor: "#f5d64e" }}
						onClick={handleConfirmClick}
						className="mt-2 text-black text-md font-semibold w-full border border-black h-10 body-text border-none"
					>
						STAKE
					</button>
				</div>
			) : (
				<CustomConnectButton className="" />
			)}
			<Dialog visible={isModalVisible} onHide={() => setIsModalVisible(false)}>
					<>
						<div className="waiting-container bg-white">
							<div className="waiting-message text-lg title-text text-white whitespace-nowrap">Waiting for COnformation... ✨.</div>
							<Image src={BotanixLOGO} className="waiting-image" alt="gif" />
						</div>
					</>
			</Dialog>
		</div>
	);
};
