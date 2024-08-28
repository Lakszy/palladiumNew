import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import pusdbtc from "../app/assets/images/PUSD.svg";
import btc from "../app/assets/images/btclive.svg";
import info from "../app/assets/images/info.svg";
import collR from "../app/assets/images/mode.svg";
import { MdClose } from 'react-icons/md';
import { CustomConnectButton } from "./connectBtn";
import "../app/App.css";
import { EVMConnect } from "./EVMConnect";
import { useAccount, useWalletClient } from "wagmi";
import MobileNavFalse from "./MobileNavFalse";
import MobileNav from "./MobileNav";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import "./navbar.css";
import TooltipContent from "./TooltipContent";
import WalletConnectButton from "./WalletConnectButton";
import { Button } from "./ui/button";
import { TfiClose } from "react-icons/tfi";
import { useAccounts } from "@particle-network/btc-connectkit";
import { useWalletAddress } from "./useWalletAddress";

function NavBar() {
  const [fetchedPrice, setFetchedPrice] = useState(0);
  const [systemCollRatio, setSystemCollRatio] = useState(0);
  const { isConnected } = useAccount();
  const { accounts } = useAccounts();
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const { address } = useAccount();
  const [userExists, setUserExists] = useState(false);
  const toast = useRef<Toast>(null);
  const { data: walletClient } = useWalletClient();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  useEffect(() => {
    fetch(`https://api.palladiumlabs.org/sepolia/users/testnetWhitelist/${address}`)
      .then((response) => response.json())
      .then((data) => {
        setUserExists(data.userExists);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [address]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.palladiumlabs.org/sepolia/protocol/metrics"
        );
        const data = await response.json();
        const protocolMetrics = data[0];
        setIsRecoveryMode(protocolMetrics.recoveryMode);
        setFetchedPrice(protocolMetrics.priceBTC);
        setSystemCollRatio(protocolMetrics.TCR);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const showSuccess = (message: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 3000,
    });
  };

  const handleAddToken = () => {
    if (window.ethereum) {
      const tokenAddress = "0xB7d7027B5dD0c50946dE98c26e5969b37D588c32";
      const tokenSymbol = "PUSD";
      const tokenDecimals = 18;

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
      }).then((success: any) => {
        if (success) {
          showSuccess("PUSD token added to MetaMask!");
        }
      }).catch((error: any) => {
        console.error("Error adding token:", error);
      });
    }
  };

  const openDialog = () => {
    setIsDialogVisible(true);
  };

  const closeDialog = () => {
    setIsDialogVisible(false);
  };

  return (
    <>
      <div className="flex justify-between md:h-fit h-[5rem] items-center gap-x-4" style={{ backgroundColor: "#1c1a0f" }}>
        <div className="md:hidden flex items-center ml-[10px] gap-x-4">
          <MobileNav />
        </div>
        <div className="md:hidden m-2">
        <EVMConnect className="" />
        </div>
      </div>
      <Toast ref={toast} className="custom-toast" />
      <div className="md:flex border-2 hidden w-full border-gray-100 border-opacity-10 items-center justify-between gap-x-4 border-l px-4 py-4 z-50" style={{ backgroundColor: "#272315" }}>
        <div className="flex items-center gap-x-4">
          <div className="w-full ml-[1rem] gap-x-10 hidden md:flex rounded-xl">
            <div
              className="items-center hovertext-addtoken flex gap-x-2 hover:cursor-pointer pusd-section"
              onClick={handleAddToken}
            >
              <Image src={pusdbtc} alt="logo" width={40} onClick={handleAddToken} />
              <div>
                <h1 className="text-white title-text2 text-sm">PUSD</h1>
                <h1 className="text-sm text-gray-400 title-text2 whitespace-nowrap -ml-1">
                  $ 1.00
                </h1>
                <span className="popup body-text text-xs">Click To Import PUSD</span>
              </div>
            </div>
            <div className="items-center flex gap-x-2">
              <Image src={btc} alt="btc" width={40} />
              <div>
                <h1 className="text-white title-text2 text-sm ">BTC</h1>
                <h1 className="text-gray-400 text-sm title-text2 ">
                  ${Number(fetchedPrice).toFixed(2)}
                </h1>
              </div>
            </div>
            {(address) && userExists && (
              <>
                <div className="items-center flex gap-x-2">
                  <Image src={collR} alt="btc" width={40} />
                  <div>
                    <div className="gap-1 flex">
                      <h1 className="text-white title-text2 text-xs">SCR</h1>
                      <h1 className="text-gray-400 body-text -mt-[4px] text-[10px]">(Normal Mode)</h1>
                    </div>
                    <div className="relative">
                      <div className="flex">
                        <h1 className="text-gray-400 text-sm title-text2">
                          {(systemCollRatio * 100).toFixed(2)} %
                        </h1>
                        <div className="">
                          <Image
                            className="toolTipHolding4 ml_5 title-text2"
                            src={info}
                            alt="info"
                          />
                          <div className="aboslute z-10">
                            <TooltipContent />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <EVMConnect className="" />
      </div>

    </>
  );
}

export default NavBar;