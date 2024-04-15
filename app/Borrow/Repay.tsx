/* eslint-disable */

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import borrowerOperationAbi from "../src/constants/abi/BorrowerOperations.sol.json";
import erc20Abi from "../src/constants/abi/ERC20.sol.json";
import hintHelpersAbi from "../src/constants/abi/HintHelpers.sol.json";
import priceFeedAbi from "../src/constants/abi/PriceFeedTestnet.sol.json";
import sortedTroveAbi from "../src/constants/abi/SortedTroves.sol.json";
import stabilityPoolAbi from "../src/constants/abi/StabilityPool.sol.json";
import troveManagerAbi from "../src/constants/abi/TroveManager.sol.json";
import { BOTANIX_RPC_URL } from "../src/constants/botanixRpcUrl";
import botanixTestnet from "../src/constants/botanixTestnet.json";
import { getContract } from "../src/utils/getContract";
import Decimal from "decimal.js";
import { ethers, toBigInt } from "ethers";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { useWalletClient } from "wagmi";
import Image from "next/image";

// import img3 from "../assets/images/image 128.png";
import img3 from "../assets/images/Group 661.svg";
import img4 from "../assets/images/Group 666.svg";

export default function Repay() {
  const [userInputs, setUserInputs] = useState({
    lusdAmount: "0",
    coll: "0",
  });

  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [isLowDebt, setIsLowDebt] = useState(false);
  const [hasPriceFetched, setHasPriceFetched] = useState(false);
  const [hasGotStaticData, setHasGotStaticData] = useState(false);
  const [totalDebt, setTotalDebt] = useState(0);
  const [ltv, setLtv] = useState(0);
  const [price, setPrice] = useState(0);
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [totalColl, setTotalColl] = useState(0);
  const [collAmount, setCollAmount] = useState(0);
  const [availCollTotal, setAvailCollTotal] = useState(0);
  const [lr, setLr] = useState(0);
  const [payableDebt, setPayableDebt] = useState(0);
  const [pusdBalance, setPusdBalance] = useState(0);
  //static
  const [staticCollAmount, setStaticCollAmount] = useState(0);
  const [staticLiquidationPrice, setStaticLiquidationPrice] = useState(0);
  const [staticTotalColl, setStaticTotalColl] = useState(0);
  const [staticLtv, setStaticLtv] = useState(0);
  const [staticPayableDebt, setStaticPayableDebt] = useState(0);
  const [staticTotalDebt, setStaticTotalDebt] = useState(0);

  const { data: walletClient } = useWalletClient();

  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);

  const hintHelpersContract = getContract(
    botanixTestnet.addresses.hintHelpers,
    hintHelpersAbi,
    provider
  );

  const sortedTrovesContract = getContract(
    botanixTestnet.addresses.sortedTroves,
    sortedTroveAbi,
    provider
  );

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

  const borrowerOperationsContractReadOnly = getContract(
    botanixTestnet.addresses.borrowerOperations,
    borrowerOperationAbi,
    provider
  );

  const priceFeedContract = getContract(
    botanixTestnet.addresses.priceFeed,
    priceFeedAbi,
    provider
  );

  const stabilityPoolContractReadOnly = getContract(
    botanixTestnet.addresses.stabilityPool,
    stabilityPoolAbi,
    provider
  );

  const erc20Contract = getContract(
    botanixTestnet.addresses.pusdToken,
    erc20Abi,
    provider
  );

  useEffect(() => {
    const getRecoveryModeStatus = async () => {
      const status: boolean = await troveManagerContract.checkRecoveryMode(
        price
      );
      setIsRecoveryMode(status);
    };

    const checkDebt = async () => {
      const pow = Decimal.pow(10, 18);

      const collateralBeforeConv = new Decimal(userInputs.lusdAmount);
      const borrowBeforeConv = new Decimal(userInputs.coll);

      const collIncrease: string = collateralBeforeConv.mul(pow).toFixed();
      const LUSDRepayment: string = borrowBeforeConv.mul(pow).toFixed();

      console.log("Collatoral Value:", collIncrease, typeof collIncrease);
      console.log("Borrow Value:", LUSDRepayment, typeof LUSDRepayment);

      if (!walletClient) return null;
      const { 0: debt, 1: coll } =
        await troveManagerContract.getEntireDebtAndColl(
          walletClient.account.address
        );
      const newDebt = toBigInt(debt) - toBigInt(LUSDRepayment);
      const newColl = toBigInt(coll) - toBigInt(collIncrease);
      console.log(newDebt, newColl, "newDebt", "newColl");

      const minDebt = await borrowerOperationsContractReadOnly.MIN_NET_DEBT();
      console.log(minDebt, "minDebt");

      if (minDebt <= newDebt) {
        return setIsLowDebt(true);
      }
    };

    const getPrice = async () => {
      try {
        if (!provider || hasPriceFetched) return null;
        const fetchedPrice = await priceFeedContract.getPrice();
        // const convertedFetchedPrice = (fetchedPrice / _1e18).toString();
        const convertedFetchedPrice = ethers.formatUnits(fetchedPrice, 18);
        setPrice(Number(convertedFetchedPrice));
        console.log(convertedFetchedPrice, "Fetched price");
      } catch (error) {
        console.error(error, "error");
      } finally {
        setHasPriceFetched(true);
      }
    };

    const getLiquidationReserve = async () => {
      const lr = await troveManagerContract.LUSD_GAS_COMPENSATION();
      const lrFormatted = Number(ethers.formatUnits(lr, 18));
      setLr(lrFormatted);
      console.log({ lr, lrFormatted });
    };

    const getStaticData = async () => {
      if (!walletClient) return null;
      if (!provider || hasGotStaticData) return null;

      const { 0: debt, 1: coll } =
        await troveManagerContract.getEntireDebtAndColl(
          walletClient.account.address
        );

      const expectedBorrowingRate =
        await troveManagerContract.getBorrowingRateWithDecay();

      const borrowingRate = Number(
        ethers.formatUnits(expectedBorrowingRate, 18)
      );
      const debtFormatted = Number(ethers.formatUnits(debt, 18));
      const collFormatted = Number(ethers.formatUnits(coll, 18));

      setStaticCollAmount(collFormatted);

      // total coll
      const collTotal = collFormatted * price;
      setStaticTotalColl(collTotal);
      setStaticTotalDebt(debtFormatted);

      //ltv
      const ltvValue = (debtFormatted * 100) / (collTotal || 1); // if collTotal is 0/null/undefined then it will be divided by 1
      setStaticLtv(ltvValue);

      //liquidationPrice
      const divideBy = isRecoveryMode ? 1.5 : 1.1;
      const liquidationPriceValue = (divideBy * debtFormatted) / collFormatted;
      setStaticLiquidationPrice(liquidationPriceValue);

      //payable debt
      const payableDebtValue = debtFormatted - lr;
      setStaticPayableDebt(payableDebtValue);

      console.log({
        debt,
        coll,
        collFormatted,
        debtFormatted,
        collTotal,
        ltvValue,
      });
      setHasGotStaticData(true);
    };

    getRecoveryModeStatus();
    checkDebt();
    getPrice();
    getLiquidationReserve();
    getStaticData();
  }, [walletClient]);

  useDebounce(
    () => {
      makeCalculations(userInputs.lusdAmount, userInputs.coll);
    },
    1000,
    [userInputs.lusdAmount, userInputs.coll]
  );

  const handleConfirmClick = async (xLusdAmount: string, xColl: string) => {
    try {
      const pow20 = Decimal.pow(10, 20);
      const pow18 = Decimal.pow(10, 18);

      // const collateralBeforeConv = new Decimal(userInputs.lusdAmount);
      // const borrowBeforeConv = new Decimal(userInputs.coll);

      // const collIncrease: string = collateralBeforeConv.mul(pow).toFixed();
      // const LUSDRepayment: string = borrowBeforeConv.mul(pow).toFixed();

      const lusdValue = Number(xLusdAmount);
      const collValue = Number(xColl);

      // console.log("Collatoral Value:", collIncrease, typeof collIncrease);
      // console.log("Borrow Value:", LUSDRepayment, typeof LUSDRepayment);

      if (!walletClient) return null;
      const { 0: debt, 1: coll } =
        await troveManagerContract.getEntireDebtAndColl(
          walletClient.account.address
        );

      // const expectedBorrowingRate =
      // 	await troveManagerContract.getBorrowingRateWithDecay();

      // const borrowingRate = Number(
      // 	ethers.formatUnits(expectedBorrowingRate, 18)
      // );
      const debtFormatted = Number(ethers.formatUnits(debt, 18));
      const collFormatted = Number(ethers.formatUnits(coll, 18));

      const newDebt = debtFormatted - lusdValue;
      const newColl = collFormatted - collValue;

      // const newDebt = toBigInt(debt) - toBigInt(LUSDRepayment);
      // const newColl = toBigInt(coll) - toBigInt(collIncrease);
      // console.log(newDebt, newColl, "newDebt", "newColl");

      const minDebt = await borrowerOperationsContractReadOnly.MIN_NET_DEBT();
      console.log({ newDebt, newColl, minDebt });

      if (minDebt <= newDebt) {
        return setIsLowDebt(true);
      }

      // const _1e20Before = new Decimal("100");
      // const _1e20 = toBigInt(_1e20Before.mul(pow).toFixed());

      // NICR = newColl.mul(_1e20).div(newDebt)
      // let NICR: bigint = (newColl * toBigInt(_1e20)) / newDebt;
      // console.log(NICR, "NICR");

      let NICR = newColl / newDebt;
      console.log(NICR, "NICR");

      // const bigNICRWithDecimals = BigInt(
      // 	ethers.parseUnits(NICR.toString(), 20)
      // );

      const NICRDecimal = new Decimal(NICR.toString());
      const NICRBigint = BigInt(NICRDecimal.mul(pow20).toFixed());
      console.log(NICRBigint, "NICRBigint");

      // console.log(bigNICRWithDecimals);

      const numTroves = await sortedTrovesContract.getSize();
      const numTrials = numTroves * BigInt("15");

      console.log(numTrials, "numTrials");

      const { 0: approxHint } = await hintHelpersContract.getApproxHint(
        // bigNICRWithDecimals,
        NICRBigint,
        numTrials,
        42
      ); // random seed of 42

      console.log(approxHint, "approxHint");

      // Use the approximate hint to get the exact upper and lower hints from the deployed SortedTroves contract
      const { 0: upperHint, 1: lowerHint } =
        await sortedTrovesContract.findInsertPosition(
          // bigNICRWithDecimals,
          NICRBigint,
          approxHint,
          approxHint
        );

      console.log(upperHint, lowerHint, "upperHint", "lowerHint");

      const maxFee = "5".concat("0".repeat(16));
      const collDecimal = new Decimal(collValue.toString());
      const collBigint = BigInt(collDecimal.mul(pow18).toFixed());
      console.log(collBigint, "collBigint");

      const lusdDecimal = new Decimal(lusdValue.toString());
      const lusdBigint = BigInt(lusdDecimal.mul(pow18).toFixed());
      console.log(lusdBigint, "lusdBigint");

      // Call adjustTrove with the exact upperHint and lowerHint
      const borrowOpt = await borrowerOperationsContract.adjustTrove(
        maxFee,
        0,
        lusdBigint,
        Number(userInputs.coll) === 0 ? false : true,
        upperHint,
        lowerHint,
        { value: collBigint }
      );
      console.log(borrowOpt, "borrowOpt");
    } catch (error) {
      console.error(error, "Error");
    } finally {
      console.log("FINALLY");
    }
  };

  const makeCalculations = async (xLusdAmount: string, xColl: string) => {
    const lusdValue = Number(xLusdAmount);
    const collValue = Number(xColl);

    if (!walletClient) return null;

    const { 0: debt, 1: coll } =
      await troveManagerContract.getEntireDebtAndColl(
        walletClient.account.address
      );

    const expectedBorrowingRate =
      await troveManagerContract.getBorrowingRateWithDecay();

    const borrowingRate = Number(ethers.formatUnits(expectedBorrowingRate, 18));
    const debtFormatted = Number(ethers.formatUnits(debt, 18));
    const collFormatted = Number(ethers.formatUnits(coll, 18));

    setCollAmount(collFormatted);

    const expectedFeeFormatted = (borrowingRate * lusdValue) / 100;

    //pusd balance
    const pusdBalanceValue = await erc20Contract.balanceOf(
      walletClient.account.address
    );
    const pusdBalanceFormatted = ethers.formatUnits(pusdBalanceValue, 18);
    setPusdBalance(Number(Number(pusdBalanceFormatted).toFixed(2)));

    // total debt
    const debtTotal = debtFormatted - lusdValue;
    setTotalDebt(debtTotal);

    // total coll
    const collTotal = (collFormatted - collValue) * price;
    setTotalColl(collTotal);

    //ltv
    const ltvValue = (debtTotal * 100) / (collTotal || 1);
    setLtv(ltvValue);

    //liquidationPrice
    const divideBy = isRecoveryMode ? 1.5 : 1.1;
    const liquidationPriceValue =
      (divideBy * debtTotal) / (collFormatted - collValue);
    setLiquidationPrice(liquidationPriceValue);

    //available total collateral
    const availCollTotalValue = collValue * price;
    setAvailCollTotal(availCollTotalValue);

    //payable debt
    const payableDebtValue = debtTotal - lr;
    setPayableDebt(payableDebtValue);

    console.log({
      debt,
      coll,
      debtFormatted,
      collFormatted,
      debtTotal,
      collTotal,
      ltvValue,
    });
  };

  return (
    <div className="container  flex flex-row justify-between gap-32">
      {/* <div className="flex gap-10 items-start "> */}
      <div>
        <div className="grid w-full max-w-sm items-start gap-2 mx-auto   p-5">
          <div className="relative">
            <Label htmlFor="items" className="text-white ">
              Repay PUSD
            </Label>
            <div
              className="flex items-center border border-yellow-300 "
              style={{ backgroundColor: "#3f3b2d" }}
            >
              <Image src={img4} alt="home" />{" "}
              <span className="text-white text-sm">PUSD</span>
              <Input
                id="items"
                placeholder="0.000 BTC"
                type="number"
                value={userInputs.lusdAmount}
                onChange={(e) => {
                  const newCollValue = e.target.value;
                  setUserInputs({ ...userInputs, lusdAmount: newCollValue });
                  // makeCalculations(userInputs.borrow, newCollValue || "0");
                }}
                className="w-[23.75rem] h-[4rem] text-white"
                style={{ backgroundColor: "#3f3b2d" }}
              />
              {/* <div style={{ backgroundColor: "#3f3b2d" }}>
                                  {totalCollateral}
                                </div> */}
              {/* <Button className="w-10" size="sm" variant="outline">
                    Max
                  </Button> */}
            </div>
            {/* <span className="text-white">
              Available {Number(balanceData?.formatted).toFixed(3)}{" "}
              {balanceData?.symbol}
            </span> */}
          </div>
          <span className="text-white text-sm ">
            Available {pusdBalance} PUSD
            {/* {balanceData?.symbol} */}
          </span>
          <div className="relative">
            <Label htmlFor="quantity" className="text-white">
              Withdraw Collateral
            </Label>
            <div
              className="flex items-center border border-yellow-300 "
              style={{ backgroundColor: "#3f3b2d" }}
            >
              {" "}
              <Image src={img3} alt="home" />
              <span className="text-white text-sm">BTC</span>
              <Input
                id="quantity"
                placeholder="0.00 PUSD"
                type="number"
                value={userInputs.coll}
                onChange={(e) => {
                  const newBorrowValue = e.target.value;
                  setUserInputs({ ...userInputs, coll: newBorrowValue });
                  // makeCalculations(newBorrowValue || "0", userInputs.collatoral);
                }}
                className="w-[23.75rem] h-[4rem] text-white"
                style={{ backgroundColor: "#3f3b2d" }}
              />
              <span className="text-white">
                ${Number(availCollTotal).toFixed(2)}
              </span>
              {/* <span className="text-white">0</span> */}
            </div>
            <div className="text-white text-sm">
              Available {collAmount}
              {/* Available {availableBorrow} */}
            </div>
            <Button
              onClick={() =>
                handleConfirmClick(userInputs.lusdAmount, userInputs.coll)
              }
              className="mt-5 w-[22rem] h-[3rem] bg-yellow-300 text-black font-bold"
            >
              UPDATE TROVE
            </Button>
          </div>
        </div>
      </div>

      <div className="m-4" style={{ backgroundColor: "#3f3b2d" }}>
        {/* Static Stats */}

        <div className="  px-10 pt-10  min-w-96 text-white text-sm">
          <div className="flex mb-2 justify-between">
            <span>Loan-To-Value</span>

            <span> {Number(staticLtv).toFixed(2)} %</span>
          </div>
          <div className="flex  gap-20 mb-2 justify-between">
            <span>Liq. Reserve</span>

            <span>{Number(lr).toFixed(2)} PUSD</span>
          </div>
          <div className="flex  gap-20 mb-2 justify-between">
            <span>Payable Debt</span>
            <span>{Number(staticPayableDebt).toFixed(2)} PUSD</span>
          </div>
          <div className="flex  gap-20 mb-2 justify-between">
            <span>Liquidation Price</span>
            <span>{Number(staticLiquidationPrice).toFixed(2)} PUSD</span>
          </div>
          <div className="flex gap-20 mb-2 justify-between">
            <span>Total Debt</span>
            <span>{Number(staticTotalDebt).toFixed(2)} PUSD</span>
          </div>
          <div className="flex gap-20 mb-2 justify-between">
            <span>Total Collateral</span>
            <span>{Number(staticTotalColl).toFixed(4)} BTC</span>
          </div>
        </div>
        <div className="px-10 border mb-2 "></div>
        {/* dysmani Stats */}

        <div className="  px-10  min-w-96 text-white text-sm">
          <div className="flex mb-2 justify-between">
            <span>Loan-To-Value</span>

            <span>{Number(ltv).toFixed(2)} %</span>
          </div>
          <div className="flex mb-2 justify-between">
            <span>Liq. Reserve</span>
            <span>{Number(lr).toFixed(2)} PUSD</span>
          </div>
          <div className="flex mb-2 justify-between">
            <span>Payable Debt</span>
            <span>{Number(payableDebt).toFixed(2)} PUSD</span>
          </div>
          <div className="flex mb-2 justify-between">
            <span>Liquidation Price</span>
            {Number(liquidationPrice).toFixed(2)} PUSD
          </div>
          <div className="flex mb-2 justify-between">
            <span>Total Debt</span>
            <span>{Number(totalDebt).toFixed(2)} PUSD</span>
          </div>
          <div className="flex mb-2 justify-between">
            <span>Total Collateral</span>
            <span>{Number(totalColl).toFixed(4)} BTC</span>
          </div>
        </div>
      </div>
    </div>
  );
}