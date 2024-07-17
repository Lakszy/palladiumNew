"use client";
import React, { useState } from "react";
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

export const TabsDemoFalse = () => {
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [userExists, setUserExists] = useState(false);
  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);
  };

  const isMenuSelected = (menu: string) => {
    return selectedMenu === menu;
  };

  const menuItems = [
    { id: "Dashboard", icon: LayoutGrid, title: "Dashboard", link: "/" },
    { id: "portfolio", icon: RiCoinsLine, title: "Portfolio", link: "/portfolio", },
    { id: "trove", icon: GrTransaction, title: "Mint PUSD", link: "/trove" },
    { id: "stake", icon: GiUnbalanced, title: "Stake PUSD", link: "/stake" },
    { id: "redeem", icon: LiaHandHoldingUsdSolid, title: "Redeem PUSD", link: "/redeem" },
  ];

  return (
    <div
      className={`sidebar hidden md:grid font-mono font-extrabold  w-72 h-screen grid-rows-[max-content_fr_max-content] 2c2819 text-white `}
      style={{ backgroundColor: "#2c2819" }}
    >
      <div className="flex items-center gap-x-1 justify-center">
        <Link href="/">
          <Image src={logo} alt="Logo" className="mr-10 w-40" />
        </Link>
      </div>
      <nav className="flex flex-col gap-y-2 px-4">
        {menuItems.map((menuItem) => (
          <div
            key={menuItem.id}
            className={`opacity-50 cursor-not-allowed text-xl menu flex min-w-[200px] items-center gap-x-3 rounded-lg p-2
${isMenuSelected(menuItem.id) ? "bg-yellow-400 text-black" : "text-gray-500"}`} onClick={() => { if (!userExists) return; handleMenuClick(menuItem.id); }}>
            <div
              className={`menu flex items-center gap-x-3 rounded-full p-2
          ${isMenuSelected(menuItem.id) ? "text-black" : "text-white"} `} >
              {React.createElement(menuItem.icon, { size: 22 })}
              <span className="font-medium body-text">{menuItem.title}</span>
            </div>
          </div>
        ))}
      </nav>
      <div className="space-y-1 -mt-7">
        <div className="ml-6 w-fit h-fit">
          <Link href="https://zealy.io/cw/palladiumlabs/questboard">
            <Image src={zeally} alt="zeally" className="w-[227px] h-[100px]" />
          </Link>
        </div>
        <div className="flex items-center justify-center text-white gap-x-7 text-[19px]">
          <Link href="https://twitter.com/PalladiumLabs">  <Image src={tweet} alt="twitter" />  </Link>
          <Link href="https://discord.com/invite/9MMEyJ4JDz"><Image src={discord} alt="twitter" />  </Link>
          <Link href="https://medium.com/palladium-labs">   <Image src={medium} alt="twitter" /> </Link>
        </div>
      </div>
    </div>
  );
};
