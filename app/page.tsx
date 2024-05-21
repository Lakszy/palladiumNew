"use client";
import React, { useState, useEffect } from "react";
import { TabsDemo } from "@/components/sidebar";
import { CardDemo } from "@/components/cards";
import NavBar from "@/components/navbar";
import { TabsDemoFalse } from "@/components/TabsDemoFalse";
import { useAccount } from "wagmi";
import ConnectWalletDefault from "@/components/ConnectWalletDefault";
import NotMinted from "@/components/NotMinted";
import FullScreenLoader from "@/components/FullScreenLoader";

export default function Home() {
  const { address } = useAccount();
  const [userExists, setUserExists] = useState(false);
  const [afterLoad, setAfterload] = useState(false);

  useEffect(() => {
    if (address) {
      setAfterload(true)
      fetch(`https://api.palladiumlabs.org/users/testnetWhitelist/${address}`).then((response) => response.json()).then((data) => {
        setUserExists(data.userExists);
        setAfterload(false)
      })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [address]);

  return (
    <>
      {
        afterLoad ? (
          <FullScreenLoader />
        ) : (
          <div className="grid h-screen font-mono font-extrabold mainT w-full sm:grid-cols-[max-content_1fr] overflow text-white">
            {userExists ? <TabsDemo /> : <TabsDemoFalse />}
            <div className="body text-black  overflow-y-scroll ">
              <div className="sticky z-50 mainT top-0  overflow-auto">
                <NavBar />
              </div>
              <div className=" w-full " style={{ backgroundColor: "#272315" }}>
                {address ? (
                  userExists ? (
                    <CardDemo userExists={userExists} />
                  ) : (
                    <NotMinted />
                  )
                ) : (<ConnectWalletDefault />)}
              </div>
            </div>
          </div>
        )
      }
    </>
  );
}
