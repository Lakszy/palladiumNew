import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import pusdbtc from "../app/assets/images/PUSD.svg";
import btc from "../app/assets/images/btclive.svg";
import { Toast } from "primereact/toast";
import { useAccount, useWalletClient } from "wagmi";
import { EVMConnect } from "./EVMConnect";
import MobileNav from "./MobileNav";
import "./navbar.css";

function NavBar() {
  const [fetchedPrice, setFetchedPrice] = useState(0);
  const [fetchedPriceBTC, setFetchedPriceBTC] = useState(0);
  const { address } = useAccount();
  const [userExists, setUserExists] = useState(false);
  const toast = useRef<Toast>(null);
  const { data: walletClient } = useWalletClient();

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
        const response = await fetch("https://api.palladiumlabs.org/core/protocol/metrics");
        const data = await response.json();
        const protocolMetrics = data[0].metrics[1]; // WCORE metrics
        const protocolMetricsBTC = data[0].metrics[0]; // wBTC metrics
        setFetchedPriceBTC(protocolMetricsBTC.price);
        setFetchedPrice(protocolMetrics.price);
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
      }).then((success: any) => {
        if (success) {
          showSuccess(`${tokenSymbol} token added to MetaMask!`);
        }
      }).catch((error: any) => {
        console.error(`Error adding ${tokenSymbol} token:`, error);
      });
    }
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
              onClick={() => handleAddToken("0xB6FfD3e71358C69e7A17f8FD5a53E2EACB0a0C56", "PUSD", 18)}>
              <Image src={pusdbtc} alt="PUSD" width={40} />
              <div>
                <h1 className="text-white title-text2 text-sm">PUSD</h1>
                <h1 className="text-sm text-gray-400 title-text2 whitespace-nowrap -ml-1">$ 1.00</h1>
                <span className="popup body-text text-xs">Click to import PUSD</span>
              </div>
            </div>
            <div className="items-center hovertext-addtoken flex gap-x-2 hover:cursor-pointer pusd-section"
              onMouseEnter={(e) => e.currentTarget.querySelector('.popup')?.classList.add('visible')}
              onMouseLeave={(e) => e.currentTarget.querySelector('.popup')?.classList.remove('visible')}
              onClick={() => handleAddToken("0x5FB4E66C918f155a42d4551e871AD3b70c52275d", "WCORE", 18)}>
              <Image src={btc} alt="WCORE" width={40} />
              <div>
                <h1 className="text-white title-text2 text-sm">WCORE</h1>
                <h1 className="text-gray-400 text-sm title-text2">${Number(fetchedPrice).toFixed(2)}</h1>
                <span className="popup body-text text-xs">Click to import WCORE</span>
              </div>
            </div>
            <div className="items-center hovertext-addtoken flex gap-x-2 hover:cursor-pointer pusd-section"
              onMouseEnter={(e) => e.currentTarget.querySelector('.popup')?.classList.add('visible')}
              onMouseLeave={(e) => e.currentTarget.querySelector('.popup')?.classList.remove('visible')}
              onClick={() => handleAddToken("0x4CE937EBAD7ff419ec291dE9b7BEc227e191883f", "wBTC", 18)}>
              <Image src={btc} alt="wBTC" width={40} />
              <div>
                <h1 className="text-white title-text2 text-sm">WBTC</h1>
                <h1 className="text-gray-400 text-sm title-text2">${Number(fetchedPriceBTC).toFixed(2)}</h1>
                <span className="popup body-text text-xs">Click to import WBTC</span>
              </div>
            </div>
          </div>
        </div>
        <EVMConnect className="" />
      </div>
    </>
  );
}

export default NavBar;
