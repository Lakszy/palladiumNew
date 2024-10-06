import React, { useEffect, useState } from 'react'
import "../app/App.css"
import Image from 'next/image'
import floatPUSD from "../app/assets/images/floatPUSD2.png";
import trove3 from "../app/assets/images/TROVE2.svg"
import botanixTestnet from "../app/src/constants/botanixTestnet.json";
import trove2 from "../app/assets/images/TROVE1.svg"
import trove1 from "../app/assets/images/TROVE3.svg"
import troveManagerAbi from "../app/src/constants/abi/TroveManager.sol.json"
import ACTIVE from "../app/assets/images/ACTIVE.svg";
import INACTIVE from "../app/assets/images/INACTIVE.svg";
import { Button } from './ui/button';
import Link from 'next/link';
import { useAccount, useWalletClient } from 'wagmi';
import Decimal from 'decimal.js';
import { ethers, toBigInt } from 'ethers';
import { getContract } from '@/app/src/utils/getContract';
import { Knob } from 'primereact/knob';
import { EVMConnect } from './EVMConnect';
import formatLargeNumber from './getActualDecimal';

const ThreeTroveCard = () => {
    const [minDebt, setMinDebt] = useState(0)
    const [borrowRate, setBorrowRate] = useState(0)
    const [borrowRateBTC, setBorrowRateBTC] = useState(0)
    const [minDebtBTC, setMinDebtBTC] = useState(0)
    const { address, isConnected } = useAccount();
    const BOTANIX_RPC_URL2 = "https://rpc.test.btcs.network";
    const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL2);
    const [lr, setLR] = useState(0)
    const [systemCollRatio, setSystemCollRatio] = useState(0);
    const [systemCollRatioBTC, setSystemCollRatioBTC] = useState(0);

    const [cCr, setCCR] = useState(0)
    const [mCR, setMCR] = useState(0)
    const [mCRBTC, setMCRBTC] = useState(0)

    const [fetchedPrice, setFetchedPrice] = useState(0)
    const [fetchedPriceBTC, setFetchedPriceBTC] = useState(0)
    const [recoveryMode, setRecoveryMode] = useState<boolean>()
    const [troveStatusBTC, setTroveStatusBTC] = useState("");
    const [troveStatuscore, setTroveStatuscore] = useState("");

    const [pusdMintedCore, setPusdMintedCore] = useState(0)
    const [pusdMintedBTC, setPusdMintedBTC] = useState(0)



    const [entireDebtAndCollCore, setEntireDebtAndCollCore] = useState({
        debtCore: "0",
        collCore: "0",
        pendingLUSDDebtReward: "0",
        pendingETHReward: "0",
    });

    const [entireDebtAndCollBTC, setEntireDebtAndCollBTC] = useState({
        debtBTC: "0",
        collBTC: "0",
        pendingLUSDDebtRewardBTC: "0",
        pendingETHRewardBTC: "0",
    });
    const { data: walletClient } = useWalletClient();

    const troveManagerContract = getContract(
        botanixTestnet.addresses.VesselManager,
        troveManagerAbi,
        provider
    );


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://api.palladiumlabs.org/core/protocol/metrics");
                const data = await response.json();
                const protocolMetrics = data[0].metrics[1]; // Fetch the metrics for WCORE (at index 1)
                const protocolMetricsBTC = data[0].metrics[0]; // Fetch the metrics for WBTC (at index 0)

                setRecoveryMode(protocolMetrics.recoveryMode);

                setFetchedPrice(protocolMetrics.price);
                setFetchedPriceBTC(protocolMetricsBTC.price)
                setPusdMintedBTC(protocolMetricsBTC.totaldebt)
                setPusdMintedCore(protocolMetrics.totaldebt)

                setMCR(protocolMetrics.MCR);
                setMCRBTC(protocolMetricsBTC.MCR);

                setCCR(protocolMetrics.CCR);
                setLR(protocolMetrics.LR);

                setMinDebt(protocolMetrics.minDebt);
                setMinDebtBTC(protocolMetricsBTC.minDebt);

                setBorrowRate(protocolMetrics.borrowRate);
                setBorrowRateBTC(protocolMetricsBTC.borrowRate);

                setSystemCollRatio(protocolMetrics.TCR);
                setSystemCollRatioBTC(protocolMetricsBTC.TCR)


            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {

        const pow = Decimal.pow(10, 18);
        const _1e18 = toBigInt(pow.toFixed());

        const fetchedData = async () => {
            if (!walletClient) return null;

            const {
                0: debtCore,
                1: collCore,
                2: pendingLUSDDebtReward,
                3: pendingETHReward,
            } = await troveManagerContract.getEntireDebtAndColl(
                "0x5FB4E66C918f155a42d4551e871AD3b70c52275d",
                walletClient?.account.address
            );

            const {
                0: debtBTC,
                1: collBTC,
                2: pendingLUSDDebtRewardBTC,
                3: pendingETHRewardBTC,
            } = await troveManagerContract.getEntireDebtAndColl(
                "0x4CE937EBAD7ff419ec291dE9b7BEc227e191883f",
                walletClient?.account.address
            );

            const collDecimal = new Decimal(collCore.toString());
            const collFormatted = collDecimal.div(_1e18.toString()).toString();

            setEntireDebtAndCollCore({
                debtCore: (debtCore / _1e18).toString(),
                collCore: collFormatted,
                pendingLUSDDebtReward: (pendingLUSDDebtReward / _1e18).toString(),
                pendingETHReward: (pendingETHReward / _1e18).toString(),
            });

            const collDecimalBTC = new Decimal(collBTC.toString());
            const collFormattedBTC = collDecimalBTC.div(_1e18.toString()).toString();

            setEntireDebtAndCollBTC({
                debtBTC: (debtBTC / _1e18).toString(),
                collBTC: collFormattedBTC,
                pendingLUSDDebtRewardBTC: (pendingLUSDDebtRewardBTC / _1e18).toString(),
                pendingETHRewardBTC: (pendingETHRewardBTC / _1e18).toString(),
            });
        };

        const getTroveStatus = async () => {
            try {
                if (!walletClient) return null;
                const troveStatusBigInt = await troveManagerContract.getVesselStatus(
                    "0x4CE937EBAD7ff419ec291dE9b7BEc227e191883f",
                    walletClient?.account.address
                );
                const troveStatus =
                    troveStatusBigInt.toString() === "1" ? "ACTIVE" : "INACTIVE";
                setTroveStatusBTC(troveStatus)

                const troveStatusBigIntcore = await troveManagerContract.getVesselStatus(
                    "0x5FB4E66C918f155a42d4551e871AD3b70c52275d",
                    walletClient?.account.address
                );
                const troveStatuscore =
                    troveStatusBigIntcore.toString() === "1" ? "ACTIVE" : "INACTIVE";
                setTroveStatuscore(troveStatuscore)
            } catch (error) {
                console.error(error)
            }
        }
        getTroveStatus();
        fetchedData();
    }, [walletClient])

    const newLTV = ((Number(entireDebtAndCollCore.debtCore) * 100) / ((Number(entireDebtAndCollCore.collCore) * Number(fetchedPrice)))).toFixed(2)
    const newLTVBTC = ((Number(entireDebtAndCollBTC.debtBTC) * 100) / ((Number(entireDebtAndCollBTC.collBTC) * Number(fetchedPriceBTC)))).toFixed(2)

    return (
        <div className='p-5 h-scree w-full' style={{ backgroundColor: "black" }}>
            {troveStatusBTC && troveStatuscore === "INACTIVE" ? (<>

                <div className="p-5">
                    <div className="md:ml-2 -ml-7 rounded-lg h-[10rem] p-2 md:w-full w-[22.5rem]" style={{ backgroundColor: "#222222" }}>
                        <div className="flex p-2 w-full">
                            <div className="hidden md:block w-[22%]">
                                <Image src={floatPUSD} height={200} alt="home" className="-mt-[3.5rem]" />
                            </div>
                            <div className=" h-fit py- space-y-5">
                                <div>
                                    <p className="text-white body-text text-2xl font-medium ">
                                        You dont have an existing trove
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[#88e273] body-text font-medium text-left ">
                                        Open a Zero-Interest trove
                                    </p>
                                    <p className="text-[#827f77] text-sm  font-medium body-text text-left">
                                        Borrow against BTCs interest free
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            ) :
                (
                    <>
                    </>
                )}

            <div className='flex md:flex-row flex-col md:pl-5 pt-5 pb-5 w-full justify-between items-center'>
                <div className={`bg-[#222222] rounded-lg text-white md:p-6 md:mb-0 mb-3 p-3  flex-1 mx-2 ${troveStatuscore === "ACTIVE" ? "space-y-4" : "space-y-16"}`}>
                    <div className="flex  md:w-full  px-2 justify-between items-center mb-6">
                        <div className='flex items-center gap-x-1'>
                            <Image src={trove1} alt="btc" />
                            <h2 className="ml-4 md:text-xl text-lg rounded-xl font-medium  body-text">WCORE Trove</h2>
                        </div>
                        {troveStatuscore === "ACTIVE" && (
                            <Image src={ACTIVE} alt="status-icon" width={120} height={100} />
                        )}
                    </div>

                    {troveStatuscore === "ACTIVE" ? (
                        <>
                            <div className="flex justify-center items-center">
                                <Knob value={Number(newLTV) || 0} min={0} max={90} showValue={true} size={135} valueColor="#3dde84" strokeWidth={7} readOnly className="text-yellow-300" />
                            </div>

                            <div className='flex  justify-between'>
                                <div className="">
                                    <p className="text-gray-500 text-sm body-text">Collateral</p>
                                    <p className="body-text font-medium ">{entireDebtAndCollCore.collCore} WCORE</p>
                                    <p className="text-gray-500 text-xs body-text">${(Number(entireDebtAndCollCore.collCore) * fetchedPrice).toFixed(2)}</p>
                                </div>
                                <div className="">
                                    <p className="text-gray-500 text-sm body-text">Debt</p>
                                    <p className="body-text font-medium">{entireDebtAndCollCore.debtCore} PUSD</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className='space-y-9'>
                                <div className="flex justify-between mb-4">
                                    <div className='whitespace-nowrap'>
                                        <p className="body-text font-medium text-gray-400">MAX LTV</p>
                                        <p className="body-text font-medium">{(100 / mCR).toFixed(2)}%</p>
                                    </div>
                                    <div className='whitespace-nowrap'>
                                        <p className="body-text text-gray-400 body-text font-medium">One-time Fee</p>
                                        <p className="body-text font-medium">{borrowRate * 100}%</p>
                                    </div>
                                </div>
                                <div className="flex justify-between mb-4">
                                    <div>
                                        <p className="body-text font-medium text-gray-400">Min Debt</p>
                                        <p className="body-text font-medium">{minDebt} PUSD</p>
                                    </div>
                                    <div>
                                        <p className="body-text font-medium text-gray-400">PUSD Minted</p>
                                        <p className="body-text font-medium">{formatLargeNumber(pusdMintedCore)} / 2.5M</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                    }
                    <div>
                        {isConnected ? (<>
                            <Link href="/trove/wcore" passHref>
                                {troveStatuscore === "ACTIVE" ? (
                                    <Button className="border-[#88e273] border bg-transparent rounded-3xl font-semibold w-full title-text text-[#88e273] hover:scale-95 hover:bg-transparent transition">
                                        See Details
                                    </Button>
                                ) : (
                                    <Button className="bg-[#88e273] rounded-3xl text-black font-semibold w-full title-text transition">
                                        OPEN TROVE
                                    </Button>
                                )}
                            </Link>
                        </>) : (
                            <>
                                <EVMConnect className="w-full" />
                            </>
                        )}
                    </div>
                </div>

                {/* Card 2 */}
                <div className={`bg-[#222222]  rounded-lg text-white md:p-6 md:mb-0 mb-3 p-3  flex-1 mx-2 ${troveStatusBTC === "ACTIVE" ? "space-y-4" : "space-y-16"}`}>
                    <div className="flex  gap-x-2 justify-between items-center mb-6">
                        <div className='flex  items-center gap-x-1'>
                            <Image src={trove1} alt="btc" />
                            <h2 className="ml-4  text-xl font-medium body-text">WBTC Trove</h2>
                        </div>
                        {troveStatusBTC === "ACTIVE" && (
                            <Image src={ACTIVE} alt="status-icon" width={120} height={100} />
                        )}
                    </div>

                    {troveStatusBTC === "ACTIVE" ? (
                        <>
                            <div className="flex justify-center items-center">
                                <Knob value={Number(newLTVBTC) || 0} min={0} max={90} showValue={true} size={135} valueColor="#3dde84" strokeWidth={7} readOnly className="text-yellow-300" />
                            </div>

                            <div className='flex  justify-between'>
                                <div className="">
                                    <p className="text-gray-500 text-sm body-text">Collateral</p>
                                    <p className="body-text font-medium ">{entireDebtAndCollBTC.collBTC} BTC</p>
                                    <p className="text-sm body-text  text-gray-500">${(Number(entireDebtAndCollBTC.collBTC) * fetchedPriceBTC).toFixed(8)}</p>
                                </div>
                                <div className="">
                                    <p className="text-gray-500 text-sm body-text">Debt</p>
                                    <p className=" body-text font-medium">{entireDebtAndCollBTC.debtBTC} PUSD</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className='space-y-9'>
                                <div className="flex justify-between mb-4">
                                    <div className='whitespace-nowrap'>
                                        <p className="body-text font-medium text-gray-400">MAX LTV</p>
                                        <p className="body-text font-medium">{(100 / mCRBTC).toFixed(2)}%</p>
                                    </div>
                                    <div className='whitespace-nowrap'>
                                        <p className="body-text text-gray-400 body-text font-medium">One-time Fee</p>
                                        <p className="body-text font-medium">{borrowRateBTC * 100}%</p>
                                    </div>
                                </div>
                                <div className="flex justify-between mb-4">
                                    <div>
                                        <p className="body-text font-medium text-gray-400">Min Debt</p>
                                        <p className="body-text font-medium">{minDebtBTC} PUSD</p>
                                    </div>
                                    <div>
                                        <p className="body-text font-medium text-gray-400">PUSD Minted</p>
                                        <p className="body-text font-medium">{formatLargeNumber(pusdMintedBTC)} / 2.5M</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                    }
                    <div>
                        {isConnected ? (<>
                            <Link href="/trove/wbtc" passHref>
                                {troveStatusBTC === "ACTIVE" ? (
                                    <Button className="border-[#88e273] border bg-transparent rounded-3xl font-semibold w-full title-text text-[#88e273] hover:scale-95 hover:bg-transparent transition">
                                        See Details
                                    </Button>
                                ) : (
                                    <Button className="bg-[#88e273] rounded-3xl text-black font-semibold w-full title-text transition">
                                        OPEN TROVE
                                    </Button>
                                )}
                            </Link>
                        </>
                        ) : (
                            <>
                                <EVMConnect className='w-full' />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ThreeTroveCard