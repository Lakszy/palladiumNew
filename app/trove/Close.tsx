/* eslint-disable */

"use client";
import borrowerOperationAbi from "../src/constants/abi/BorrowerOperations.sol.json";
import erc20Abi from "../src/constants/abi/ERC20.sol.json";
import { BOTANIX_RPC_URL } from "../src/constants/botanixRpcUrl";
import botanixTestnet from "../src/constants/botanixTestnet.json";
import { getContract } from "../src/utils/getContract";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { Dialog } from 'primereact/dialog';
import Image from "next/image";
import BotanixLOGO from "../../app/assets/images/newpalladium.svg"
import "../../app/App.css"
import "../../components/stabilityPool/Modal.css"

interface Props {
  entireDebtAndColl: number;
  debt: number;
  liquidationReserve: number;
}

export const CloseTrove: React.FC<Props> = ({ entireDebtAndColl, debt, liquidationReserve }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLowBalance, setIsLowBalance] = useState(false);
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const [afterLoad, setAfterload] = useState(false);
  const [pusdBalance, setPusdBalance] = useState("0");
  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);

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
    const fetchPrice = async () => {
      const pusdBalanceValue = await erc20Contract.balanceOf(address);
      const pusdBalanceFormatted = ethers.formatUnits(pusdBalanceValue, 18);
      if (Number(pusdBalanceFormatted) < (debt - liquidationReserve)) {
        setIsLowBalance(true);
      }
      setPusdBalance(pusdBalanceFormatted);
      setAfterload(false)
    };
    setAfterload(true)
    fetchPrice();
  }, [address, walletClient]);

  const handleConfirmClick = async () => {
    try {
      setIsModalVisible(true)
      if (!walletClient) return null;
      await borrowerOperationsContract.closeTrove();
    } catch (error) {
      console.error(error, "Error");
    }
    finally {
      setIsModalVisible(false)
    }
  };

  return (
    <div className="md:w-[60rem] flex md:-ml-0  ">
      <div className="relative text-white text-base flex flex-col gap-2 md:pl-20  pr-[32rem] py-20">
        <div className="space-y-7 ">
          <div className="flex md:gap-40 justify-between">
            <span className=" md:ml-0 ml-1  title-text text-gray-500">Collateral</span>
            {Number(entireDebtAndColl) <= 0 ? "--" : <span className="title-text md:mr-0 mr-4 whitespace-nowrap">{Number(entireDebtAndColl).toFixed(8)} BTC</span>}
          </div>
          <div className="flex justify-between">
            <span className=" md:ml-0 ml-1 title-text text-gray-500">Debt</span>
            {Number(debt) <= 0 ? "---" : <span className="title-text md:mr-0 mr-4">{Number(debt).toFixed(2)} PUSD</span>}
          </div>
          <div className="flex justify-between">
            <span className=" md:ml-0 ml-1 title-text text-gray-500">Liquidation Reserve</span>
            {Number(liquidationReserve) <= 0 ? "--" : <span className="title-text md:mr-0 mr-4">{Number(liquidationReserve).toFixed(2)} PUSD</span>}
          </div>
          <div className="flex justify-between">
            <span className="title-text text-gray-500 ml-1 md:ml-0">Wallet Balance</span>
            <span className="title-text mr-4 md:mr-0">
              {afterLoad ? (
                <div className=" h-2 mr-20  text-left">
                  <div className="hex-loader"></div>
                </div>
              ) : (
                `${Number(pusdBalance).toFixed(2)} PUSD`
              )}
            </span>
          </div>
        </div>
        <button onClick={handleConfirmClick} disabled={isLowBalance || afterLoad} className={`mt-20 md:w-full md:ml-0 ml-1 w-[20rem] h-[3rem] bg-yellow-300 hover:bg-yellow-400 text-black title-text ${isLowBalance || afterLoad ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
          Close Trove
        </button>
        <div className="text-red-500 body-text w-full ml-1">
          {isLowBalance ? "Low balance: unable to close trove" : null}
        </div>
      </div>
      <Dialog visible={isModalVisible} onHide={() => setIsModalVisible(false)}>
        <>
          <div className="waiting-container bg-white">
            <div className="waiting-message text-lg title-text text-white whitespace-nowrap">Waiting for Confirmation... ✨.</div>
            <Image src={BotanixLOGO} className="waiting-image" alt="gif" />
          </div>
        </>
      </Dialog>
    </div>
  );
};
