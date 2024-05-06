"use client";
import React, { useState, useEffect } from "react";
import { TabsDemo } from "@/components/sidebar";
import { CardDemo } from "@/components/cards";
import NavBar from "@/components/navbar";
import { useAccount } from "wagmi";

export default function Home() {
  const { address } = useAccount();
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    fetch(`https://api.palladiumlabs.org/users/testnetWhitelist/${address}`)
      .then(response => response.json())
      .then(data => {
        setUserExists(data.userExists);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="grid h-screen font-mono font-extrabold mainT w-full grid-cols-[max-content_1fr] overflow text-white">
      <TabsDemo />
      <div className="body text-black  overflow-y-scroll ">
        <div className="sticky z-50 mainT top-0  overflow-auto">
          <NavBar />
        </div>
        <div className=" w-full">
          {userExists ? (
            <CardDemo userExists={userExists} />
          ) : (
            <p>Sorry, you do not have private access to Palladium testnet
              {userExists}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}