/* eslint-disable */
"use client";
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
import { useAccount, useWalletClient } from "wagmi";
import { Dialog } from 'primereact/dialog';
import BotanixLOGO from "../../app/assets/images/newpalladium.svg"
import Image from "next/image";
import "../../components/stabilityPool/Modal.css"
import "../../app/App.css"
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
  const { address, isConnected } = useAccount();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fetchedPrice, setFetchedPrice] = useState("0");
  const [value, setValue] = useState("0");

  const [newAvailColl, setNewAvailColl] = useState(0)

  const [entireDebtAndColl, setEntireDebtAndColl] = useState({
    debt: "0",
    coll: "0",
    pendingLUSDDebtReward: "0",
    pendingETHReward: "0",
  });


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

  const erc20Contract = getContract(
    botanixTestnet.addresses.pusdToken,
    erc20Abi,
    provider
  );

  useEffect(() => {
    const pow = Decimal.pow(10, 18);
    const _1e18 = toBigInt(pow.toFixed());

    const getRecoveryModeStatus = async () => {
      const status: boolean = await troveManagerContract.checkRecoveryMode(
        price
      );
      setIsRecoveryMode(status);
    };

    const fetchedData = async () => {
      console.log(walletClient?.account.address, "walletClient");
      if (!walletClient) return null;
      const { 0: debt, 1: coll, 2: pendingLUSDDebtReward, 3: pendingETHReward,
      } = await troveManagerContract.getEntireDebtAndColl(
        walletClient?.account.address
      );
      const collDecimal = new Decimal(coll.toString()); // Convert coll to a Decimal
      const collFormatted = collDecimal.div(_1e18.toString()).toString(); // Divide coll by _1e18 and convert to string

      setEntireDebtAndColl({
        debt: (debt / _1e18).toString(),
        coll: collFormatted,
        pendingLUSDDebtReward: (pendingLUSDDebtReward / _1e18).toString(),
        pendingETHReward: (pendingETHReward / _1e18).toString(),
      });

      if (!hasPriceFetched) {
        try {
          const fetchPrice: bigint = await priceFeedContract.getPrice();
          console.log(fetchPrice, "Fetching price");

          const fetchPriceDecimal = new Decimal(fetchPrice.toString()); // Convert coll to a Decimal
          const fetchPriceFormatted = fetchPriceDecimal
            .div(_1e18.toString())
            .toString();
          setFetchedPrice(fetchPriceFormatted);

          // Multiply collFormatted with fetchPrice
          const updatedCollFormatted = new Decimal(collFormatted).mul(
            fetchPriceFormatted
          );
          console.log(updatedCollFormatted, "updatedCollFormatted");

          // Convert the result back to a number before setting the state
          const updatedPrice = parseFloat(updatedCollFormatted.toString());

          // Update state with the multiplied value
          setPrice(updatedPrice);
          console.log(updatedPrice, "Multiplied collFormatted");
          setHasPriceFetched(true);
        } catch (error) {
          console.error(error, "Error fetching price");
          setHasPriceFetched(true);
        }
      }
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
      setHasGotStaticData(true);

    };

    getRecoveryModeStatus();
    checkDebt();
    fetchedData();
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

      const lusdValue = Number(xLusdAmount);
      const collValue = Number(xColl);

      if (!walletClient) return null;
      const { 0: debt, 1: coll } =
        await troveManagerContract.getEntireDebtAndColl(
          walletClient.account.address
        );

      const debtFormatted = Number(ethers.formatUnits(debt, 18));
      const collFormatted = Number(ethers.formatUnits(coll, 18));

      const newDebt = debtFormatted - lusdValue;
      const newColl = collFormatted - collValue;

      const minDebt = await borrowerOperationsContractReadOnly.MIN_NET_DEBT();

      if (minDebt <= newDebt) {
        return setIsLowDebt(true);
      }

      let NICR = newColl / newDebt;

      const NICRDecimal = new Decimal(NICR.toString());
      const NICRBigint = BigInt(NICRDecimal.mul(pow20).toFixed(0));

      const numTroves = await sortedTrovesContract.getSize();
      const numTrials = numTroves * BigInt("15");

      const { 0: approxHint } = await hintHelpersContract.getApproxHint(
        // bigNICRWithDecimals,
        NICRBigint,
        numTrials,
        42
      ); // random seed of 42

      const { 0: upperHint, 1: lowerHint } =
        await sortedTrovesContract.findInsertPosition(
          // bigNICRWithDecimals,
          NICRBigint,
          approxHint,
          approxHint
        );


      const maxFee = "6".concat("0".repeat(16));
      const collDecimal = new Decimal(collValue.toString());
      const collBigint = BigInt(collDecimal.mul(pow18).toFixed());

      const lusdDecimal = new Decimal(lusdValue.toString());
      const lusdBigint = BigInt(lusdDecimal.mul(pow18).toFixed());

      // Call adjustTrove with the exact upperHint and lowerHint
      const borrowOpt = await borrowerOperationsContract.adjustTrove(
        maxFee,
        collBigint,
        lusdBigint,
        false,
        upperHint,
        lowerHint,
        { value: 0 }
      );

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
    const collTotal = (collFormatted - collValue);
    setTotalColl(collTotal);

    //ltv
    const ltvValue = (debtTotal * 100) / ((collTotal || 1) * Number(fetchedPrice));
    setLtv(ltvValue);

    //liquidationPrice
    const divideBy = isRecoveryMode ? 1.5 : 1.1;
    const liquidationPriceValue = (divideBy * debtTotal) / (collFormatted - collValue);
    setLiquidationPrice(liquidationPriceValue);

    //available total collateral
    const availCollTotalValue = collValue * price;
    const newAvailColl = collValue * Number(fetchedPrice);

    setNewAvailColl(newAvailColl)

    setAvailCollTotal(availCollTotalValue);

    //payable debt
    const payableDebtValue = debtTotal - lr;
    setPayableDebt(payableDebtValue);
  };

  const divideBy = isRecoveryMode ? 1.5 : 1.1;
  const availableToBorrow = price / divideBy - Number(entireDebtAndColl.debt);
  const liquidation = divideBy * (Number(entireDebtAndColl.debt) / Number(entireDebtAndColl.coll));

  const getTroveStatus = async () => {
    if (!walletClient) return null;
    const troveStatusBigInt = await troveManagerContract.getTroveStatus(
      walletClient?.account.address
    );
    const troveStatus =
      troveStatusBigInt.toString() === "1" ? "ACTIVE" : "INACTIVE";

    setValue((Number(entireDebtAndColl.debt) / (Number(entireDebtAndColl.coll) * Number(fetchedPrice)) * 100).toFixed(3));

  };
  getTroveStatus();


  return (
    <div className=" flex-col flex md:flex-row justify-between gap-32">
      <div>
        <div className="grid space-y-5 w-full max-w-sm items-start gap-2 mx-auto   p-5">
          <div className="relative">
            <Label htmlFor="items" className=" body-text text-base text-gray-500 whitespace-nowrap ">
              Repay PUSD
            </Label>
            <div
              className="flex items-center border border-yellow-300  w-[20rem] md:w-full md:-ml-0 -ml-3 "
              style={{ backgroundColor: "#3f3b2d" }}
            >
              <div className="p-1">
                <Image src={img4} alt="home" />{" "}
                <span className=" body-text text-xs whitespace-nowrap ml-05">PUSD</span>
              </div>
              <input
                id="items"
                placeholder="0.000 BTC"
                type="number"
                disabled={!isConnected}
                value={userInputs.lusdAmount}
                onChange={(e) => {
                  const newCollValue = e.target.value;
                  setUserInputs({ ...userInputs, lusdAmount: newCollValue });
                  // makeCalculations(userInputs.borrow, newCollValue || "0");
                }}
                className="w-[23.75rem] ml-1 body-text text-base whitespace-nowrap text-gray-500 h-[4rem] "
                style={{ backgroundColor: "#3f3b2d" }}
              />
            </div>
          </div>
          <span className="text-white text-sm body-text  whitespace-nowrap ">
            Available {pusdBalance} PUSD
          </span>
          <div className="relative">
            <Label htmlFor="quantity" className="body-text text-base text-gray-500 whitespace-nowrap">
              Withdraw Collateral
            </Label>
            <div
              className="flex items-center border w-[20rem] md:w-full md:-ml-0 -ml-3  border-yellow-300 "
              style={{ backgroundColor: "#3f3b2d" }}
            >
              {" "}
              <Image src={img3} alt="home" />
              <span className="text-white  body-text text-xs whitespace-nowrap md:-ml-0 -ml-2">BTC</span>
              <input
                id="quantity"
                placeholder="0.00 PUSD"
                type="number"
                disabled={!isConnected}
                value={userInputs.coll}
                onChange={(e) => {
                  const newBorrowValue = e.target.value;
                  setUserInputs({ ...userInputs, coll: newBorrowValue });
                  // makeCalculations(newBorrowValue || "0", userInputs.collatoral);
                }}
                className="w-[23.75rem] h-[4rem] ml-1 text-gray-500 body-text text-base whitespace-nowrap"
                style={{ backgroundColor: "#3f3b2d" }}
              />
              <span className="text-white  body-text text-xs whitespace-nowrap">
                ${Number(newAvailColl).toFixed(2)}
              </span>
            </div>
            <div className="text-white text-sm body-text mt-0.5 whitespace-nowrap">
              Available {collAmount.toFixed(4)}
            </div>
            <button
              onClick={() =>
                handleConfirmClick(userInputs.lusdAmount, userInputs.coll)
              }
              className="mt-5 w-full title-text h-[3rem] bg-yellow-300 text-black "
            >
              UPDATE TROVE
            </button>
          </div>
        </div>
      </div>

      <div className="w-auto  p-10   md:mt-10 mx-2 md:mx-0 border border-black text-sm" style={{ backgroundColor: "#3f3b2d" }}>
        <div className="mb-4 space-y-4 ">

          <div className="flex  text-white mb-2 justify-between">
            <span className="body-text text-xs whitespace-nowrap">Loan-To-Value</span>

            <span className="text-xs whitespace-nowrap body-text text-right">{Number(value)} %</span>
          </div>

          <div className="flex  text-white mb-2 justify-between">
            <span className="body-text text-xs whitespace-nowrap">Liq. Reserve</span>

            <span className="text-xs whitespace-nowrap body-text text-right">{Number(lr).toFixed(2)} PUSD</span>
          </div>
          <div className="flex  text-white mb-2 justify-between">
            <span className="body-text text-xs whitespace-nowrap text">Liquidation Price</span>

            <span className="body-text text-xs whitespace-nowrap text-right">
              {Number(liquidation).toFixed(2)} PUSD
            </span>
          </div>
          <div className="flex  text-white mb-2 justify-between">
            <span className="body-text text-xs whitespace-nowrap">Total Debt</span>
            <span className="body-text text-xs whitespace-nowrap">
              {Number(staticTotalDebt).toFixed(2)} PUSD
            </span>
          </div>
          <div className="flex  text-white mb-2 justify-between">
            <span className="text-xs whitespace-nowrap body-text">Total Collateral</span>
            <span className="body-text text-xs whitespace-nowrap text-left -ml-9">
              {Number(entireDebtAndColl.coll).toFixed(4)} BTC
            </span>
          </div>
        </div>

        <div className="w-50 border mb-4 "></div>

        <div className="space-y-4 ">
          <div className="flex md:gap-40 mb-2 justify-between">
            <span className="body-text text-xs whitespace-nowrap">Loan-To-Value</span>
            <span className="body-text text-xs whitespace-nowrap">{Number(ltv).toFixed(2)} %</span>
          </div>
          <div className="flex md:gap-40 mb-2 justify-between">
            <span className="body-text text-xs whitespace-nowrap">Liq. Reserve</span>
            <span className="body-text text-xs whitespace-nowrap">{Number(lr).toFixed(2)} PUSD</span>
          </div>
          <div className="flex mb-2 md:gap-20 justify-between">
            <span className="body-text text-xs whitespace-nowrap">Payable Debt</span>
            <span className="body-text text-xs whitespace-nowrap">{Number(payableDebt).toFixed(2)} PUSD</span>
          </div>
          <div className="flex mb-2 md:gap-40 justify-between">
            <span className="body-text text-xs whitespace-nowrap">Liquidation Price</span>
            <h6 className="body-text text-xs whitespace-nowrap b">
              {Number(liquidationPrice).toFixed(2)} PUSD
            </h6>
          </div>
          <div className="flex mb-2 md:gap-40 justify-between">
            <span className="body-text text-xs whitespace-nowrap">Total Debt</span>
            <span className="body-text text-xs whitespace-nowrap">{Number(totalDebt).toFixed(2)} PUSD</span>
          </div>
          <div className="flex mb-2 md:gap-40 justify-between">
            <span className="body-text text-xs whitespace-nowrap">Total Collateral</span>
            <span className="body-text text-xs whitespace-nowrap">{Number(totalColl).toFixed(4)} BTC</span>
          </div>
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
}