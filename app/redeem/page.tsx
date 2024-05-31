"use client";
import React from "react";
import { TabsDemo } from "@/components/sidebar";
import NavBar from "@/components/navbar";
import Redeem from "./index"
import "../App.css"

export default function Home() {
  return (
    <div className="md:grid md:h-screen mainT w-full grid-cols-[max-content_1fr] overflow text-white">
      <TabsDemo />
      <div className="body text-black  overflow-y-scroll ">
        <div className="sticky z-50 mainT top-0  overflow-auto">
          <NavBar />
        </div>

        <div className="md:h-screen " style={{ backgroundColor: '#272315' }}>
          <div className="text-center">
            <h1 className="text-2xl  md:w-full w-[24rem] pt-12 font-semibold text-yellow-300 title-text">Exchange 1 PUSD For $1 Worth Of BTC</h1>
          </div>
          <div className="flex md:flex-row flex-col mt-12 md:mt-28 justify-between">
            <Redeem />
            <div className="md:-mt-7 w-1/2 p-6">
              <h1 className="text-lg font-semibold whitespace-nowrap font-sans text-yellow-300 title-text">About Redemptions</h1>
              <div className="text-gray-400 w-72 md:w-full text-sm body-text leading-normal mt-2">
                Redemptions are one of Palladium’s most unique and important title-text protocol features. The redemption mechanism gives PUSD holders the ability to redeem the underlying BTC collateral at face value at any time.
                <span className="mt-10 block body-text">
                  Redemptions pay off debt of lowest collateral vaults, in return for their collateral.
                </span>
                <span className="mt-10 block body-text">
                  IMPORTANT: Redemptions are not the same as paying back your debt. To repay your loan, adjust your Trove on the Repay tab of the Borrow PUSD page
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}