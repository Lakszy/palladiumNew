"use client";

import { Label } from "@/components/ui/label";
import borrowerOperationAbi from "../src/constants/abi/BorrowerOperations.sol.json";
import hintHelpersAbi from "../src/constants/abi/HintHelpers.sol.json";
import sortedTroveAbi from "../src/constants/abi/SortedTroves.sol.json";
import { BOTANIX_RPC_URL } from "../src/constants/botanixRpcUrl";
import botanixTestnet from "../src/constants/botanixTestnet.json";
import { getContract } from "../src/utils/getContract";
import Decimal from "decimal.js";
import { ethers } from "ethers";
import img3 from "../assets/images/Group 663.svg";
import btc from "../assets/images/btclive.svg";
import rej from "../assets/images/TxnError.gif";
import conf from "../assets/images/conf.gif"
import rec2 from "../assets/images/rec2.gif"
import tick from "../assets/images/tick.gif"
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { useAccount, useBalance, useWaitForTransactionReceipt, useWalletClient, useWriteContract } from "wagmi";
import { BorrowerOperationbi } from "../src/constants/abi/borrowerOperationAbi";
import Image from "next/image";
import img4 from "../assets/images/Group 666.svg";
import floatPUSD from "../assets/images/floatPUSD.png";
import { Button } from "@/components/ui/button";
import "./opentroves.css"
import { Dialog } from "primereact/dialog";

export const OpenTrove = () => {
  const [userInputs, setUserInputs] = useState({
    collatoral: "",
    borrow: "",
  });
  const [isloading, setIsLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [minDebt, setMinDebt] = useState(0)
  const [borrowRate, setBorrowRate] = useState(0)
  const [lr, setLR] = useState(0)
  const [cCr, setCCR] = useState(0)
  const [mCR, setMCR] = useState(0)
  const [fetchedPrice, setFetchedPrice] = useState(0)
  const [recoveryMode, setRecoveryMode] = useState<boolean>()
  const [message, setMessage] = useState("");
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { data: hash, writeContract, error: writeError } = useWriteContract()
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({ hash });
  const [transactionRejected, setTransactionRejected] = useState(false);

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
    } else {
      setLoadingModalVisible(false);
    }
  }, [isSuccess, isLoading, transactionRejected]);

  const [calculatedValues, setCalculatedValues] = useState({
    expectedFee: 0,
    expectedDebt: 0,
    collateralRatio: 0,
  });

  const { data: isConnected } = useWalletClient();
  const { data: walletClient } = useWalletClient();
  const { data: balanceData } = useBalance({
    address: walletClient?.account.address,
  });

  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);

  const sortedTrovesContract = getContract(
    botanixTestnet.addresses.sortedTroves,
    sortedTroveAbi,
    provider
  );

  const hintHelpersContract = getContract(
    botanixTestnet.addresses.hintHelpers,
    hintHelpersAbi,
    provider
  );


  const pow18 = Decimal.pow(10, 18);
  const pow20 = Decimal.pow(10, 20);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.palladiumlabs.org/sepolia/protocol/metrics");
        const data = await response.json();
        const protocolMetrics = data[0];

        setRecoveryMode(protocolMetrics.recoveryMode);
        setFetchedPrice(protocolMetrics.priceBTC);
        setMCR(protocolMetrics.MCR)
        setCCR(protocolMetrics.CCR)
        setLR(protocolMetrics.LR)
        setBorrowRate(protocolMetrics.borrowRate)
        setMinDebt(protocolMetrics.minDebt)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


  const handleConfirmClick = async (xBorrow: string, xCollatoral: string) => {

    try {
      setIsModalVisible(true);
      const collValue = Number(xCollatoral);
      const borrowValue = Number(xBorrow);
      const expectedFeeFormatted = (borrowRate * borrowValue) / 100;
      const expectedDebt = borrowValue + expectedFeeFormatted + lr;
      let NICR = collValue / expectedDebt;

      const NICRDecimal = new Decimal(NICR.toString());
      const NICRBigint = BigInt(NICRDecimal.mul(pow20).toFixed(0));
      const numTroves = await sortedTrovesContract.getSize();
      const numTrials = numTroves * BigInt("15");
      const { 0: approxHint } = await hintHelpersContract.getApproxHint(
        NICRBigint,
        numTrials,
        42
      );
      const { 0: upperHint, 1: lowerHint } =
        await sortedTrovesContract.findInsertPosition(
          NICRBigint,
          approxHint,
          approxHint
        );
      const collDecimal = new Decimal(collValue.toString());
      const collBigint = BigInt(collDecimal.mul(pow18).toFixed());
      const borrowDecimal = new Decimal(borrowValue.toString());
      const borrowBigint = BigInt(borrowDecimal.mul(pow18).toFixed());
      const maxFee = "6".concat("0".repeat(16));
      await writeContract({
        abi: BorrowerOperationbi,
        address: '0xE0774dA339FA29bAf646B57B00644deA48fCaE23',
        functionName: 'openTrove',
        args: [maxFee, borrowBigint, upperHint, lowerHint],
        value: collBigint,
      });
    }
    catch (error) {
      console.error('Error sending transaction:', error);
      setTransactionRejected(true);
      setUserModal(true);
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
    if (hash) {
      setIsModalVisible(false);
    }
  }, [hash]);

  const makeCalculations = async (xBorrow: string, xCollatoral: string) => {
    setIsLoading(true)
    try {
      const collValue = Number(xCollatoral);
      const borrowValue = Number(xBorrow);

      const expectedFeeFormatted = (borrowRate * borrowValue);
      const expectedDebt = Number(borrowValue + expectedFeeFormatted + lr);

      const collRatio = (collValue * fetchedPrice * 100) / Number(expectedDebt);

      setCalculatedValues({
        ...calculatedValues,
        expectedFee: expectedFeeFormatted,
        expectedDebt,
        collateralRatio: collRatio,
      });
    }
    catch (error) {
      console.error(error)
    }
    finally {
      setIsLoading(false)
    }
  };

  const handleClose = () => {
    setLoadingModalVisible(false);
    window.location.reload()
  };
  const handlePercentageClick = (percentage: any) => {
    const percentageDecimal = new Decimal(percentage).div(100);
    const pusdBalanceNumber = parseFloat(maxBorrow.toString());
    if (!isNaN(pusdBalanceNumber)) {
      const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
      const stakeFixed = maxStake.toFixed(2);
      setUserInputs({ collatoral: userInputs.collatoral, borrow: stakeFixed });

    } else {
      console.error("Invalid PUSD balance:");
    }
  };

  const handlePercentageClickBTC = (percentage: any) => {
    const percentageDecimal = new Decimal(percentage).div(100);

    const pusdBalanceNumber = parseFloat(balanceData?.formatted || '0');

    if (!isNaN(pusdBalanceNumber)) {
      const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
      const stakeFixed = maxStake.toFixed(8);

      setUserInputs({ collatoral: stakeFixed, borrow: userInputs.borrow });
    } else {
      console.error("Invalid PUSD balance:", balanceData?.formatted);
    }
  };

  useDebounce(() => {
    makeCalculations(userInputs.borrow, userInputs.collatoral);
  }, 10, [userInputs.borrow, userInputs.collatoral]
  );

  const totalCollateral = Number(userInputs.collatoral) * fetchedPrice;
  const divideBy = recoveryMode ? cCr : mCR;
  const maxBorrow = totalCollateral / Number(divideBy)
    - (lr + calculatedValues.expectedFee);
  const loanToValue = (calculatedValues.expectedDebt * 100) / (totalCollateral || 1);
  const liquidationPrice = (Number(divideBy) * calculatedValues.expectedDebt) / (Number(Number(userInputs.collatoral)) || 1);
  const bothInputsEntered = userInputs.collatoral !== "0" && userInputs.borrow !== "0";

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
    }, 90000);
    return () => clearTimeout(timer);
  }, []);


  return (
    <>
      <div className="h-full body-text md:ml-0">
        <div className="p-10 ">
          <div className="md:ml-2 -ml-6  border border-black p-2 md:w-full w-[22.5rem]" style={{ backgroundColor: "#2e2a1c" }}>
            <div className="flex p-2 w-full">
              <div className="hidden md:block w-[22%]">
                <Image src={floatPUSD} height={200} alt="home" className="-mt-[3rem]" />
              </div>
              <div className=" h-fit py-2 space-y-5">
                <div>
                  <p className="text-white body-text  text-xl font-medium ">
                    You dont have an existing trove
                  </p>
                </div>
                <div>
                  <p className="text-yellow-300 body-text font-medium text-left text-xl mb-2">
                    Open a Zero-Interest trove
                  </p>
                  <p className="text-[#827f77] text-sm body-text text-left">
                    Borrow against BTCs interest free
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container flex flex-col md:flex-row justify-between gap-x-24 md:-mt-6">
          <div className="grid w-1/2 items-start gap-2 text-white md:p-5">
            <div className="w-full">
              <Label htmlFor="items" className="text-[#827f77] md:-ml-0 -ml-6 body-text text-lg">Deposit Collatoral</Label>
              <div className="flex md:w-full items-center space-x-2 mt-[10px] -ml-3  w-[22rem] md:-ml-0 border border-yellow-300">
                <div className='flex items-center h-[3.5rem] '>
                  <Image src={btc} alt="home" className='ml-1' />
                  <h3 className='h-full border border-yellow-300 text-yellow-300 mx-3'></h3>
                  <h3 className='text-gray-400 body-text font-medium ml-1 mr-3 hidden md:block'>BTC</h3>
                </div>
                <input id="items" placeholder="Enter Collateral Amount" value={userInputs.collatoral} onChange={(e) => { const newCollValue = e.target.value; setUserInputs({ ...userInputs, collatoral: newCollValue }); makeCalculations(userInputs.borrow, newCollValue || "0"); }} className=" w-[12.5rem] md:w-[24.75rem] body-text font-medium h-[4rem] text-gray-400" style={{ backgroundColor: "#272315" }} />
                <span className="md:max-w-[fit] md:p-2 mr-1 md:mr-0 font-medium text-gray-400 body-text h-full">${totalCollateral.toFixed(2)}</span>
              </div>
              <div className="pt-2 flex md:flex-row flex-col items-center justify-between ">
                <span className={`text-sm body-text w-full body-text font-medium whitespace-nowrap ${parseFloat(userInputs.collatoral) > Number(balanceData?.formatted) ? 'text-red-500' : 'text-white'}`}>
                  <span className="body-text text-gray-400 font-medium ">Available</span> {Number(balanceData?.formatted).toFixed(8)}{" "}
                </span>
                <div className="flex gap-x-4 w-full md:gap-x-3 mt-2">
                  <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-300  body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(25)}>25%</Button>
                  <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-300 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(50)}>50%</Button>
                  <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-300 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(75)}>75%</Button>
                  <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-300 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClickBTC(100)}>100%</Button>
                </div>
              </div>
            </div>
            <div className="w-full">
              <Label className="text-[#827f77] md:-ml-0 -ml-5  body-text text-lg" htmlFor="quantity">Borrow PUSD</Label>
              <div className="flex  items-center md:space-x-2 mt-[10px] -ml-3 md:-ml-0 border border-yellow-300">
                <div className='flex items-center h-[3.5rem] '>
                  <Image src={img4} alt="home" className='ml-1' />
                  <h3 className='h-full border border-yellow-300 text-yellow-300 mx-4'></h3>
                  <h3 className='text-gray-400 body-text font-medium hidden md:block mx-1'>PUSD</h3>
                </div>
                <input id="quantity" placeholder="Enter Borrow Amount" value={userInputs.borrow} onChange={(e) => { const newBorrowValue = e.target.value; setUserInputs({ ...userInputs, borrow: newBorrowValue }); makeCalculations(userInputs.collatoral, newBorrowValue || "0"); }} className="md:w-[23.75rem] h-[4rem] text-gray-400 body-text font-medium" style={{ backgroundColor: "#272315" }} />
              </div>
              <div className="pt-2 flex flex-col md:flex-row   items-center justify-between  p-2">
                <span className={`text-sm font-medium w-full body-text whitespace-nowrap ${parseFloat(userInputs.borrow) > maxBorrow ? 'text-red-500' : 'text-white'}`}>
                <span className="body-text text-gray-400 font-medium ">Available</span> {maxBorrow >= 0 ? Math.floor(maxBorrow * 100) / 100 : "0.00"}
                </span>
                <div className="flex gap-x-4 w-full -mr-2 md:gap-x-4  mt-2">
                  <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-300  body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(25)}>25%</Button>
                  <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-300 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(50)}>50%</Button>
                  <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-300 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(75)}>75%</Button>
                  <Button disabled={!isConnected} className={`text-sm border-2 border-yellow-300 body-text`} style={{ backgroundColor: "#3b351b", borderRadius: "0" }} onClick={() => handlePercentageClick(100)}>100%</Button>
                </div>
              </div>
              {Number(userInputs.borrow) < minDebt && (Number(userInputs.borrow) > 0) && (
                <span className="text-red-500 body-text">Borrow amount should be greater than {minDebt} </span>
              )}
            </div>
            <button
              onClick={() => handleConfirmClick(userInputs.borrow, userInputs.collatoral)}
              className={`mt-5 md:-ml-0 -ml-4 w-92 h-[3rem] bg-yellow-300 title-text text-black font-bold ${(!userInputs.borrow || !userInputs.collatoral) ? ' cursor-not-allowed opacity-50' : 'hover:scale-95 bg-yellow-300'}`}
              disabled={!userInputs.borrow || !userInputs.collatoral || loanToValue > (100 / Number(divideBy))
                || parseFloat(userInputs.borrow) > maxBorrow || parseFloat(userInputs.collatoral) > Number(balanceData?.formatted)
                || parseFloat(userInputs.borrow) <= minDebt || isModalVisible}
              style={{
                cursor: (!userInputs.borrow || isModalVisible ||
                  !userInputs.collatoral ||
                  loanToValue > (100 / Number(divideBy)) ||
                  parseFloat(userInputs.borrow) > maxBorrow ||
                  parseFloat(userInputs.collatoral) > Number(balanceData?.formatted) ||
                  parseFloat(userInputs.borrow) <= minDebt)
                  ? 'not-allowed' : 'pointer',
                opacity: (!userInputs.borrow || isModalVisible ||
                  !userInputs.collatoral ||
                  loanToValue > (100 / Number(divideBy)) ||
                  parseFloat(userInputs.borrow) > maxBorrow ||
                  parseFloat(userInputs.collatoral) > Number(balanceData?.formatted) ||
                  parseFloat(userInputs.borrow) <= minDebt)
                  ? 0.5 : 1
              }}>
              {isModalVisible ? "Opening Trove..." : "Open Trove"}
            </button>
          </div>
          {bothInputsEntered && Number(userInputs.borrow) >= minDebt && parseFloat(userInputs.collatoral) < Number(balanceData?.formatted) ? (
            <div className="md:w-4/5 w-full mt-8 p-5 border-yellow-200 h-fit space-y-10  text-white"
              style={{ backgroundColor: "#2e2a1c" }}
            >
              <div className="flex whitespace-nowrap justify-between">
                <span className="body-text text-sm text-[#827f77]">Loan-To-Value</span>
                {!isloading ? <span className={`overflow-x-clip text-sm body-text font-medium ${loanToValue > (100 / Number(divideBy)) ? 'text-red-500' : 'text-yellow-300'}`}>{loanToValue.toFixed(2)} % </span> : "--"}
              </div>
              <div className="flex body-text whitespace-nowrap justify-between">
                <span className="body-text text-sm text-[#827f77]">Liq. Reserve</span>
                <span className="body-text text-sm body-text font-medium">
                  {lr} PUSD
                </span>
              </div>
              <div className="flex justify-between">
                <span className=" text-sm text-[#827f77]">Liquidation Price</span>
                <span className=" text-sm body-text font-medium">{liquidationPrice.toFixed(2)} PUSD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm body-text text-[#827f77]">Borrowing Fee</span>
                <span className="text-sm body-text font-medium">
                  {calculatedValues.expectedFee.toFixed(2)} PUSD
                </span>
              </div>
              <div className="flex justify-between">
                <span className=" text-sm body-text text-[#827f77]">Total Debt</span>
                {Number((calculatedValues.expectedDebt)) > lr ? <span className=" text-sm body-text font-medium">{(calculatedValues.expectedDebt).toFixed(2)} {" "} PUSD</span> : "---"}
              </div>
              <div className="flex justify-between">
                <span className=" text-sm body-text text-[#827f77]">Total Collateral</span>
                <span className=" text-sm body-text font-medium">{(totalCollateral).toFixed(2)} {" "} PUSD</span>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div >
      <Dialog visible={isModalVisible} onHide={() => setIsModalVisible(false)}>
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="py-5">
              <Image src={rec2} alt="box" width={140} className="" />
            </div>
            <div className="p-5">
              <div className="waiting-message text-lg title-text2 text-yellow-300 whitespace-nowrap">Transaction is initiated</div>
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
              <div className="waiting-message title-text2 text-yellow-300">{loadingMessage}</div>
              {isSuccess && (
                <button className="mt-1 p-3 text-black title-text2 hover:scale-95 bg-[#f5d64e]" onClick={handleClose}>Go Back to the Stake Page</button>
              )}
              {(transactionRejected || (!isSuccess && showCloseButton)) && (
                <>
                  <p className="body-text text-white text-xs">{transactionRejected ? "Transaction was rejected. Please try again." : "Some Error Occurred On Network Please Try Again After Some Time.. 🤖"}</p>
                  <Button className=" mt-1 p-3 hover:bg-yellow-400 rounded-none w-[20rem] text-black title-text2 hover:scale-95 bg-[#f5d64e]" onClick={handleClose}>Try again</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};
