/* eslint-disable */
"use client";
import { Label } from "@/components/ui/label";
import borrowerOperationAbi from "../src/constants/abi/BorrowerOperations.sol.json";
import erc20Abi from "../src/constants/abi/ERC20.sol.json";
import hintHelpersAbi from "../src/constants/abi/HintHelpers.sol.json";
import priceFeedAbi from "../src/constants/abi/PriceFeedTestnet.sol.json";
import sortedTroveAbi from "../src/constants/abi/SortedTroves.sol.json";
import troveManagerAbi from "../src/constants/abi/TroveManager.sol.json";
import { BOTANIX_RPC_URL } from "../src/constants/botanixRpcUrl";
import botanixTestnet from "../src/constants/botanixTestnet.json";
import { getContract } from "../src/utils/getContract";
import Decimal from "decimal.js";
import { readContract } from '@wagmi/core'
import { ethers, toBigInt } from "ethers";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { useAccount, useWalletClient } from "wagmi";
import Image from "next/image";
import img3 from "../assets/images/Group 661.svg";
import img4 from "../assets/images/Group 666.svg";
import "../../components/stabilityPool/Modal.css"
import "../../app/App.css"
import { wagmiConfig } from "../src/config/config";
import { borrowerOperations } from "../src/constants/abi/borrowerOperations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
interface Props {
  coll: number;
  debt: number;
  lr: number;
  fetchedPrice: number
}

export const Repay: React.FC<Props> = ({ coll, debt, lr, fetchedPrice }) => {
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
  const [payableDebt, setPayableDebt] = useState(0);
  const [pusdBalance, setPusdBalance] = useState(0);
  const { address, isConnected } = useAccount();
  const [value, setValue] = useState("0");

  const [userInputColl, setUserInputColl] = useState(0)
  const [userInputDebt, setUserInputDebt] = useState(0)

  const [newAvailColl, setNewAvailColl] = useState(0)

  //static
  const [staticCollAmount, setStaticCollAmount] = useState(0);
  const [staticLiquidationPrice, setStaticLiquidationPrice] = useState(0);
  const [staticTotalColl, setStaticTotalColl] = useState(0);
  const [staticLtv, setStaticLtv] = useState(0);
  const [staticPayableDebt, setStaticPayableDebt] = useState(0);
  const [staticTotalDebt, setStaticTotalDebt] = useState(0);
  const [minimumBorrow, setMinimumBorrow] = useState("0");

  const [formattedMCR, setFormattedMCR] = useState("0")
  const [formattedCCR, setFormattedCCR] = useState("0")




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
    const fetchedData = async () => {
      if (!walletClient) return null;

      const {
        0: debt,
        1: coll,
        2: pendingLUSDDebtReward,
        3: pendingETHReward,
      } = await troveManagerContract.getEntireDebtAndColl(
        walletClient?.account.address
      );
      const collDecimal = new Decimal(coll.toString()); // Convert coll to a Decimal
      const collFormatted = collDecimal.div(_1e18.toString()).toString(); // Divide coll by _1e18 and convert to string

      const expectedBorrowingRate = await troveManagerContract.getBorrowingRateWithDecay();
      const expectedFeeForm = ethers.formatUnits(expectedBorrowingRate, 18)

      const minDebt = await readContract(wagmiConfig, {
        abi: borrowerOperations,
        address: '0x1a45fEEe34a2fcfB39f28c57A1df08756f5d3A97',
        functionName: 'MIN_NET_DEBT',
      })
      const formattedMInDebt = ethers.formatUnits(minDebt, 18)
      setMinimumBorrow(formattedMInDebt)


      const divideBy = isRecoveryMode ? formattedCCR : formattedMCR;
      const liquidationPriceValue = (Number(divideBy) * Number(debt)) / Number(coll);
      setStaticLiquidationPrice(liquidationPriceValue);

    };

    const getRecoveryModeStatus = async () => {
      const fetchPrice: bigint = await priceFeedContract.getPrice();
      const status: boolean = await troveManagerContract.checkRecoveryMode(
        fetchPrice
      );
      setIsRecoveryMode(status);
    };

    const getStaticData = async () => {
      if (!walletClient) return null;
      if (!provider || hasGotStaticData) return null;

      const MCR = await troveManagerContract.MCR();
      const CCR = await troveManagerContract.CCR();

      setFormattedMCR(ethers.formatUnits(MCR, 18))
      setFormattedCCR(ethers.formatUnits(CCR, 18))

      const ltvValue = (Number(debt) * 100) / ((Number(coll) * Number(fetchedPrice)) || 1); // if collTotal is 0/null/undefined then it will be divided by 1
      setStaticLtv(ltvValue);
      setHasGotStaticData(true);
    };

    getTroveStatus();
    fetchedData();
    getStaticData();
    getRecoveryModeStatus();
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
      const pow20 = Decimal.pow(10, 20);
      const pow18 = Decimal.pow(10, 18);

      const lusdValue = Number(xLusdAmount);
      const collValue = Number(xColl);

      if (!walletClient) return null;

      const newDebt = Number(debt) - lusdValue;
      const newColl = Number(coll) - collValue;
      const minDebt = await borrowerOperationsContractReadOnly.MIN_NET_DEBT();

      if (minDebt <= newDebt) {
        return setIsLowDebt(true);
      }

      let NICR = newColl / newDebt;

      const NICRDecimal = new Decimal(NICR.toString());
      const NICRBigint = BigInt(NICRDecimal.mul(pow20).toFixed());

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

      console.log("tsxn start")
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
    try {

      const lusdValue = Number(xLusdAmount);
      const collValue = Number(xColl);

      if (!walletClient) return null;

      const debtTotal = Number(debt) - lusdValue;
      setTotalDebt(debtTotal);

      const collTotal = Number(coll) - collValue;
      setTotalColl(collTotal);

      //ltv
      const ltvValue = (debtTotal * 100) / ((collTotal || 1) * Number(fetchedPrice));
      setLtv(ltvValue);

      //liquidationPrice
      const liquidationPriceValue = (divideBy * debtTotal) / collTotal;
      setLiquidationPrice(liquidationPriceValue);

      const newAvailColl = Number(coll) - ((divideBy * debtTotal) / Number(fetchedPrice))

      setNewAvailColl(newAvailColl)

      { parseFloat(userInputs.coll) > 0 ? setUserInputColl(1) : setUserInputColl(0) }
      { parseFloat(userInputs.lusdAmount) > 0 ? setUserInputDebt(1) : setUserInputDebt(0) }


      // Payable debt
      const payableDebtValue = debtTotal - lr;
      setPayableDebt(payableDebtValue);

    } catch (error) {
      console.error(error, "Error in makeCalculations");
    }
  };

  const handlePercentageClick = (percentage: any) => {
    const percentageDecimal = new Decimal(percentage).div(100);
    const pusdBalanceNumber = parseFloat(totalAvailableRepay.toString());
    if (!isNaN(pusdBalanceNumber)) {
      const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
      const stakeFixed = maxStake.toFixed(2);
      setUserInputs({ coll: userInputs.coll, lusdAmount: stakeFixed });

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


  const divideBy = isRecoveryMode ? 1.5 : 1.1;
  const availableToBorrow = price / divideBy - Number(debt);
  const liquidation = 1.1 * (Number(debt) / Number(coll));

  const getTroveStatus = async () => {
    if (!walletClient) return null;
    const troveStatusBigInt = await troveManagerContract.getTroveStatus(
      walletClient?.account.address
    );
    const troveStatus =
      troveStatusBigInt.toString() === "1" ? "ACTIVE" : "INACTIVE";

    setValue((Number(debt) / (Number(coll) * Number(fetchedPrice)) * 100).toFixed(3));

  };
  getTroveStatus();
  const isUpdateDisabled = parseFloat(userInputs.coll) > collAmount && parseFloat(userInputs.lusdAmount) > pusdBalance && parseFloat(userInputs.coll) !== 0 && parseFloat(userInputs.lusdAmount) !== 0 && parseFloat(userInputs.lusdAmount) >= pusdBalance;
  const totalAvailableRepay = Number(debt) - Number(minimumBorrow) - lr
  const isCollInValid = parseFloat(userInputs.coll) > newAvailColl
  const isDebtInValid = parseFloat(userInputs.lusdAmount) > totalAvailableRepay

  const newLTV = ((Number(debt) * 100) / ((Number(coll) * Number(fetchedPrice)))).toFixed(2)




  return (
    <>
      <div className="flex-col flex md:flex-row justify-between gap-32">
        <div>
          <div className="grid w-full max-w-sm items-start gap-2 mx-auto   p-5">
            <div className="relative">
              <Label htmlFor="quantity" className="text-white body-text text-sm mb-2">
                Repay PUSD
              </Label>

              <div className="flex items-center w-[20rem] md:w-full md:-ml-0 -ml-3  border border-yellow-300 " style={{ backgroundColor: "#3f3b2d" }}>
                <div className='flex items-center h-[3.5rem] '>
                  <Image src={img4} alt="home" className='ml-1' />
                  <h3 className='text-white body-text ml-1 '>PUSD</h3>
                  <h3 className='h-full border mx-4'></h3>
                </div>
                <input id="quantity" placeholder="Enter Borrow Amount" value={userInputs.lusdAmount} onChange={(e) => { const newBorrowValue = e.target.value; setUserInputs({ ...userInputs, lusdAmount: newBorrowValue, }); }} className="w-[23.75rem] ml-1 h-[4rem] body-text text-sm whitespace-nowrap text-white" style={{ backgroundColor: "#3f3b2d" }} />
              </div>
              <div className="flex flex-col  md:flex-row gap-x-5  justify-between">
                <span className="text-white gap-x-2 flex md:flex-row  md:w-full w-20 flex-col">
                  <h6 className="text-gray-500 body-text  text-sm">
                    Available{" "}
                  </h6>
                  {Number(totalAvailableRepay) >= 0 && (
                    <h6 className={`text-sm body-text whitespace-nowrap ${parseFloat(userInputs.lusdAmount) > totalAvailableRepay ? 'text-red-500' : 'text-white'}`}>
                      {Number(totalAvailableRepay).toFixed(2)}
                    </h6>
                  )}
                </span>
                <div className="flex w-full gap-x-3 mt-2">
                  <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900  body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(25)}>25%</Button>
                  <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(50)}>50%</Button>
                  <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(75)}>75%</Button>
                  <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(100)}>100%</Button>
                </div>
              </div>

            </div>
            <div className="relative">
              <Label
                htmlFor="items"
                className="text-white body-text text-sm mb-2"
              >
                Withdraw Collatoral
              </Label>
              <div className="flex items-center  md:w-full md:-ml-0 -ml-3  border border-yellow-300 " style={{ backgroundColor: "#3f3b2d" }}>
                <div className='flex items-center h-[3.5rem] '>
                  <Image src={img3} alt="home" className='ml-1' />
                  <h3 className='text-white body-text ml-1 '>BTC</h3>
                  <h3 className='h-full border mx-4'></h3>
                </div>
                <div className=" justify-between items-center flex gap-x-24">
                  <input id="items" placeholder='Enter Collateral Amount'
                    disabled={!isConnected} value={userInputs.coll}
                    onChange={(e) => {
                      const newCollValue = e.target.value;
                      setUserInputs({ ...userInputs, coll: newCollValue, });
                    }}
                    className="body-text text-sm whitespace-nowrap ml-1 h-[4rem] text-white" style={{ backgroundColor: "#3f3b2d" }}
                  />
                  <span className="text-sm body-text">
                    ${(parseFloat(userInputs.coll) * Number(fetchedPrice)).toFixed(2)}
                  </span>
                </div>

              </div>
              <div className="flex flex-col md:flex-row gap-x-5 justify-between">
                <span className="text-white gap-x-2 flex md:flex-row md:w-full w-20 flex-col ">
                  <span className={`text-sm body-text whitespace-nowrap ${parseFloat(userInputs.coll) > newAvailColl ? 'text-red-500' : 'text-white'}`}>
                    Available {(newAvailColl).toFixed(8)}
                  </span>
                </span>
                <div className="flex w-full gap-x-3 mt-2">
                  <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900  body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(25)}>25%</Button>
                  <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(50)}>50%</Button>
                  <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(75)}>75%</Button>
                  <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(100)}>100%</Button>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleConfirmClick(userInputs.lusdAmount, userInputs.coll)}
              className={`mt-5 w-full title-text h-[3rem]
                                   ${isDebtInValid || isCollInValid || (userInputColl + userInputDebt == 0)
                  ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer bg-yellow-300 text-black'}`}
              disabled={(isDebtInValid || isCollInValid || (userInputColl + userInputDebt == 0))}>
              UPDATE TROVE
            </button>
          </div>
        </div>
        <div className="w-fit p-10 border mx-2 md:mx-4 border-black  md:mt-10 text-sm"
          style={{ backgroundColor: "#" }}>

          <div className="mb-4 space-y-4">
            <div className="flex md:gap-40 text-white mb-2 justify-between">
              <span className="body-text text-xs whitespace-nowrap">Loan-To-Value</span>
              <span className="text-xs whitespace-nowrap body-text">
                <div className="flex items-center gap-x-3">
                  {Number(newLTV).toFixed(2)} %
                  <>
                    {(userInputColl + userInputDebt >= 1) && (parseFloat(userInputs.coll) < Number(coll)) && (parseFloat(userInputs.lusdAmount) < Number(debt)) && (
                      <>
                        {`--->`}
                        <span className={`overflow-x-clip text-sm body-text ${ltv > (100 / Number(divideBy)) ? 'text-red-500' : ''}`}>{" "}{Number(ltv).toFixed(2)} %</span>
                      </>
                    )}
                  </>
                </div>
              </span>
            </div>
            <div className="flex md:gap-30 text-white mb-2 justify-between">
              <span className="body-text text-xs whitespace-nowrap">Liquidation Price</span>
              <span className="body-text text-xs whitespace-nowrap">
                <div className="flex items-center gap-x-3">
                  {Number(liquidation).toFixed(2)} PUSD
                  <>
                    {(userInputColl + userInputDebt >= 1) && (parseFloat(userInputs.coll) < Number(coll)) && (parseFloat(userInputs.lusdAmount) < Number(debt)) && (
                      <>
                        {`--->`}
                        <span className="body-text text-xs whitespace-nowrap">{" "}{Number(liquidationPrice).toFixed(2)} PUSD</span>
                      </>
                    )}
                  </>
                </div>
              </span>
            </div>
            <div className="flex md:gap-40 text-white mb-2 justify-between">
              <span className="body-text text-xs whitespace-nowrap">Total Debt</span>
              <span className="body-text text-xs whitespace-nowrap">
                <div className="flex items-center gap-x-3">
                  {Number(debt).toFixed(2)} PUSD
                  <>
                    {(userInputDebt == 1) && (parseFloat(userInputs.lusdAmount) < Number(debt)) && (
                      <>
                        {`--->`}
                        <span className="ml-05">{" "}{Number(totalDebt).toFixed(2)} PUSD</span>
                      </>
                    )}
                  </>
                </div>
              </span>
            </div>
            <div className="flex md:gap-40 text-white mb-2 justify-between">
              <span className="text-xs whitespace-nowrap body-text">Total Collateral</span>
              <span className="body-text text-xs whitespace-nowrap">
                <div className="flex items-center gap-x-3">
                  {Number(coll).toFixed(8)} BTC
                  <>
                    {(userInputColl == 1) && (parseFloat(userInputs.coll) < Number(coll)) && (
                      <>
                        {`--->`}
                        <span className="ml-05">{" "}{Number(totalColl).toFixed(8)} BTC</span>
                      </>
                    )}
                  </>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}