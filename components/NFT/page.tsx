"use client";

import nftAbi from "../../app/src/constants/abi/NftAbi.json";
import { BOTANIX_RPC_URL } from "../../app/src/constants/botanixRpcUrl";
import { getContract } from "../../app/src/utils/getContract";
import { ethers } from "ethers";
import CB from "../../app/assets/images/CB.svg"
import crate from "../../app/assets/images/crate.svg"
import btc from "../../app/assets/images/btc.svg"
import { EVMConnect } from "../../app/src/config/EVMConnect";
import { useEffect, useState } from "react";
import {
    useAccount,
    useTransactionReceipt,
    useWaitForTransactionReceipt,
    useWriteContract,
    useWalletClient,
} from "wagmi";
import "../../app/App.css";
import Image from "next/image";
import { CustomConnectButton } from "@/components/connectBtn";
import { useRouter } from "next/navigation";
import { Dialog } from 'primereact/dialog';
import "./Modal.css"
import { useAccounts } from "@particle-network/btc-connectkit";

export default function Redeem() {
    const { address, isConnected } = useAccount();
    const [mint, setMint] = useState("0");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const router = useRouter();
    const { accounts } = useAccounts();
    const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);
    const nftContract = getContract(
        "0xD8C448dD8A4785835da7af461ebB015dD83d4a12",
        nftAbi,
        provider
    );
    const mintStatus = async () => {
        if (!address) {
            setMint("0")
            return;
        }
        const minted = await nftContract?.idOf(address);
        setMint(minted.toString());
    };

    const {
        data: hash,
        isPending,
        writeContract
    } = useWriteContract()

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    const handleMint = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
            writeContract({
                abi: nftAbi,
                address: "0xD8C448dD8A4785835da7af461ebB015dD83d4a12",
                functionName: "safeMint",
                args: [address],
            });

            router.refresh();
        } catch (error) {
            console.error("An error occurred", error);
        }
    };

    useEffect(() => {
        mintStatus();
    }, [mintStatus,address, mint, isConfirming, isConfirmed]);

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
    const apiResponse = mint.toString();

    return (
        <>

            <div className="w-full -ml-1.5 md:-ml-0 upper mr-10 border-[#88e273]  p-6 border items-center justify-center" style={{ backgroundColor: '#272315' }}>
                <div className="flex flex-col md:flex-row justify-between  ">
                    <div className="box-1 w-[20rem] space-y-3 pb-24">
                        <Image src={CB} alt="circuit breaker" />
                        <h1 className="text-[#88e273] text-5xl font-extrabold title-text">Genesis NFT</h1>
                        <h3 className="text-gray-300 body-text">Collect the very first Circuit Breaker NFT and join the elite OGs of Palladium.</h3>
                        <div className="pt-10">
                            <h3 className="text-gray-300 title-text text-xl font-semibold">Available till</h3>
                            <h3 className="text-[#88e273] text-2xl font-semibold">21 April 2024 12PM GMT</h3>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-center max-sm:px-5">
                            <div className="md:mr-8 md:mt-[4rem] ">
                                {mint.toString() === "0" ? (
                                    <>
                                    {/* <Image src={crate} width={300} height={250} alt="home" /> */}
                                    </>
                                ) : (
                                    <div className=" h-[24rem] -mt-24">
                                        <Image src={crate} alt="home" />
                                        <p className="text-amber-400 font-mono text-2xl font-extrabold text-center mt-2">
                                            Token ID:{apiResponse}
                                        </p>
                                        <button disabled className="w-full md:w-[15rem] bg-amber-400 md:ml-9 text-black text-lg cursor-not-allowed font-bold title-text mt-8 md:mt-[2rem] px-4 py-2">
                                            ALREADY MINTED
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 md:mt-[4rem]">
                                {isConnected ? (

                                    mint.toString() === "0" ? (
                                        <>
                                            <button
                                                className={`w-full md:w-[15rem] bg-amber-400 text-black text-lg font-bold title-text mt-4 md:mt-[2rem] px-4 py-2 ${isPending ? "opacity-50" : ""
                                                    }`}
                                                disabled={isPending}
                                                onClick={handleMint}
                                                style={{ transition: "background-color 0.3s ease-in-out" }}
                                            >
                                                {isPending ? "Minting..." : "MINT NOW"}
                                            </button>
                                        </>
                                    ) : (
                                        <>

                                            {/* <button disabled className="w-full md:w-[15rem] bg-amber-400 text-black text-lg cursor-not-allowed font-bold title-text mt-4 md:mt-[2rem] px-4 py-2">
                                                ALREADY MINTED
                                            </button> */}
                                        </>

                                    )
                                ) : (
                                    <div className="items-center  h-[19rem] flex flex-col justify-between -mt-10">
                                        <Image src={crate} alt="home" className="-mt-10" />
                                        <EVMConnect className="" />
                                    </div>
                                )}
                            </div>
                            <Dialog visible={isModalVisible} onHide={() => setIsModalVisible(false)}>
                                {isConfirming && (
                                    <>
                                        <div className="waiting-container">
                                            <div className="waiting-message text-xl font-mono whitespace-nowrap">Minting Your NFT ✨.....</div>
                                            <Image src={btc} className="waiting-image animate-ping" alt="gif" />
                                        </div>
                                    </>
                                )}
                                {isConfirmed && (
                                    <div className="text-3xl text-white">Transaction confirmed.</div>
                                )}
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
