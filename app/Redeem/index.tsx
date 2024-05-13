/* eslint-disable */


"use client";
import { Button } from "@/components/ui/button";
import { readContract } from '@wagmi/core'
import { Input } from "@/components/ui/input";
import { HintHelpers } from "../src/constants/abi/HintHelpers";
import priceFeedAbi from "../src/constants/abi/PriceFeedTestnet.sol.json";
import { sortedTroves } from "../src/constants/abi/SortedTroves";
import { troveManagerAbi } from "../src/constants/abi/TroveManager";
import troveManagerContractQ from "../src/constants/abi/TroveManager.sol.json"
import { BOTANIX_RPC_URL } from "../src/constants/botanixRpcUrl";
import botanixTestnet from "../src/constants/botanixTestnet.json";
import erc20Abi from "../src/constants/abi/ERC20.sol.json"
import { getContract } from "../src/utils/getContract";
import Decimal from "decimal.js";
import { useAccount, useWriteContract, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import web3 from "web3";
import { CustomConnectButton } from "@/components/connectBtn";
import { wagmiConfig } from "../src/config/config";
import { Dialog } from 'primereact/dialog';
import BotanixLOGO from "../../app/assets/images/newpalladium.svg"
import Image from "next/image";
import "../../components/stabilityPool/Modal.css"
import "../../app/App.css"
import '../App.css';

export default function Redeem() {
    const [userInput, setUserInput] = useState("0");
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [isRecoveryMode, setIsRecoveryMode] = useState<boolean>(false);
    const [price, setPrice] = useState<number>(0);
    const [pusdBalance, setPusdBalance] = useState("0");
    const [hasPriceFetched, setHasPriceFetched] = useState(false);
    const { address, isConnected } = useAccount();
    const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);
    const { data: walletClient } = useWalletClient();
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { toBigInt } = web3.utils;

    const {
        data: hash,
        isPending,
        writeContract
    } = useWriteContract()

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

    const neTrove = getContract(
        botanixTestnet.addresses.troveManager,
        troveManagerContractQ,
        walletClient
    )

    useEffect(() => {
        const fetchPrice = async () => {
            const pusdBalanceValue = await erc20Contract.balanceOf(address);
            const pusdBalanceFormatted = ethers.formatUnits(pusdBalanceValue, 18);
            setPusdBalance(pusdBalanceFormatted);
        };
        fetchPrice();
    }, [address]);

    useEffect(() => {
        const getPrice = async () => {
            try {
                if (!provider || hasPriceFetched) return null;
                const fetchedPrice = await priceFeedContract.getPrice();
                const convertedFetchedPrice = ethers.formatUnits(fetchedPrice, 18);
                setPrice(Number(convertedFetchedPrice));
            } catch (error) {
                console.error(error, "error");
            } finally {
                setHasPriceFetched(true);
                setIsLoading(false);
            }

        };

        const getRecoveryModeStatus = async () => {
            const fetchedPrice = await priceFeedContract.getPrice();
            const result = await readContract(wagmiConfig, {
                abi: troveManagerAbi,
                address: '0x84400014b6bFA5b76d2feb4F460AEac8dd84B656',
                functionName: 'checkRecoveryMode',
                args: [fetchedPrice],
            }) as boolean
            setIsRecoveryMode(result);
        };

        getPrice();
        getRecoveryModeStatus();
    }, [isConnected, walletClient]);


    const handlePercentageClick = (percentage: any) => {
        const percentageDecimal = new Decimal(percentage).div(100);
        const pusdBalanceNumber = parseFloat(pusdBalance);

        if (!isNaN(pusdBalanceNumber)) {
            const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
            const stakeFixed = maxStake.toFixed();
            setUserInput(stakeFixed);
        } else {
            console.error("Invalid PUSD balance:", pusdBalance);
        }
    };


    const handleConfirmClick = async () => {
        try {
            setIsModalVisible(true)
            setIsRedeeming(true);

            const pow = Decimal.pow(10, 18);
            const fetchedPrice = await priceFeedContract.getPrice();

            const inputBeforeConv = new Decimal(userInput);
            const inputValue = inputBeforeConv.mul(pow).toFixed();

            const redemptionhint = await readContract(wagmiConfig, {
                abi: HintHelpers,
                address: '0xA7B88e482d3C9d17A1b83bc3FbeB4DF72cB20478',
                functionName: 'getRedemptionHints',

                args: [BigInt(inputValue), fetchedPrice, 50n]
            })
            const {
                0: firstRedemptionHint,
                1: partialRedemptionNewICR,
                2: truncatedLUSDAmount,
            } = redemptionhint;

            const numTroves = await readContract(wagmiConfig, {
                abi: sortedTroves,
                address: '0x6AB8c9590bD89cBF9DCC90d5efEC4F45D5d219be',
                functionName: 'getSize'
            })

            const numTrials = numTroves * toBigInt("15");

            const approxPartialRedemptionHint = await readContract(wagmiConfig, {
                abi: HintHelpers,
                address: '0xA7B88e482d3C9d17A1b83bc3FbeB4DF72cB20478',
                functionName: 'getApproxHint',

                args: [partialRedemptionNewICR, numTrials, 42n]
            })

            const approxPartialRedemptionHintString = approxPartialRedemptionHint[0];

            const exactPartialRedemptionHint = await readContract(wagmiConfig, {
                abi: sortedTroves,
                address: '0x6AB8c9590bD89cBF9DCC90d5efEC4F45D5d219be',
                functionName: 'findInsertPosition',
                args: [partialRedemptionNewICR, approxPartialRedemptionHintString, approxPartialRedemptionHintString]
            })

            const maxFee = "6".concat("0".repeat(17));

            const x = await neTrove.redeemCollateral(
                truncatedLUSDAmount,
                firstRedemptionHint,
                exactPartialRedemptionHint[0],
                exactPartialRedemptionHint[1],
                partialRedemptionNewICR,
                0,
                maxFee,
            );
            setIsModalVisible(false)
            setIsRedeeming(false);

        } catch (error) {
            console.error(error);
            setIsRedeeming(false);
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isRedeeming && (
                <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-900"></div>
                </div>
            )}
            <div className=" ml-3 md:ml-12 md:w-[40%] w-[22.5rem]">
                <div className="grid items-start h-[20rem] gap-x-2  mx-auto border-[2px] border-yellow-400 p-5">
                    <div>
                        <div className="flex mb-2 items-center">
                            <Input id="items" placeholder="0.000 BTC" disabled={!isConnected} value={userInput} onChange={(e) => { const input = e.target.value; setUserInput(input); }}
                                className="bg-[#3b351b] body-text w-[20rem] md:w-full text-lg h-14 border border-yellow-300 text-white "
                            />
                        </div>
                        <span className="ml-[55%] body-text text-yellow-300 font-medium balance ">
                            {isLoading ?
                                (<div className="-mt-6 h-3 rounded-xl">
                                    <div className="hex-loader"></div>
                                </div>
                                ) : (
                                    <span className="whitespace-nowrap">Wallet: {Number(pusdBalance).toFixed(2) || ".."} PUSD</span>
                                )}
                        </span>
                    </div>
                    <div className="flex gap-x-2 md:gap-x-6">
                        <Button disabled={!isConnected && isLoading} className={`text-lg body-text border-2 border-yellow-900 ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(25)}>25%</Button>
                        <Button disabled={!isConnected && isLoading} className={`text-lg body-text border-2 border-yellow-900 ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(50)}>50%</Button>
                        <Button disabled={!isConnected && isLoading} className={`text-lg body-text border-2 border-yellow-900 ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(75)}>75%</Button>
                        <Button disabled={!isConnected && isLoading} className={`text-lg body-text border-2 border-yellow-900 ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(100)}>100% </Button>
                    </div>

                    {isConnected ? (
                        <div className="space-y-2">
                            <button style={{ backgroundColor: "#f5d64e" }} onClick={handleConfirmClick} className={`mt-5 body-text text-black text-md font-semibold w-[20rem] md:w-full border border-black h-10 ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`} disabled={isLoading}>
                                {isLoading ? 'LOADING...' : 'REDEEM'}
                            </button>
                            <div>
                                {isRecoveryMode && <span className="body-text pt-2 text-gray-300 text-xl w-2">System Is In Recovery Mode !</span>}
                            </div>
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
            </div>

        </>
    );
}
