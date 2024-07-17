"use client"

import React from "react";
import { usePathname } from 'next/navigation';
import { RiBillLine } from "react-icons/ri";
import Link from "next/link";
import { GrTransaction } from "react-icons/gr";
import { LiaHandHoldingUsdSolid } from "react-icons/lia";
import { GiUnbalanced } from "react-icons/gi";
import { RiCoinsLine } from "react-icons/ri";
import { LayoutGrid } from "lucide-react";
import Image from "next/image";
import logo from "../app/assets/images/newpalladium.svg";
import zeally from "../app/assets/images/zeally.svg";
import tweet from "../app/assets/images/tweet.svg";
import discord from "../app/assets/images/discord.svg";
import medium from "../app/assets/images/medium.svg";

import "../app/App.css";

export const TabsDemo = () => {
  const pathname = usePathname();

  const isRoute = (route: string) => {
    return pathname === route;
  };

  return (
    <div className={`sidebar hidden md:grid font-mono font-extrabold  w-72  h-screen grid-rows-[max-content_fr_max-content] 2c2819 text-white `} style={{ backgroundColor: "#2c2819" }}>
      <div className="flex items-center gap-x-1 justify-center">
        <Link href="/">
          <Image src={logo} alt="Logo" className="mr-12 -mt-3 w-40" />
        </Link>
      </div>
      <nav className="flex flex-col gap-y-2 px-4">
        <Link href="/">
          <div className={` hover:scale-95 cursor-pointer text-xl menu flex min-w-[200px] items-center gap-x-3 rounded-lg p-2 ${isRoute("/") ? "bg-yellow-400 text-black" : "text-gray-500"}`}>
            <div className={`cursor-pointer menu flex items-center gap-x-3 rounded-full p-2 ${isRoute("/") ? "text-black" : " text-white"}`}>
              {React.createElement(LayoutGrid, { size: 18 })}
            </div>
            <span className="font-medium text-lg body-text">Dashboard</span>
          </div>
        </Link>
        <Link href="/portfolio">
          <div className={`cursor-pointer  hover:scale-95 text-xl menu flex min-w-[200px] items-center gap-x-3 rounded-lg p-2 ${isRoute("/portfolio") ? "bg-yellow-400 text-black" : "text-gray-500"}`}>
            <div className={`cursor-pointer menu flex items-center gap-x-3 rounded-full p-2 ${isRoute("/portfolio") ? "text-black" : " text-white"}`}>
              {React.createElement(RiCoinsLine, { size: 18 })}
            </div>
            <span className="font-medium text-lg body-text">Portfolio</span>
          </div>
        </Link>
        <Link href="/trove">
          <div className={`cursor-pointer  hover:scale-95 text-xl menu flex min-w-[200px] items-center gap-x-3 rounded-lg p-2 ${isRoute("/trove") ? "bg-yellow-400 text-black" : "text-gray-500"}`}>
            <div className={`cursor-pointer menu flex items-center gap-x-3 rounded-full p-2 ${isRoute("/trove") ? "text-black" : " text-white"}`}>
              {React.createElement(GrTransaction, { size: 18 })}
            </div>
            <span className="font-medium text-lg body-text">Mint PUSD</span>
          </div>
        </Link>
        <Link href="/stake">
          <div className={`cursor-pointer  hover:scale-95 text-xl menu flex min-w-[200px] items-center gap-x-3 rounded-lg p-2 ${isRoute("/stake") ? "bg-yellow-400 text-black" : "text-gray-500"}`}>
            <div className={`cursor-pointer menu flex items-center gap-x-3 rounded-full p-2 ${isRoute("/stake") ? "text-black" : " text-white"}`}>
              {React.createElement(GiUnbalanced, { size: 18 })}
            </div>
            <span className="font-medium text-lg body-text">Stake PUSD</span>
          </div>
        </Link>
        <Link href="/redeem">
          <div className={`cursor-pointer  hover:scale-95 text-xl menu flex min-w-[200px] items-center gap-x-3 rounded-lg p-2 ${isRoute("/redeem") ? "bg-yellow-400 text-black" : "text-gray-500"}`}>
            <div className={`cursor-pointer menu flex items-center gap-x-3 rounded-full p-2 ${isRoute("/redeem") ? "text-black" : " text-white"}`}>
              {React.createElement(LiaHandHoldingUsdSolid, { size: 18 })}
            </div>
            <span className="font-medium text-lg body-text">Redeem PUSD</span>
          </div>
        </Link>
      </nav>
      <div className="space-y-1  -mt-6">
        <div className="ml-6 w-fit h-fit">
          <Link href="https://zealy.io/cw/palladiumlabs/questboard">
            <Image src={zeally} alt="zeally" className="w-[227px] h-[100px]" />
          </Link>
        </div>
        <div className="flex items-center justify-center text-white gap-x-7 text-[19px] -mt-10">
          <Link href="https://twitter.com/PalladiumLabs">  <Image className="hover:scale-105"  src={tweet} alt="twitter" /></Link>
          <Link href="https://discord.com/invite/9MMEyJ4JDz">  <Image className="hover:scale-105"  src={discord} alt="twitter" /></Link>
          <Link href="https://medium.com/palladium-labs">  <Image  className="hover:scale-105" src={medium} alt="twitter" /></Link>
        </div>
      </div>
    </div>
  );
};
