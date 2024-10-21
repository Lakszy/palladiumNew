import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Toast } from "primereact/toast";
import ORE from "../app/assets/images/ORE.png";
import earthBTC from "../app/assets/images/earthBTC.png";
import FaucetAbi from "./FaucetAbi.sol.json";
import { EVMConnect } from "../app/src/config/EVMConnect";
import { useWalletClient, useWriteContract } from "wagmi";
import MobileNav from "./MobileNav";
import { ethers } from "ethers";
import "./navbar.css";
import { BOTANIX_RPC_URL } from "@/app/src/constants/botanixRpcUrl";

function NavBar() {
  const [fetchedPriceBTC, setFetchedPriceBTC] = useState(0);
  const { data: isConnected } = useWalletClient();
  const { data: hash, writeContract, error: writeError } = useWriteContract()
  const [fetchedPriceORE, setFetchedPriceORE] = useState(0);
  const toast = useRef<Toast>(null);
  const { data: walletClient } = useWalletClient();


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
    if (!walletClient) {
      console.error("Wallet not connected");
      return;
    }
    try {
      await writeContract({
        abi: FaucetAbi,
        address: "0xDf2Fe2159e9801B3C520665a8a5039705927b360",
        functionName: "claimTokens",
      });
    } catch (error) {
      console.error("Error claiming tokens:", error);
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
              <button
                className="earthBTC-faucet-button rounded-3xl text-black title-text bg-gradient-to-r from-[#88e273] via-[#9cd685] to-[#b5f2a4] hover:from-[#6ab95b] hover:via-[#82c16a] hover:to-[#9cd685] font-bold py-2 px-4"
                onClick={handleClaimTokens}
              >
                Claim earthBTC
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
        <EVMConnect className="" />
      </div>

    </>
  );
}

export default NavBar;
