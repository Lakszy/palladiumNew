"use client";

import erc20Abi from "../../app/src/constants/abi/ERC20.sol.json";
import { StabilityPoolbi } from "@/app/src/constants/abi/StabilityPoolbi";
import { BOTANIX_RPC_URL } from "../../app/src/constants/botanixRpcUrl";
import botanixTestnet from "../../app/src/constants/botanixTestnet.json";
import { getContract } from "../../app/src/utils/getContract";
import Decimal from "decimal.js";
import { ethers } from "ethers";
import rej from "../../app/assets/images/TxnError.gif";
import { useCallback, useEffect, useState } from "react";
import { useWalletClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { CustomConnectButton } from "../connectBtn";
import { Button } from "../ui/button";
import { useAccount } from "wagmi";
import { Dialog } from "primereact/dialog";
import "./stake.css";
import img3 from "../../app/assets/images/Group 663.svg";
import conf from "../../app/assets/images/conf.gif";
import rec2 from "../../app/assets/images/rec2.gif";
import tick from "../../app/assets/images/tick.gif";
import Image from "next/image";
import "./Modal.css";
import "../../app/App.css";
import wcore from "../../app/assets/images/btcc.svg";
import wbtc from "../../app/assets/images/btccc.svg";
import susdt from "../../app/assets/images/bbn.svg";
import { EVMConnect } from "../EVMConnect";

export const StabilityPool = () => {
  const [userInput, setUserInput] = useState("0");
  const [pusdBalance, setPusdBalance] = useState("0");
  const { address, isConnected } = useAccount();
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showCloseButton, setShowCloseButton] = useState(false);
  const { data: walletClient } = useWalletClient();
  const [transactionRejected, setTransactionRejected] = useState(false);
  const BOTANIX_RPC_URL2 = "https://rpc.test.btcs.network";
  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL2);
  const [collateralToken, setCollateralToken] = useState<`0x${string}`>(
    "0x0000000000000000000000000000000000000000"
  );

  const erc20Contract = getContract(
    botanixTestnet.addresses.DebtToken,
    erc20Abi,
    provider
  );
  
  const { data: hash, writeContract, error: writeError } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const collateralTokens = [
    {
      name: "WCORE",
      address: "0x5FB4E66C918f155a42d4551e871AD3b70c52275d",
      oracle: "0xdd68eE1b8b48e63909e29379dBe427f47CFf6BD0",
      img: wcore,
    },
    {
      name: "WBTC",
      address: "0x4CE937EBAD7ff419ec291dE9b7BEc227e191883f",
      oracle: "0x81A64473D102b38eDcf35A7675654768D11d7e24",
      img: wbtc,
    },
    {
      name: "sUSDT",
      address: "0x3786495F5d8a83B7bacD78E2A0c61ca20722Cce3",
      oracle: "0x6e9Cd926Bf8F57FCe14b5884d9Ee0323126A772E",
      img: susdt,
    },
  ];

  useEffect(() => {
    if (isLoading) {
      setIsModalVisible(false);
      setLoadingMessage("Waiting for transaction to confirm..");
      setLoadingModalVisible(true);
    } else if (isSuccess) {
      setLoadingMessage("Stake Transaction completed successfully");
      setLoadingModalVisible(true);
    } else if (transactionRejected) {
      setLoadingMessage("Transaction was rejected");
      setLoadingModalVisible(true);
    } else {
      setLoadingModalVisible(false);
    }
  }, [isSuccess, isLoading, transactionRejected]);

  const handlePercentageClick = (percentage: any) => {
    const percentageDecimal = new Decimal(percentage).div(100);
    const pusdBalanceNumber = parseFloat(pusdBalance);
    if (!isNaN(pusdBalanceNumber)) {
      const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
      const stakeFixed = maxStake;
      const roundedStakeFixed = Number(stakeFixed.toFixed(2));
      setUserInput(String(roundedStakeFixed));
    } else {
      console.error("Invalid PUSD balance:", pusdBalance);
    }
  };

  const fetchPrice = async () => {

    if (!walletClient) {
      return null;
    }
  
    const pusdBalanceValue = await erc20Contract.balanceOf(address);
    console.log("PUSD Balance: ", pusdBalanceValue);
    const pusdBalanceFormatted = ethers.formatUnits(pusdBalanceValue, 18);
    setPusdBalance(pusdBalanceFormatted);
    // setAfterload(false);
    setIsDataLoading(false);
  };
  useEffect(() => {
    fetchPrice();
  }, [fetchPrice, address, walletClient, writeContract, hash]);

  const handleClose = useCallback(() => {
    setLoadingModalVisible(false);
    setUserModal(false);
    setIsModalVisible(false);
    setTransactionRejected(false);
    window.location.reload();
  }, []);

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

      const sortedAssets = [...collateralTokens].sort((a, b) =>
        a.address.toLowerCase().localeCompare(b.address.toLowerCase())
      );

      const assets = sortedAssets.map((token) => token.address);
      console.log("Assets: ", assets);
      writeContract({
        abi: StabilityPoolbi,
        address: "0x7779C10ae22632955846fa8c8EfA4cBd241f1659",
        functionName: "provideToSP",
        args: [
          inputBigInt,
          [
            "0x3786495F5d8a83B7bacD78E2A0c61ca20722Cce3",
            "0x4CE937EBAD7ff419ec291dE9b7BEc227e191883f",
            "0x5FB4E66C918f155a42d4551e871AD3b70c52275d",
          ],
        ],
      });
      console.log(writeContract);
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
    if (hash) {
      setIsModalVisible(false);
    }
  }, [hash]);

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between align-items-center">
        <Button
          className="p-button-rounded p-button-text"
          onClick={() => setUserModal(false)}
        >
          Close
        </Button>
      </div>
    );
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCloseButton(true);
    }, 90000);
    return () => clearTimeout(timer);
  }, []);

  const handleCollateralTokenClick = (address: `0x${string}`) => {
    setCollateralToken(address);
    console.log("Collateral Token Address: ", address);
  };
  return (
    <div className="grid bg-[black] -mt-10 items-start h-72 space-y-8  gap-2 mx-auto rounded-lg  border-[#88e273] p-7">
      <div className=" mt-10 md:mt-0">
        <div
          className="flex items-center mb-2 mt-4 md:-ml-0 -ml- border rounded-lg border-[#88e273]"
          style={{ backgroundColor: "black" }}
        >
          <div className="flex items-center h-[3.5rem]">
            <Image src={img3} alt="home" className="ml-1" width={30} />
            <h3 className="text-white body-text ml-1 hidden md:block">PUSD</h3>
            <h3 className="h-full border rounded-lg border-[#88e273] mx-3 text-[#88e273]"></h3>
            <div className="justify-between items-center flex gap-x-24">
              <input id="items" placeholder="Enter Collateral Amount" disabled={!isConnected} value={userInput} onChange={(e) => { const input = e.target.value; setUserInput(input); }} className="body-text text-sm whitespace-nowrap ml-1 text-white" style={{ backgroundColor: "black" }} />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <span
            className={
              "body-text font-medium balance " +
              (Number(userInput) > Math.trunc(Number(pusdBalance) * 100) / 100
                ? "text-red-500"
                : "text-gray-400")
            }
          >
            {isDataLoading && isConnected ? (
              <div className="mr-[82px]">
                <div className="text-left w-full h-2">
                  <div className="hex-loader"></div>
                </div>
              </div>
            ) : (
              <span className="whitespace-nowrap body-text">
                <span className="text-gray-400 body-text">Wallet: </span>
                {Math.trunc(Number(pusdBalance) * 100) / 100} PUSD
              </span>
            )}
          </span>
        </div>
      </div>
      <div className="flex w-full justify-between gap-x-2 md:gap-x-6  mt-2 mb-2">
        <Button disabled={!isConnected || isDataLoading} className={`text-xs md:text-lg border-2 rounded-lg border-[#88e273] body-text ${isDataLoading ? "cursor-not-allowed" : ""}`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(25)}>  25%</Button>
        <Button disabled={!isConnected || isDataLoading} className={`text-xs md:text-lg border-2 rounded-lg border-[#88e273] body-text ${isDataLoading ? "cursor-not-allowed" : ""}`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(50)}>  50%</Button>
        <Button disabled={!isConnected || isDataLoading} className={`text-xs md:text-lg border-2 rounded-lg border-[#88e273] body-text ${isDataLoading ? "cursor-not-allowed" : ""}`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(75)}>  75%</Button>
        <Button disabled={!isConnected || isDataLoading} className={`text-xs md:text-lg border-2 rounded-lg border-[#88e273] body-text ${isDataLoading ? "cursor-not-allowed" : ""}`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(100)}>  100%</Button>
      </div>
      {isConnected ? (
        <div className=" my-2">
          <button
            style={{ backgroundColor: "#88e273" }}
            onClick={handleConfirmClick}
            className={`mt-2 text-black text-md font-semibold w-full border rounded-lg border-black h-10 title-text border-none 
                            ${isDataLoading ||
                Number(userInput) <= 0 ||
                Number(userInput) >
                Number(
                  Math.trunc(Number(pusdBalance) * 100) / 100
                )
                ? "cursor-not-allowed opacity-50"
                : "hover:scale-95 "
              }`}
            disabled={
              isDataLoading ||
              Number(userInput) <= 0 ||
              Number(userInput) >
              Number(Math.trunc(Number(pusdBalance) * 100) / 100)
            }
          >
            {isDataLoading ? "LOADING..." : "STAKE"}
          </button>
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
      <Dialog
        visible={userModal}
        onHide={() => setUserModal(false)}
        header={renderHeader}
      >
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="p-5">
              <div className="waiting-message text-lg title-text text-white whitespace-nowrap">
                Transaction rejected
              </div>
              <Button
                className="p-button-rounded p-button-text"
                onClick={() => setUserModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog
        visible={loadingModalVisible}
        onHide={() => setLoadingModalVisible(false)}
      >
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="p-5">
              {loadingMessage === "Waiting for transaction to confirm.." ? (
                <>
                  <Image src={conf} alt="rectangle" width={150} />
                  <div className="my-5 ml-[6rem] mb-5"></div>
                </>
              ) : loadingMessage ===
                "Stake Transaction completed successfully" ? (
                <Image src={tick} alt="tick" width={200} />
              ) : transactionRejected ? (
                <Image src={rej} alt="rejected" width={140} />
              ) : (
                <Image src={conf} alt="box" width={140} />
              )}
              <div className="waiting-message title-text2  text-[#88e273] ">
                {loadingMessage}
              </div>
              <div className="pb-5">
                {isSuccess && (
                  <button
                    className="mt-1 p-3 text-black title-text2 hover:scale-95 bg-[#f5d64e]"
                    onClick={handleClose}
                  >
                    Go Back to the Stake Page
                  </button>
                )}
                {(transactionRejected || (!isSuccess && showCloseButton)) && (
                  <>
                    <p className="body-text text-white text-xs">
                      {transactionRejected
                        ? "Transaction was rejected. Please try again."
                        : "Some Error Occurred On Network Please Try Again After Some Time.. 🤖"}
                    </p>
                    <Button
                      className=" mt-1 p-3 text-black rounded-none w-[20rem] hover:bg-yellow-400 title-text2 hover:scale-95 bg-[#f5d64e]"
                      onClick={handleClose}
                    >
                      Try again
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};