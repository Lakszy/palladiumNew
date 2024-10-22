/* eslint-disable */
"use client";

import hintHelpersAbi from "@/app/src/constants/abi/HintHelpers.sol.json";
import sortedTroveAbi from "@/app/src/constants/abi/SortedTroves.sol.json";
import troveManagerAbi from "@/app/src/constants/abi/TroveManager.sol.json";
import { BOTANIX_RPC_URL } from "@/app/src/constants/botanixRpcUrl";
import botanixTestnet from "@/app/src/constants/botanixTestnet.json";
import erc20Abi from "@/app/src/constants/abi/ERC20.sol.json"
import feeCollector from "@/app/src/constants/abi/FeeCollector.sol.json";
import { getContract } from "@/app/src/utils/getContract";
import { Label } from "@radix-ui/react-label";
import Decimal from "decimal.js";
import { ethers, toBigInt } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { useSwitchChain, useWaitForTransactionReceipt, useWalletClient, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button";
import OpenTroveNotConnected from "@/app/trove/openTroveNotConnected";
import Image from "next/image";
import INACTIVE from "@/app/assets/images/INACTIVE.svg";
import ACTIVE from "@/app/assets/images/ACTIVE.svg";
import ORE from "@/app/assets/images/ORE.png";
import earthBTC from "@/app/assets/images/earthBTC.png";
import rej from "@/app/assets/images/TxnError.gif";
import conf from "@/app/assets/images/conf.gif"
import rec2 from "@/app/assets/images/rec2.gif"
import info from "@/app/assets/images/info.svg"
import tick from "@/app/assets/images/tick.gif"
import { Knob } from "primereact/knob";
import { TabView, TabPanel } from "primereact/tabview";
import Layout from "@/app/portfolio/layout";
import { FaArrowRightLong } from "react-icons/fa6";
import "@/app/App.css"
import FullScreenLoader from "@/components/FullScreenLoader";
import { Dialog } from "primereact/dialog";
import { BorrowerOperationbi } from "@/app/src/constants/abi/borrowerOperationAbi";
import { Tooltip } from "primereact/tooltip";
import Web3 from "web3";
import { RepayBTC } from "@/app/trove/RepayBTC";
import { CloseTroveBTC } from "@/app/trove/CloseTroveBTC";
import { OpenTroveBTC } from "@/app/trove/OpenTroveBTC";
import { bitfinityTestNetChain, useEthereumChainId } from "@/components/NetworkChecker";
import { Input } from "@/components/ui/input";

const BorrowBTCNEW = () => {
  const [userInputs, setUserInputs] = useState({
    depositCollateral: "",
    borrow: "",
  });
  const [troveStatus, setTroveStatus] = useState("");
  const [borrowingFee, setBorrowingFee] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  const [ltv, setLtv] = useState(0);
  const [price, setPrice] = useState<number>(0);
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [hasPriceFetched, setHasPriceFetched] = useState(false);
  const [hasGotStaticData, setHasGotStaticData] = useState(false);
  const [newDebt, setNewDebt] = useState(0);
  const [totalCollateral, setTotalCollateral] = useState(0);
  const [availableBorrow, setAvailableBorrow] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // static
  const [staticLiquidationPrice, setStaticLiquidationPrice] = useState(0);
  const [staticLtv, setStaticLtv] = useState(0);
  const [newUserColl, setNewUserColl] = useState("0")


  const [userInputColl, setUserInputColl] = useState(0)
  const [userInputDebt, setUserInputDebt] = useState(0)
  const [minDebt, setMinDebt] = useState(0)
  const [borrowRate, setBorrowRate] = useState(0)
  const [lr, setLR] = useState(0)
  const [cCr, setCCR] = useState(0)
  const [mCR, setMCR] = useState(0)
  const [fetchedPrice, setFetchedPrice] = useState(0)
  const [recoveryMode, setRecoveryMode] = useState<boolean>(false)
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [transactionRejected, setTransactionRejected] = useState(false);
  const [balanceData, setBalanceData] = useState<any>()
  const [aprvAmnt, setAprvAmt] = useState<BigInt>(BigInt(0));
  const [entireDebtAndColl, setEntireDebtAndColl] = useState({
    debt: "0",
    coll: "0",
    pendingLUSDDebtReward: "0",
    pendingETHReward: "0",
  });
  const [calculatedFee, setCalculatedFee] = useState("0");
  const [newApprovedAmount, setNewApprovedAmount] = useState<any>(null);
  const [modiff, setModiff] = useState<any>(null);

  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);
  const erc20Contract = getContract("0x222c21111dDde68e6eaC2fCde374761E72c45FFe", erc20Abi, provider);
  const { data: walletClient } = useWalletClient();
  const { data: isConnected } = useWalletClient();
  const spenderAddress = walletClient?.account?.address

  const { switchChain } = useSwitchChain()
  const [chainId, setChainId] = useState(355113);
  useEthereumChainId(setChainId)

  const fetchPrice = async () => {
    if (!walletClient) return null;
    const collateralValue = await erc20Contract.balanceOf(walletClient?.account?.address);
    const collateralValueFormatted = ethers.formatUnits(collateralValue, 18)
    setBalanceData(collateralValueFormatted)
  };

  const { data: hash, writeContract, error: writeError } = useWriteContract()
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });


  const handleClose = useCallback(() => {
    setLoadingModalVisible(false);
    setUserModal(false);
    setIsModalVisible(false);
    setTransactionRejected(false);
    window.location.reload();
  }, []);

  const troveManagerContract = getContract(
    botanixTestnet.addresses.VesselManager,
    troveManagerAbi,
    provider
  );

  const sortedTrovesContract = getContract(
    botanixTestnet.addresses.SortedVessels,
    sortedTroveAbi,
    provider
  );

  const feeCollectorContract = getContract(
    botanixTestnet.addresses.FeeCollector,
    feeCollector,
    provider
  );

  const hintHelpersContract = getContract(
    botanixTestnet.addresses.VesselManagerOperations,
    hintHelpersAbi,
    provider
  );

  const pow20 = Decimal.pow(10, 20);
  const pow18 = Decimal.pow(10, 18);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.palladiumlabs.org/bitfinity/protocol/metrics");
        const data = await response.json();
        const protocolMetrics = data[0].metrics[0]; // Fetch the metrics for earthBTC (at index 0)
        setRecoveryMode(protocolMetrics.recoveryMode);
        setFetchedPrice(protocolMetrics.price);
        setMCR(protocolMetrics.MCR);
        setCCR(protocolMetrics.CCR);
        setLR(protocolMetrics.LR);
        setBorrowRate(protocolMetrics.borrowRate);
        setMinDebt(protocolMetrics.minDebt);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchPrice();
    fetchData();
  }, [fetchPrice, walletClient?.account?.address, walletClient]);


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
        "0x222c21111dDde68e6eaC2fCde374761E72c45FFe",
        walletClient?.account.address
      );
      const collDecimal = new Decimal(coll.toString());
      const collFormatted = collDecimal.div(_1e18.toString()).toString();
      setEntireDebtAndColl({
        debt: (debt / _1e18).toString(),
        coll: collFormatted,
        pendingLUSDDebtReward: (pendingLUSDDebtReward / _1e18).toString(),
        pendingETHReward: (pendingETHReward / _1e18).toString(),
      });

      if (!hasPriceFetched) {
        try {
          const updatedCollFormatted = new Decimal(entireDebtAndColl.coll).mul(fetchedPrice);
          const updatedPrice = parseFloat(updatedCollFormatted.toString());
          setPrice(updatedPrice);
          setHasPriceFetched(true);
        } catch (error) {
          console.error(error, "Error fetching price");
          setHasPriceFetched(true);
        }
      }

      const Refundfee = await feeCollectorContract.simulateRefund(walletClient?.account?.address, "0x222c21111dDde68e6eaC2fCde374761E72c45FFe", 1000000000000000000n);
      const RefundfeeDecimal = new Decimal(Refundfee.toString());
      const RefundfeeFormatted = RefundfeeDecimal.div(_1e18.toString()).toString();
      setCalculatedFee(RefundfeeFormatted)
    };

    const getTroveStatus = async () => {
      try {
        if (!walletClient) return null;
        const troveStatusBigInt = await troveManagerContract.getVesselStatus(
          "0x222c21111dDde68e6eaC2fCde374761E72c45FFe",
          walletClient?.account.address
        );
        const troveStatus =
          troveStatusBigInt.toString() === "1" ? "ACTIVE" : "INACTIVE";
        setTroveStatus(troveStatus)
      } catch (error) {
        console.error(error)
      }
    }

    const getStaticData = async () => {
      if (!walletClient) return null;
      if (!provider || hasGotStaticData) return null;


      const ltvValue = (Number(entireDebtAndColl.debt) * 100) / ((Number(entireDebtAndColl.coll) * Number(fetchedPrice)) || 1); // if collTotal is 0/null/undefined then it will be divided by 1
      setStaticLtv(ltvValue);

      const divideBy = recoveryMode ? cCr : mCR;
      const liquidationPriceValue = (Number(divideBy) * Number(entireDebtAndColl.debt)) / Number(entireDebtAndColl.coll);
      setStaticLiquidationPrice(liquidationPriceValue);
      setHasGotStaticData(true);
    };

    getTroveStatus();
    fetchedData();
    getStaticData();
  }, [walletClient, calculatedFee]);

  useDebounce(
    () => {
      makeCalculations(userInputs.borrow, userInputs.depositCollateral)
    }, 10,
    [userInputs.borrow, userInputs.depositCollateral]
  );

  const handleConfirmClick = async (xBorrow: string, xCollatoral: string) => {

    if (!walletClient) return null;
    if (modiff >= 0 && xCollatoral !== undefined && !isNaN(Number(xCollatoral)) && Number(xCollatoral) > 0) {
      await handleApproveClick(xCollatoral);
    }

    try {
      setIsModalVisible(true)
      const borrowValue = Number(xBorrow);
      const collValue = Number(xCollatoral);

      if (!walletClient) return null;

      const newDebtValue = Number(entireDebtAndColl.debt) + borrowValue;
      const newCollValue = Number(entireDebtAndColl.coll) + collValue;
      setNewDebt(newDebtValue);

      let NICR = newCollValue / newDebtValue;
      const NICRDecimal = new Decimal(NICR.toString());
      const NICRBigint = BigInt(NICRDecimal.mul(pow20).toFixed(0));

      const numTroves = await sortedTrovesContract.getSize("0x222c21111dDde68e6eaC2fCde374761E72c45FFe");
      const numTrials = numTroves * BigInt("15");

      const { 0: approxHint } = await hintHelpersContract.getApproxHint(
        "0x222c21111dDde68e6eaC2fCde374761E72c45FFe",
        NICRBigint,
        numTrials,
        42
      );

      const { 0: upperHint, 1: lowerHint } = await sortedTrovesContract.findInsertPosition(
        "0x222c21111dDde68e6eaC2fCde374761E72c45FFe",
        NICRBigint,
        approxHint,
        approxHint
      );

      const collDecimal = new Decimal(collValue.toString());
      const collBigint = BigInt(collDecimal.mul(pow18).toFixed());

      const borrowDecimal = new Decimal(borrowValue.toString());
      const borrowBigint = BigInt(borrowDecimal.mul(pow18).toFixed());

      const borrowOpt = await writeContract({
        abi: BorrowerOperationbi,
        address: '0x9d4ecfC15D9FcfC804a838F495DEA21aAEaC5628',
        functionName: 'adjustVessel',
        args: [
          "0x222c21111dDde68e6eaC2fCde374761E72c45FFe", //tokenAddress
          collBigint, //_assetSent
          0, // collateral withdraw 0 in case of borrow
          borrowBigint, // debt change how much is added in case of borrow
          borrowValue > 0 ? true : false, //isDebtIncrease 
          upperHint, lowerHint
        ]
      });

    } catch (error) {
      console.error(error, "Error");
      setTransactionRejected(true);
      setUserModal(true);
    }
  };

  const makeCalculations = async (xBorrow: string, xCollatoral: string) => {

    const borrowValue = Number(xBorrow);
    const collValue = Number(xCollatoral);

    if (!walletClient) return null;

    const expectedFeeFormatted = (borrowRate * borrowValue);
    const totalColl = (Number(entireDebtAndColl.coll) + collValue) * Number(fetchedPrice);
    const userColl = (collValue) * Number(fetchedPrice);

    setNewUserColl(String(Number(entireDebtAndColl.coll) + collValue))
    setTotalCollateral(userColl);
    const debtTotal = expectedFeeFormatted + borrowValue + Number(entireDebtAndColl.debt);
    const divideBy = recoveryMode ? cCr : mCR;

    const liquidationPriceValue = (Number(divideBy) * debtTotal) / (Number(entireDebtAndColl.coll) + collValue);

    const ltvValue = ((Number(debtTotal) * 100) / (((Number(entireDebtAndColl.coll) + collValue) * Number(fetchedPrice)))).toFixed(2)
    setLtv(Number(ltvValue));

    const availBorrowValue = totalColl / Number(divideBy) - Number(entireDebtAndColl.debt) - expectedFeeFormatted;
    setAvailableBorrow(Number(availBorrowValue.toFixed(2)));

    setBorrowingFee(Number(expectedFeeFormatted.toFixed(2)));
    setTotalDebt(Number(debtTotal.toFixed(2)));

    { parseFloat(userInputs.depositCollateral) > 0 ? setUserInputColl(1) : setUserInputColl(0) }
    { parseFloat(userInputs.borrow) > 0 ? setUserInputDebt(1) : setUserInputDebt(0) }

    setLiquidationPrice(Number(liquidationPriceValue.toFixed(2)));
  };

  const handlePercentageClick = (percentage: any) => {
    const percentageDecimal = new Decimal(percentage).div(100);
    const pusdBalanceNumber = parseFloat(totalAvailableBorrow.toString());
    if (!isNaN(pusdBalanceNumber)) {
      const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
      const stakeFixed = maxStake;
      setUserInputs({ depositCollateral: userInputs.depositCollateral, borrow: String(stakeFixed) });

    } else {
      console.error("Invalid ORE balance:", availableToBorrow);
    }
  };

  const handlePercentageClickBTC = (percentage: any) => {
    const percentageDecimal = new Decimal(percentage).div(100);

    const pusdBalanceNumber = parseFloat(balanceData || '0');

    if (!isNaN(pusdBalanceNumber)) {
      const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
      const stakeFixed = maxStake.toFixed(8);
      setUserInputs({ depositCollateral: stakeFixed, borrow: userInputs.borrow });
    } else {
      console.error("Invalid ORE balance:", balanceData);
    }
  };


  const getApprovedAmount = async (ownerAddress: string | undefined, spenderAddress: string | undefined) => {
    try {
      if (walletClient) {
        const web3 = new Web3(window.ethereum)
        const tokenAddress = "0x222c21111dDde68e6eaC2fCde374761E72c45FFe"
        const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);

        const approvedAmount = await tokenContract.methods.allowance(ownerAddress, spenderAddress).call() as BigInt;
        if (approvedAmount != null) {
          setAprvAmt(approvedAmount);
          return approvedAmount;
        } else {
          console.error("Approved amount is null or undefined");
          return null;
        }
      }
    } catch (error) {
      console.error("Error fetching approved amount:", error);
      return null;
    }
  };

  const handleCheckApprovedClick = async () => {
    const userAddress = walletClient?.account?.address;
    const spenderAddress = "0x9d4ecfC15D9FcfC804a838F495DEA21aAEaC5628"
    const approvedAmount = await getApprovedAmount(userAddress, spenderAddress);
    if (approvedAmount) {
      setAprvAmt(approvedAmount);
    } else {
      console.error("Could not retrieve approved amount.");
    }
  };

  useEffect(() => {
    if (walletClient?.account?.address && spenderAddress) {
      handleCheckApprovedClick();
    }
  }, [walletClient?.account?.address, spenderAddress]);

  const handleApproveClick = async (amount: string) => {
    try {
      if (walletClient) {
        const web3 = new Web3(window.ethereum)
        const tokenAddress = "0x222c21111dDde68e6eaC2fCde374761E72c45FFe"
        const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);

        const userAddress = walletClient?.account?.address;
        const gasPrice = (await web3.eth.getGasPrice()).toString();
        const amountInWei = web3.utils.toWei(amount, 'ether'); // Converts directly to Wei as a string
        const tx = await tokenContract.methods.approve("0x9d4ecfC15D9FcfC804a838F495DEA21aAEaC5628", amountInWei).send({ from: userAddress, gasPrice: gasPrice });
      }
    } catch (error) {
      const e = error as { code?: number; message?: string };
      if (e.code === 4001) {
        console.error("User rejected the transaction:", e.message);

      } else {
        console.error("Error during token approval:", e.message);
      }
    }
  };

  const divideBy = recoveryMode ? cCr : mCR;
  const availableToBorrow = (Number(entireDebtAndColl.coll) * Number(fetchedPrice)) / Number(divideBy) - Number(entireDebtAndColl.debt);
  const liquidation = Number(divideBy) * (Number(entireDebtAndColl.debt) / Number(entireDebtAndColl.coll));
  const totalAvailableBorrow = Number(newUserColl) * Number(fetchedPrice) / Number(divideBy) - Number(entireDebtAndColl.debt)
  const newLTV = ((Number(entireDebtAndColl.debt) * 100) / ((Number(entireDebtAndColl.coll) * Number(fetchedPrice)))).toFixed(2)

  const isCollInValid = parseFloat(userInputs.depositCollateral) > Number(balanceData)
  const isDebtInValid = parseFloat(userInputs.borrow) > totalAvailableBorrow
  const condition = (userInputColl + userInputDebt >= 1) || (parseFloat(userInputs.depositCollateral) < Number(entireDebtAndColl.coll)) || (parseFloat(userInputs.borrow) < Number(entireDebtAndColl.debt));

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
      setLoadingMessage("Borrow Transaction completed successfully");
      setLoadingModalVisible(true);
    } else if (transactionRejected) {
      setLoadingMessage("Transaction was rejected");
      setLoadingModalVisible(true);
    }
  }, [isSuccess, isLoading, transactionRejected]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCloseButton(true);
    }, 200000);
    return () => clearTimeout(timer);
  }, []);

  const marginClass = parseFloat(userInputs.depositCollateral) > 0 ? 'md:-ml-[7rem]' : 'md:-ml-[5rem]';

  getApprovedAmount(walletClient?.account?.address, "0x9d4ecfC15D9FcfC804a838F495DEA21aAEaC5628")
  useEffect(() => {
    const aprvAmntInDecimals = Number(aprvAmnt) / (10 ** 18);
    const modDifference = Number(userInputs.depositCollateral) - aprvAmntInDecimals;
    setModiff(modDifference)
  }, [userInputs.depositCollateral, aprvAmnt]);

  useEffect(() => {
    if (Number(modiff) > 0) {
      setNewApprovedAmount(modiff);
    } else {
      setNewApprovedAmount(null);
    }
  }, [newApprovedAmount, modiff, aprvAmnt, userInputs.depositCollateral]);

  return (
    <div>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <Layout>
          {troveStatus === "ACTIVE" && (
            <div style={{ backgroundColor: "black" }} className="p-7">
              <div className="w-[103%] -ml-2 h-[35rem] md:h-fit md:w-[97%] md:ml-4 p-3 justify-between flex flex-col md:flex-row" style={{ backgroundColor: "#222222" }}>
                <div className="p-2 px-4  ">
                  <p className=" title-text2 text-2xl text-white mb-4">
                    earthBTC Trove
                  </p>
                  <p className=" title-text2 text-gray-500 text-base mb-4">
                    Available to borrow
                  </p>
                  <div className="flex flex-row gap-2 items-center ">
                    <Image src={ORE} alt="home" width={40} />
                    {Number(availableToBorrow) >= 0 && (
                      <h6 className={`text-white tracking-wider title-text2 text-3xl`}>
                        {Number(availableToBorrow).toFixed(2)}
                      </h6>
                    )}
                  </div>
                  <div className="flex -ml-5 flex-row justify-between mt-3 md:mt-5 md:gap-4">
                    <div className="flex flex-col text-white  h-28 p-5" style={{ backgroundColor: "" }}>
                      <span className="body-text font-medium  text-gray-500">Collateral</span>
                      <span className="body-text font-medium text-xl">{Number(entireDebtAndColl.coll).toFixed(8)} earthBTC</span>
                      <span className="body-text font-medium text-xs  p-1 text-gray-500">${(Number(fetchedPrice) * Number(entireDebtAndColl.coll)).toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col text-white w-[9rem]  h-28 p-5" style={{ backgroundColor: "" }} >
                      <span className="body-text font-medium text-gray-500 ">Debt</span>
                      <span className="body-text font-medium text-xl whitespace-nowrap">{Number(entireDebtAndColl.debt).toFixed(2)} ORE</span>
                      <span className="body-text font-medium text-gray-500 text-xs">${Number(entireDebtAndColl.debt).toFixed(2)}</span>
                    </div>{" "}
                  </div>
                </div>
                <div className="md:w-[14rem] hidden md:block  md:h-[13rem] mt-4" style={{ backgroundColor: "" }}>
                  <div className="flex md:flex-col md:gap-x-0 gap-x-10 gap-y-14 text-white  px-5 py-4">
                    <span></span>
                    <span></span>
                    <div className="flex flex-col">
                      <span className="text-gray-500 -mt-[7px]  body-text font-medium">Trove Status</span>
                      {troveStatus === "ACTIVE" ? <Image className="mt-[5px]" width={120} src={ACTIVE} alt={""} /> : <Image className="mt-[5px]" width={120} src={INACTIVE} alt={""} />}
                    </div>
                  </div>
                </div>
                {/* <div className="md:w-[25rem] h-[15rem] p-5 md:p-0 md:h-[13rem] mt-3 px-8 md:py-4 mr-5"*/}
                <div className="md:w-[25rem] w-full h-[18rem] md:h-[13rem] rounded-2xl  mt-3 pt-5 px-8 md:py-4 mr-5" style={{ backgroundColor: "#282828" }}>
                  <div className="flex justify-between text-white">
                    <div className="flex flex-col gap-y-16 ">
                      <div className="flex  p-1 flex-col">
                        <span className="text-xs text-gray-500 body-text">Liquidation</span>
                        <span className="body-text body-text">${liquidation.toFixed(2)} ORE</span>
                        <span className="text-sm text-gray-500 body-text">${Number(fetchedPrice).toFixed(2)}</span>
                      </div>
                      <div className="flex md:hidden -mt-12 md:-mt-6 flex-col">
                        <span className="text-gray-500 text-xs body-text">Trove Status</span>
                        {troveStatus === "ACTIVE" ? <Image className="" width={120} src={ACTIVE} alt={""} /> : <Image className="mt-[5px]" width={120} src={INACTIVE} alt={""} />}
                      </div>
                      <div className="flex  fee -mt-6 flex-col">
                        <span className=" body-text text-xs text-gray-500 body-text">Refundable Fee</span>
                        <p className="body-text text-sm ">{Number(calculatedFee).toFixed(2)} ORE</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className=" text-gray-500 body-text ml-[0.5rem] text-sm -mt-3">loan to value</span>
                      <Knob value={Number(newLTV) || 0} showValue={true} size={135} rangeColor="#78887f" valueColor="#3dde84" strokeWidth={7} readOnly className="text-[#88e273]" />
                      <div className="flex-col flex items-center space-y-1 -mt-4  w-[4.5rem]">
                        <span className="text-base  ml-[0.5rem] body-text">{Number(newLTV).toFixed(2) || 0}%</span>
                        <span className="text-xs text-gray-500 body-text ">YOUR LTV</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" md:mt-5" style={{ backgroundColor: "black" }}>
                <div className="md:p-5 pt-20 flex-col flex gap-x-36">
                  <div className=" border-[#88e273]">
                    <TabView className="md:-ml-0  -ml-2">
                      <TabPanel className="p-[2px] bg-[#88e273] text-sm title-text " header="Borrow">
                        <div className="p-5"
                          style={{ backgroundColor: "black" }}>
                          <div className="flex-col mx-2  flex md:flex-row justify-between gap-10">
                            <div>
                              <div className="grid w-full  space-y-7  max-w-sm items-start gap-2 mx-auto p-7  md:p-5">
                                <div className="relative">
                                  <Label htmlFor="items" className="text-[#84827a] font-medium body-text  text-base mb-2 md:-ml-0 -ml-11 ">
                                    Deposit Collateral
                                  </Label>
                                  <div className="flex items-center mt-4 md:-ml-0 -ml-11 border rounded-2xl border-[#88e273] " style={{ backgroundColor: "black" }}>
                                    <div className='flex items-center h-[3.5rem] '>
                                      <Image src={earthBTC} alt="home" className='ml-1' width={41} />
                                      <h6 className='text-white text-sm font-medium hidden md:block body-text mx-2'>earthBTC</h6>
                                      <h3 className='h-full border border-[#88e273] mx-6 text-[#88e273]'></h3>
                                    </div>
                                    <div className="flex-grow h-full">
                                      <Input id="items" placeholder='' disabled={!(isConnected)}
                                      value={userInputs.depositCollateral} onChange={(e) => {
                                        const newCollValue = e.target.value;
                                        setUserInputs({ ...userInputs, depositCollateral: newCollValue });
                                      }}
                                        className=" h-full ml-5 w-[90%] body-text  font-medium text-gray-400"
                                      style={{ backgroundColor: "black", outline: "none", border: "none" }} />
                                    </div>
                                    <span className={`md:max-w-[fit] md:p-2 mr-1 md:mr-0 font-medium text-gray-400 body-text`}>
                                        ${(parseFloat(userInputs.depositCollateral || "0") * Number(fetchedPrice)).toFixed(2)}
                                      </span>
                                  </div>
                                  <div className="flex flex-col mt-[15px] gap-x-5 justify-between">
                                    <span className="text-white gap-x-2 flex flex-row w-full md:-ml-0 -ml-10 ">
                                      <h6 className="text-[#84827a] font-medium body-text text-sm">
                                        Available{" "}
                                      </h6>
                                      <span className={`text-sm  font-medium body-text whitespace-nowrap ${parseFloat(userInputs.depositCollateral) > Number(balanceData) ? 'text-red-500' : 'text-white'}`}>
                                        {Number(balanceData).toFixed(8)}{" "}
                                      </span>
                                    </span>
                                    {/* <Button onClick={() => handleApproveClick(userInputs.depositCollateral)}>Approve</Button> */}
                                    <div className="flex w-full py-2 -ml-11 gap-x-3 md:-ml-0 md:gap-x-3 mt-2">
                                      <Button disabled={(!isConnected)} className={`text-sm border-2 rounded-2xl border-[#88e273]  body-text`} style={{ backgroundColor: "#", }} onClick={() => handlePercentageClickBTC(25)}>25%</Button>
                                      <Button disabled={(!isConnected)} className={`text-sm border-2 rounded-2xl border-[#88e273] body-text`} style={{ backgroundColor: "#", }} onClick={() => handlePercentageClickBTC(50)}>50%</Button>
                                      <Button disabled={(!isConnected)} className={`text-sm border-2 rounded-2xl border-[#88e273] body-text`} style={{ backgroundColor: "#", }} onClick={() => handlePercentageClickBTC(75)}>75%</Button>
                                      <Button disabled={(!isConnected)} className={`text-sm border-2 rounded-2xl border-[#88e273] body-text`} style={{ backgroundColor: "#", }} onClick={() => handlePercentageClickBTC(100)}>100%</Button>
                                    </div>
                                  </div>
                                </div>
                                <div className="relative ">
                                  <div className="mb-4">
                                    <Label htmlFor="quantity" className="text-[#84827a] font-medium md:-ml-0 p-1 -ml-11 body-text text-base">
                                      Borrow
                                    </Label>
                                  </div>
                                  <div className="flex  items-center  md:mt-0 w-[19rem] md:w-[24rem] md:-ml-0 -ml-11 rounded-2xl  border border-[#88e273] " style={{ backgroundColor: "black" }}>
                                    <div className='flex items-center h-[3.5rem] mx-1'>
                                      <Image src={ORE} alt="home" className='ml-1' width={40} />
                                      <h3 className='text-white body-text ml-1 font-medium hidden md:block mr-2 mx-3'>ORE</h3>
                                      <h3 className='h-full border  border-[#88e273] mx-2  text-[#88e273]'></h3>
                                    </div>
                                  <div className="flex-grow h-full">
                                    <Input id="items" placeholder='Enter Collateral Amount'
                                      disabled={!(isConnected)} value={Math.trunc(Number(userInputs.borrow) * 100) / 100}
                                      onChange={(e) => {
                                        const newBorrowValue = e.target.value;
                                        setUserInputs({ ...userInputs, borrow: newBorrowValue, });
                                      }}
                                      className="w-[80%] h-full ml-1 body-text font-medium text-gray-400 pl-3"
                                      style={{ backgroundColor: "black", outline: "none", border: "none" }}
                                    />
                                  </div>
                                  </div>
                                  <div className="flex flex-col mt-[15px] gap-x-5 justify-between">
                                    <span className="text-white gap-x-2 flex flex-row w-full md:-ml-0 -ml-10 ">
                                      <h6 className="text-[#84827a] font-medium body-text text-sm">
                                        Available{" "}
                                      </h6>
                                      {Number(totalAvailableBorrow) >= 0 ? (
                                        <h6 className={`text-sm  font-medium body-text whitespace-nowrap ${parseFloat(userInputs.borrow) > totalAvailableBorrow ? 'text-red-500' : 'text-white'}`}>
                                          {Math.trunc(Number(totalAvailableBorrow) * 100) / 100}
                                          <div></div>
                                        </h6>
                                      ) :
                                        (<h6 className={`text-sm  font-medium  body-text whitespace-nowrap ${parseFloat(userInputs.borrow) > totalAvailableBorrow ? 'text-red-500' : 'text-white'}`}>
                                          {Math.trunc(Number(availableToBorrow) * 100) / 100}
                                          <div></div>
                                        </h6>
                                        )}
                                    </span>
                                    <div className="flex w-full mt-[4px] py-3 -ml-11  md:-ml-0 gap-x-3 md:gap-x-3">
                                      <Button disabled={(!isConnected)} className={`text-sm border-2 rounded-2xl border-[#88e273]  body-text`} style={{ backgroundColor: "#", }} onClick={() => handlePercentageClick(25)}>25%</Button>
                                      <Button disabled={(!isConnected)} className={`text-sm border-2 rounded-2xl border-[#88e273] body-text`} style={{ backgroundColor: "#", }} onClick={() => handlePercentageClick(50)}>50%</Button>
                                      <Button disabled={(!isConnected)} className={`text-sm border-2 rounded-2xl border-[#88e273] body-text`} style={{ backgroundColor: "#", }} onClick={() => handlePercentageClick(75)}>75%</Button>
                                      <Button disabled={(!isConnected)} className={`text-sm border-2 rounded-2xl border-[#88e273] body-text`} style={{ backgroundColor: "#", }} onClick={() => handlePercentageClick(100)}>100%</Button>
                                    </div>
                                  </div>
                                  {
                                    chainId !== bitfinityTestNetChain.id ? (
                                      <button
                                        onClick={() => switchChain({ chainId: bitfinityTestNetChain.id })
                                        }
                                        className="mt-2 text-black text-md font-semibold w-full border  border-black h-12 bg-gradient-to-r from-[#88e273] via-[#9cd685] to-[#b5f2a4] hover:from-[#6ab95b] hover:via-[#82c16a] hover:to-[#9cd685] title-text border-none rounded-3xl"
                                      >
                                        Switch to Bitfinity
                                      </button>
                                    ) : (
                                      <button onClick={() => handleConfirmClick(userInputs.borrow, userInputs.depositCollateral)}
                                        className={`mt-9 md:-ml-0 rounded-3xl -ml-10 w-[19rem] md:w-full title-text h-12 bg-gradient-to-r from-[#88e273] via-[#9cd685] to-[#b5f2a4] hover:from-[#6ab95b] hover:via-[#82c16a] hover:to-[#9cd685]
                                     ${isDebtInValid || ltv > (100 / Number(divideBy)) || isCollInValid || (userInputColl + userInputDebt == 0)
                                            ? 'bg-[#88e273] text-black opacity-50 cursor-not-allowed' : ' hover:scale-95  cursor-pointer bg-[#88e273]  text-black'}`}
                                        disabled={(isDebtInValid || isCollInValid || (userInputColl + userInputDebt == 0) || ltv > (100 / Number(divideBy)))}>
                                        {isModalVisible ? "Updating Trove..." : modiff > -0 ? "Approve" : "Update Trove"}
                                      </button>
                                    )}
                                </div>
                              </div>
                            </div>
                            <div className={`px-1 pl-5 w-[18rem] -ml-4 md:px-9 md:w-full rounded-2xl pt-9 h-[18rem] md:h-[20rem] ${condition ? 'p-4' : ' p-16'} md:pt-12 md:mx-4 md:mt-10 text-sm`}
                              style={{ backgroundColor: "#222222" }}>
                              <div className="mb-4 space-y-4">
                                <div className="flex  md:gap-x-20 text-white md:flex-row flex-col  items-center justify-between">
                                  <div className="flex  w-full">
                                    <span className="body-text text-xs whitespace-nowrap text-[#84827a] font-medium">Loan-To-Value</span>
                                    <Image width={15} className="toolTipHolding9 ml_5 cursor-pointer" src={info} data-pr-tooltip="" alt="info" />
                                    <Tooltip className=" title-text2" target=".toolTipHolding9" content="It is a ratio that measures the amount of a loan compared to the value of the collateral." mouseTrack mouseTrackLeft={10} />
                                  </div>
                                  <span className="text-xs w-full whitespace-nowrap body-text">
                                    <div className="flex items-center gap-x-2.5">
                                      <span className="w-28 p-1  md:-ml-10 -ml-1 font-medium body-text ">
                                        {Number(newLTV).toFixed(2)} %
                                      </span>
                                      {userInputColl + userInputDebt >= 1 && ((<>
                                        <span className="text-[#88e273] text-lg">
                                          <FaArrowRightLong />
                                        </span>
                                        <span className={`overflow-x-clip text-sm body-text font-medium w-28 p-1 ${ltv > (100 / Number(divideBy)) ?
                                          'text-red-500' : ''}`}>{" "}{Number(ltv).toFixed(2)} %</span>
                                      </>
                                      ))}
                                    </div>
                                  </span>
                                </div>
                                <div className="flex  text-white mb-2 justify-between  items-center  md:flex-row flex-col">
                                  <div className="flex w-full">
                                    <span className="body-text text-xs whitespace-nowrap text-[#84827a] font-medium">Liquidation Price</span>
                                    <Image width={15} className="toolTipHolding10 ml_5 " src={info} data-pr-tooltip="" alt="info" />
                                    <Tooltip className="custom-tooltip title-text2" target=".toolTipHolding10" content="The ORE value at which your Vault will drop below 110% Collateral Ratio and be at risk of liquidation. You should manage your position to avoid liquidation by monitoring normal mode liquidation price." mouseTrack mouseTrackLeft={10} />
                                  </div>
                                  <span className="body-text  my-1  text-xs w-full whitespace-nowrap">
                                    <div className="flex items-center gap-x-2.5">
                                      <span className=" w-28 -ml-[5px] body-text font-medium p-1">
                                        {Number(liquidation).toFixed(2)} ORE
                                      </span>
                                      {userInputColl + userInputDebt >= 1 && (
                                        <>
                                          <span className="text-[#88e273] text-lg">
                                            <FaArrowRightLong />
                                          </span>
                                          <span className="body-text text-xs whitespace-nowrap w-28  p-1 font-medium">{" "}{Number(liquidationPrice).toFixed(2)} ORE</span>
                                        </>
                                      )}
                                    </div>
                                  </span>
                                </div>
                                <div className="flex  text-white mb-2  items-center justify-between  md:flex-row flex-col">
                                  <div className="flex w-full">
                                    <span className="body-text text-xs whitespace-nowrap text-[#84827a] font-medium  md:flex-row flex-col">Total Debt</span>
                                    <Image width={15} className="toolTipHolding11 ml_5" src={info} data-pr-tooltip="" alt="info" />
                                    <Tooltip className="custom-tooltip title-text2" target=".toolTipHolding11" mouseTrack content="Total amount of ORE borrowed + liquidation reserve (200 ORE) + borrowing fee at time of loan issuance." mouseTrackLeft={10} />
                                  </div>
                                  <span className="body-text  my-1  text-xs w-full whitespace-nowrap">
                                    <div className="flex items-center gap-x-2">
                                      <span className="w-28 -ml-[5px] p-1 body-text font-medium">
                                        {Number(entireDebtAndColl.debt).toFixed(2)} ORE
                                      </span>
                                      {userInputColl == 1 && (
                                        <>
                                          <span className="text-[#88e273] text-lg">
                                            <FaArrowRightLong />
                                          </span>
                                          <span className="ml-05 w-28 p-1 body-text font-medium">{" "}{Number(totalDebt).toFixed(2)} ORE</span>
                                        </>
                                      )}
                                    </div>
                                  </span>
                                </div>
                                <div className="flex text-white mb-2  items-center md:flex-row flex-col justify-between">
                                  <div className="flex w-full">
                                    <span className="text-xs whitespace-nowrap body-text text-[#84827a] font-medium ">Total Collateral</span>
                                    <Image width={15} className="toolTipHolding12 ml_5" src={info} data-pr-tooltip="" alt="info" />
                                    <Tooltip className="custom-tooltip title-text2" target=".toolTipHolding12" mouseTrack content="The ratio of the ORE value of the entire system collateral divided by the entire system debt." mouseTrackLeft={10} />
                                  </div>
                                  <span className="body-text my-1  text-xs w-full whitespace-nowrap">
                                    <div className="flex items-center gap-x-1 md:gap-x-3">
                                      <span className="p-1 w-28 -ml-[5px] body-text  font-medium">
                                        {Number(entireDebtAndColl.coll).toFixed(8)} earthBTC
                                      </span>
                                      {userInputColl == 1 && (
                                        <>
                                          <span className="text-[#88e273] text-lg">
                                            <FaArrowRightLong className="ml-1" />
                                          </span>
                                          <span className="md:ml-05 p-1 w-28 body-text text-xs font-medium">{" "}{Number(newUserColl).toFixed(8)} earthBTC</span>
                                        </>
                                      )}
                                    </div>
                                  </span>
                                </div>
                              </div>
                              {userInputDebt == 1 && (
                                <div className="flex text-white mb-2  items-center md:flex-row flex-col justify-between">
                                  <div className="flex w-full">
                                    <span className="text-xs whitespace-nowrap body-text text-[#84827a] font-medium ">Borrowing Fee</span>
                                    <Image width={15} className="toolTipHolding12 ml_5" src={info} data-pr-tooltip="" alt="info" />
                                    <Tooltip className="custom-tooltip title-text2" target=".toolTipHolding12" mouseTrack content="The ratio of the ORE value of the entire system collateral divided by the entire system debt." mouseTrackLeft={10} />
                                  </div>
                                  <span className="body-text my-1  text-xs w-full whitespace-nowrap">
                                    <div className="flex items-center gap-x-2">
                                      <span className="p-1 w-28 body-text pl-2 font-medium">
                                        {Number(borrowingFee).toFixed(2)} ORE
                                      </span>
                                      {userInputColl == 1 && (
                                        <>
                                          <span className="text-[#88e273]  w-6 text-lg">
                                          </span>
                                          <span className="md:ml-05 p-1  w-28 body-text font-medium">{" "}</span>
                                        </>
                                      )}
                                    </div>
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </TabPanel>
                      <TabPanel className="p-[2px] bg-[#88e273] text-sm body-text " header="Repay">
                        <div className="w-full h-full border p-5 border-[#88e273]" style={{ backgroundColor: "black" }}>
                          <RepayBTC coll={parseFloat(entireDebtAndColl.coll)} debt={parseFloat(entireDebtAndColl.debt)} lr={lr} fetchedPrice={Number(fetchedPrice)} borrowRate={borrowRate} minDebt={minDebt} recoveryMode={recoveryMode} cCR={cCr} mCR={mCR} troveStatus={troveStatus} />
                        </div>
                      </TabPanel>
                      <TabPanel className="p-[2px] bg-[#88e273] text-sm title-text" header="Close">
                        <div className="w-full h-full" style={{ backgroundColor: "black" }}  >
                          <CloseTroveBTC entireDebtAndColl={parseFloat(entireDebtAndColl.coll)} debt={parseFloat(entireDebtAndColl.debt)} liquidationReserve={lr} />
                        </div>
                      </TabPanel>
                    </TabView>
                  </div>
                </div>
              </div>
            </div>
          )}
          {troveStatus === "INACTIVE" && (
            <div className="w-full h-auto" style={{ backgroundColor: "black" }}>
              <OpenTroveBTC />
            </div>
          )}
          {!isConnected && (
            <OpenTroveNotConnected />
          )}
        </Layout>
      )}

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
              ) : loadingMessage === 'Borrow Transaction completed successfully' ? (
                <Image src={tick} alt="tick" width={200} />
              ) : transactionRejected ? (
                <Image src={rej} alt="rejected" width={140} />
              ) : (
                <Image src={conf} alt="box" width={140} />
              )}
              <div className="waiting-message title-text2 text-[#88e273]">{loadingMessage}</div>
              {isSuccess && (
                <button className="mt-1 p-3 text-black title-text2 hover:scale-95 bg-[#88e273]" onClick={handleClose}>Okay</button>
              )}
              {(transactionRejected || (!isSuccess && showCloseButton)) && (
                <>
                  <p className="body-text text-white text-xs">{transactionRejected ? "Transaction was rejected. Please try again." : "Some Error Occurred On Network Please Try Again After Some Time.. 🤖"}</p>
                  <Button className=" mt-1 p-3 text-black rounded-none md:w-[20rem] title-text2 hover:bg-[#88e273] hover:scale-95 bg-[#88e273]" onClick={handleClose}>Try again</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default BorrowBTCNEW;