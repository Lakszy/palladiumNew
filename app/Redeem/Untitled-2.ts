
// "use client";
// import { readContract } from '@wagmi/core'
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { HintHelpers } from "../src/constants/abi/HintHelpers";
// import priceFeedAbi from "../src/constants/abi/PriceFeedTestnet.sol.json";
// import { sortedTroves } from "../src/constants/abi/SortedTroves";
// import troveManagerContractQ from "../src/constants/abi/TroveManager.sol.json"
// import { BOTANIX_RPC_URL } from "../src/constants/botanixRpcUrl";
// import botanixTestnet from "../src/constants/botanixTestnet.json";
// import erc20Abi from "../src/constants/abi/ERC20.sol.json"
// import { estimateFeesPerGas } from '@wagmi/core'
// import { getContract } from "../src/utils/getContract";
// import Decimal from "decimal.js";
// import { useAccount, useWriteContract, useWalletClient, useWaitForTransactionReceipt, useFeeData } from "wagmi";
// import { BigNumber, ethers } from "ethers";
// import { useCallback, useEffect, useState } from "react";
// import web3, { Web3 } from "web3";
// import { CustomConnectButton } from "@/components/connectBtn";
// import { sepoliaChain, wagmiConfig } from "../src/config/config";
// import { Dialog } from 'primereact/dialog';
// import rej from "../../app/assets/images/TxnError.gif";
// import conf from "../../app/assets/images/conf.gif"
// import rec2 from "../../app/assets/images/rec2.gif"
// import tick from "../../app/assets/images/tick.gif"
// import Image from "next/image";
// import "../../components/stabilityPool/Modal.css"
// import "../../app/App.css"
// import '../App.css';
// import "./redeem.css"

// export default function Redeem() {
//     const [userInput, setUserInput] = useState("0");
//     const [isRecoveryMode, setIsRecoveryMode] = useState<boolean>(false);
//     const [pusdBalance, setPusdBalance] = useState("0");
//     const { address, isConnected } = useAccount();
//     const { data: walletClient } = useWalletClient();
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const web3 = new Web3(BOTANIX_RPC_URL);
//     const { toBigInt } = web3.utils;
//     const [loadingModalVisible, setLoadingModalVisible] = useState(false);
//     const [loadingMessage, setLoadingMessage] = useState("");
//     const [userModal, setUserModal] = useState(false);
//     const [showCloseButton, setShowCloseButton] = useState(false);
//     const { data: hash, writeContract, error: writeError } = useWriteContract();
//     const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
//     const [transactionRejected, setTransactionRejected] = useState(false);
//     const provider = new ethers.providers.JsonRpcProvider(BOTANIX_RPC_URL)
//     const priceFeedContract = getContract(
//         botanixTestnet.addresses.priceFeed,
//         priceFeedAbi,
//         provider
//     );

//     const erc20Contract = getContract(
//         botanixTestnet.addresses.lusdToken,
//         erc20Abi,
//         provider
//     );

//     const handleClose = useCallback(() => {
//         setLoadingModalVisible(false);
//         setUserModal(false);
//         setIsModalVisible(false);
//         setTransactionRejected(false);
//         window.location.reload();
//     }, []);

//     const neTrove = getContract(
//         botanixTestnet.addresses.troveManager,
//         troveManagerContractQ,
//         provider
//     )

//     useEffect(() => {
//         const fetchPrice = async () => {
//             const pusdBalanceValue = await erc20Contract.balanceOf(address);
//             const pusdBalanceFormatted = ethers.utils.formatUnits(pusdBalanceValue, 18);
//             setPusdBalance(pusdBalanceFormatted);
//         };
//         fetchPrice();
//     }, [erc20Contract, address]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch(
//                     "https://api.palladiumlabs.org/sepolia/protocol/metrics"
//                 );
//                 const data = await response.json();
//                 const protocolMetrics = data[0];
//                 setIsRecoveryMode(protocolMetrics.recoveryMode);
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             }
//         };

//         fetchData();
//     }, []);

//     const handlePercentageClick = (percentage: any) => {
//         const percentageDecimal = new Decimal(percentage).div(100);
//         const pusdBalanceNumber = parseFloat(pusdBalance);

//         if (!isNaN(pusdBalanceNumber)) {
//             const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
//             const stakeFixed = maxStake;
//             const roundedStakeFixed = Number(stakeFixed.toFixed(2))
//             setUserInput(String(roundedStakeFixed));
//         } else {
//             console.error("Invalid PUSD balance:", pusdBalance);
//         }
//     };


//     const handleConfirmClick = async () => {
//         setIsModalVisible(true);
//         try {
//             const provider = new ethers.providers.Web3Provider(window.ethereum);
//             const signer = provider.getSigner();
//             const address = await signer.getAddress();
//             console.log('Account Address:', address);
//             const pow = new Decimal(10).pow(18);
//             const fetchedPrice = await priceFeedContract.getPrice();

//             const inputBeforeConv = new Decimal(userInput);
//             const inputValue = BigInt(inputBeforeConv.mul(pow).toFixed(0));

//             const redemptionhint = await readContract(wagmiConfig, {
//                 abi: HintHelpers,
//                 address: '0x59356e69d4447D1225482f966C984Bcc62C3Ef1b',
//                 functionName: 'getRedemptionHints',
//                 args: [
//                     inputValue,
//                     fetchedPrice,
//                     50n
//                 ]
//             });

//             const {
//                 0: firstRedemptionHint,
//                 1: partialRedemptionNewICR,
//                 2: truncatedLUSDAmount,
//             } = redemptionhint;

//             const numTroves = await readContract(wagmiConfig, {
//                 abi: sortedTroves,
//                 address: '0x34C3C2DBe369c23d07fCB7dBf1c6472faf2232Bd',
//                 functionName: 'getSize'
//             });

//             const numTrials = BigInt(numTroves) * 15n;

//             const approxPartialRedemptionHint = await readContract(wagmiConfig, {
//                 abi: HintHelpers,
//                 address: '0x59356e69d4447D1225482f966C984Bcc62C3Ef1b',
//                 functionName: 'getApproxHint',
//                 args: [partialRedemptionNewICR, numTrials, 42n]
//             });

//             const approxPartialRedemptionHintString = approxPartialRedemptionHint[0];

//             const exactPartialRedemptionHint = await readContract(wagmiConfig, {
//                 abi: sortedTroves,
//                 address: '0x34C3C2DBe369c23d07fCB7dBf1c6472faf2232Bd',
//                 functionName: 'findInsertPosition',
//                 args: [partialRedemptionNewICR, approxPartialRedemptionHintString, approxPartialRedemptionHintString]
//             });

//             const feeData = await provider.getFeeData();
//             const maxPriFeeWei = feeData.maxPriorityFeePerGas || 0;
//             const baseFeePerGas = feeData.maxFeePerGas;
//             const maxFeePerGas = baseFeePerGas?.add(maxPriFeeWei);

//             const maxFee = "5".concat("0".repeat(17));
//             console.log(maxFeePerGas, "maxFeePerGas", baseFeePerGas, "baseFeePerGas", maxPriFeeWei, "maxPriFeeWei", feeData, 'feeData')
//             const txParams = {
//                 maxPriorityFeePerGas: maxPriFeeWei,
//                 maxFeePerGas: maxFeePerGas,
//             };

//             console.log(maxPriFeeWei, maxFeePerGas, "ahahah");

//             const contract = new ethers.Contract(botanixTestnet.addresses.troveManager, troveManagerContractQ, signer);
//             const x = await contract.redeemCollateral(
//                 truncatedLUSDAmount,
//                 firstRedemptionHint,
//                 exactPartialRedemptionHint[0],
//                 exactPartialRedemptionHint[1],
//                 partialRedemptionNewICR,
//                 0,
//                 maxFee,
//                 txParams
//             );

//             await x.wait();

//         } catch (error) {
//             console.error(error);
//             setTransactionRejected(true);
//             setUserModal(true);
//         }
//     };


//     useEffect(() => {
//         if (writeError) {
//             console.error('Write contract error:', writeError);
//             setTransactionRejected(true);
//             setUserModal(true);
//         }
//     }, [writeError]);


//     useEffect(() => {
//         if (isLoading) {
//             setIsModalVisible(false);
//             setLoadingMessage("Waiting for transaction to confirm..");
//             setLoadingModalVisible(true);
//         } else if (isSuccess) {
//             setLoadingMessage("Redeem Transaction completed successfully");
//             setLoadingModalVisible(true);
//         } else if (transactionRejected) {
//             setLoadingMessage("Transaction was rejected");
//             setLoadingModalVisible(true);
//         }
//     }, [isSuccess, isLoading, transactionRejected]);



//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setShowCloseButton(true);
//         }, 90000);
//         return () => clearTimeout(timer);
//     }, []);



//     const renderHeader = () => {
//         return (
//             <div className="flex justify-content-between align-items-center">
//                 <Button className="p-button-rounded p-button-text" onClick={() => setUserModal(false)}>
//                     Close
//                 </Button>
//             </div>
//         );
//     };

//     return (
//         <>
//             <div className=" ml-3 md:ml-12 md:w-[40%] w-[22.5rem]">
//                 <div className="grid items-start h-[20rem] gap-x-2  mx-auto border-[2px] border-yellow-400 p-5">
//                     <div>
//                         <div className="flex mb-2 items-center">
//                             <Input id="items" placeholder="0.000 BTC" disabled={!isConnected} value={userInput} onChange={(e) => { const input = e.target.value; setUserInput(input); }}
//                                 className="bg-[#3b351b] body-text w-[20rem] md:w-full text-lg h-14 border border-yellow-300 text-white "
//                             />
//                         </div>
//                         <span className=" ml-[56%] md:ml-[66%] body-text  font-medium balance ">
//                             {isLoading ?
//                                 (<div className="-mt-6 h-3 rounded-xl">
//                                     <div className="hex-loader"></div>
//                                 </div>
//                                 ) : (
//                                     <span className="whitespace-nowrap -ml-2 text-white body-text">Wallet: {" "}
//                                         <span className="body-text text-sm">
//                                             {Number(pusdBalance).toFixed(2) || ".."} PUSD
//                                         </span>
//                                     </span>
//                                 )}
//                         </span>
//                     </div>
//                     <div className="flex w-full justify-between">
//                         <Button disabled={!isConnected || isLoading} className={`text-lg body-text border-2 border-yellow-300 ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(25)}>25%</Button>
//                         <Button disabled={!isConnected || isLoading} className={`text-lg body-text border-2 border-yellow-300 ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(50)}>50%</Button>
//                         <Button disabled={!isConnected || isLoading} className={`text-lg body-text border-2 border-yellow-300 ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(75)}>75%</Button>
//                         <Button disabled={!isConnected || isLoading || Number(userInput) > Number(pusdBalance)} className={`text-lg body-text border-2 border-yellow-300 ${isLoading || Number(userInput) > Number(pusdBalance) ? 'cursor-not-allowed opacity-50' : ''}`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(100)}>100% </Button>
//                     </div>

//                     {isConnected ? (
//                         <div className="space-y-2">
//                             <button style={{ backgroundColor: "#f5d64e" }} onClick={handleConfirmClick} className={`mt-5  text-black title-text font-semibold w-[20rem] md:w-full border border-black h-10 ${isLoading || Number(userInput) > Number(pusdBalance) || Number(userInput) == 0 ? 'cursor-not-allowed opacity-50' : ''}`} disabled={isLoading || Number(userInput) > Number(pusdBalance)}>
//                                 {isLoading ? 'LOADING...' : 'REDEEM'}
//                             </button>
//                             <div>
//                                 {isRecoveryMode && <span className="body-text pt-2 text-gray-300 text-xl w-2">System Is In Recovery Mode !</span>}
//                             </div>
//                         </div>
//                     ) : (
//                         <CustomConnectButton className="" />
//                     )}
//                 </div>
//             </div>
//             <Dialog visible={isModalVisible} onHide={() => setIsModalVisible(false)}>
//                 <div className="dialog-overlay">
//                     <div className="dialog-content">
//                         <div className="py-5">
//                             <Image src={rec2} alt="box" width={140} className="" />
//                         </div>
//                         <div className="waiting-message text-lg title-text2 text-yellow-300 whitespace-nowrap">Transaction is initiated</div>
//                         <div className="text-sm title-text2 text-[#bebdb9] whitespace-nowrap">Please confirm in Metamask.</div>
//                     </div>
//                 </div>
//             </Dialog>
//             <Dialog visible={userModal} onHide={() => setUserModal(false)} header={renderHeader}>
//                 <div className="dialog-overlay">
//                     <div className="dialog-content">
//                         <div className="waiting-message text-lg title-text2 whitespace-nowrap">Transaction rejected</div>
//                         <div className="py-5">
//                             <Image src={rej} alt="box" width={140} className="" />
//                         </div>
//                         <Button className="p-button-rounded text-black title-text2 " onClick={() => setUserModal(false)}>Close</Button>
//                     </div>
//                 </div>
//             </Dialog>
//             <Dialog visible={loadingModalVisible} onHide={() => setLoadingModalVisible(false)}>
//                 <div className="dialog-overlay">
//                     <div className="dialog-content">
//                         {loadingMessage === 'Waiting for transaction to confirm..' ? (
//                             <>
//                                 <Image src={conf} alt="rectangle" width={150} />
//                                 <div className="my-5 ml-[6rem] mb-5"></div>
//                             </>
//                         ) : loadingMessage === 'Redeem Transaction completed successfully' ? (
//                             <Image src={tick} alt="tick" width={200} />
//                         ) : transactionRejected ? (
//                             <Image src={rej} alt="rejected" width={140} />
//                         ) : (
//                             <Image src={conf} alt="box" width={140} />
//                         )}
//                         <div className="waiting-message title-text2 text-white whitespace-nowrap">{loadingMessage}</div>
//                         {isSuccess && (
//                             <button className="mt-1 p-3 text-black title-text2 hover:scale-95 bg-[#f5d64e]" onClick={handleClose}>Go Back to the Stake Page</button>
//                         )}
//                         {(transactionRejected || (!isSuccess && showCloseButton)) && (
//                             <>
//                                 <p className="text-red-400 body-text">{transactionRejected ? "Transaction was rejected. Please try again." : "Some Error Occurred On Network Please Try Again After Some Time.. 🤖"}</p>
//                                 <Button className="p-button-rounded p-button-text text-black title-text2" onClick={handleClose}>Close</Button>
//                             </>
//                         )}
//                     </div>
//                 </div>
//             </Dialog>
//         </>
//     );
// }
