/* eslint-disable */
"use client";
import { Label } from "@/components/ui/label";
import borrowerOperationAbi from "../src/constants/abi/BorrowerOperations.sol.json";
import hintHelpersAbi from "../src/constants/abi/HintHelpers.sol.json";
import priceFeedAbi from "../src/constants/abi/PriceFeedTestnet.sol.json";
import sortedTroveAbi from "../src/constants/abi/SortedTroves.sol.json";
import BotanixLOGO from "../../app/assets/images/newpalladium.svg"
import troveManagerAbi from "../src/constants/abi/TroveManager.sol.json";
import { BOTANIX_RPC_URL } from "../src/constants/botanixRpcUrl";
import botanixTestnet from "../src/constants/botanixTestnet.json";
import { getContract } from "../src/utils/getContract";
import Decimal from "decimal.js";
import { ethers, toBigInt } from "ethers";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { useAccount, useWalletClient } from "wagmi";
import Image from "next/image";
import img3 from "../assets/images/Group 661.svg";
import img4 from "../assets/images/Group 666.svg";
import "../../components/stabilityPool/Modal.css"
import "../../app/App.css"
import { Button } from "@/components/ui/button";
import { Dialog } from "primereact/dialog";

interface Props {
  coll: number;
  debt: number;
  lr: number;
  fetchedPrice: number;
  minDebt: number;
  borrowRate: number;
  recoveryMode: boolean;
  cCR: number;
  mCR: number
}

export const Repay: React.FC<Props> = ({ coll, debt, lr, fetchedPrice, recoveryMode, minDebt, cCR, mCR }) => {
  const [userInputs, setUserInputs] = useState({
    lusdAmount: "0",
    coll: "0",
  });

  const [isLowDebt, setIsLowDebt] = useState(false);
  const [hasGotStaticData, setHasGotStaticData] = useState(false);
  const [totalDebt, setTotalDebt] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ltv, setLtv] = useState(0);
  const [price, setPrice] = useState(0);
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [totalColl, setTotalColl] = useState(0);
  const { isConnected } = useAccount();
  const [value, setValue] = useState("0");
  const [userInputColl, setUserInputColl] = useState(0)
  const [userInputDebt, setUserInputDebt] = useState(0)
  const [newAvailColl, setNewAvailColl] = useState(0)

  //static
  const [staticLtv, setStaticLtv] = useState(0);

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

  useEffect(() => {
    const pow = Decimal.pow(10, 18);
    const _1e18 = toBigInt(pow.toFixed());
    const fetchedData = async () => {
      if (!walletClient) return null;

      const collDecimal = new Decimal(coll.toString()); // Convert coll to a Decimal
      const collFormatted = collDecimal.div(_1e18.toString()).toString(); // Divide coll by _1e18 and convert to string

    };
    const getStaticData = async () => {
      if (!walletClient) return null;
      if (!provider || hasGotStaticData) return null;
      const ltvValue = (Number(debt) * 100) / ((Number(coll) * Number(fetchedPrice)) || 1); // if collTotal is 0/null/undefined then it will be divided by 1
      setStaticLtv(ltvValue);
      setHasGotStaticData(true);
    };
    getTroveStatus();
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
    setIsModalVisible(true)
    try {
      const pow20 = Decimal.pow(10, 20);
      const pow18 = Decimal.pow(10, 18);

      const lusdValue = Number(xLusdAmount);
      const collValue = Number(xColl);

      if (!walletClient) return null;

      const newDebt = Number(debt) - lusdValue;
      const newColl = Number(coll) - collValue;

      if (minDebt <= newDebt) {
        return setIsLowDebt(true);
      }

      let NICR = newColl / newDebt;
      const NICRDecimal = new Decimal(NICR.toString());
      const NICRBigint = BigInt(NICRDecimal.mul(pow20).toFixed());
      const numTroves = await sortedTrovesContract.getSize();
      const numTrials = numTroves * BigInt("15");

      const { 0: approxHint } = await hintHelpersContract.getApproxHint(
        NICRBigint,
        numTrials,
        42
      ); // random seed of 42

      const { 0: upperHint, 1: lowerHint } =
        await sortedTrovesContract.findInsertPosition(
          NICRBigint,
          approxHint,
          approxHint
        );

      const maxFee = "6".concat("0".repeat(16));
      const collDecimal = new Decimal(collValue.toString());
      const collBigint = BigInt(collDecimal.mul(pow18).toFixed());

      const lusdDecimal = new Decimal(lusdValue.toString());
      const lusdBigint = BigInt(lusdDecimal.mul(pow18).toFixed());

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
    }
    finally {
      setIsModalVisible(false)
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


  const divideBy = recoveryMode ? cCR : mCR;
  const availableToBorrow = price / divideBy - Number(debt);
  const liquidation = divideBy * (Number(debt) / Number(coll));

  const getTroveStatus = async () => {
    if (!walletClient) return null;
    const troveStatusBigInt = await troveManagerContract.getTroveStatus(
      walletClient?.account.address
    );
    setValue((Number(debt) / (Number(coll) * Number(fetchedPrice)) * 100).toFixed(3));

  };
  getTroveStatus();
  const totalAvailableRepay = Number(debt) - minDebt - lr
  const isCollInValid = parseFloat(userInputs.coll) > newAvailColl
  const isDebtInValid = parseFloat(userInputs.lusdAmount) > totalAvailableRepay

  const newLTV = ((Number(debt) * 100) / ((Number(coll) * Number(fetchedPrice)))).toFixed(2)
  const condition = (userInputColl + userInputDebt >= 1) || (parseFloat(userInputs.coll) < Number(coll)) || (parseFloat(userInputs.lusdAmount) < Number(debt));
  return (
    <>
      <div className="flex-col  md:border md:border-yellow-400 mx-2  flex md:flex-row justify-between gap-10">
        <div>
          <div className="grid w-full space-y-6 max-w-sm items-start gap-2 mx-auto p-5 px-8">
            <div className="relative">
              <Label htmlFor="quantity" className="text-gray-500 md:-ml-0 -ml-10 body-text text-lg">
                Repay PUSD
              </Label>
              <div className="flex items-center w-[20rem] md:w-[24rem] md:-ml-0 -ml-11  border border-yellow-300 " style={{ backgroundColor: "#3f3b2d" }}>
                <div className='flex items-center h-[3.5rem] '>
                  <Image src={img4} alt="home" className='ml-1' />
                  <h3 className='text-white body-text notMobileDevice ml-1 text-sm'>PUSD</h3>
                  <h3 className='h-full border border-yellow-300 mx-4 text-yellow-300'></h3>
                </div>
                <input id="quantity" placeholder="Enter Borrow Amount" value={userInputs.lusdAmount} onChange={(e) => { const newBorrowValue = e.target.value; setUserInputs({ ...userInputs, lusdAmount: newBorrowValue, }); }} className="ml-1 w-full h-[4rem] body-text text-sm whitespace-nowrap text-white" style={{ backgroundColor: "#3f3b2d" }} />
              </div>
              <div className="flex flex-col  md:flex-row gap-x-5  justify-between">
                <span className="text-white gap-x-2 flex flex-row w-full md:-ml-0 -ml-10 ">
                  <h6 className="text-white body-text text-sm">
                    Available{" "}
                  </h6>
                  {Number(totalAvailableRepay) >= 0 && (
                    <h6 className={`text-sm body-text whitespace-nowrap ${parseFloat(userInputs.lusdAmount) > totalAvailableRepay ? 'text-red-500' : 'text-white'}`}>
                      {Math.trunc(Number(totalAvailableRepay) * 100) / 100}

                    </h6>
                  )}
                </span>
              </div>
              <div className="flex w-full p-1 -ml-10 gap-x-4 md:-ml-0 md:gap-x-3 mt-2">
                <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900  body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(25)}>25%</Button>
                <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(50)}>50%</Button>
                <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(75)}>75%</Button>
                <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(100)}>100%</Button>
              </div>

            </div>
            <div className="relative">
              <Label htmlFor="items" className="text-gray-500 md:-ml-0 -ml-10 body-text text-lg">
                Withdraw Collatoral
              </Label>
              <div className="flex items-center w-[20rem] md:w-[24rem] md:-ml-0 -ml-11  border border-yellow-300 " style={{ backgroundColor: "#3f3b2d" }}>
                <div className='flex items-center h-[3.5rem] '>
                  <Image src={img3} alt="home" className='ml-1' />
                  <h6 className='text-white text-sm notMobileDevice body-text ml-1'>BTC</h6>
                  <h3 className='h-full border border-yellow-300 mx-4 text-yellow-300'></h3>
                </div>
                <div className=" justify-between items-center flex gap-x-24">
                  <input id="items" placeholder='Enter Collateral Amount' disabled={!isConnected} value={userInputs.coll} onChange={(e) => { const newCollValue = e.target.value; setUserInputs({ ...userInputs, coll: newCollValue, }); }} className="body-text w-full text-sm whitespace-nowrap ml-1 h-[4rem] text-white" style={{ backgroundColor: "#3f3b2d" }} />
                  <span className="text-sm body-text  absolute flex-end ml-36  md:ml-44">
                    ${(parseFloat(userInputs.coll) * Number(fetchedPrice)).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-x-5 ">
                <span className="text-white gap-x-2 flex flex-col w-full  md:-ml-0 -ml-10 ">
                  <span className={`text-sm body-text w-full whitespace-nowrap mt-[10px] text-gray-500 ${parseFloat(userInputs.coll) > newAvailColl ? 'text-red-500' : 'text-white'}`}>
                    Available {(newAvailColl).toFixed(8)}
                  </span>
                </span>
              </div>
              <div className="flex w-full p-1 -ml-10 gap-x-4 md:-ml-0 md:gap-x-3 mt-2">
                <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900  body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(25)}>25%</Button>
                <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(50)}>50%</Button>
                <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(75)}>75%</Button>
                <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-900 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(100)}>100%</Button>
              </div>
            </div>
            <button onClick={() => handleConfirmClick(userInputs.lusdAmount, userInputs.coll)} className={`mt-5 md:-ml-0 -ml-6 w-full title-text h-[3rem]
             ${isDebtInValid || isCollInValid || (userInputColl + userInputDebt == 0)
                ? 'bg-yellow-300 text-black cursor-not-allowed opacity-50' : 'hover:scale-95 cursor-pointer bg-yellow-300 text-black'}`}
              disabled={(isDebtInValid || isCollInValid || (userInputColl + userInputDebt == 0))}>
              UPDATE TROVE
            </button>
          </div>
        </div>
        <div className={`px-1 md:px-5 md:w-fit md:h-[20rem] ${condition ? 'p-4' : 'p-16'} md:pt-12 mx-2 md:mx-4 md:mt-10 text-sm`}
          style={{ backgroundColor: "#2e2a1c" }}>
          <div className="mb-4  space-y-4">
            <div className="flex md:gap-x-20 text-white md:flex-row flex-col  justify-between">
              <span className="body-text text-xs whitespace-nowrap text-gray-500">Loan-To-Value</span>
              <span className="text-xs whitespace-nowrap body-text">
                <div className="flex items-center gap-x-2.5">
                  <span className=" w-28 p-1">
                    {Number(newLTV).toFixed(2)} %
                  </span>
                  {(userInputColl + userInputDebt >= 1) && (parseFloat(userInputs.coll) < Number(coll)) && (parseFloat(userInputs.lusdAmount) < Number(debt)) && (
                    <>
                      <span className="text-yellow-300 text-lg">
                        {`--->`}
                      </span>
                      <span className={`overflow-x-clip text-sm body-text  w-28 p-1 ${ltv > (100 / Number(divideBy)) ? 'text-red-500' : ''}`}>{" "}{Number(ltv).toFixed(2)} %</span>
                    </>
                  )}
                </div>
              </span>
            </div>
            <div className="flex text-white mb-2 md:flex-row flex-col  justify-between">
              <span className="body-text text-xs whitespace-nowrap text-gray-500">Liquidation Price</span>
              <span className="body-text text-xs whitespace-nowrap">
                <div className="flex items-center gap-x-2.5">
                  <span className="p-1  w-28">
                    {Number(liquidation).toFixed(2)} PUSD
                  </span>
                  {(userInputColl + userInputDebt >= 1) && (parseFloat(userInputs.coll) < Number(coll)) && (parseFloat(userInputs.lusdAmount) < Number(debt)) && (
                    <>
                      <span className="text-yellow-300 text-lg">
                        {`--->`}
                      </span>
                      <span className="body-text text-xs whitespace-nowrap w-28  p-1">{" "}{Number(liquidationPrice).toFixed(2)} PUSD</span>
                    </>
                  )}
                </div>
              </span>
            </div>
            <div className="flex text-white mb-2 md:flex-row flex-col justify-between">
              <span className="body-text text-xs whitespace-nowrap text-gray-500">Total Debt</span>
              <span className="body-text text-xs whitespace-nowrap">
                <div className="flex items-center gap-x-2">
                  <span className="p-1 w-28">
                    {Number(debt).toFixed(2)} PUSD
                  </span>
                  {(userInputDebt == 1) && (parseFloat(userInputs.lusdAmount) < Number(debt)) && (
                    <>
                      <span className="text-yellow-300 text-lg">
                        {`--->`}
                      </span>
                      <span className="ml-05 w-28 p-1 ">{" "}{Number(totalDebt).toFixed(2)} PUSD</span>
                    </>
                  )}
                </div>
              </span>
            </div>
            <div className="flex text-white mb-2 md:flex-row flex-col  justify-between">
              <span className="text-xs whitespace-nowrap body-text text-gray-500">Total Collateral</span>
              <span className="body-text text-xs whitespace-nowrap">
                <div className="flex items-center gap-x-2">
                  <span className="p-1 w-28">
                    {Number(coll).toFixed(8)} BTC
                  </span>
                  {(userInputColl == 1) && (parseFloat(userInputs.coll) < Number(coll)) && (
                    <>
                      <span className="text-yellow-300 text-lg">
                        {`--->`}
                      </span>
                      <span className="ml-05 p-1 w-28 ">{" "}{Number(totalColl).toFixed(8)} BTC</span>
                    </>
                  )}
                </div>
              </span>
            </div>
          </div>
        </div>
        <Dialog visible={isModalVisible} onHide={() => setIsModalVisible(false)}>
          <div className="waiting-container bg-white">
            <div className="waiting-message text-lg title-text text-white whitespace-nowrap">Waiting for Confirmation... ✨.</div>
            <Image src={BotanixLOGO} className="waiting-image" alt="gif" />
          </div>
        </Dialog>
      </div>
    </>
  );
}