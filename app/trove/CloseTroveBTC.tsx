"use client";
import erc20Abi from "../src/constants/abi/ERC20.sol.json";
import { BOTANIX_RPC_URL } from "../src/constants/botanixRpcUrl";
import botanixTestnet from "../src/constants/botanixTestnet.json";
import { getContract } from "../src/utils/getContract";
import { ethers } from "ethers";
import React, { useState, useEffect, useCallback } from "react";
import { useAccount, useWaitForTransactionReceipt, useWalletClient, useWriteContract } from "wagmi";
import { Dialog } from 'primereact/dialog';
import Image from "next/image";
import rej from "../assets/images/TxnError.gif";
import info from "../assets/images/info.svg";
import conf from "../assets/images/conf.gif"
import rec2 from "../assets/images/rec2.gif"
import tick from "../assets/images/tick.gif"
import "../../app/App.css"
import "./closed.css"
import "../../components/stabilityPool/Modal.css"
import { Button } from "@/components/ui/button";
import { BorrowerOperationbi } from "../src/constants/abi/borrowerOperationAbi";
import { Tooltip } from "primereact/tooltip";
import { useWalletAddress } from "@/components/useWalletAddress";

interface Props {
  entireDebtAndColl: number;
  debt: number;
  liquidationReserve: number;
}

export const CloseTroveBTC: React.FC<Props> = ({ entireDebtAndColl, debt, liquidationReserve }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLowBalance, setIsLowBalance] = useState(false);
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { data: walletClient } = useWalletClient();
  const { address, isConnected } = useAccount();
  const [afterLoad, setAfterload] = useState(false);
  const BOTANIX_RPC_URL2 = "https://rpc.test.btcs.network";
  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL2);
  const [pusdBalance, setPusdBalance] = useState("0");
  const [userModal, setUserModal] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);
  const { data: hash, writeContract, error: writeError } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
  const [transactionRejected, setTransactionRejected] = useState(false);

  const erc20Contract = getContract(
    botanixTestnet.addresses.DebtToken,
    erc20Abi,
    provider
  );


  const handleClose = useCallback(() => {
    setLoadingModalVisible(false);
    setUserModal(false);
    setIsModalVisible(false);
    setTransactionRejected(false);
    window.location.reload();
  }, []);

  const fetchPrice = useCallback(async () => {
    // if (!address) return;
    if (!walletClient) return null;
    const pusdBalanceValue = await erc20Contract.balanceOf(
      walletClient?.account?.address
    );
    const pusdBalanceFormatted = ethers.formatUnits(pusdBalanceValue, 18);
    if (Number(pusdBalanceFormatted) < (debt - liquidationReserve)) {
      setIsLowBalance(true);
    }
    setPusdBalance(pusdBalanceFormatted);
    setAfterload(false);
  }, [address, debt, liquidationReserve, erc20Contract]);

  useEffect(() => {
    fetchPrice();
  }, [fetchPrice, walletClient, writeContract, hash, ]);

  const handleConfirmClick = async () => {
    setIsModalVisible(true);
    try {
      if (!walletClient) return null;

      const tx = writeContract({
        abi: BorrowerOperationbi,
        address: '0x6117bde97352372eb8041bc631738402DEfA79a4',
        functionName: 'closeVessel',
        args: ["0x4CE937EBAD7ff419ec291dE9b7BEc227e191883f"],
      });
    } catch (error) {
      console.error('Error sending transaction:', error);
      setTransactionRejected(true);
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
      setLoadingMessage("Close Transaction completed successfully");
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
    <div className="md:w-[60rem] bg-black  flex md:-ml-0 w-[2rem]">
      <div className="relative bg-black text-white text-base flex flex-col  gap-2 p-5 md:p-10">
        <div className="space-y-7">
          <div className="flex md:gap-52 justify-between">
            <span className="flex">
              <span className="md:ml-0 ml-1 text-sm body-text text-[#84827a] font-medium">Collateral</span>
              <Image width={15} className="toolTipHolding5 ml_5 -mt-[3px]" src={info} data-pr-tooltip="" alt="info" />
              <Tooltip className="custom-tooltip title-text2" target=".toolTipHolding5" mouseTrack content="The BTC you’ve staked to receive PUSD. This Bitcoin acts as security for the loan or transaction." mouseTrackLeft={10} />
            </span>
            {Number(entireDebtAndColl) <= 0 ? "--" : <span className="body-text font-medium text-sm md:mr-0 mr-4 whitespace-nowrap">{Number(entireDebtAndColl).toFixed(8)} BTC</span>}
          </div>
          <div className="flex justify-between">
            <div className="flex">
              <span className="md:ml-0 ml-1 text-sm body-text text-[#84827a] font-medium">Debt</span>
              <Image width={15} className="toolTipHolding6 ml_5 -mt-[5px]" src={info} data-pr-tooltip="" alt="info" />
              <Tooltip className="custom-tooltip title-text2" target=".toolTipHolding6" mouseTrack content="The amount of PUSD you owe. This is the value you need to repay, with your BTC collateral backing it." mouseTrackLeft={10} />
            </div>
            {Number(debt) <= 0 ? "---" : <span className="body-text font-medium text-sm md:mr-0 mr-4 whitespace-nowrap">{Number(debt).toFixed(2)} PUSD</span>}
          </div>
          <div className="flex justify-between">
            <div className="flex">
              <span className="md:ml-0 ml-1 text-sm body-text font-medium text-[#84827a]">Liquidation Reserve</span>
              <Image width={15} className="toolTipHolding7 ml_5 -mt-[px]" src={info} data-pr-tooltip="" alt="info" />
              <Tooltip className="custom-tooltip title-text2" target=".toolTipHolding7" mouseTrack content="The amount of PUSD set aside as a buffer to cover potential liquidation. This reserve helps ensure that there are sufficient funds to handle any shortfalls or losses that may occur." mouseTrackLeft={10} />
            </div>
            {Number(liquidationReserve) <= 0 ? "--" : <span className="body-text md:mr-0 mr-4 font-medium text-sm">{Number(liquidationReserve).toFixed(2)} PUSD</span>}
          </div>
          <div className="flex justify-between">
            <div className="flex">
              <span className="body-text font-medium text-[#84827a] text-sm ml-1 md:ml-0">Wallet Balance</span>
              <Image width={15} className="toolTipHolding8 ml_5 " src={info} data-pr-tooltip="" alt="info" />
              <Tooltip className="custom-tooltip title-text2" target=".toolTipHolding8" mouseTrack content="The amount of PUSD currently available in your wallet for transactions or withdrawals" mouseTrackLeft={10} />
            </div>
            <span className="body-text font-medium text-sm mr-4 md:mr-0">
              {afterLoad ? (
                <div className="h-2 mr-20 text-left">
                  <div className="hex-loader"></div>
                </div>
              ) : (
                `${Math.trunc(Number(pusdBalance) * 100) / 100} PUSD`
              )}
            </span>
          </div>
        </div>
        <button
          onClick={handleConfirmClick}
          disabled={isLowBalance || afterLoad}
          className={`mt-20 md:w-full md:ml-0 ml-1 w-[18.2rem] h-[3rem] rounded-3xl bg-[#88e273] text-black title-text ${isLowBalance || afterLoad ? 'cursor-not-allowed opacity-50' : 'hover:scale-95 cursor-pointer'}`}
        >
          Close Trove
        </button>
        <div className="text-red-500 text-sm font-medium body-text w-full ml-1">
          {isLowBalance ? "Low balance: unable to close trove" : null}
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
              ) : loadingMessage === 'Close Transaction completed successfully' ? (
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
                  <Button className=" mt-1 p-3 rounded-none md:w-[20rem] text-black title-text2 hover:bg-[#88e273] hover:scale-95 bg-[#88e273]" onClick={handleClose}>Try again</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );

};
