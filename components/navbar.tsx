"use client"

import React, { useEffect, useState } from "react";
import Image from "next/image";
import pusdbtc from "../app/assets/images/PUSD.svg"
import priceFeedAbi from "../app/src/constants/abi/PriceFeedTestnet.sol.json";
import Decimal from "decimal.js";
import botanixTestnet from "../app/src/constants/botanixTestnet.json";
import { ethers } from "ethers";
import btc from "../app/assets/images/btclive.svg"
import { CustomConnectButton } from "./connectBtn";
import web3 from "web3";
import { getContract } from "@/app/src/utils/getContract";
import { BOTANIX_RPC_URL } from "@/app/src/constants/botanixRpcUrl";
import "../app/App.css"
import MobileNav from "./MobileNav";

function NavBar() {
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchedPrice, setFetchedPrice] = useState("0");

  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);

  const priceFeedContract = getContract(
    botanixTestnet.addresses.priceFeed,
    priceFeedAbi,
    provider
  );

  const { toBigInt } = web3.utils;


  useEffect(() => {
    const fetchPrice = async () => {
      const pow = Decimal.pow(10, 18);
      const _1e18 = toBigInt(pow.toFixed());
      try {
        const fetchPrice: bigint = await priceFeedContract.getPrice();

        const fetchPriceDecimal = new Decimal(fetchPrice.toString());
        const fetchPriceFormatted = fetchPriceDecimal
          .div(_1e18.toString())
          .toString();
        setFetchedPrice(fetchPriceFormatted);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchPrice();

    const intervalId = setInterval(fetchPrice, 50000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="md:flex border-2 hidde w-full  border-gray-100 h-28  border-opacity-10 items-center justify-between gap-x-4 border-l px-4 py-4 z-50" style={{ backgroundColor: "#272315" }}>
      <div className="flex items-center gap-x-4">
        <div className="w-full flex gap-x-10  notMobileDevice rounded-xl">
          <div className="items-center flex gap-x-2">
            <Image src={pusdbtc} alt="btc" width={40} />
            <div>
              <h1 className="text-white body-text -ml-1">PUSD</h1>
              <h1 className="text-gray-400 text-bold body-text -ml-1">$ 1</h1>
            </div>
          </div>
          <div className="items-center flex gap-x-2">
            <Image src={btc} alt="btc" width={40} />
            <div>
              <h1 className="text-white body-text -ml-1">BTC</h1>
              <h1 className="body-text text-gray-400">${fetchedPrice}</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center gap-x-4">
      <div className="mobileDevice ">
        <MobileNav/>
      </div>
        <CustomConnectButton />
      </div>
    </div>
  );
}
export default NavBar

