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
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import "../app/App.css";

export default function MobileNavFalse() {
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);

  const [visible, setVisible] = useState<boolean>(false);
  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);
  };

  const isMenuSelected = (menu: string) => {
    return selectedMenu === menu;
  };

  interface MenuItem {
    id: string;
    icon: React.ElementType;
    title: string;
    link: string;
  }

  const menuItems: MenuItem[] = [
    { id: "Dashboard", icon: LayoutGrid, title: "Dashboard", link: "/" },
    {  id: "Portfolio",  icon: RiCoinsLine,  title: "Portfolio",  link: "portfolio",},
    { id: "Borrow", icon: GrTransaction, title: "Mint PUSD", link: "Borrow" },
    { id: "Stake-pusd", icon: GiUnbalanced, title: "Stake PUSD", link: "Stake" },
    { id: "Redeem", icon: LiaHandHoldingUsdSolid, title: "Redeem PUSD", link: "Redeem" },
  ];
  return (
    <div className="w-12 h-12 title-text flex">
      <Sidebar visible={visible} onHide={() => setVisible(false)}>
        <div
          className={`sidebar bg-red-90 h-full font-mono font-extrabold  w-full grid-rows-[max-content_fr_max-content] text-white`}
          style={{ backgroundColor: "#2c2819" }}
        >
          <div className="flex items-center gap-x-1  justify-center">
            <Link href="/">
              <Image src={logo} alt="Logo" className="mr- -mt-10 mb-3 w-40" />
            </Link>
          </div>
          <nav className="flex flex-col gap-y-2 px-4">
            {menuItems.map((menuItem) => (
              // <Link legacyBehavior key={menuItem.id} href={menuItem.link}>
              <a
                key={menuItem.id}
                className={`opacity-50 cursor-not-allowed  text-xl menu flex min-w-[200px] items-center gap-x-3 rounded-lg p-2 ${
                  isMenuSelected(menuItem.id)
                    ? "text-gray-500"
                    : "text-gray-500"
                }`}
                onClick={() => handleMenuClick(menuItem.id)}
              >
                <div
                  className={`cursor-not-allowed  menu flex items-center gap-x-3 rounded-full p-2 ${
                    isMenuSelected(menuItem.id) ? "text-black" : " text-white"
                  }`}
                >
                  {React.createElement(menuItem.icon, { size: 22 })}
                </div>
                <span className="font-medium body-text">{menuItem.title}</span>
              </a>
              // </Link>
            ))}
          </nav>
          <div className="space-y-1 pt-16">
            <div className=" w-full h-full">
              <Link href="https://zealy.io/cw/palladiumlabs/questboard">
                <Image
                  src={zeally}
                  alt="zeally"
                  className="w-[297px] h-[100px]"
                />
              </Link>
            </div>
            <div className="flex items-center w-full  justify-around text-white gap-x-7 text-[19px] -mt-10">
              <Link href="https://twitter.com/PalladiumLabs">
                <Image src={tweet} alt="twitter" />
              </Link>

              <Link href="https://discord.com/invite/9MMEyJ4JDz">
                <Image src={discord} alt="twitter" />
              </Link>

              <Link href="https://medium.com/palladium-labs">
                <Image src={medium} alt="twitter" />
              </Link>
            </div>
          </div>
        </div>
      </Sidebar>
      <Button
        className="title-text font-bold"
        icon="pi pi-bars z-10"
        onClick={() => setVisible(true)}
      />
    </div>
  );
}
