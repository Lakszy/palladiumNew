import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Toast } from "primereact/toast";
import ORE from "../app/assets/images/ORE.png";
import rej from "../app/assets/images/TxnError.gif";
import info from "../app/assets/images/info.svg";
import conf from "../app/assets/images/conf.gif"
import rec2 from "../app/assets/images/rec2.gif"
import tick from "../app/assets/images/tick.gif"
import earthBTC from "../app/assets/images/earthBTC.png";
import FaucetAbi from "./FaucetAbi.sol.json";
import { EVMConnect } from "../app/src/config/EVMConnect";
import { useSwitchChain, useWaitForTransactionReceipt, useWalletClient, useWriteContract } from "wagmi";
import MobileNav from "./MobileNav";
import "./navbar.css";
import { bitfinityTestNetChain, useEthereumChainId } from "@/components/NetworkChecker";
import { Dialog } from "primereact/dialog";
import { Button } from "./ui/button";

function NavBar() {
  const [fetchedPriceBTC, setFetchedPriceBTC] = useState(0);
  const { data: isConnected } = useWalletClient();
  const { switchChain } = useSwitchChain()
  const [fetchedPriceORE, setFetchedPriceORE] = useState(0);
  const toast = useRef<Toast>(null);
  const [chainId, setChainId] = useState(355113);
  useEthereumChainId(setChainId)


  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [userModal, setUserModal] = useState(false);

  const [showCloseButton, setShowCloseButton] = useState(false);
  const { data: hash, writeContract, error: writeError } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
  const [transactionRejected, setTransactionRejected] = useState(false);
  const { data: walletClient } = useWalletClient();


  const handleClose = useCallback(() => {
    setLoadingModalVisible(false);
    setUserModal(false);
    setIsModalVisible(false);
    setTransactionRejected(false);
    window.location.reload();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.palladiumlabs.org/bitfinity/protocol/metrics");
        const data = await response.json();
        const protocolMetricsBTC = data[0].metrics[0]
        const priceORE = data[0].pricePUSD;
        setFetchedPriceBTC(protocolMetricsBTC.price);
        setFetchedPriceORE(priceORE);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [walletClient]);

  const showSuccess = (message: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 3000,
    });
  };

  const handleAddToken = (tokenAddress: string, tokenSymbol: string, tokenDecimals: number) => {
    if (window.ethereum) {
      window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
          },
        },
      })
        .then((success: any) => {
          if (success) {
            showSuccess(`${tokenSymbol} token added to MetaMask!`);
          }
        })
        .catch((error: any) => {
          console.error(`Error adding ${tokenSymbol} token:`, error);
        });
    }
  };

  const handleClaimTokens = async () => {
    setIsModalVisible(true);
    if (!walletClient) return;

    try {
      await writeContract({
        abi: FaucetAbi,
        address: "0xDf2Fe2159e9801B3C520665a8a5039705927b360",
        functionName: "claimTokens",
      });
    } catch (error) {
      console.error("Error claiming tokens:", error);
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
    <>
      <div className="flex justify-between md:h-fit h-[5rem] items-center gap-x-4" style={{ backgroundColor: "black" }}>
        <div className="md:hidden flex items-center ml-[10px] gap-x-4">
          <MobileNav />
        </div>
        <div className="md:hidden m-2">
          <EVMConnect className="" />
        </div>

      </div>
      <Toast ref={toast} className="custom-toast" />
      <div className="md:flex border-2 hidden w-full border-gray-100 border-opacity-10 items-center justify-between gap-x-4 border-l px-4 py-4 z-50" style={{ backgroundColor: "black" }}>
        <div className="flex items-center gap-x-4">
          <div className="w-full ml-[1rem] gap-x-10 hidden md:flex rounded-xl">
            <div className="items-center hovertext-addtoken flex gap-x-2 hover:cursor-pointer pusd-section"
              onMouseEnter={(e) => e.currentTarget.querySelector('.popup')?.classList.add('visible')}
              onMouseLeave={(e) => e.currentTarget.querySelector('.popup')?.classList.remove('visible')}
              onClick={() => handleAddToken("0x222c21111dDde68e6eaC2fCde374761E72c45FFe", "earthBTC", 18)}>
              <Image src={earthBTC} alt="earthBTC" width={40} />
              <div>
                <h1 className="text-white title-text2 text-sm">earthBTC</h1>
                <h1 className="text-gray-400 text-sm title-text2">${Number(fetchedPriceBTC).toFixed(2)}</h1>
                <span className="popup body-text text-xs">Click to import earthBTC</span>
              </div>
            </div>
            <div className="items-center hovertext-addtoken flex gap-x-2 hover:cursor-pointer pusd-section"
              onMouseEnter={(e) => e.currentTarget.querySelector('.popup')?.classList.add('visible')}
              onMouseLeave={(e) => e.currentTarget.querySelector('.popup')?.classList.remove('visible')}
              onClick={() => handleAddToken("0x67ce5fa8bef187fb54374f2dBF588dE013C96dc6", "ORE", 18)}>
              <Image src={ORE} alt="ORE" className="mr-1" width={40} />
              <div>
                <h1 className="text-white title-text2 text-sm">ORE</h1>
                <h1 className="text-sm text-gray-400 title-text2 whitespace-nowrap -ml-[0px]">${Number(fetchedPriceORE).toFixed(2)}</h1>
                <span className="popup body-text text-xs">Click to import ORE</span>
              </div>
            </div>
            {isConnected ? (
              chainId !== bitfinityTestNetChain?.id ? (
                <button
                  onClick={() => switchChain({ chainId: bitfinityTestNetChain.id })}
                  className="earthBTC-faucet-button rounded-3xl text-black title-text bg-gradient-to-r from-[#88e273] via-[#9cd685] to-[#b5f2a4] hover:from-[#6ab95b] hover:via-[#82c16a] hover:to-[#9cd685] font-bold py-2 px-4"
                >
                  Switch to Bitfinity
                </button>
              ) : (
                <button
                  className="earthBTC-faucet-button rounded-3xl text-black title-text bg-gradient-to-r from-[#88e273] via-[#9cd685] to-[#b5f2a4] hover:from-[#6ab95b] hover:via-[#82c16a] hover:to-[#9cd685] font-bold py-2 px-4"
                  onClick={handleClaimTokens}
                >
                  Claim earthBTC
                </button>
              )
            ) : (
              <></>
            )}

          </div>
        </div>
        <EVMConnect className="" />
      </div>
      <Dialog visible={isModalVisible} onHide={() => setIsModalVisible(false)} className="dialog-overlay-wrapper">
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="py-5">
              <Image src={rec2} alt="box" width={140}  className="ml-16  p-2" />
            </div>
            <div className="p-5">
              <div className="waiting-message text-lg title-text2 text-[#88e273] whitespace-nowrap">Transaction is initiated</div>
              <div className="text-sm title-text2 text-[#bebdb9] whitespace-nowrap">Please confirm in Metamask.</div>
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog visible={userModal} onHide={() => setUserModal(false)} className="dialog-overlay-wrapper">
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="p-5">
              <div className="waiting-message text-lg title-text text-white whitespace-nowrap">Transaction rejected</div>
              <Button className="p-button-rounded p-button-text" onClick={() => setUserModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog visible={loadingModalVisible} onHide={() => setLoadingModalVisible(false)} className="dialog-overlay-wrapper">
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="p-5">
              {loadingMessage === 'Waiting for transaction to confirm..' ? (
                <>
                  <Image src={conf} alt="rectangle" width={150} className="ml-20  p-2" />
                  <div className="my-5 ml-[6rem] mb-5"></div>
                </>
              ) : loadingMessage === 'Close Transaction completed successfully' ? (
                <Image src={tick} alt="tick" width={200} className="ml-20  p-2" />
              ) : transactionRejected ? (
                <Image src={rej} alt="rejected" width={140} className="ml-20  p-2" />
              ) : (
                <Image src={conf} alt="box" width={140} className="ml-20  p-2"/>
              )}
              <div className="waiting-message title-text2 text-[#88e273]">{loadingMessage}</div>
              {isSuccess && (
                <button className="mt-1 p-3 text-black title-text2 hover:scale-95 bg-[#88e273]" onClick={handleClose}>Okay</button>
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

    </>
  );
}

export default NavBar;
