"use client";
import { Label } from "@/components/ui/label";
import hintHelpersAbi from "../src/constants/abi/HintHelpers.sol.json";
import sortedTroveAbi from "../src/constants/abi/SortedTroves.sol.json";
import rec2 from "../../app/assets/images/rec2.gif"
import conf from "../../app/assets/images/conf.gif"
import tick from "../../app/assets/images/tick.gif"
import rej from "../../app/assets/images/TxnError.gif"
import erc20Abi from "../src/constants/abi/ERC20.sol.json"
import botanixTestnet from "../src/constants/botanixTestnet.json";
import { getContract } from "../src/utils/getContract";
import Decimal from "decimal.js";
import { ethers, toBigInt } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { useDebounce } from "react-use";
import { useAccount, useWaitForTransactionReceipt, useWalletClient, useWriteContract } from "wagmi";
import Image from "next/image";
import img3 from "../assets/images/Group 661.svg";
import img4 from "../assets/images/Group 666.svg";
import info from "../assets/images/info.svg";
import "../../components/stabilityPool/Modal.css"
import "../../app/App.css"
import { Button } from "@/components/ui/button";
import { Dialog } from "primereact/dialog";
import { BorrowerOperationbi } from "../src/constants/abi/borrowerOperationAbi";
import { Tooltip } from "primereact/tooltip";
import { useAccounts } from "@particle-network/btc-connectkit";
import Web3 from "web3";

interface Props {
  coll: number;
  debt: number;
  lr: number;
  fetchedPrice: number;
  minDebt: number;
  borrowRate: number;
  recoveryMode: boolean;
  cCR: number;
  mCR: number;
  troveStatus?: string
}

export const RepayBTC: React.FC<Props> = ({ coll, debt, lr, fetchedPrice, recoveryMode, minDebt, cCR, mCR }) => {
  const [userInputs, setUserInputs] = useState({
    lusdAmount: "0",
    coll: "0",
  });

  const [hasGotStaticData, setHasGotStaticData] = useState(false);
  const [totalDebt, setTotalDebt] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ltv, setLtv] = useState(0);
  const [price, setPrice] = useState(0);
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [totalColl, setTotalColl] = useState(0);
  const { isConnected } = useAccount();
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [userInputColl, setUserInputColl] = useState(0)
  const [userInputDebt, setUserInputDebt] = useState(0)
  const [newAvailColl, setNewAvailColl] = useState(0)
  const [staticLtv, setStaticLtv] = useState(0);
  const { data: walletClient } = useWalletClient();
  const BOTANIX_RPC_URL2 = "https://rpc.test.btcs.network";
  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL2);
  const { data: hash, writeContract, error: writeError } = useWriteContract()
  const [transactionRejected, setTransactionRejected] = useState(false);
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({ hash });
  const { accounts } = useAccounts();
  const [aprvAmnt, setAprvAmt] = useState<BigInt>(BigInt(0));
  const web3 = new Web3(window.ethereum)
  const tokenAddress = "0x4CE937EBAD7ff419ec291dE9b7BEc227e191883f"
  const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);
  const spenderAddress = walletClient?.account?.address

  const handleClose = useCallback(() => {
    setLoadingModalVisible(false);
    setUserModal(false);
    setIsModalVisible(false);
    setTransactionRejected(false);
    window.location.reload();
  }, []);

  const sortedTrovesContract = getContract(
    botanixTestnet.addresses.SortedVessels,
    sortedTroveAbi,
    provider
  );

  const hintHelpersContract = getContract(
    botanixTestnet.addresses.VesselManagerOperations,
    hintHelpersAbi,
    provider
  );

  useEffect(() => {
    const pow = Decimal.pow(10, 18);
    const _1e18 = toBigInt(pow.toFixed());
    const fetchedData = async () => {
      if (!walletClient) return null;

      const collDecimal = new Decimal(coll.toString());
      const collFormatted = collDecimal.div(_1e18.toString()).toString();

    };
    const getStaticData = async () => {
      if (!walletClient) return null;
      if (!provider || hasGotStaticData) return null;
      const ltvValue = (Number(debt) * 100) / ((Number(coll) * Number(fetchedPrice)) || 1);
      setStaticLtv(ltvValue);
      setHasGotStaticData(true);
    };
    // getTroveStatus();
    fetchedData();
    getStaticData();
  }, [walletClient]);

  useDebounce(
    () => {
      makeCalculations(userInputs.lusdAmount, userInputs.coll);
    },
    10,
    [userInputs.lusdAmount, userInputs.coll]
  );

  const handleConfirmClick = async (xLusdAmount: string, xColl: string) => {
    try {
      if (!walletClient) {
        return null;
      }

      setIsModalVisible(true);
      const pow20 = Decimal.pow(10, 20);
      const pow18 = Decimal.pow(10, 18);

      const lusdValue = Number(xLusdAmount);
      const collValue = Number(xColl);
      const allowance = await tokenContract.methods.allowance("0x4CE937EBAD7ff419ec291dE9b7BEc227e191883f", spenderAddress).call();

      const newDebt = Number(debt) - lusdValue;
      const newColl = Number(coll) - collValue;

      let NICR = newColl / newDebt;
      const NICRDecimal = new Decimal(NICR.toString());
      const NICRBigint = BigInt(NICRDecimal.mul(pow20).toFixed(0));

      const numTroves = await sortedTrovesContract.getSize("0x4CE937EBAD7ff419ec291dE9b7BEc227e191883f");
      const numTrials = numTroves * BigInt("15");

      const { 0: approxHint } = await hintHelpersContract.getApproxHint(
        "0x4CE937EBAD7ff419ec291dE9b7BEc227e191883f",
        NICRBigint,
        numTrials,
        42
      );

      const { 0: upperHint, 1: lowerHint } = await sortedTrovesContract.findInsertPosition(
        "0x4CE937EBAD7ff419ec291dE9b7BEc227e191883f",
        NICRBigint,
        approxHint,
        approxHint
      );

      const collDecimal = new Decimal(collValue.toString());
      const collBigint = BigInt(collDecimal.mul(pow18).toFixed());

      const lusdDecimal = new Decimal(lusdValue.toString());
      const lusdBigint = BigInt(lusdDecimal.mul(pow18).toFixed());

      const borrowOpt = await writeContract({
        abi: BorrowerOperationbi,
        address: '0x6117bde97352372eb8041bc631738402DEfA79a4',
        functionName: 'adjustVessel',
        args: [
          "0x4CE937EBAD7ff419ec291dE9b7BEc227e191883f", //tokenAddress
          0, //_assetSent
          collBigint, // collateral withdraw 0 in case of borrow
          lusdBigint, // debt change how much is added in case of borrow
          lusdValue >= 0 ? false : true, //isDebtIncrease 
          upperHint, lowerHint
        ]
      });

      // address _asset, _assetSent, //  _collWithdrawal,// _debtChange,bool// isDebtIncrease,address _upperHint,address _lowerHint)

    } catch (error) {
      console.error(error, "Error");
      setTransactionRejected(true);
      setUserModal(true);
    }
  };

  const makeCalculations = async (xLusdAmount: string, xColl: string) => {
    try {

      const lusdValue = Number(xLusdAmount);
      const collValue = Number(xColl);

      const debtTotal = Number(debt) - lusdValue;
      setTotalDebt(debtTotal);

      const collTotal = Number(coll) - collValue;
      setTotalColl(collTotal);

      const ltvValue = (debtTotal * 100) / ((collTotal || 1) * Number(fetchedPrice));
      setLtv(ltvValue);

      const liquidationPriceValue = (divideBy * debtTotal) / collTotal;
      setLiquidationPrice(liquidationPriceValue);

      const newAvailColl = Number(coll) - ((divideBy * debtTotal) / Number(fetchedPrice))
      setNewAvailColl(newAvailColl)

      { parseFloat(userInputs.coll) > 0 ? setUserInputColl(1) : setUserInputColl(0) }
      { parseFloat(userInputs.lusdAmount) > 0 ? setUserInputDebt(1) : setUserInputDebt(0) }


    } catch (error) {
      console.error(error, "Error in makeCalculations");
    }
  };

  const handlePercentageClick = (percentage: any) => {
    const percentageDecimal = new Decimal(percentage).div(100);
    const pusdBalanceNumber = parseFloat(totalAvailableRepay.toString());
    if (!isNaN(pusdBalanceNumber)) {
      const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
      const stakeFixed = maxStake;
      setUserInputs({ coll: userInputs.coll, lusdAmount: String(stakeFixed) });

    } else {
      console.error("Invalid PUSD balance:", availableToBorrow);
    }
  };

  const handlePercentageClickBTC = (percentage: any) => {
    const percentageDecimal = new Decimal(percentage).div(100);
    const pusdBalanceNumber = newAvailColl

    if (!isNaN(pusdBalanceNumber)) {
      const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
      const stakeFixed = maxStake.toFixed(8);
      setUserInputs({ coll: stakeFixed, lusdAmount: userInputs.lusdAmount });
    } else {
      console.error("Invalid PUSD balance:");
    }
  };

  const getApprovedAmount = async (ownerAddress: string | undefined, spenderAddress: string | undefined) => {
    try {
      const approvedAmount = await tokenContract.methods.allowance(ownerAddress, spenderAddress).call() as BigInt;
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
      const amountInWei = web3.utils.toWei(amount, 'ether'); // Converts directly to Wei as a string
      const tx = await tokenContract.methods.approve("0x6117bde97352372eb8041bc631738402DEfA79a4", amountInWei).send({ from: userAddress, gasPrice: gasPrice });

      if (tx.status) {
        console.log("Transaction successful!");
      } else {
        console.log("Transaction failed. Please try again.");
      }
    } catch (error) {
      const e = error as { code?: number; message?: string };
      if (e.code === 4001) {
        console.error("User rejected the transaction:", e.message);
        console.log("Transaction rejected by the user.");
      } else {
        console.error("Error during token approval:", e.message);
        console.log("An error occurred during token approval. Please try again.");
      }
    }
  };

  const divideBy = recoveryMode ? cCR : mCR;
  const availableToBorrow = price / divideBy - Number(debt);
  const liquidation = divideBy * (Number(debt) / Number(coll));
  const totalAvailableRepay = Number(debt) - minDebt - lr
  const isCollInValid = parseFloat(userInputs.coll) > newAvailColl
  const isDebtInValid = parseFloat(userInputs.lusdAmount) > totalAvailableRepay

  const newLTV = ((Number(debt) * 100) / ((Number(coll) * Number(fetchedPrice)))).toFixed(2)
  const condition = (userInputColl + userInputDebt >= 1) || (parseFloat(userInputs.coll) < Number(coll)) || (parseFloat(userInputs.lusdAmount) < Number(debt));

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between align-items-center">
        <Button className="p-button-rounded p-button-text" onClick={() => setUserModal(false)}>
          Close
        </Button>
      </div>
    );
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
      setLoadingMessage("Repay Transaction completed successfully");
      setLoadingModalVisible(true);
    } else if (transactionRejected) {
      setLoadingMessage("Transaction was rejected");
      setLoadingModalVisible(true);
    }
  }, [isSuccess, isLoading, transactionRejected]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCloseButton(true);
    }, 200000);
    return () => clearTimeout(timer);
  }, []);
  const marginClass = parseFloat(userInputs.coll) > 0 ? 'md:-ml-[7rem]' : 'md:-ml-[5rem]';

  return (
    <div className="flex-col mx-2  flex md:flex-row justify-between gap-10 bg-black">
      <div>
        <div className="grid w-full space-y-7  max-w-sm items-start gap-2 mx-auto p-7 md:p-5">
          <div className="relative">
            <Label htmlFor="quantity" className="text-[#84827a] font-medium md:-ml-0 mb-2 -ml-10 body-text text-base">
              Repay PUSD
            </Label>
            <div className="flex items-center mt-4 w-[19rem] bg-black md:w-[24rem] md:-ml-0 -ml-11 rounded-2xl  border border-[#88e273] " style={{ backgroundColor: "bg-transparent" }}>
              <div className='flex items-center h-[3.5rem] '>
                <Image src={img4} alt="home" className='ml-1' width={35} />
                <h3 className='text-white body-text font-medium hidden md:block ml-1 text-sm'>PUSD</h3>
                <h3 className='h-full border border-[#88e273] mx-4 text-[#88e273]'></h3>
              </div>
              <input id="items" placeholder=''
                disabled={!(isConnected)}
                value={userInputs.lusdAmount}
                onChange={(e) => { const newBorrowValue = e.target.value; setUserInputs({ ...userInputs, lusdAmount: newBorrowValue, }); }}
                className="body-text text-sm whitespace-nowrap h-[4rem] text-gray-400" style={{ backgroundColor: "black" }}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-x-5 mt-[7px]  justify-between">
              <span className="text-white items-center gap-x-2 flex flex-row w-full md:-ml-0 -ml-10 ">
                <h6 className="text-gray-500 font-medium mt-[8px] body-text text-sm">
                  Available
                </h6>
                {Number(totalAvailableRepay) >= 0 && (
                  <h6 className={`text-sm mt-[8px] body-text font-medium whitespace-nowrap ${parseFloat(userInputs.lusdAmount) > totalAvailableRepay ? 'text-red-500' : 'text-white'}`}>
                    {Math.trunc(Number(totalAvailableRepay) * 100) / 100}

                  </h6>
                )}
              </span>
            </div>
            <div className="flex w-full py-3 -ml-12 gap-x-2 md:-ml-0 md:gap-x-3 mt-2">
              <Button disabled={(!isConnected)} className={`text-sm border-2 rounded-2xl border-[#88e273]  body-text`} style={{ backgroundColor: "#3b351b",  }} onClick={() => handlePercentageClick(25)}>25%</Button>
              <Button disabled={(!isConnected)} className={`text-sm border-2 rounded-2xl border-[#88e273] body-text`} style={{ backgroundColor: "#3b351b",  }} onClick={() => handlePercentageClick(50)}>50%</Button>
              <Button disabled={(!isConnected)} className={`text-sm border-2 rounded-2xl border-[#88e273] body-text`} style={{ backgroundColor: "#3b351b",  }} onClick={() => handlePercentageClick(75)}>75%</Button>
              <Button disabled={(!isConnected)} className={`text-sm border-2 rounded-2xl border-[#88e273] body-text`} style={{ backgroundColor: "#3b351b",  }} onClick={() => handlePercentageClick(100)}>100%</Button>
            </div>

          </div>
          <div className="relative">
            <div className="mb-4">
              <Label htmlFor="items" className="text-[#84827a]  font-medium md:-ml-0 -ml-10 body-text text-base">
                Withdraw Collateral
              </Label>
            </div>
            <div className="flex mt-2 md:mt-0 items-center w-[19rem] md:w-[24rem] md:-ml-0 -ml-11 rounded-2xl  border border-[#88e273] " style={{ backgroundColor: "black" }}>
              <div className='flex items-center h-[3.5rem] '>
                <Image src={img3} alt="home" className='ml-1' width={41} />
                <h6 className='text-white text-sm font-medium hidden md:block body-text ml-1'>WBTC</h6>
                <h3 className='h-full border border-[#88e273] mx-4 text-[#88e273]'></h3>
              </div>
              <div className=" justify-between items-center flex gap-x-24">
                <input id="items" placeholder='' disabled={!(isConnected)} value={userInputs.coll} onChange={(e) => {
                  const newCollValue = e.target.value;
                  setUserInputs({ ...userInputs, coll: newCollValue, });
                }}
                  className="body-text text-gray-400 w-full text-sm whitespace-nowrap ml-1 h-[4rem] " style={{ backgroundColor: "black" }} />
                <span className={`text-sm body-text text-gray-400 -ml-36 ${marginClass}`}>
                  ${(parseFloat(userInputs.coll) * Number(fetchedPrice)).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-x-5 ">
              <span className="text-white gap-x-2 flex flex-col w-full  md:-ml-0 -ml-10 ">
                <div className="mt-[15px]">
                  <span className={`text-sm text-  text-[#84827a]  font-medium body-text w-full whitespace-nowrap mt-[10px]  ${parseFloat(userInputs.coll) > newAvailColl ? 'text-red-500' : 'text-white'}`}>
                    <span className="text-[#84827a] font-medium body-text">
                      Available
                    </span>
                  </span>
                  <span className="text-sm ml-1   font-medium body-text">
                    {(newAvailColl).toFixed(8)}
                  </span>
                </div>
              </span>
            </div>
            <div className="flex w-full py-3  -ml-12 gap-x-2 md:-ml-0 md:gap-x-3 mt-[5px]">
              <Button disabled={(!isConnected)} className={`text-sm border-2 rounded-2xl border-[#88e273]  body-text`} style={{ backgroundColor: "#3b351b",  }} onClick={() => handlePercentageClickBTC(25)}>25%</Button>
              <Button disabled={(!isConnected)} className={`text-sm border-2 rounded-2xl border-[#88e273] body-text`} style={{ backgroundColor: "#3b351b",  }} onClick={() => handlePercentageClickBTC(50)}>50%</Button>
              <Button disabled={(!isConnected)} className={`text-sm border-2 rounded-2xl border-[#88e273] body-text`} style={{ backgroundColor: "#3b351b",  }} onClick={() => handlePercentageClickBTC(75)}>75%</Button>
              <Button disabled={(!isConnected)} className={`text-sm border-2 rounded-2xl border-[#88e273] body-text`} style={{ backgroundColor: "#3b351b",  }} onClick={() => handlePercentageClickBTC(100)}>100%</Button>
            </div>
          </div>
          <button onClick={() => handleConfirmClick(userInputs.lusdAmount, userInputs.coll)}
            className={`mt-5 md:-ml-0 rounded-2xl -ml-11 w-[19.5rem] md:w-full title-text h-[3rem]
             ${isDebtInValid || isCollInValid || (userInputColl + userInputDebt == 0)
                ? 'bg-[#88e273] text-black cursor-not-allowed opacity-50' : 'hover:scale-95 cursor-pointer bg-[#88e273] text-black'}`}
            disabled={(isDebtInValid || isCollInValid || (userInputColl + userInputDebt == 0))}>
            UPDATE TROVE
          </button>
        </div>
      </div>
      <div className={`px-1  w-[18rem] rounded-2xl -ml-4 md:px-9 md:w-full  pt-9 h-[18rem] pl-5 md:h-[20rem] ${condition ? 'p-4' : ' p-16'} md:pt-12 md:mx-4 md:mt-10 text-sm`}
        style={{ backgroundColor: "#282828" }}>
        <div className="mb-4  space-y-4">
          <div className="flex  md:gap-x-20 text-white md:flex-row flex-col  items-center justify-between">
            <div className="flex  w-full">
              <span className="body-text text-xs whitespace-nowrap text-[#84827a] font-medium">Loan-To-Value</span>
              <Image width={15} className="toolTipHolding14 ml_5" src={info} data-pr-tooltip="" alt="info" />
              <Tooltip className="custom-tooltip title-text2" target=".toolTipHolding14" content="It is a ratio that measures the amount of a loan compared to the value of the collateral." mouseTrack mouseTrackLeft={10} />
            </div>
            <span className="text-xs w-full whitespace-nowrap body-text">
              <div className="flex items-center gap-x-2.5">
                <span className="w-28 p-1 -ml-[5px]  md:-ml-10 font-medium body-text ">
                  {Number(newLTV).toFixed(2)} %
                </span>
                {(userInputColl + userInputDebt >= 1) && (parseFloat(userInputs.coll) < Number(coll)) && (parseFloat(userInputs.lusdAmount) < Number(debt)) && (
                  <>
                    <span className="text-[#88e273] text-lg">
                      <FaArrowRightLong />
                    </span>
                    <span className={`overflow-x-clip text-sm body-text font-medium w-28 p-1 ${ltv > (100 / Number(divideBy)) ? 'text-red-500' : ''}`}>{" "}{Number(ltv).toFixed(2)} %</span>
                  </>
                )}
              </div>
            </span>
          </div>
          <div className="flex text-white mb-2 md:flex-row flex-col  items-center  justify-between">
            <div className="flex  w-full">
              <span className="body-text text-xs whitespace-nowrap text-[#84827a] font-medium">Liquidation Price</span>
              <Image width={15} className="toolTipHolding15 ml_5" src={info} data-pr-tooltip="" alt="info" />
              <Tooltip className="custom-tooltip title-text2" target=".toolTipHolding15" content="The PUSD value at which your Vault will drop below 110% Collateral Ratio and be at risk of liquidation. You should manage your position to avoid liquidation by monitoring normal mode liquidation price." mouseTrack mouseTrackLeft={10} />
            </div>
            <span className="body-text text-xs my-1 w-full whitespace-nowrap">
              <div className="flex items-center gap-x-2.5">
                <span className="p-1 font-medium body-text -ml-[5px]  w-28">
                  {Number(liquidation).toFixed(2)} PUSD
                </span>
                {(userInputColl + userInputDebt >= 1) && (parseFloat(userInputs.coll) < Number(coll)) && (parseFloat(userInputs.lusdAmount) < Number(debt)) && (
                  <>
                    <span className="text-[#88e273] text-lg">
                      <FaArrowRightLong />
                    </span>
                    <span className="body-text font-medium text-xs whitespace-nowrap w-28  p-1">{" "}{Number(liquidationPrice).toFixed(2)} PUSD</span>
                  </>
                )}
              </div>
            </span>
          </div>
          <div className="flex text-white mb-2 md:flex-row flex-col  items-center justify-between">
            <div className="flex  w-full">
              <span className="body-text text-xs whitespace-nowrap text-[#84827a] font-medium">Total Debt</span>
              <Image width={15} className="toolTipHolding16 ml_5" src={info} data-pr-tooltip="" alt="info" />
              <Tooltip className="custom-tooltip title-text2" target=".toolTipHolding16" content="Total amount of PUSD borrowed + liquidation reserve (200 PUSD) + borrowing fee at time of loan issuance." mouseTrack mouseTrackLeft={10} />
            </div>
            <span className="body-text text-xs my-1  w-full whitespace-nowrap">
              <div className="flex items-center gap-x-2">
                <span className="p-1 w-28 -ml-[5px] body-text font-medium">
                  {Number(debt).toFixed(2)} PUSD
                </span>
                {(userInputDebt == 1) && (parseFloat(userInputs.lusdAmount) < Number(debt)) && (
                  <>
                    <span className="text-[#88e273] text-lg">
                      <FaArrowRightLong />
                    </span>
                    <span className="ml-05 font-medium body-text w-28 p-1 ">{" "}{Number(totalDebt).toFixed(2)} PUSD</span>
                  </>
                )}
              </div>
            </span>
          </div>
          <div className="flex text-white mb-2 md:flex-row flex-col items-center  justify-between">
            <div className="flex  w-full">
              <span className="text-xs whitespace-nowrap body-text text-[#84827a] font-medium">Total Collateral</span>
              <Image width={15} className="toolTipHolding17 ml_5 " src={info} data-pr-tooltip="" alt="info" />
              <Tooltip className="custom-tooltip title-text2" target=".toolTipHolding17" content="The ratio of the USD value of the entire system collateral divided by the entire system debt." mouseTrack mouseTrackLeft={10} />
            </div>
            <span className="body-text text-xs my-1 w-full whitespace-nowrap">
              <div className="flex items-center gap-x-2">
                <span className="p-1 body-text font-medium -ml-[5px] w-28">
                  {Number(coll).toFixed(8)} WBTC
                </span>
                {(userInputColl == 1) && (parseFloat(userInputs.coll) < Number(coll)) && (
                  <>
                    <span className="text-[#88e273] text-lg">
                      <FaArrowRightLong />
                    </span>
                    <span className="ml-05 p-1 w-28 body-text font-medium ">{" "}{Number(totalColl).toFixed(8)} WBTC</span>
                  </>
                )}
              </div>
            </span>
          </div>
        </div>
      </div>
      <Dialog visible={isModalVisible} onHide={() => setIsModalVisible(false)}>
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="py-5">
              <Image src={rec2} alt="box" width={140} className="" />
            </div>
            <div className="p-5">
              <div className="waiting-message text-lg title-text2 text-[#88e273] whitespace-nowrap">Transaction is initiated</div>
              <div className="text-sm title-text2 text-[#bebdb9] whitespace-nowrap">Please confirm in Metamask.</div>
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog visible={userModal} onHide={() => setUserModal(false)} header={renderHeader}>
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="p-5">
              <div className="waiting-message text-lg title-text text-white whitespace-nowrap">Transaction rejected</div>
              <Button className="p-button-rounded p-button-text" onClick={() => setUserModal(false)}>Close</Button>
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
              ) : loadingMessage === 'Repay Transaction completed successfully' ? (
                <Image src={tick} alt="tick" width={200} />
              ) : transactionRejected ? (
                <Image src={rej} alt="rejected" width={140} />
              ) : (
                <Image src={conf} alt="box" width={140} />
              )}
              <div className="waiting-message title-text2 text-[#88e273]">{loadingMessage}</div>
              {isSuccess && (
                <button className="mt-1 p-3 text-black title-text2 hover:scale-95 bg-[#88e273]" onClick={handleClose}>Close</button>
              )}
              {(transactionRejected || (!isSuccess && showCloseButton)) && (
                <>
                  <p className="body-text text-white text-xs">{transactionRejected ? "Transaction was rejected. Please try again." : "Some Error Occurred On Network Please Try Again After Some Time.. 🤖"}</p>
                  <Button className=" mt-1 p-3 text-black rounded-none md:w-[20rem] title-text2 hover:bg-[#88e273] hover:scale-95 bg-[#88e273]" onClick={handleClose}>Try again</Button>
                </>
              )}</div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}