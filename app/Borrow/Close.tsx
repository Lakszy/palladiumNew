/* eslint-disable */

"use client";
import borrowerOperationAbi from "../src/constants/abi/BorrowerOperations.sol.json";
import erc20Abi from "../src/constants/abi/ERC20.sol.json";
import troveManagerAbi from "../src/constants/abi/TroveManager.sol.json";
import { BOTANIX_RPC_URL } from "../src/constants/botanixRpcUrl";
import botanixTestnet from "../src/constants/botanixTestnet.json";
import { getContract } from "../src/utils/getContract";
import Decimal from "decimal.js";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import web3 from "web3";
import { Dialog } from 'primereact/dialog';
import Image from "next/image";
import BotanixLOGO from "../../app/assets/images/newpalladium.svg"
import "../../app/App.css"
import "../../components/stabilityPool/Modal.css"

interface Props {
  entireDebtAndColl: number; 
}

export const CloseTrove: React.FC<Props> = ({ entireDebtAndColl }) => {
  const { toBigInt } = web3.utils;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [debtCollValue, setDebtCollValue] = useState({
    coll: "0",
    debt: "0",
    liquidationReserve: "0",
    balance: "0",
  });
  const [isLowBalance, setIsLowBalance] = useState(false);
  const { data: walletClient } = useWalletClient();
  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);

  const troveManagerContract = getContract(
    botanixTestnet.addresses.troveManager,
    troveManagerAbi,
    provider
  );

  const borrowerOperationsContract = getContract(
    botanixTestnet.addresses.borrowerOperations,
    borrowerOperationAbi,
    walletClient 
  );

  const erc20Contract = getContract(
    botanixTestnet.addresses.pusdToken,
    erc20Abi,
    provider
  );

  useEffect(() => {
    const getInfo = async () => {
      const pow = Decimal.pow(10, 18);
      const _1e18 = toBigInt(pow.toFixed());

      if (!walletClient) return null;
      const { 0: debt, 1: coll } =
        await troveManagerContract.getEntireDebtAndColl(
          walletClient.account.address
        );
      const liquidationReserve: bigint =
        await troveManagerContract.LUSD_GAS_COMPENSATION();

      const balance = debt - liquidationReserve;
      setDebtCollValue({
        balance: (balance / _1e18).toString(),
        coll: (coll / _1e18).toString(),
        debt: (debt / _1e18).toString(),
        liquidationReserve: (liquidationReserve / _1e18).toString(),
      });

      const pusdBalance = await erc20Contract.balanceOf(
        walletClient.account.address
      );
      if (pusdBalance <= balance) {
        setIsLowBalance(true);
      }
    };
    getInfo();
  }, [walletClient]);

  const handleConfirmClick = async () => {
    try {
      setIsModalVisible(true)
      const pow = Decimal.pow(10, 18);
      if (!walletClient) return null;
      await borrowerOperationsContract.closeTrove();
      setIsModalVisible(false)
    } catch (error) {
      console.error(error, "Error");
    }
  };

  return (
    <div className="md:w-[60rem] flex md:-ml-0  ">
      <div className="relative text-white text-base flex flex-col gap-2 md:pl-20  pr-[32rem] py-20">
        <div className="space-y-7 ">
          <div className="flex  justify-between">
            <span className=" md:ml-0 ml-1 title-text text-gray-500">Collateral</span>
            <span className="title-text md:mr-0 mr-4">{Number(entireDebtAndColl).toFixed(4)} BTC</span>
          </div>
          <div className="flex justify-between">
            <span className=" md:ml-0 ml-1 title-text text-gray-500">Debt</span>
            <span className="title-text md:mr-0 mr-4">{debtCollValue.debt.toString()} PUSD</span>
          </div>
          <div className="flex justify-between">
            <span className=" md:ml-0 ml-1 title-text text-gray-500">Liquidation Reserve</span>
            <span className="title-text md:mr-0 mr-4">{debtCollValue.liquidationReserve.toString()} PUSD</span>
          </div>
          <div className="flex justify-between">
            <span className=" md:ml-0 ml-1 title-text text-gray-500">Balance</span>
            <span className="title-text md:mr-0 mr-4">{debtCollValue.balance.toString()} PUSD</span>
          </div>
        </div>
        <button
          onClick={handleConfirmClick}
          disabled={isLowBalance}
          className={`mt-20 md:w-full md:ml-0 ml-1 w-[20rem] h-[3rem] bg-yellow-300 hover:bg-yellow-400 text-black title-text ${isLowBalance ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          Close Trove
        </button>
        <div className="text-red-500 body-text">
          {isLowBalance ? "Low balance: unable to close trove" : null}
        </div>
      </div>
      <Dialog visible={isModalVisible} onHide={() => setIsModalVisible(false)}>
        <>
          <div className="waiting-container bg-white">
            <div className="waiting-message text-lg title-text text-white whitespace-nowrap">Waiting for COnformation... ✨.</div>
            <Image src={BotanixLOGO} className="waiting-image" alt="gif" />
          </div>
        </>
      </Dialog>
    </div>
  );
};
