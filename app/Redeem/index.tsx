/* eslint-disable */


"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import hintHelpersAbi from "../src/constants/abi/HintHelpers.sol.json";
import priceFeedAbi from "../src/constants/abi/PriceFeedTestnet.sol.json";
import sortedTroveAbi from "../src/constants/abi/SortedTroves.sol.json";
import troveManagerAbi from "../src/constants/abi/TroveManager.sol.json";
import { BOTANIX_RPC_URL } from "../src/constants/botanixRpcUrl";
import botanixTestnet from "../src/constants/botanixTestnet.json";
import erc20Abi from "../src/constants/abi/ERC20.sol.json"
import { getContract } from "../src/utils/getContract";
import Decimal from "decimal.js";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import web3 from "web3";
import '../App.css';
import { CustomConnectButton } from "@/components/connectBtn";

export default function Redeem() {
    const [fetchedPrice, setFetchedPrice] = useState("0");
    const [userInput, setUserInput] = useState("0");
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [pusdBalance, setPusdBalance] = useState(0);
    const {isConnected } = useAccount();

    const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);

    const { data: walletClient } = useWalletClient();

    const priceFeedContract = getContract(
        botanixTestnet.addresses.priceFeed,
        priceFeedAbi,
        provider
    );

    const erc20Contract = getContract(
        botanixTestnet.addresses.pusdToken,
        erc20Abi,
        provider
    );

    const hintHelpersContract = getContract(
        botanixTestnet.addresses.hintHelpers,
        hintHelpersAbi,
        provider
    );

    const sortedTrovesContract = getContract(
        botanixTestnet.addresses.sortedTroves,
        sortedTroveAbi,
        provider
    );

    const troveManagerContract = getContract(
        botanixTestnet.addresses.troveManager,
        troveManagerAbi,
        walletClient
    );

    const { toWei, toBigInt } = web3.utils;

    useEffect(() => {
        const fetchPrice = async () => {
            const price = await priceFeedContract.getPrice();
            console.log(price, "price");
            if (!walletClient) return null;
            const { 0: debt, 1: coll } =
                await troveManagerContract.getEntireDebtAndColl(
                    walletClient.account.address
                );

            const pusdBalanceValue = await erc20Contract.balanceOf(
                walletClient.account.address
            );
            const pusdBalanceFormatted = ethers.formatUnits(pusdBalanceValue, 18);
            setPusdBalance(Number(Number(pusdBalanceFormatted).toFixed(2)));
            const convertedPrice = price.toString();

            console.log(convertedPrice, "convertedprice");
            setFetchedPrice(convertedPrice);
        };
        fetchPrice();
    }, []);

    const handlePercentageClick = (percentage: any) => {
        const pow = Decimal.pow(10, 18);
        const _1e18 = toBigInt(pow.toFixed());
        const percentageDecimal = new Decimal(percentage).div(100);
        const pusdBalanceNumber = parseFloat(fetchedPrice);
        if (!isNaN(pusdBalanceNumber)) {
            const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
            const stakeFixed = maxStake.toFixed();
            const stakeFixedConv = (toBigInt(stakeFixed) / _1e18).toString();
            setUserInput(stakeFixedConv);
        } else {
            console.error("Not enough pusd to unstake:", pusdBalanceNumber);
        }
    };

    const handleConfirmClick = async () => {
        try {
            setIsRedeeming(true);
            const pow = Decimal.pow(10, 18);

            const inputBeforeConv = new Decimal(userInput);

            const inputValue = inputBeforeConv.mul(pow).toFixed();

            const redemptionhint = await hintHelpersContract.getRedemptionHints(
                inputValue,
                fetchedPrice,
                50
            );
            console.log(redemptionhint, "redemption");

            const {
                0: firstRedemptionHint,
                1: partialRedemptionNewICR,
                2: truncatedLUSDAmount,
            } = redemptionhint;

            const numTroves = await sortedTrovesContract.getSize();
            const numTrials = numTroves * toBigInt("15");

            console.log(numTrials, "numTrials");

            // Get the approximate partial redemption hint
            const { hintAddress: approxPartialRedemptionHint } =
                await hintHelpersContract.getApproxHint(
                    partialRedemptionNewICR,
                    numTrials,
                    42
                );

            const exactPartialRedemptionHint =
                await sortedTrovesContract.findInsertPosition(
                    partialRedemptionNewICR,
                    approxPartialRedemptionHint,
                    approxPartialRedemptionHint
                );
            const maxFee = "5".concat("0".repeat(16));

            const redeem = await troveManagerContract.redeemCollateral(
                truncatedLUSDAmount,
                firstRedemptionHint,
                exactPartialRedemptionHint[0], //upper hint
                exactPartialRedemptionHint[1], //lower hint
                partialRedemptionNewICR,
                0,
                maxFee
            );
            console.log(redeem, "redeem");
            setIsRedeeming(false);
        } catch (error) {
            console.error(error);
            setIsRedeeming(false);
        }
    };


    return (
        <>
            {isRedeeming && (
                <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-900"></div>
                </div>
            )}
            <div className="grid items-start h-64 gap-2 mx-auto border-[2px] border-yellow-400 p-5">
                <div>
                    <div className="flex -mt-2 mb-2 items-center">
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
                    <span className="ml-60 text-yellow-300 font-medium balance">Available {pusdBalance} PUSD</span>
                </div>
                <div className="flex gap-x-6 mt-2">
                    <Button className="text-lg  border-2 border-yellow-900" style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(25)}>25%</Button>
                    <Button className="text-lg  border-2 border-yellow-900" style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(50)}>50%</Button>
                    <Button className="text-lg  border-2 border-yellow-900" style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(75)}>75%</Button>
                    <Button className="text-lg  border-2 border-yellow-900" style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(100)}>100%</Button>
                </div>
                {isConnected ? (
                    <div className="">
                        <button
                            style={{ backgroundColor: "#f5d64e" }}
                            // onClick={handleConfirmClick}
                            className="mt-5 text-black text-md font-semibold w-full border border-black h-10 border-none"
                        >
                            STAKE
                        </button>
                    </div>
                ) : (
                    <CustomConnectButton />
                )}
            </div>
        </>
    );
}
