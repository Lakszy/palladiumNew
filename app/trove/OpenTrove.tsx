"use client";

import { Label } from "@/components/ui/label";
import hintHelpersAbi from "../src/constants/abi/HintHelpers.sol.json";
import erc20Abi from "../src/constants/abi/ERC20.sol.json"
import sortedTroveAbi from "../src/constants/abi/SortedTroves.sol.json";
import troveManagerAbi from "../src/constants/abi/TroveManager.sol.json";
import adminConAbi from "../src/constants/abi/AdminContract.sol.json"
import botanixTestnet from "../src/constants/botanixTestnet.json";
import { getContract } from "../src/utils/getContract";
import Decimal from "decimal.js";
import { ethers, JsonRpcSigner } from "ethers";
import info from "../assets/images/info.svg";
import btc from "../assets/images/btclive.svg";
import rej from "../assets/images/TxnError.gif";
import conf from "../assets/images/conf.gif"
import rec2 from "../assets/images/rec2.gif"
import tick from "../assets/images/tick.gif"
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { useWaitForTransactionReceipt, useWalletClient, useWriteContract } from "wagmi";
import { BorrowerOperationbi } from "../src/constants/abi/borrowerOperationAbi";
import Image from "next/image";
import img4 from "../assets/images/Group 666.svg";
import trove1 from "../assets/images/TROVE3.svg";
import { Button } from "@/components/ui/button";
import "./opentroves.css"
import { Dialog } from "primereact/dialog";
import { Tooltip } from "primereact/tooltip";
import { useAccounts } from "@particle-network/btc-connectkit";
import Web3 from "web3";

export const OpenTrove = () => {
  const [userInputs, setUserInputs] = useState({
    collatoral: "",
    borrow: "",
  });
  const [isloading, setIsLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [minDebt, setMinDebt] = useState(0)
  const [borrowRate, setBorrowRate] = useState(0)
  const [lr, setLR] = useState(0)
  const [cCr, setCCR] = useState(0)
  const [mCR, setMCR] = useState(0)
  const [fetchedPrice, setFetchedPrice] = useState(0)
  const [recoveryMode, setRecoveryMode] = useState<boolean>()
  const [message, setMessage] = useState("");
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { data: hash, writeContract, error: writeError } = useWriteContract()
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({ hash });
  const [transactionRejected, setTransactionRejected] = useState(false);
  const [balanceData, setBalanceData] = useState<any>()
  const [aprvAmnt, setAprvAmt] = useState<BigInt>(BigInt(0));

  useEffect(() => {
    if (isLoading) {
      setIsModalVisible(false);
      setLoadingMessage("Waiting for transaction to confirm..");
      setLoadingModalVisible(true);
    } else if (isSuccess) {
      setLoadingMessage("Open Trove Transaction completed successfully");
      setLoadingModalVisible(true);
    } else if (transactionRejected) {
      setLoadingMessage("Transaction was rejected");
      setLoadingModalVisible(true);
    } else {
      setLoadingModalVisible(false);
    }
  }, [isSuccess, isLoading, transactionRejected]);

  const [calculatedValues, setCalculatedValues] = useState({
    expectedFee: 0,
    expectedDebt: 0,
    collateralRatio: 0,
  });

  const { data: isConnected } = useWalletClient();
  const { data: walletClient } = useWalletClient();
  const BOTANIX_RPC_URL2 = "https://rpc.test.btcs.network";

  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL2);
  const erc20Contract = getContract("0x5FB4E66C918f155a42d4551e871AD3b70c52275d", erc20Abi, provider);
  const providerTwo = new ethers.JsonRpcSigner(provider, walletClient?.account?.address as string)
  // const signer = provider.getSigner(walletClient?.account?.address);
  const signer = new JsonRpcSigner(provider, walletClient?.account?.address as string)
  const signerToken = new JsonRpcSigner(provider, "0x5FB4E66C918f155a42d4551e871AD3b70c52275d")
  const collToken = new ethers.Contract(
    "0x5FB4E66C918f155a42d4551e871AD3b70c52275d", // ERC20 token address
    erc20Abi, // ERC20 token ABI
    signer
  )
  const getEtherContract = (address: string, abi: any, provider: any) => {
    return new ethers.Contract(address, abi, provider);
  };


  const web3 = new Web3(window.ethereum)
  const tokenAddress = "0x5FB4E66C918f155a42d4551e871AD3b70c52275d"
  const spenderAddress = walletClient?.account?.address
  const amount = web3.utils.toWei("100", "ether");
  const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);

  const contract = getEtherContract(
    "0x5FB4E66C918f155a42d4551e871AD3b70c52275d",
    erc20Abi,
    signerToken
  );

  const sortedTrovesContract = getContract(
    botanixTestnet.addresses.SortedVessels,
    sortedTroveAbi,
    provider
  );

  const troveManagerContract = getContract(
    botanixTestnet.addresses.VesselManager,
    troveManagerAbi,
    provider
  );

  const adminContract = getContract(
    botanixTestnet.addresses.AdminContract,
    adminConAbi,
    provider
  );

  const hintHelpersContract = getContract(
    botanixTestnet.addresses.VesselManagerOperations,
    hintHelpersAbi,
    provider
  );


  const pow18 = Decimal.pow(10, 18);
  const pow6 = Decimal.pow(10, 6);
  const pow20 = Decimal.pow(10, 20);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.palladiumlabs.org/core/protocol/metrics");
        const data = await response.json();
        const protocolMetrics = data[0].metrics[1]; // Fetch the metrics for WCORE (at index 1)
        setRecoveryMode(protocolMetrics.recoveryMode);
        setFetchedPrice(protocolMetrics.price);
        setMCR(protocolMetrics.MCR);
        setCCR(protocolMetrics.CCR);
        setLR(protocolMetrics.LR);
        setBorrowRate(protocolMetrics.borrowRate);
        setMinDebt(protocolMetrics.minDebt);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


  const handleConfirmClick = async (xBorrow: string, xCollatoral: string) => {
    try {
      setIsModalVisible(true);

      await  handleApproveClick(xCollatoral);
      // from here we can approve and to txn from a single click in a flow
      const status = await troveManagerContract.getVesselStatus(
        "0x5FB4E66C918f155a42d4551e871AD3b70c52275d",
        walletClient?.account.address
      );

      const allowance = await tokenContract.methods.allowance("0x5FB4E66C918f155a42d4551e871AD3b70c52275d", spenderAddress).call();
      const collValue = Number(xCollatoral);
      const borrowValue = Number(xBorrow);
      const expectedFeeFormatted = (borrowRate * borrowValue) / 100;
      const expectedDebt = borrowValue + expectedFeeFormatted + lr;
      let NICR = collValue / expectedDebt;
      const NICRDecimal = new Decimal(NICR.toString());
      const NICRBigint = BigInt(NICRDecimal.mul(pow20).toFixed());

      const numTroves = await sortedTrovesContract.getSize("0x5FB4E66C918f155a42d4551e871AD3b70c52275d");
      const minDebt = await adminContract.getMinNetDebt("0x5FB4E66C918f155a42d4551e871AD3b70c52275d");
      const minDebtInDecimal = new Decimal(minDebt.toString()).div(pow18);
      const numTrials = numTroves * BigInt("15");
      const { 0: approxHint } = await hintHelpersContract.getApproxHint(
        "0x5FB4E66C918f155a42d4551e871AD3b70c52275d",
        NICRBigint,
        numTrials,
        42
      );

      const { 0: upperHint, 1: lowerHint } = await sortedTrovesContract.findInsertPosition(
        "0x5FB4E66C918f155a42d4551e871AD3b70c52275d",
        NICRBigint,
        approxHint,
        approxHint
      );

      const collDecimal = new Decimal(collValue.toString());
      const collBigint = BigInt(collDecimal.mul(pow18).toFixed());

      const borrowDecimal = new Decimal(borrowValue.toString());
      const borrowBigint = BigInt(borrowDecimal.mul(pow18).toFixed());

      await writeContract({
        abi: BorrowerOperationbi,
        address: "0x6117bde97352372eb8041bc631738402DEfA79a4",
        functionName: "openVessel",
        args: ["0x5FB4E66C918f155a42d4551e871AD3b70c52275d", collBigint, borrowBigint, upperHint, lowerHint],
      });

    } catch (error) {
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
    if (hash) {
      setIsModalVisible(false);
    }
  }, [hash]);

  const makeCalculations = async (xBorrow: string, xCollatoral: string) => {
    setIsLoading(true)
    try {
      const collValue = Number(xCollatoral);
      const borrowValue = Number(xBorrow);

      const expectedFeeFormatted = (borrowRate * borrowValue);
      const expectedDebt = Number(borrowValue + expectedFeeFormatted + lr);

      const collRatio = (collValue * fetchedPrice * 100) / Number(expectedDebt);

      setCalculatedValues({
        ...calculatedValues,
        expectedFee: expectedFeeFormatted,
        expectedDebt,
        collateralRatio: collRatio,
      });
    }
    catch (error) {
      console.error(error)
    }
    finally {
      setIsLoading(false)
    }
  };

  const fetchPrice = async () => {
    const collateralValue = await erc20Contract.balanceOf(walletClient?.account?.address);
    const collateralValueFormatted = ethers.formatUnits(collateralValue, 18)
    setBalanceData(collateralValueFormatted)
  };
  useEffect(() => {
    fetchPrice();
  }, [fetchPrice, walletClient?.account?.address, walletClient, writeContract, hash]);

  const handleClose = () => {
    setLoadingModalVisible(false);
    setUserModal(false);
    window.location.reload()
  };
  const handlePercentageClick = (percentage: any) => {
    const percentageDecimal = new Decimal(percentage).div(100);
    const pusdBalanceNumber = parseFloat(maxBorrow.toString());
    if (!isNaN(pusdBalanceNumber)) {
      const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
      const stakeFixed = maxStake.toFixed(2);
      setUserInputs({ collatoral: userInputs.collatoral, borrow: stakeFixed });

    } else {
      console.error("Invalid PUSD balance:");
    }
  };

  const handlePercentageClickBTC = (percentage: any) => {
    const percentageDecimal = new Decimal(percentage).div(100);

    const pusdBalanceNumber = parseFloat(balanceData || '0');

    if (!isNaN(pusdBalanceNumber)) {
      const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
      const stakeFixed = maxStake.toFixed(8);

      setUserInputs({ collatoral: stakeFixed, borrow: userInputs.borrow });
    } else {
      console.error("Invalid PUSD balance:", balanceData);
    }
  };

  const getApprovedAmount = async (ownerAddress: string | undefined, spenderAddress: string | undefined) => {
    try {
      const approvedAmount = await tokenContract.methods.allowance(ownerAddress, spenderAddress).call() as BigInt;
      console.log("Approved amount:", approvedAmount);
      if (approvedAmount != null) {
        setAprvAmt(approvedAmount);
        return approvedAmount;
      } else {
        console.error("Approved amount is null or undefined");
        return null;
      }
    } catch (error) {
      console.error("Error fetching approved amount:", error);
      return null;
    }
  };

  const handleCheckApprovedClick = async () => {
    const userAddress = walletClient?.account?.address;
    const approvedAmount = await getApprovedAmount(userAddress, spenderAddress);
    if (approvedAmount) {
      setAprvAmt(approvedAmount);
    } else {
      console.error("Could not retrieve approved amount.");
    }
  };

  useEffect(() => {
    if (walletClient?.account?.address && spenderAddress) {
      handleCheckApprovedClick();
    }
  }, [walletClient?.account?.address, spenderAddress]);

  const handleApproveClick = async (amount: string) => {
    try {
      const userAddress = walletClient?.account?.address;
      const gasPrice = (await web3.eth.getGasPrice()).toString();
      // const amountInWei = (parseFloat(amount) * 1000000).toString();
      const amountInWei = web3.utils.toWei(amount, 'ether'); // Converts directly to Wei as a string
      const tx = await tokenContract.methods.approve("0x6117bde97352372eb8041bc631738402DEfA79a4", amountInWei).send({ from: userAddress, gasPrice: gasPrice });

      if (tx.status) {
        alert("Transaction successful!");
      } else {
        alert("Transaction failed. Please try again.");
      }
    } catch (error) {
      const e = error as { code?: number; message?: string };
      if (e.code === 4001) {
        console.error("User rejected the transaction:", e.message);
        alert("Transaction rejected by the user.");
      } else {
        console.error("Error during token approval:", e.message);
        alert("An error occurred during token approval. Please try again.");
      }
    }
  };

  useDebounce(() => {
    makeCalculations(userInputs.borrow, userInputs.collatoral);
  }, 10, [userInputs.borrow, userInputs.collatoral]
  );

  const totalCollateral = Number(userInputs.collatoral) * fetchedPrice;
  const divideBy = recoveryMode ? cCr : mCR;
  const maxBorrow = totalCollateral / Number(divideBy)
    - (lr + calculatedValues.expectedFee);
  const loanToValue = (calculatedValues.expectedDebt * 100) / (totalCollateral || 1);
  const liquidationPrice = (Number(divideBy) * calculatedValues.expectedDebt) / (Number(Number(userInputs.collatoral)) || 1);
  const bothInputsEntered = userInputs.collatoral !== "0" && userInputs.borrow !== "0";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCloseButton(true);
    }, 180000);
    return () => clearTimeout(timer);
  }, []);


  return (
    <>
      <div className="h-full pt-3 body-text md:ml-0">
        <div className="p-10 ">
          <div className="md:ml-2 flex items-center gap-x-3 -ml-6 h-[2rem] p-2 md:w-full w-[22.5rem]">
            <button onClick={() => window.history.back()} className="text-white hover:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <Image src={trove1} alt="btc" width={50} />
            <p className="body-text text-2xl font-semibold text-white">wCORE Trove</p>
          </div>
        </div>

        <div className="container flex flex-col md:flex-row justify-between gap-x-28 md:-mt-6">
          <div className="grid w-1/2 items-start space-y-7 gap-2 text-white md:p-5">
            <div className="w-full">
              <Label htmlFor="items" className="text-[#827f77] md:-ml-0 -ml-2 body-text text-lg">Deposit Collateral</Label>
              <div className="flex md:w-[90%] items-center space-x-2 mt-[10px] -ml-3  w-[22rem] md:-ml-0 border border-yellow-300">
                <div className='flex items-center  h-[3.5rem] '>
                  <Image src={btc} alt="home" className='ml-1' />
                  <h3 className='text-gray-400 body-text font-medium ml-1 mr-3 hidden md:block'>WCORE</h3>
                  <h3 className='h-full border border-yellow-300 text-yellow-300 mx-3'></h3>
                </div>
                <input id="items" placeholder="" value={userInputs.collatoral} onChange={(e) => { const newCollValue = e.target.value; setUserInputs({ ...userInputs, collatoral: newCollValue }); makeCalculations(userInputs.borrow, newCollValue || "0"); }} className=" w-[12.5rem] md:w-[20.75rem] body-text font-medium h-[4rem] pl-3 text-gray-400" style={{ backgroundColor: "#272315" }} />
                <span className="md:max-w-[fit]  md:p-2 mr-1 md:mr-0 font-medium text-gray-400 body-text h-full">${totalCollateral.toFixed(2)}</span>
              </div>
              <div className="pt-2 w-[90%] flex md:-ml-0 -ml-2 mt-[10px]  md:flex-row flex-col items-center justify-between ">
                <span className={`text-sm body-text w-full body-text font-medium whitespace-nowrap ${parseFloat(userInputs.collatoral) > Number(balanceData) ? 'text-red-500' : 'text-white'}`}>
                  <span className="body-text text-gray-400 font-medium ">Available</span> {Number(balanceData).toFixed(2)}{" "}
                </span>
                {/* <Button onClick={() => handleApproveClick(userInputs.collatoral)}>Approve</Button> */}
                <div className="flex gap-x-4 md:gap-x-2 w-full   mt-2">
                  <Button disabled={!(isConnected)} className={`text-sm border border-yellow-300  body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(25)}>25%</Button>
                  <Button disabled={!(isConnected)} className={`text-sm border border-yellow-300 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(50)}>50%</Button>
                  <Button disabled={!(isConnected)} className={`text-sm border border-yellow-300 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(75)}>75%</Button>
                  <Button disabled={!(isConnected)} className={`text-sm border border-yellow-300 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(100)}>100%</Button>
                </div>
              </div>
            </div>
            <div className="w-full">
              <Label className="text-[#827f77] md:-ml-0 -ml-2   body-text text-lg" htmlFor="quantity">Borrow PUSD</Label>
              <div className="flex  md:w-[90%] items-center md:space-x-2 mt-[10px] -ml-3 md:-ml-0 border border-yellow-300">
                <div className='flex items-center h-[3.5rem] '>
                  <Image src={img4} alt="home" className='ml-1' />
                  <h3 className='text-gray-400 body-text font-medium hidden md:block mx-1'>PUSD</h3>
                  <h3 className='h-full border border-yellow-300 text-yellow-300 mx-4'></h3>
                </div>
                <input id="quantity" placeholder="" value={userInputs.borrow} onChange={(e) => { const newBorrowValue = e.target.value; setUserInputs({ ...userInputs, borrow: newBorrowValue }); makeCalculations(userInputs.collatoral, newBorrowValue || "0"); }} className="md:w-[23.75rem] h-[4rem] text-gray-400 body-text font-medium" style={{ backgroundColor: "#272315" }} />
              </div>
              <div className="pt-2 w-[90%] flex flex-col md:flex-row md:-ml-0 -ml-5 mt-[10px]   items-center justify-between  p-2">
                <span className={`text-sm font-medium w-full body-text whitespace-nowrap ${parseFloat(userInputs.borrow) > maxBorrow ? 'text-red-500' : 'text-white'}`}>
                  <span className="body-text text-gray-400 font-medium ">Available</span> {maxBorrow >= 0 ? Math.floor(maxBorrow * 100) / 100 : "0.00"}
                </span>
                <div className="flex gap-x-4 md:gap-x-2 w-full -mr-2  mt-2">
                  <Button disabled={!(isConnected)} className={`text-sm border border-yellow-300  body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(25)}>25%</Button>
                  <Button disabled={!(isConnected)} className={`text-sm border border-yellow-300 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(50)}>50%</Button>
                  <Button disabled={!(isConnected)} className={`text-sm border border-yellow-300 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(75)}>75%</Button>
                  <Button disabled={!(isConnected)} className={`text-sm border border-yellow-300 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(100)}>100%</Button>
                </div>
              </div>
              {Number(userInputs.borrow) < minDebt && (Number(userInputs.borrow) > 0) && (
                <span className="text-red-500 body-text">Borrow amount should be greater than {minDebt} </span>
              )}
            </div>
            <button
              onClick={() => handleConfirmClick(userInputs.borrow, userInputs.collatoral)}
              className={`mt-5 md:-ml-0 -ml-4 w-[90%] h-[3rem] bg-yellow-300 title-text text-black font-bold ${(!userInputs.borrow || !userInputs.collatoral) ? ' cursor-not-allowed opacity-50' : 'hover:scale-95 bg-yellow-300'}`}
              disabled={!userInputs.borrow || !userInputs.collatoral || loanToValue > (100 / Number(divideBy))
                || parseFloat(userInputs.borrow) > maxBorrow || parseFloat(userInputs.collatoral) > Number(balanceData)
                || parseFloat(userInputs.borrow) <= minDebt || isModalVisible}
              style={{
                cursor: (!userInputs.borrow || isModalVisible ||
                  !userInputs.collatoral ||
                  loanToValue > (100 / Number(divideBy)) ||
                  parseFloat(userInputs.borrow) > maxBorrow ||
                  parseFloat(userInputs.collatoral) > Number(balanceData) ||
                  parseFloat(userInputs.borrow) <= minDebt)
                  ? 'not-allowed' : 'pointer',
                opacity: (!userInputs.borrow || isModalVisible ||
                  !userInputs.collatoral ||
                  loanToValue > (100 / Number(divideBy)) ||
                  parseFloat(userInputs.borrow) > maxBorrow ||
                  parseFloat(userInputs.collatoral) > Number(balanceData) ||
                  parseFloat(userInputs.borrow) <= minDebt)
                  ? 0.5 : 1
              }}>
              {isModalVisible ? "Opening Trove..." : "Open Trove"}
            </button>
          </div>
          {bothInputsEntered && Number(userInputs.borrow) >= minDebt && parseFloat(userInputs.collatoral) < Number(balanceData) ? (
            <div className="md:w-4/5 w-full mt-[55px] p-5 border-yellow-200 h-fit space-y-10  text-white"
              style={{ backgroundColor: "#2e2a1c" }}>
              <div className="flex whitespace-nowrap justify-between">
                <div className="flex items-center">
                  <span className="body-text text-sm font-medium text-[#827f77]">Loan-To-Value</span>
                  <Image
                    width={15}
                    className="toolTipHolding14 ml_5"
                    src={info}
                    data-pr-tooltip=""
                    alt="info"
                  />
                  <Tooltip
                    className="custom-tooltip title-text2"
                    target=".toolTipHolding14"
                    content="It is a ratio that measures the amount of a loan compared to the value of the collateral."
                    mouseTrack
                    mouseTrackLeft={10}
                  />
                </div>
                {!isloading ? <span className={`overflow-x-clip text-sm body-text font-medium ${loanToValue > (100 / Number(divideBy)) ? 'text-red-500' : 'text-yellow-300'}`}>{loanToValue.toFixed(2)} % </span> : "--"}
              </div>
              <div className="flex body-text whitespace-nowrap justify-between">
                <div className="flex items-center">
                  <span className="body-text text-sm font-medium text-[#827f77]">Liq. Reserve</span>
                  <Image
                    width={15}
                    className="toolTipHolding7 ml_5 -mt-[px]"
                    src={info}
                    data-pr-tooltip=""
                    alt="info"
                  />
                  <Tooltip
                    className="custom-tooltip title-text2"
                    target=".toolTipHolding7"
                    mouseTrack
                    content="The amount of PUSD set aside as a buffer to cover potential liquidation. This reserve helps ensure that there are sufficient funds to handle any shortfalls or losses that may occur."
                    mouseTrackLeft={10}
                  />
                </div>
                <span className="body-text text-sm body-text font-medium">
                  {lr} PUSD
                </span>
              </div>
              <div className="flex justify-between">
                <div className="items-center flex">
                  <span className=" text-sm body-text font-medium text-[#827f77]">Liquidation Price</span>
                  <Image
                    width={15}
                    className="toolTipHolding15 ml_5"
                    src={info}
                    data-pr-tooltip=""
                    alt="info"
                  />
                  <Tooltip
                    className="custom-tooltip title-text2"
                    target=".toolTipHolding15"
                    content="The PUSD value at which your Vault will drop below 110% Collateral Ratio and be at risk of liquidation. You should manage your position to avoid liquidation by monitoring normal mode liquidation price."
                    mouseTrack
                    mouseTrackLeft={10}
                  />
                </div>
                <span className=" text-sm body-text font-medium">{liquidationPrice.toFixed(2)} PUSD</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="text-sm body-text font-medium text-[#827f77]">Borrowing Fee</span>
                  <Image
                    width={15}
                    className="toolTipHolding12 ml_5"
                    src={info}
                    data-pr-tooltip=""
                    alt="info"
                  />
                  <Tooltip
                    className="custom-tooltip title-text2"
                    target=".toolTipHolding12"
                    mouseTrack
                    content="The ratio of the PUSD value of the entire system collateral divided by the entire system debt."
                    mouseTrackLeft={10}
                  />
                </div>
                <span className="text-sm body-text font-medium">
                  {calculatedValues.expectedFee.toFixed(2)} PUSD
                </span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className=" text-sm body-text font-medium text-[#827f77]">Total Debt</span>
                  <Image
                    width={15}
                    className="toolTipHolding16 ml_5"
                    src={info}
                    data-pr-tooltip=""
                    alt="info"
                  />
                  <Tooltip
                    className="custom-tooltip title-text2"
                    target=".toolTipHolding16"
                    content="Total amount of PUSD borrowed + liquidation reserve (200 PUSD) + borrowing fee at time of loan issuance."
                    mouseTrack
                    mouseTrackLeft={10}
                  />
                </div>
                {Number((calculatedValues.expectedDebt)) > lr ? <span className=" text-sm body-text font-medium">{(calculatedValues.expectedDebt).toFixed(2)} {" "} PUSD</span> : "---"}
              </div>
              <div className="flex justify-between">
                <div className="flex items-center ">
                  <span className=" text-sm body-text font-medium text-[#827f77]">Total Collateral</span>
                  <Image
                    width={15}
                    className="toolTipHolding17 ml_5 -mt-[2px] "
                    src={info}
                    data-pr-tooltip=""
                    alt="info"
                  />
                  <Tooltip
                    className="custom-tooltip title-text2"
                    target=".toolTipHolding17"
                    content="The ratio of the USD value of the entire system collateral divided by the entire system debt."
                    mouseTrack
                    mouseTrackLeft={10}
                  />
                </div>
                <span className=" text-sm body-text font-medium">{(totalCollateral).toFixed(2)} {" "} PUSD</span>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div >
      <Dialog visible={isModalVisible} onHide={() => setIsModalVisible(false)}>
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="py-5">
              <Image src={rec2} alt="box" width={140} className="" />
            </div>
            <div className="p-5">
              <div className="waiting-message text-lg title-text2 text-yellow-300 whitespace-nowrap">Transaction is initiated</div>
              <div className="text-sm title-text2 text-[#bebdb9] whitespace-nowrap">Please confirm in Metamask.</div>
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog visible={loadingModalVisible} onHide={() => setLoadingModalVisible(false)}>
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="p-5">
              {loadingMessage === 'Waiting for transaction to confirm..' ? (
                <>
                  <Image src={conf} alt="rectangle" width={150} />
                  <div className="my-5 ml-[6rem] mb-5"></div>
                </>
              ) : loadingMessage === 'Open Trove Transaction completed successfully' ? (
                <Image src={tick} alt="tick" width={200} />
              ) : transactionRejected ? (
                <Image src={rej} alt="rejected" width={140} />
              ) : (
                <Image src={conf} alt="box" width={140} />
              )}
              <div className="waiting-message title-text2 text-yellow-300">{loadingMessage}</div>
              {isSuccess && (
                <button className="mt-1 p-3 text-black title-text2 hover:scale-95 bg-[#f5d64e]" onClick={handleClose}>Close</button>
              )}
              {(transactionRejected || (!isSuccess && showCloseButton)) && (
                <>
                  <p className="body-text text-white text-xs">{transactionRejected ? "Transaction was rejected. Please try again." : "Some Error Occurred On Network Please Try Again After Some Time.. 🤖"}</p>
                  <Button className=" mt-1 p-3 hover:bg-yellow-400 rounded-none md:w-[20rem] text-black title-text2 hover:scale-95 bg-[#f5d64e]" onClick={handleClose}>Try again</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};
