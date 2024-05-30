"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import pusdbtc from "../app/assets/images/PUSD.svg";
import btc from "../app/assets/images/btclive.svg";
import { CustomConnectButton } from "./connectBtn";
import "../app/App.css";
import { useAccount } from "wagmi";
import MobileNavFalse from "./MobileNavFalse";

function NavBar() {
  const [fetchedPrice, setFetchedPrice] = useState(0);
  const [systemCollRatio, setSystemCollRatio] = useState(0);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const { address } = useAccount();
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    fetch(`https://api.palladiumlabs.org/users/testnetWhitelist/${address}`)
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
          "https://api.palladiumlabs.org/protocol/metrics"
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
  return (
    <>
      <div className="md:flex border-2 hidde w-full  border-gray-100 h-28  border-opacity-10 items-center justify-between gap-x-4 border-l px-4 py-4 z-50" style={{ backgroundColor: "#272315" }}>
      <div className="flex items-center gap-x-4">
        <div className="w-full  flex gap-x-10  notMobileDevice rounded-xl">
          <div className="items-center flex gap-x-2">
            <Image src={pusdbtc} alt="btc" width={40} />
            <div>
              <h1 className="text-white title-text text-sm">PUSD</h1>
              <h1 className="text-sm text-gray-400 title-text whitespace-nowrap -ml-1">
                $ 1.00
              </h1>
            </div>
          </div>
          <div className="items-center flex gap-x-2">
            <Image src={btc} alt="btc" width={40} />
            <div>
              <h1 className="text-white title-text text-sm ">BTC</h1>
              <h1 className="text-gray-400 text-sm title-text ">
                ${Number(fetchedPrice).toFixed(2)}
              </h1>
            </div>
          </div>
          {address && userExists && (
            <>
              <div className="items-ceneter flex flex-col gap-x-2">
                <h2 className="text-white text-xs title-text">
                  System Collateral Ratio
                </h2>
                <h3 className="text-gray-400 title-text text-sm">
                  {(systemCollRatio * 100).toFixed(2)} %
                </h3>
              </div>
              <div className="items-ceneter flex flex-col gap-x-2">
                <h2 className="text-white text-xs title-text">Recovery Mode</h2>
                <h3 className="text-gray-400 title-text text-sm">
                  {isRecoveryMode ? "Yes" : "No"}
                  {}
                </h3>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center gap-x-4">
        <div className="mobileDevice ">
          {/* {userExists ? <MobileNav /> : <MobileNavFalse />} */}
          {userExists ? <MobileNavFalse /> : <MobileNavFalse />}
        </div>
        <CustomConnectButton className="" />
      </div>
  </div>
  </>
  );
}

export default NavBar;
