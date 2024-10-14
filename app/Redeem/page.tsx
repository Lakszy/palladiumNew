"use client";
import React from "react";
import { TabsDemo } from "@/components/sidebar";
import NavBar from "@/components/navbar";
import Redeem from "."
import "../App.css"

export default function Home() {
  return (
    <div className="md:grid md:h-screen mainT w-full grid-cols-[max-content_1fr] overflow text-white">
      <TabsDemo />
      <div className="body text-black  overflow-y-scroll ">
        <div className="sticky z-50 mainT top-0  overflow-auto">
          <NavBar />
        </div>

        <div className="md:h-screen " style={{ backgroundColor: 'black' }}>
          <div className="text-center">
            <h1 className="text-2xl  md:w-full w-[24rem] pt-12 font-medium text-white title-text2">Exchange 1 ORE For $1 Worth Of Collateral Asset</h1>
          </div>
          <div className="flex md:flex-row flex-col mt-12 md:mt-28 justify-between">
            <Redeem />
            <div className="md:-mt-7 w-[40%] p-6 mr-16">
              <h1 className="text-lg font-semibold whitespace-nowrap font-sans text-[#88e273] title-text2">About Redemptions</h1>
              <div className="text-gray-400 w-72 md:w-full text-sm body-text leading-normal">
                Redemptions are one of EarthFi’s most unique and important title-text protocol features. The redemption mechanism gives ORE holders the ability to redeem the underlying collateral at face value at any time.
                <span className="mt-5 block body-text">
                  Redemptions pay off debt of lowest collateral vaults, in return for their collateral.
                </span>
                <span className="mt-5 block body-text">
                  IMPORTANT: Redemptions are not the same as paying back your debt. To repay your loan, adjust your vessel on the Repay tab of the Borrow ORE page
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}