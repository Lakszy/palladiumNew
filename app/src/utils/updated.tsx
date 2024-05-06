"use client";

import Decimal from "decimal.js";
import { ethers } from "ethers";
import { useState } from "react";
import { useWalletClient } from "wagmi";
import web3 from "web3";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import borrowerOperationAbi from "../constants/abi/BorrowerOperations.sol.json"
import hintHelpersAbi from "../constants/abi/HintHelpers.sol.json";
import sortedTroveAbi from "../constants/abi/SortedTroves.sol.json";
import troveManagerAbi from "../constants/abi/TroveManager.sol.json";
import botanixTestnet from "../constants/botanixTestnet.json";
import { getContract } from "../utils/getContract";

export const OpenTrove = () => {
	const [userInputs, setUserInputs] = useState({
		collatoral: "0",
		borrow: "0",
	});

	const { data: walletClient } = useWalletClient();

	const provider = new ethers.JsonRpcProvider("https://node.botanixlabs.dev");

	const troveManagerContract = getContract(
		botanixTestnet.addresses.troveManager,
		troveManagerAbi,
		provider
	);

	const sortedTrovesContract = getContract(
		botanixTestnet.addresses.sortedTroves,
		sortedTroveAbi,
		provider
	);

	const hintHelpersContract = getContract(
		botanixTestnet.addresses.hintHelpers,
		hintHelpersAbi,
		provider
	);

	const borrowerOperationsContract = getContract(
		botanixTestnet.addresses.borrowerOperations,
		borrowerOperationAbi,
		walletClient // We are using walletClient because we need to update/modify data in blockchain.
	);

	const { toWei, toBigInt } = web3.utils;

	const collatoralRatio =
		(Number(userInputs.collatoral) / Number(userInputs.borrow)) * 100;

	let liquidationReserve = "0";
	let expectedFee = "0";
	let expectedDebt = "0";
	let _1e20 = "0";
	let numTroves = 0;
	let numTrials = 0;

	const handleConfirmClick = async () => {
		const pow = Decimal.pow(10, 18);

		const collatoralBeforeConv = new Decimal(userInputs.collatoral);
		const borrowBeforeConv = new Decimal(userInputs.borrow);

		const collatoralValue = collatoralBeforeConv.mul(pow).toFixed();
		const borrowValue = borrowBeforeConv.mul(pow).toFixed();
		const liquidationReserve = await troveManagerContract.LUSD_GAS_COMPENSATION();

		const expectedFee = await troveManagerContract.getBorrowingFeeWithDecay(
			borrowValue
		);

		const expectedDebt = borrowValue + BigInt(expectedFee) + BigInt(liquidationReserve);

		const _1e20Before = new Decimal(100);
		_1e20 = _1e20Before.mul(pow).toFixed();
		let NICR = (BigInt(collatoralValue) * BigInt(_1e20)) / BigInt(expectedDebt);

		const numTroves = await sortedTrovesContract.getSize();
		const numTrials = numTroves * toBigInt("15");

		const { 0: approxHint } = await hintHelpersContract.getApproxHint(
			NICR,
			numTrials,
			42
		); // random seed of 42

		const { 0: upperHint, 1: lowerHint } =
			await sortedTrovesContract.findInsertPosition(
				NICR,
				approxHint,
				approxHint
			);
		const maxFee = "6".concat("0".repeat(16)); // Slippage protection: 5%
		await borrowerOperationsContract.openTrove(
			maxFee,
			borrowValue,
			upperHint,
			lowerHint,
			{ value: collatoralValue }
		);
	};

	const handleValueChange = async (values: {
		collatoral: string;
		borrow: string;
	}) => {
		setUserInputs(values);

		const pow = Decimal.pow(10, 18);

		const collatoralBeforeConv = new Decimal(values.collatoral);
		const borrowBeforeConv = new Decimal(values.borrow);

		const collatoralValue = collatoralBeforeConv.mul(pow).toFixed();
		const borrowValue = borrowBeforeConv.mul(pow).toFixed();

		liquidationReserve = await troveManagerContract.LUSD_GAS_COMPENSATION();
		expectedFee = await troveManagerContract.getBorrowingFeeWithDecay(
			borrowValue
		);

		expectedDebt = borrowValue + BigInt(expectedFee) + BigInt(liquidationReserve);
		const _1e20Before = new Decimal(100);

		_1e20 = _1e20Before.mul(pow).toFixed();
		let NICR = (BigInt(collatoralValue) * BigInt(_1e20)) / BigInt(expectedDebt);
		numTroves = await sortedTrovesContract.getSize();
		numTrials = Number(numTroves) * Number(15);

		const { 0: approxHint } = await hintHelpersContract.getApproxHint(
			NICR,
			numTrials,
			42
		); // random seed of 42
		const { 0: upperHint, 1: lowerHint } =
			await sortedTrovesContract.findInsertPosition(
				NICR,
				approxHint,
				approxHint
			);
		const maxFee = "6".concat("0".repeat(16)); // Slippage protection: 5%
	};

	return (
		<div className="grid w-full max-w-sm items-start gap-2 mx-auto mt-44 border rounded-md border-black p-5">
			<div className="relative">
				<Label htmlFor="items">Collatoral</Label>
				<div className="flex items-center space-x-2">
					<Input
						id="items"
						placeholder="0.000 BTC"
						value={userInputs.collatoral}
						onChange={(e) => {
							handleValueChange({
								...userInputs,
								collatoral: e.target.value,
							});
						}}
					/>
					<Button className="w-10" size="sm" variant="outline">
						Max
					</Button>
				</div>
			</div>
			<div className="relative">
				<Label htmlFor="quantity">Borrow</Label>
				<div className="flex items-center space-x-2">
					<Input
						id="quantity"
						placeholder="0.00 PUSD"
						value={userInputs.borrow}
						onChange={(e) => {
							handleValueChange({ ...userInputs, borrow: e.target.value });
						}}
					/>
					<Button className="rounded-l-none" size="sm" variant="outline">
						+
					</Button>
					<Button size="sm" variant="outline">
						-
					</Button>
				</div>
				<div className="flex flex-col gap-2 mt-4">
					<div className="flex flex-col">
						<span>Liquidation Reserve</span>
						<span>{liquidationReserve} PUSD</span>
					</div>
					<div className="flex flex-col">
						<span>Borrowing Fee</span>
						<span>{expectedFee} PUSD</span>
					</div>
					<div className="flex flex-col">
						<span>Total Debt</span>
						<span>{expectedDebt} PUSD</span>
					</div>
					<div className="flex flex-col">
						<span>Collatoral Ratio</span>
						<span className="text-green-500">{collatoralRatio}%</span>
					</div>
				</div>

				<Button onClick={handleConfirmClick} className="mt-5">
					Confirm
				</Button>
			</div>
		</div>
	);
};
