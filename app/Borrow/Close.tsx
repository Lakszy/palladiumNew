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
import { Button } from "@/components/ui/button";

export const CloseTrove = () => {
  const { toBigInt } = web3.utils;
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
    walletClient // We are using walletClient because we need to update/modify data in blockchain.
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
      console.log(debt, "debt");
      console.log(coll, "coll");

      const liquidationReserve: bigint =
        await troveManagerContract.LUSD_GAS_COMPENSATION();

      console.log(
        liquidationReserve,
        "liquidationReserve",
        typeof liquidationReserve
      );

      const balance = debt - liquidationReserve;
      console.log(balance, "balance");
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
      const pow = Decimal.pow(10, 18);

      if (!walletClient) return null;
      await borrowerOperationsContract.closeTrove();
    } catch (error) {
      console.error(error, "Error");
    }
  };

  return (
    // <div className="w-[60rem] h-[32rem]  p-20">
    //   {/* <div className="grid w-full max-w-sm items-start gap-2 mx-auto mt-24 border rounded-md border-black p-5"> */}
    //   <div className="relative text-white text-sm">
    //     <div className="flex gap-40 mb-2">
    //       <span>Loan-To-Value</span>
    //       <span>{debtCollValue.coll.toString()} %</span>
    //     </div>
    //     <div className="flex gap-40 mb-2">
    //       <span>Collateral</span>
    //       <span>{debtCollValue.coll.toString()} ETH</span>
    //     </div>
    //     <div className="flex gap-40 mb-2">
    //       <span>Debt</span>
    //       <span>{debtCollValue.debt.toString()} PUSD</span>
    //     </div>
    //     <div className="flex gap-40 mb-2">
    //       <span>Liquidation Reserve</span>
    //       <span>{debtCollValue.liquidationReserve.toString()} PUSD</span>
    //     </div>
    //     <div className="flex gap-40 mb-2">
    //       <span>Balance</span>
    //       <span>{debtCollValue.balance.toString()} PUSD</span>
    //     </div>
    //     {/* <p className="mb-2">collateral - {debtCollValue.coll.toString()}</p>
    //     <p className="mb-2">debt - {debtCollValue.debt.toString()}</p>
    //     <p className="mb-2">
    //       liquidation-reserve - {debtCollValue.liquidationReserve.toString()}
    //     </p>
    //     <p className="mb-2">balance - {debtCollValue.balance.toString()}</p> */}

    //     <Button
    //       // disable the btn if collratio is less than 110
    //       // disabled={
    //       // 	Number(calculatedValues.collateralRatio) <= 110 ||
    //       // 	Number(userInputs.borrow) < 500
    //       // }
    //       onClick={handleConfirmClick}
    //       disabled={isLowBalance}
    //       className="mt-44 w-[22rem] h-[3rem] bg-yellow-300 text-black font-bold"
    //     >
    //       Close Trove
    //     </Button>
    //     <div className="text-red-500">
    //       {isLowBalance ? "Low balance: unable to close trove" : null}
    //     </div>
    //   </div>
    // </div>
    <div className="w-[60rem] h-[28rem]  ">
      <div className="relative text-white text-sm flex flex-col gap-2 pl-20 pr-[32rem] py-20">
        {/* <div className="flex justify-between">
          <span>Loan-To-Value</span>
          <span>{debtCollValue.coll.toString()} %</span>
        </div> */}
        <div className="flex justify-between">
          <span>Collateral</span>
          <span>{debtCollValue.coll.toString()} BTC</span>
        </div>
        <div className="flex justify-between">
          <span>Debt</span>
          <span>{debtCollValue.debt.toString()} PUSD</span>
        </div>
        <div className="flex justify-between">
          <span>Liquidation Reserve</span>
          <span>{debtCollValue.liquidationReserve.toString()} PUSD</span>
        </div>
        <div className="flex justify-between">
          <span>Balance</span>
          <span>{debtCollValue.balance.toString()} PUSD</span>
        </div>

        <Button
          onClick={handleConfirmClick}
          disabled={isLowBalance}
          className="mt-20 w-[22rem] h-[3rem] bg-yellow-300 text-black font-bold"
        >
          Close Trove
        </Button>
        <div className="text-red-500">
          {isLowBalance ? "Low balance: unable to close trove" : null}
        </div>
      </div>
    </div>
  );
};