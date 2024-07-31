/* eslint-disable */
"use client";
import stabilityPoolAbi from "../../app/src/constants/abi/StabilityPool.sol.json";
import { BOTANIX_RPC_URL } from "../../app/src/constants/botanixRpcUrl";
import botanixTestnet from "../../app/src/constants/botanixTestnet.json";
import info from "../../app/assets/images/info.svg"
import { getContract } from "../../app/src/utils/getContract";
import { ethers } from "ethers";
import Image from "next/image";
import "../../components/stabilityPool/Modal.css"
import { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import "../../app/App.css"
import { Tooltip } from "primereact/tooltip";

const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);
export const StabilityStats = () => {
	const [loanRewards, setLoanRewards] = useState("0");
	const [liquidGains, setLiquidGains] = useState("0");

	const [totalStakedValue, setTotalStakedValue] = useState("0");
	const [totalStabilityPool, setTotalStabilityPool] = useState("0");
	const [isLoading, setIsLoading] = useState(true);
	const [isPoolLoading, setIsPoolLoading] = useState(true);
	const { data: walletClient } = useWalletClient();

	const stabilityPoolContractReadOnly = getContract(
		botanixTestnet.addresses.stabilityPool,
		stabilityPoolAbi,
		provider
	);

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
		const totalStabilityPool = async () => {
			if (!walletClient) return null;
			const fetchedTotalStakedValue =
				await stabilityPoolContractReadOnly.getTotalLUSDDeposits();

			const fixedtotal = ethers.formatUnits(fetchedTotalStakedValue, 18);
			setTotalStabilityPool(fixedtotal);
			setIsPoolLoading(false)
		};
		getStakedValue();
		totalStabilityPool();
	}, [walletClient]);

	const stakedValue = parseFloat(totalStakedValue);
	const stabilityPoolValue = parseFloat(totalStabilityPool);
	const poolShare = (stakedValue / stabilityPoolValue) * 100;

	return (
		<div className="bg-[#272315]">
			<div>
				<div className="flex justify-center">
					<h2 className="font-bold text-sm my-3 text-yellow-400 title-text">Stability Pool</h2>
				</div>

				<div className="flex justify-between py-2">
					<div className="flex">
						<span className="text-[#827f77] font-medium text-sm ml body-text">
							Your Total Staking Balance
						</span>
						<Image
							width={15}
							className="toolTipHolding ml_5"
							src={info}
							data-pr-tooltip="The displayed portfolio balance has already accounted for the vault performance fee."
							alt="info"
						/>
						<Tooltip
							className="custom-tooltip title-text2"
							target=".toolTipHolding"
							mouseTrack
							mouseTrackLeft={10}
						/>
					</div>
					<span className="text-white font-medium ml-7 text-sm body-text whitespace-nowrap">
						{isLoading ? (
							<div className="h-3 rounded-xl">
								<div className="hex2-loader"></div>
							</div>
						) : (
							<>{(Number(totalStakedValue).toFixed(2)).toString()} PUSD</>
						)}
					</span>
				</div>

				<div className="flex justify-between py-2">
					<div className="flex">
						<span className="text-[#827f77] text-sm font-medium body-text">
							Total Stability Pool Staked
						</span>
						<Image
							width={15}
							className="toolTipHolding ml_5 "
							src={info}
							data-pr-tooltip="The displayed portfolio balance has already accounted for the vault performance fee."
							alt="info"
						/>
						<Tooltip
							className="custom-tooltip title-text2"
							target=".toolTipHolding"
							mouseTrack
							mouseTrackLeft={10}
						/>
					</div>
					<span className="text-white font-medium text-sm body-text">
						{isPoolLoading ? (
							<div className="h-3 rounded-xl">
								<div className="hex2-loader"></div>
							</div>
						) : (
							<>{(Number(totalStabilityPool).toFixed(2)).toString()} PUSD</>
						)}
					</span>
				</div>

				<div className="flex justify-between py-2">
					<div className="flex">
						<span className="text-[#827f77] text-sm font-medium body-text">
							Your Pool Share
						</span>
						<Image
							width={15}
							className="toolTipHolding ml_5"
							src={info}
							data-pr-tooltip="The displayed portfolio balance has already accounted for the vault performance fee."
							alt="info"
						/>
						<Tooltip
							className="custom-tooltip title-text2"
							target=".toolTipHolding"
							mouseTrack
							mouseTrackLeft={10}
						/>
					</div>
					<span className="text-white text-sm font-medium body-text">
						{isLoading && isPoolLoading ? (
							<div className="h-3 rounded-xl">
								<div className="hex2-loader"></div>
							</div>
						) : (
							<>{isNaN(poolShare) ? "0" : poolShare.toFixed(2)}%</>
						)}
					</span>
				</div>

				<div className="flex justify-center">
					<h2 className="font-bold text-yellow-400 my-3 text-sm title-text">Your Rewards</h2>
				</div>

				<div className="flex justify-between py-2">
					<div className="flex">
						<span className="text-[#827f77] text-sm font-medium body-text">
							Liquidation Gains
						</span>
						<Image
							width={15}
							className="toolTipHolding ml_5"
							src={info}
							data-pr-tooltip="The displayed portfolio balance has already accounted for the vault performance fee."
							alt="info"
						/>
						<Tooltip
							className="custom-tooltip title-text2"
							target=".toolTipHolding"
							mouseTrack
							mouseTrackLeft={10}
						/>
					</div>
					<span className="text-white font-medium text-sm body-text">
						{liquidGains.toString()} BTC
					</span>
				</div>

				<div className="flex justify-between py-2">
					<div className="flex">

						<span className="text-[#827f77] text-sm font-medium body-text">
							PDM Rewards
						</span>
						<Image
							width={15}
							className="toolTipHolding ml_5"
							src={info}
							data-pr-tooltip="The displayed portfolio balance has already accounted for the vault performance fee."
							alt="info"
						/>
						<Tooltip
							className="custom-tooltip title-text2"
							target=".toolTipHolding"
							mouseTrack
							mouseTrackLeft={10}
						/>
					</div>
					<span className="text-white text-sm font-medium body-text">
						{loanRewards.toString()} PDM
					</span>
				</div>
			</div>
		</div>
	);
};
