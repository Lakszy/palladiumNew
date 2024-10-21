import React, { useCallback } from "react";
import "../../app/App.css";
import Image from "next/image";
import rej from "../../app/assets/images/TxnError.gif";
import conf from "../../app/assets/images/conf.gif"
import rec2 from "../../app/assets/images/rec2.gif"
import tick from "../../app/assets/images/tick.gif"
import stabilityPoolAbi from "../../app/src/constants/abi/StabilityPool.sol.json";
import botanixTestnet from "../../app/src/constants/botanixTestnet.json";
import { getContract } from "../../app/src/utils/getContract";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWalletClient,
  useWriteContract,
} from "wagmi";
import "../../app/App.css";
import "../../components/stabilityPool/Modal.css";
import { StabilityPoolbi } from "@/app/src/constants/abi/StabilityPoolbi";
import { Button } from "../ui/button";
import { Dialog } from "primereact/dialog";
import { BOTANIX_RPC_URL } from "@/app/src/constants/botanixRpcUrl";
import { bitfinityTestNetChain, useEthereumChainId } from "../NetworkChecker";
import { useSwitchChain } from 'wagmi'
import { EVMConnect } from "../../app/src/config/EVMConnect";


const Claim = () => {
  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);

  const stabilityPoolContractReadOnly = getContract(
    botanixTestnet.addresses.StabilityPool,
    stabilityPoolAbi,
    provider
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data: hash, writeContract, error: writeError } = useWriteContract();
  const [fetchedPrice, setFetchedPrice] = useState(0);
  const [fetchedPriceBTC, setFetchedPriceBTC] = useState(0);
  const [userModal, setUserModal] = useState(false);
  const { isConnected } = useAccount();
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showCloseButton, setShowCloseButton] = useState(false);
  const { data: walletClient } = useWalletClient();
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
  const [transactionRejected, setTransactionRejected] = useState(false);
  const { switchChain } = useSwitchChain()
  const [wcoreBalance, setWcoreBalance] = useState(0.0)
  const [wbtcBalance, setWbtcBalance] = useState(0.0)

  const [depositorAssets, setDepositorAssets] = useState([]);
  const [depositorGains, setDepositorGains] = useState<{
    [key: string]: string;
  }>({});
  const [chainId, setChainId] = useState(355113);
  useEthereumChainId(setChainId)

  const handleClose = useCallback(() => {
    setLoadingModalVisible(false);
    setUserModal(false);
    setIsModalVisible(false);
    setTransactionRejected(false);
    window.location.reload();
  }, []);

  const collateralTokens = [
    {
      name: "earthBTC",
      address: "0x222c21111dDde68e6eaC2fCde374761E72c45FFe",
    },

  ];


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.palladiumlabs.org/bitfinity/protocol/metrics");
        const data = await response.json();
        const protocolMetrics = data[0].metrics[0];
        const protocolMetricsBTC = data[0].metrics[0];
        setFetchedPriceBTC(protocolMetricsBTC.price);
        setFetchedPrice(protocolMetrics.price);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [walletClient, hash]);

  const fetchDepositorGains = useCallback(async () => {
    if (!walletClient) return;

    try {
      const sortedAssets = [...collateralTokens].sort((a, b) =>
        a.address.toLowerCase().localeCompare(b.address.toLowerCase())
      );

      const assets = sortedAssets.map((token) => token.address);
      const [returnedAssets, gains] =
        await stabilityPoolContractReadOnly.getDepositorGains(
          walletClient.account.address,
          assets
        );

      const gainsObject: { [key: string]: string } = {};
      returnedAssets.forEach((asset: string, index: number) => {
        const gain = gains[index];
        if (gain > BigInt(0)) {
          const token = sortedAssets.find(
            (t) => t.address.toLowerCase() === asset.toLowerCase()
          );
          if (token) {
            gainsObject[token.name] = ethers.formatUnits(gain, 18);
          }
        }
      });
      setDepositorGains(gainsObject);
    } catch (error) {
      console.error("Error fetching depositor gains:", error);
    }
  }, [walletClient, stabilityPoolContractReadOnly, collateralTokens]);


  useEffect(() => {
    const fetchDepositorGains = async () => {
      try {
        const [returnedAssets, gains] =
          await stabilityPoolContractReadOnly.getDepositorGains(
            walletClient?.account.address,
            [
              "0x222c21111dDde68e6eaC2fCde374761E72c45FFe",
            ],
          );
        setDepositorAssets(returnedAssets);
        setDepositorGains(gains);

        setWcoreBalance(Number(gains[0]));
        setWbtcBalance(Number(gains[1]));

      } catch (error) {
        console.error("Error fetching depositor gains:", error);
      }
    };

    fetchDepositorGains();
  }, [walletClient]);

  const handleConfirmClick = async () => {
    setIsModalVisible(true);
    try {
      if (!walletClient) return null;
      const inputBigInt = BigInt(0);

      await writeContract({
        abi: StabilityPoolbi,
        address: "0x955494Ae78369d0A224D05d7DD5Bc8d9804bF082", // STABILITY POOL contract address
        functionName: "withdrawFromSP",
        args: [
          inputBigInt,
          [
            "0x222c21111dDde68e6eaC2fCde374761E72c45FFe",
          ],
        ],
        value: undefined,
      });
    } catch (error) {
      console.error("Error sending transaction:", error);
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
      setLoadingMessage("Claim completed successfully");
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

  useEffect(() => {
    fetchDepositorGains();
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

  const allTokenGains = collateralTokens.reduce((acc, token) => {
    acc[token.name] = depositorGains[token.name] || "0";
    return acc;
  }, {} as { [key: string]: string });

  const wbtcGains = Number(allTokenGains["earthBTC"]);

  const totalClaimValue = Number((wbtcGains * fetchedPriceBTC)).toFixed(2);

  const isButtonEnabled = Number(totalClaimValue) > 0;

  const assets = [{ name: "earthBTC", amount: wbtcGains, marketPrice: fetchedPriceBTC, decimals: 2 }];

  return (
    <div className="p-4 md:p-8 w-full md:h-[25.6rem] border-[#88e273] bg-black text-white border rounded-none">
      <div className="flex flex-col md:flex-row gap-y-4 md:gap-x-2">
        <div className="flex-1 pr-0 p-2" style={{ backgroundColor: "#222222" }}>
          <div className="w-full grid grid-cols-3 gap-4 text-left" style={{ backgroundColor: "" }}>
            <div className="text-gray-400 body-text font-medium pb-4 pl-2">Assets</div>
            <div className="text-gray-400 body-text font-medium whitespace-nowrap pb-4">Market Price</div>
            <div className="text-gray-400 body-text font-medium pb-4">Claim Value</div>
            {assets.map((asset, index) => (
              <React.Fragment key={index}>
                <div className="py-2 px-1 md:px-2 body-text font-medium flex items-center">
                  <span className=" whitespace-nowrap">
                    {Number(asset.amount).toFixed(2)} {asset.name}
                  </span>
                </div>
                <div className="py-2 body-text font-medium ">
                  ${asset.marketPrice.toFixed(2)}
                </div>
                <div className="py-2 body-text font-medium ">
                  ${(asset.amount * asset.marketPrice).toFixed(asset.decimals)}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex-1 px-2 py-4 p-2" style={{ backgroundColor: "#222222" }}>
            <div className="mb-6 mt-2">
              <div className="flex justify-between gap-x-16 mb-2">
                <span className="text-gray-400 body-text font-medium ">
                  Total Value to claim
                </span>
                <span className="body-text font-medium ">
                  {totalClaimValue} USD
                </span>
              </div>
              {Object.entries(allTokenGains).map(([token, amount]) => {
                let formattedAmount;
                 if (token === "earthBTC") {
                  formattedAmount = parseFloat(amount).toFixed(8);
                } else {
                  formattedAmount = parseFloat(amount).toFixed(6);
                }
                return (
                  <div key={token} className="flex justify-between py-2">
                    <div className="flex">
                      <span className="text-[#827f77] text-sm font-medium body-text">
                        {token} Gains
                      </span>
                    </div>
                    <span className="text-white font-medium text-sm body-text">
                      {formattedAmount} {token}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          {isConnected ? (
            chainId !== bitfinityTestNetChain.id ? (
              <button
                onClick={() => switchChain({ chainId: bitfinityTestNetChain.id })}
                className="mt-2 text-black text-md font-semibold w-full border  border-black h-12 bg-gradient-to-r from-[#88e273] via-[#9cd685] to-[#b5f2a4] hover:from-[#6ab95b] hover:via-[#82c16a] hover:to-[#9cd685] title-text border-none rounded-3xl"
              >
                Switch to Bitfinity
              </button>
            ) : (
              <button
                className={`w-full py-3 h-12 bg-gradient-to-r from-[#88e273] via-[#9cd685] to-[#b5f2a4] hover:from-[#6ab95b] hover:via-[#82c16a] hover:to-[#9cd685] h- title-text2 transition-colors mt-4 rounded-3xl font-medium bg-[#88e273] text-black
      ${isButtonEnabled ? 'bg-[#88e273] text-black' : 'cursor-not-allowed opacity-50'}`}
                onClick={isButtonEnabled ? handleConfirmClick : undefined}
                disabled={!isButtonEnabled}
              >
                CLAIM
              </button>
            )
          ) : (
            <EVMConnect className={""} />
          )}

        </div>
      </div>
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
              ) : loadingMessage === 'Claim completed successfully' ? (
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
                  <Button className=" mt-1 p-3 rounded-none md:w-[20rem] text-black title-text2 hover:bg-[#88e273] hover:scale-95 bg-[#88e273]" onClick={handleClose}>Try again</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Claim;
