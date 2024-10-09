/* eslint-disable */


"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import hintHelpersAbi from "../src/constants/abi/HintHelpers.sol.json";
import apiThreeFeed from "../src/constants/abi/ApiThree.sol.json";
import troveManagerAbi from "../src/constants/abi/TroveManager.sol.json";
import botanixTestnet from "../src/constants/botanixTestnet.json";
import erc20Abi from "../src/constants/abi/ERC20.sol.json"
import { getContract } from "../src/utils/getContract";
import Decimal from "decimal.js";
import { EVMConnect } from '@/components/EVMConnect';
import { useAccount, useWriteContract, useWalletClient, useWaitForTransactionReceipt } from "wagmi";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import web3 from "web3";
import { Dialog } from 'primereact/dialog';
import trove3 from "../../app/assets/images/TROVE3.svg"
import trove2 from "../../app/assets/images/TROVE1.svg"
import trove1 from "../../app/assets/images/TROVE2.svg"
import rej from "../../app/assets/images/TxnError.gif";
import conf from "../../app/assets/images/conf.gif"
import sortedTroveAbi from "../src/constants/abi/SortedTroves.sol.json";
import rec2 from "../../app/assets/images/rec2.gif"
import tick from "../../app/assets/images/tick.gif"
import Image from "next/image";
import "../../components/stabilityPool/Modal.css"
import "../../app/App.css"
import '../App.css';
import "./redeem.css"
import { GiConsoleController } from "react-icons/gi";

export default function Redeem() {
    const [userInput, setUserInput] = useState("0");
    const [isRecoveryMode, setIsRecoveryMode] = useState<boolean>(false);
    const [pusdBalance, setPusdBalance] = useState("0");
    const { address, isConnected } = useAccount();
    const { data: walletClient } = useWalletClient();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { toBigInt } = web3.utils;
    const [loadingModalVisible, setLoadingModalVisible] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [userModal, setUserModal] = useState(false);
    const [showCloseButton, setShowCloseButton] = useState(false);
    const { data: hash, writeContract, error: writeError } = useWriteContract();
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
    const [transactionRejected, setTransactionRejected] = useState(false);
    const [selectedButton, setSelectedButton] = useState("WCORE")
    const [newBTCPrice, setNewBTCPrice] = useState(0n);
    const [newWCOREPrice, setNewWCOREPrice] = useState(0n);

    const [collTokenAddress, setCollTokenAddress] = useState<string>("0x5FB4E66C918f155a42d4551e871AD3b70c52275d")

    const handleButtonClick = (buttonId: any) => {
        setSelectedButton(buttonId);
        if (!walletClient) return null;
        let address = '';
        if (buttonId === 'WCORE') {
            address = "0x5FB4E66C918f155a42d4551e871AD3b70c52275d";
        } else if (buttonId === 'WBTC') {
            address = "0x4CE937EBAD7ff419ec291dE9b7BEc227e191883f";
        }
        setCollTokenAddress(address);
    };


    const BOTANIX_RPC_URL2 = "https://rpc.test.btcs.network";
    const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL2);
    const erc20Contract = getContract(
        botanixTestnet.addresses.DebtToken,
        erc20Abi,
        provider);

    const handleClose = useCallback(() => {
        setLoadingModalVisible(false);
        setUserModal(false);
        setIsModalVisible(false);
        setTransactionRejected(false);
        window.location.reload();
    }, []);

    const neTrove = getContract(
        botanixTestnet.addresses.troveManager,
        troveManagerAbi,
        walletClient
    )

    const hintHelpersContract = getContract(
        botanixTestnet.addresses.VesselManagerOperations,
        hintHelpersAbi,
        provider
    );

    const ApiFeedBTC = getContract(
        "0x81A64473D102b38eDcf35A7675654768D11d7e24",
        apiThreeFeed,
        provider
    );

    const ApiFeedCore = getContract(
        "0xdd68eE1b8b48e63909e29379dBe427f47CFf6BD0",
        apiThreeFeed,
        provider
    );

    useEffect(() => {
        const fetchPrice = async () => {
            if (!walletClient) return null;
            const pusdBalanceValue = await erc20Contract.balanceOf(
                walletClient?.account?.address
            );
            const pusdBalanceFormatted = ethers.formatUnits(pusdBalanceValue, 18);
            setPusdBalance(pusdBalanceFormatted);
        };
        fetchPrice();
    }, [erc20Contract, address]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "https://api.palladiumlabs.org/core/protocol/metrics"
                );
                const data = await response.json();
                const protocolMetrics = data[0].metrics[1] // WCORE
                const protocolMetricsBTC = data[0].metrics[0] // WBTC

                setIsRecoveryMode(protocolMetrics.recoveryMode);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        const getPrice = async () => {
            const oracleBTCPrice = await ApiFeedBTC.read()
            const oracleWCOREPrice = await ApiFeedCore.read()
            const btcPrice = oracleBTCPrice[0];
            const wcorePrice = oracleWCOREPrice[0];
            const btcpriceAsBigint = BigInt(btcPrice)
            const wcorepriceAsBigint = BigInt(wcorePrice)
            setNewBTCPrice(btcpriceAsBigint)
            setNewWCOREPrice(wcorepriceAsBigint)
        }
        console.log(selectedButton, "selectedButton", collTokenAddress)
        getPrice()
        fetchData();
    }, [walletClient, collTokenAddress, selectedButton, newBTCPrice, newWCOREPrice]);
    const sortedTrovesContract = getContract(
        botanixTestnet.addresses.SortedVessels,
        sortedTroveAbi,
        provider
    );

    const handlePercentageClick = (percentage: any) => {
        const percentageDecimal = new Decimal(percentage).div(100);
        const pusdBalanceNumber = parseFloat(pusdBalance);

        if (!isNaN(pusdBalanceNumber)) {
            const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
            const stakeFixed = maxStake;
            const roundedStakeFixed = Number(stakeFixed.toFixed(2))
            setUserInput(String(roundedStakeFixed));
        } else {
            console.error("Invalid PUSD balance:", pusdBalance);
        }
    };
    const handleConfirmClick = async () => {
        setIsModalVisible(true);
        try {
            if (!walletClient) {
                return null;
              }
            
            const pow = Decimal.pow(10, 18);
            const inputBeforeConv = new Decimal(userInput);

            const inputValue = inputBeforeConv.mul(pow).toFixed();
            const priceAsBigInt = selectedButton === "WBTC" ? newBTCPrice : newWCOREPrice
            console.log(selectedButton, "selectedButton", collTokenAddress)
            const redemptionhint = await hintHelpersContract.getRedemptionHints(collTokenAddress, BigInt(inputValue), priceAsBigInt, 50);

            const { 0: firstRedemptionHint, 1: partialRedemptionNewICR, 2: truncatedLUSDAmount } = redemptionhint;
            const numTroves = await sortedTrovesContract.getSize(collTokenAddress);
            const numTrials = numTroves * toBigInt("15");
            const { hintAddress: approxPartialRedemptionHint } = await hintHelpersContract.getApproxHint(collTokenAddress, partialRedemptionNewICR, numTrials, 42);
            const exactPartialRedemptionHint = await sortedTrovesContract.findInsertPosition(collTokenAddress, partialRedemptionNewICR, approxPartialRedemptionHint, approxPartialRedemptionHint);
            
            const maxFee = BigInt(5e16);

            const result = await writeContract({
                address: "0x21F46c75F3c12FE2cA6714e6085B65FACA61102f",
                abi: hintHelpersAbi,
                functionName: 'redeemCollateral',
                args: [
                    collTokenAddress,
                    truncatedLUSDAmount,
                    exactPartialRedemptionHint[0], // upper hint
                    exactPartialRedemptionHint[1], // lower hint
                    firstRedemptionHint,
                    partialRedemptionNewICR,
                    0,
                    maxFee],
            });
        } catch (error) {
            console.error('Error:', error);
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
        if (isLoading) {
            setIsModalVisible(false);
            setLoadingMessage("Waiting for transaction to confirm..");
            setLoadingModalVisible(true);
        } else if (isSuccess) {
            setLoadingMessage("Redeem Transaction completed successfully");
            setLoadingModalVisible(true);
        } else if (transactionRejected) {
            setLoadingMessage("Transaction was rejected");
            setLoadingModalVisible(true);
        }
    }, [isSuccess, isLoading, transactionRejected]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowCloseButton(true);
        }, 180000);
        return () => clearTimeout(timer);
    }, []);

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <Button className="p-button-rounded p-button-text" onClick={() => setUserModal(false)}>
                    Close
                </Button>
            </div>
        );
    };

    return (
        <>
            <div className=" ml-3 md:ml-12 md:w-[40%] w-[22.5rem]">
                <div className="grid items-start h-[25rem] gap-x-2  mx-auto border-[2px]  rounded-lg border-[#88e273] p-5">
                    <div className='mb-2 pb-1 threeButtons gap-x-4 flex items-center  w-full h-10 my-2'>
                        <div className={`items-center flex w-1/3 text-lg body-text border-2 rounded-lg border-[#88e273] h-fit p-1 cursor-pointer ${selectedButton === 'WCORE' ? "bg-[#88e273] opacity-80" : "opacity-50"}`} onClick={() => handleButtonClick('WCORE')}>
                            <Image src={trove1} alt='rovbtc' width={40} className='p-1' />
                            <p className={`font-light body-text text-xs ${selectedButton === 'WCORE' ? 'text-black body-text font-medium' : 'text-white'}`}>WCORE</p>
                        </div>
                        <div className={`items-center flex w-1/3 text-lg body-text border-2 rounded-lg border-[#88e273] h-fit p-1 cursor-pointer ${selectedButton === 'WBTC' ? "bg-[#88e273] opacity-90" : "opacity-50"}`} onClick={() => handleButtonClick('WBTC')}>
                            <Image src={trove2} alt='bbnbtc' width={40} className='p-1' />
                            <p className={`font-light body-text text-xs ${selectedButton === 'WBTC' ? 'text-black body-text font-medium' : 'text-white'}`}>WBTC</p>
                        </div>
                    </div>
                    <div className='my-4'>
                        <div className="flex mb-2 items-center">
                            <Input id="items" placeholder="0.000 BTC" disabled={!isConnected} value={userInput} onChange={(e) => { const input = e.target.value; setUserInput(input); }} className="bg-[#3b351b] rounded-lg body-text w-[20rem] md:w-full text-lg h-14 border border-[#88e273] text-white " />
                        </div>
                        <span className=" ml-[56%] md:ml-[66%] body-text  font-medium balance ">
                            {isLoading ?
                                (<div className="-mt-6 h-3 rounded-xl">
                                    <div className="hex-loader"></div>
                                </div>
                                ) : (
                                    <span className="whitespace-nowrap -ml-2 text-white body-text">Wallet: {" "}
                                        <span className="body-text text-sm">
                                            {Number(pusdBalance).toFixed(2) || ".."} PUSD
                                        </span>
                                    </span>
                                )}
                        </span>
                    </div>
                    <div className="flex w-full justify-between">
                        <Button disabled={!isConnected || isLoading} className={`text-lg body-text border-2 rounded-lg border-[#88e273] ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(25)}>25%</Button>
                        <Button disabled={!isConnected || isLoading} className={`text-lg body-text border-2 rounded-lg border-[#88e273] ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(50)}>50%</Button>
                        <Button disabled={!isConnected || isLoading} className={`text-lg body-text border-2 rounded-lg border-[#88e273] ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(75)}>75%</Button>
                        <Button disabled={!isConnected || isLoading || Number(userInput) > Number(pusdBalance)} className={`text-lg body-text border-2 rounded-lg border-[#88e273] ${isLoading || Number(userInput) > Number(pusdBalance) ? 'cursor-not-allowed opacity-50' : ''}`} style={{ backgroundColor: "#3b351b", borderRadius: "0.5rem" }} onClick={() => handlePercentageClick(100)}>100% </Button>
                    </div>

                    {isConnected ? (
                        <div className="space-y-2">
                            <button style={{ backgroundColor: "#88e273" }} onClick={handleConfirmClick} className={`mt-5  text-black title-text font-semibold w-[20rem] md:w-full rounded-lg border border-black h-10 ${isLoading || Number(userInput) > Number(pusdBalance) || Number(userInput) == 0 ? 'cursor-not-allowed opacity-50' : ''}`} disabled={isLoading || Number(userInput) > Number(pusdBalance)}>
                                {isLoading ? 'LOADING...' : 'REDEEM'}
                            </button>
                            <div>
                                {isRecoveryMode && <span className="body-text pt-2 text-gray-300 text-xl w-2">System Is In Recovery Mode !</span>}
                            </div>
                        </div>
                    ) : (
                        <div className="mt-8">
                            <EVMConnect className="w-full" />
                        </div>
                    )}
                </div>
            </div>
            <Dialog visible={isModalVisible} onHide={() => setIsModalVisible(false)}>
                <div className="dialog-overlay">
                    <div className="dialog-content">
                        <div className="py-5">
                            <Image src={rec2} alt="box" width={140} className="" />
                        </div>
                        <div className="waiting-message text-lg title-text2 text-[#88e273] whitespace-nowrap">Transaction is initiated</div>
                        <div className="text-sm title-text2 text-[#bebdb9] whitespace-nowrap">Please confirm in Metamask.</div>
                    </div>
                </div>
            </Dialog>
            <Dialog visible={userModal} onHide={() => setUserModal(false)} header={renderHeader}>
                <div className="dialog-overlay">
                    <div className="dialog-content">
                        <div className="waiting-message text-lg title-text2 whitespace-nowrap">Transaction rejected</div>
                        <div className="py-5">
                            <Image src={rej} alt="box" width={140} className="" />
                        </div>
                        <Button className="p-button-rounded text-black title-text2 " onClick={() => setUserModal(false)}>Close</Button>
                    </div>
                </div>
            </Dialog>
            <Dialog visible={loadingModalVisible} onHide={() => setLoadingModalVisible(false)}>
                <div className="dialog-overlay">
                    <div className="dialog-content">
                        {loadingMessage === 'Waiting for transaction to confirm..' ? (
                            <>
                                <Image src={conf} alt="rectangle" width={150} />
                                <div className="my-5 ml-[6rem] mb-5"></div>
                            </>
                        ) : loadingMessage === 'Redeem Transaction completed successfully' ? (
                            <Image src={tick} alt="tick" width={200} />
                        ) : transactionRejected ? (
                            <Image src={rej} alt="rejected" width={140} />
                        ) : (
                            <Image src={conf} alt="box" width={140} />
                        )}
                        <div className="waiting-message title-text2 text-white whitespace-nowrap">{loadingMessage}</div>
                        {isSuccess && (
                            <button className="mt-1 p-3 text-black title-text2 hover:scale-95 bg-[#88e273]" onClick={handleClose}>Go Back to the Stake Page</button>
                        )}
                        {(transactionRejected || (!isSuccess && showCloseButton)) && (
                            <>
                                <p className="body-text text-white text-xs">{transactionRejected ? "Transaction was rejected. Please try again." : "Some Error Occurred On Network Please Try Again After Some Time.. 🤖"}</p>
                                <Button className=" mt-1 p-3 text-black rounded-none md:w-[20rem] title-text2  hover:scale-95 bg-[#88e273]" onClick={handleClose}>Try again</Button>
                            </>
                        )}
                    </div>
                </div>
            </Dialog>
        </>
    );
}
