"use client";
import React from "react";
import { TabsDemo } from "@/components/sidebar";
import NavBar from "@/components/navbar";
import Redeem from "../Redeem/index"

export default function Home() {
  return (
    <div className="grid h-screen mainT w-full grid-cols-[max-content_1fr] overflow text-white">
      <TabsDemo />
      <div className="body text-black  overflow-y-scroll ">
        <div className="sticky z-50 mainT top-0  overflow-auto">
          <NavBar />
        </div>

        <div className="h-screen" style={{ backgroundColor: '#272315' }}>
          <div className="text-center">
            <h1 className="text-4xl pt-20 font-semibold font-sans text-yellow-300">Exchange 1 PUSD For $1 Worth Of BTC</h1>
          </div>
          <div className="flex mt-40 gap-x-10">
            <Redeem />
            <div className="w-1/2 mr-10 -mt-10">
              <h1 className="text-3xl font-semibold font-sans text-yellow-300">About Redemptions</h1>
              <h3 className="text-gray-400 text-xl whitespace-normal leading-normal mt-2">
                Redemptions are one of Palladium’s most unique and important protocol features. The redemption mechanism gives PUSD holders the ability to redeem the underlying BTC collateral at face value at any time.
                <span className="mt-2 block">
                  Redemptions pay off debt of lowest collateral vaults, in return for their collateral.
                </span>
                <span className="mt-2 block">
                  IMPORTANT: Redemptions are not the same as paying back your debt. To repay your loan, adjust your Trove on the Repay tab of the Borrow PUSD page
                </span>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}