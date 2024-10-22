"use client";

import stabilityPoolAbi from "../../app/src/constants/abi/StabilityPool.sol.json";
import { BOTANIX_RPC_URL } from "../../app/src/constants/botanixRpcUrl";
import ORE from "../../app/assets/images/ORE.png";
import botanixTestnet from "../../app/src/constants/botanixTestnet.json";
import { getContract } from "../../app/src/utils/getContract";
import conf from "../../app/assets/images/conf.gif";
import rec2 from "../../app/assets/images/rec2.gif";
import tick from "../../app/assets/images/tick.gif";
import rej from "../../app/assets/images/TxnError.gif";
import Decimal from "decimal.js";
import "./unstake.css";
import { ethers } from "ethers";
import { useEffect, useState, useCallback } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWalletClient,
  useWriteContract,
} from "wagmi";
import { Button } from "../ui/button";
import { Dialog } from "primereact/dialog";
import Image from "next/image";
import "../../app/App.css";
import "../../components/stabilityPool/Modal.css";
import { StabilityPoolbi } from "@/app/src/constants/abi/StabilityPoolbi";
import { EVMConnect } from "../../app/src/config/EVMConnect";
import wbtc from "../../app/assets/images/btccc.svg";
import { bitfinityTestNetChain, useEthereumChainId } from "../NetworkChecker";
import { useSwitchChain } from 'wagmi'
import { Input } from "../ui/input";

export const Unstake = () => {
  const [userInput, setUserInput] = useState("0");
  const [stakedValue, setStakedValue] = useState(0);
  const [pusdBalance, setPusdBalance] = useState(0);
  const { switchChain } = useSwitchChain()
  const { isConnected } = useAccount();
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [userModal, setUserModal] = useState(false);
  const [isStateLoading, setIsStateLoading] = useState(true);
  const [totalStakedValue, setTotalStakedValue] = useState("0");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);
  const { data: walletClient } = useWalletClient();
  const { data: hash, writeContract, error: writeError } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
  const [transactionRejected, setTransactionRejected] = useState(false);

  const [chainId, setChainId] = useState(355113);
  useEthereumChainId(setChainId)

  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);
  const stabilityPoolContractReadOnly = getContract(
    botanixTestnet.addresses.StabilityPool,
    stabilityPoolAbi,
    provider
  );

  useEffect(() => {
    if (isLoading) {
      setIsModalVisible(false);
      setLoadingMessage("Waiting for transaction to confirm..");
      setLoadingModalVisible(true);
    } else if (isSuccess) {
      setLoadingMessage("Unstake Transaction completed successfully");
      setLoadingModalVisible(true);
    } else if (transactionRejected) {
      setLoadingMessage("Transaction was rejected");
      setLoadingModalVisible(true);
    } else {
      setLoadingModalVisible(false);
    }
  }, [isSuccess, isLoading, transactionRejected]);

  const fetchStakedValue = useCallback(async () => {
    try {
      if (!walletClient) return null;
      const fetchedPUSD =
        await stabilityPoolContractReadOnly.getCompoundedDebtTokenDeposits(
          walletClient?.account.address
        );
      setStakedValue(fetchedPUSD);
    } catch (error) {
      console.error("Error fetching staked value:", error);
    }
  }, [walletClient, stabilityPoolContractReadOnly]);

  useEffect(() => {
    fetchStakedValue();
  }, [fetchStakedValue, writeContract, hash]);

  const handleClose = useCallback(() => {
    setLoadingModalVisible(false)
    setUserModal(false)
    setIsModalVisible(false)
    setTransactionRejected(false)
    window.location.reload();
  }, []);

  useEffect(() => {
    const getStakedValue = async () => {
      if (!walletClient) return null;
      const fetchedTotalStakedValue =
        await stabilityPoolContractReadOnly.getCompoundedDebtTokenDeposits(
          walletClient?.account.address
        );
      const fixedtotal = ethers.formatUnits(fetchedTotalStakedValue, 18);
      setTotalStakedValue(fixedtotal);
      setIsStateLoading(false);
    };
    getStakedValue();
  }, [walletClient, stabilityPoolContractReadOnly]);

  const handlePercentageClick = (percentage: any) => {
    const percentageDecimal = new Decimal(percentage).div(100);
    const pusdBalanceNumber = parseFloat(stakedValue.toString());
    if (!isNaN(pusdBalanceNumber)) {
      const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
      const stakeFixed = maxStake.div(Decimal.pow(10, 18));
      const roundedStakeFixed = Number(stakeFixed.toFixed(2));
      setUserInput(String(roundedStakeFixed));
    } else {
      console.error("Invalid ORE balance:", pusdBalance);
    }
  };

  const handleConfirmClick = async () => {
    try {
      if (!walletClient) {
        return null;
      }
      setIsModalVisible(true);

      const pow = Decimal.pow(10, 18);
      const inputBeforeConv = new Decimal(userInput);
      const inputValue = inputBeforeConv.mul(pow).toFixed();
      const inputBigInt = BigInt(inputValue);

      await writeContract({
        abi: StabilityPoolbi,
        address: "0x955494Ae78369d0A224D05d7DD5Bc8d9804bF082",
        functionName: "withdrawFromSP",
        args: [
          inputBigInt,
          ["0x222c21111dDde68e6eaC2fCde374761E72c45FFe"],
        ],
      });
    } catch (error) {
      console.error("Error sending transaction:", error);
      setTransactionRejected(true);
      setUserModal(true);
    }
  };

  useEffect(() => {
    if (writeError) {
      console.error("Write contract error:", writeError);
      setTransactionRejected(true);
      setUserModal(true);
    }
  }, [writeError]);

  useEffect(() => {
    if (hash) setIsModalVisible(false);
  }, [hash]);

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
    const timer = setTimeout(() => {
      setShowCloseButton(true);
    }, 180000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isSuccess) handleClose()
  }, [isSuccess, handleClose])

  return (
    <div className="grid space-y-8 bg-[black] items-start md:h-66 gap-2 mx-auto p-7">
      <div className="">
        <div className="flex items-center mt-4 mb-2 rounded-lg parent-div border border-[#88e273]" style={{ backgroundColor: "black" }}>
          <div className="flex items-center w-full h-[3.5rem]">
            <Image src={ORE} alt="home" className="ml-1" width={30} />
            <h3 className="text-white body-text ml-1 hidden md:block">
              ORE
            </h3>
            <div className="h-full border border-[#88e273] rounded-lg mx-3"></div>
            <div className="flex-grow h-full">
              <Input id="items"
                placeholder="0.000 earthBTC"
                disabled={!isConnected}
                value={userInput}
                onChange={(e) => {
                  const input = e.target.value;
                  setUserInput(input);
                }}
                className="w-[104%] -ml-[0.75rem]  h-full 
                  body-text text-sm text-white full-input px-2"
                style={{
                  backgroundColor: "black",
                  outline: "none",
                  border: "none",
                  borderRight: "0px solid #88e273",
                  borderRadius: "0 0.5rem 0.5rem 0",
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <span
            className={"font-medium balance body-text " + (Number(userInput) > Math.trunc(Number(totalStakedValue) * 100) / 100 ? "text-red-500" : "text-gray-400")}
          >
            {isStateLoading && isConnected ? (
              <div className="mr-[82px]">
                <div className=" h-2 rounded-2xl">
                  <div className="hex-loader"></div>
                </div>
              </div>
            ) : (
              <span className="whitespace-nowrap">
                <span className="text-gray-400 body-text"> Your Stake: </span>
                <span className="body-text">
                  {Math.trunc(Number(totalStakedValue) * 100) / 100} ORE
                </span>
              </span>
            )}
          </span>
        </div>
      </div>
      <div className="flex w-full justify-between gap-x-2 md:gap-x-6  mt-2 mb-2">
        <Button disabled={!isConnected || isStateLoading} className={`text-xs md:text-lg  rounded-lg border-2 ${isStateLoading ? "cursor-not-allowed" : "cursor-pointer"}  rounded-3xl border border-[#88e273] body-text`} style={{ backgroundColor: "#" }} onClick={() => handlePercentageClick(25)}>  25%</Button>
        <Button disabled={!isConnected || isStateLoading} className={`text-xs md:text-lg  rounded-lg border-2 ${isStateLoading ? "cursor-not-allowed" : "cursor-pointer"}  rounded-3xl border border-[#88e273] body-text`} style={{ backgroundColor: "#" }} onClick={() => handlePercentageClick(50)}>  50%</Button>
        <Button disabled={!isConnected || isStateLoading} className={` text-xs md:text-lg rounded-lg  border-2 ${isStateLoading ? "cursor-not-allowed" : "cursor-pointer"} rounded-3xl border border-[#88e273] body-text`} style={{ backgroundColor: "#" }} onClick={() => handlePercentageClick(75)}>  75%</Button>
        <Button disabled={!isConnected || isStateLoading} className={` text-xs md:text-lg rounded-lg  border-2 ${isStateLoading ? "cursor-not-allowed" : "cursor-pointer"} rounded-3xl border border-[#88e273] body-text`} style={{ backgroundColor: "#" }} onClick={() => handlePercentageClick(100)}>  100%</Button>
      </div>
      {isConnected ? (
        <div className="my-2">
          {chainId !== bitfinityTestNetChain.id ? (
            <button onClick={() => switchChain({ chainId: bitfinityTestNetChain.id })} className="mt-2 text-black text-md font-semibold w-full border  border-black h-12 bg-gradient-to-r from-[#88e273] via-[#9cd685] to-[#b5f2a4] hover:from-[#6ab95b] hover:via-[#82c16a] hover:to-[#9cd685] title-text border-none rounded-3xl">
              Switch to Bitfinity
            </button>
          ) : (
            <button
              style={{ backgroundColor: "#88e273" }}
              onClick={handleConfirmClick}
              className={`mt-2 bg-gradient-to-r from-[#88e273] via-[#9cd685] to-[#b5f2a4] hover:from-[#6ab95b] hover:via-[#82c16a] hover:to-[#9cd685] h-12 rounded-3xl
              text-black title-text font-semibold w-full border border-black border-none 
					 ${isStateLoading ||
                  Number(userInput) == 0 ||
                  Math.trunc(Number(totalStakedValue) * 100) / 100 === 0 ||
                  Number(userInput) >
                  Number(Math.trunc(Number(totalStakedValue) * 100) / 100)
                  ? "cursor-not-allowed opacity-50"
                  : "hover:scale-95 "
                }`}
              disabled={
                isStateLoading ||
                Math.trunc(Number(totalStakedValue) * 100) / 100 === 0 ||
                Number(userInput) >
                Number(Math.trunc(Number(totalStakedValue) * 100) / 100)
              }
            >
              {isStateLoading ? "Loading" : "UNSTAKE"}
            </button>
          )}
        </div>
      ) : (
        <EVMConnect className="w-full" />
      )}
      <Dialog visible={isModalVisible} onHide={() => setIsModalVisible(false)}>
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="py-5">
              <Image src={rec2} alt="box" width={140} className="" />
            </div>
            <div className="p-5">
              <div className="waiting-message text-lg title-text2 text-[#88e273] whitespace-nowrap">
                Transaction is initiated
              </div>
              <div className="text-sm title-text2 text-[#bebdb9] whitespace-nowrap">
                Please confirm in Metamask.
              </div>
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog visible={userModal} onHide={() => setUserModal(false)} header={renderHeader}>
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="p-5">
              <div className="waiting-message text-lg title-text text-white whitespace-nowrap">
                Transaction rejected
              </div>
              <Button className="p-button-rounded p-button-text" onClick={() => setUserModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog visible={loadingModalVisible} onHide={() => setLoadingModalVisible(false)}>
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="p-5">
              {loadingMessage === "Waiting for transaction to confirm.." ? (
                <>
                  <Image src={conf} alt="rectangle" width={150} />
                  <div className="my-5 ml-[6rem] mb-5"></div>
                </>
              ) : loadingMessage ===
                "Unstake Transaction completed successfully" ? (
                <Image src={tick} alt="tick" width={200} />
              ) : transactionRejected ? (
                <Image src={rej} alt="rejected" width={140} />
              ) : (
                <Image src={conf} alt="box" width={140} />
              )}
              <div className="waiting-message title-text2 text-[#88e273]">
                {loadingMessage}
              </div>
              {isSuccess && (
                <button
                  className="mt-1 p-3 text-black title-text2 hover:scale-95 bg-[#88e273]"
                  onClick={handleClose}
                >
                  Okay
                </button>
              )}
              {(transactionRejected || (!isSuccess && showCloseButton)) && (
                <>
                  <p className="body-text text-xs text-white">
                    {transactionRejected
                      ? "Transaction was rejected. Please try again."
                      : "Some Error Occurred On Network Please Try Again After Some Time.. 🤖"}
                  </p>
                  <Button className=" mt-1 p-3 rounded-none  text-black md:w-[20rem] title-text2 hover:scale-95 bg-[#88e273]" onClick={handleClose}>
                    TRY aGain
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};