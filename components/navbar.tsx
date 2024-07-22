import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import pusdbtc from "../app/assets/images/PUSD.svg";
import btc from "../app/assets/images/btclive.svg";
import { CustomConnectButton } from "./connectBtn";
import "../app/App.css";
import { useAccount } from "wagmi";
import MobileNavFalse from "./MobileNavFalse";
import MobileNav from "./MobileNav";
import { Toast } from "primereact/toast";
import "./navbar.css"

function NavBar() {
  const [fetchedPrice, setFetchedPrice] = useState(0);
  const [systemCollRatio, setSystemCollRatio] = useState(0);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const { address } = useAccount();
  const [userExists, setUserExists] = useState(false);
  const toast = useRef<Toast>(null);

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

  return (
    <>
      <div className="flex justify-between items-center gap-x-4" style={{ backgroundColor: "#1c1a0f" }}>
        <div className="md:hidden">
          {userExists ? <MobileNav /> : <MobileNavFalse />}
        </div>
        <div className="md:hidden m-2">
        <CustomConnectButton className="" />
        </div>
      </div>
      <Toast ref={toast} className="custom-toast" />
      <div className="md:flex border-2 hidden w-full border-gray-100  border-opacity-10 items-center justify-between gap-x-4 border-l px-4 py-4 z-50" style={{ backgroundColor: "#272315" }}>
        <div className="flex items-center gap-x-4">
          <div className="w-full  gap-x-10 hidden md:flex rounded-xl">
            <div className="items-center flex gap-x-2 hover:cursor-pointer pusd-section" onClick={handleAddToken}>
              <Image src={pusdbtc} alt="logo" width={40} onClick={handleAddToken} />
              <div>
                <h1 className="text-white title-text2 text-sm">PUSD</h1>
                <h1 className="text-sm text-gray-400 title-text2 whitespace-nowrap -ml-1">
                  $ 1.00
                </h1>
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
            {address && userExists && (
              <>
                <div className=" flex flex-col gap-x-2">
                  <h2 className="text-white text-xs title-text2">
                    System Collateral Ratio
                  </h2>
                  <h3 className="text-gray-400 title-text2 text-sm">
                    {(systemCollRatio * 100).toFixed(2)} %
                  </h3>
                </div>
                <div className=" flex flex-col gap-x-2">
                  <h2 className="text-white text-xs title-text2">Recovery Mode</h2>
                  <h3 className="text-gray-400 title-text2 text-sm">
                    {isRecoveryMode ? "Yes" : "No"}
                  </h3>
                </div>
              </>
            )}
          </div>
        </div>
        <CustomConnectButton className="" />
      </div>
    </>
  );
}

export default NavBar;
