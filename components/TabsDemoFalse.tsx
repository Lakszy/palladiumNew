"use client";
import React, { useState, useEffect } from "react";
import { MdOutlineInventory2 } from "react-icons/md";
import { BiDollar } from "react-icons/bi";
import { RiBillLine } from "react-icons/ri";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import Image from "next/image";
import logo from "../app/assets/images/newpalladium.svg";
import zeally from "../app/assets/images/zeally.svg";
import tweet from "../app/assets/images/tweet.svg";
import discord from "../app/assets/images/discord.svg";
import medium from "../app/assets/images/medium.svg";
import { useAccount } from "wagmi";

import "../app/App.css";

export const TabsDemoFalse = () => {
  const { address } = useAccount();
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [userExists, setUserExists] = useState(false);

  //   useEffect(() => {
  //     fetch(`https://api.palladiumlabs.org/users/testnetWhitelist/${address}`)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setUserExists(data.userExists);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching data:", error);
  //       });
  //   }, []);
  //   console.log("userExist", userExists);
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
    {
      id: "Portfolio",
      icon: MdOutlineInventory2,
      title: "Portfolio",
      link: "/Portfolio",
    },
    { id: "Borrow", icon: RiBillLine, title: "Mint PUSD", link: "/borrow" },
    { id: "Stake-pusd", icon: BiDollar, title: "Stake PUSD", link: "stake" },
    { id: "Redeem", icon: RiBillLine, title: "Redeem PUSD", link: "redeem" },
  ];

  return (
    <div
      className={`sidebar notMobileDevice font-mono font-extrabold  w-72 grid h-screen grid-rows-[max-content_fr_max-content] 2c2819 text-white `}
      style={{ backgroundColor: "#2c2819" }}
    >
      <div className="flex items-center gap-x-1 justify-center">
        <Link href="/">
          <Image src={logo} alt="Logo" className="mr-10 w-56" />
        </Link>
      </div>
      <nav className="flex flex-col gap-y-2 px-4">
        {/* {menuItems.map((menuItem) => (
          <Link legacyBehavior key={menuItem.id} href={menuItem.link}>
            <a
              className={`cursor-pointer text-xl menu flex min-w-[200px] items-center gap-x-3 rounded-lg p-2  ${
                !userExists ? "opacity-50 cursor-not-allowed" : ""
              } // Conditionally apply disabled styles ${
                isMenuSelected(menuItem.id)
                  ? "bg-yellow-400 text-black"
                  : "text-gray-500"
              }`}
              // onClick={() => handleMenuClick(menuItem.id)}
              onClick={() => {
                if (!userExists) return; // Prevent click if menu is disabled
                handleMenuClick(menuItem.id);
              }}
            >
              <div
                className={`cursor-pointer menu flex items-center gap-x-3 rounded-full p-2 ${
                  isMenuSelected(menuItem.id) ? "text-black" : " text-white"
                }`}
              >
                {React.createElement(menuItem.icon, { size: 22 })}
              </div>
              <span className="font-medium body-text">{menuItem.title}</span>
            </a>
          </Link>
          // ${!userExists ? "opacity-50 cursor-not-allowed" : ""}
        ))} */}
        {menuItems.map((menuItem) => (
          //   <Link key={menuItem.id} href={menuItem.link}>
          <div
            key={menuItem.id}
            className={`opacity-50 cursor-not-allowed text-xl menu flex min-w-[200px] items-center gap-x-3 rounded-lg p-2
        
        ${
          isMenuSelected(menuItem.id)
            ? "bg-yellow-400 text-black"
            : "text-gray-500"
        }
      `}
            onClick={() => {
              console.log("clicked1");
              if (!userExists) return; // Prevent click if menu is disabled
              handleMenuClick(menuItem.id);
              console.log("clicked2");
            }}
          >
            <div
              className={`menu flex items-center gap-x-3 rounded-full p-2
          ${isMenuSelected(menuItem.id) ? "text-black" : "text-white"}
        `}
            >
              {React.createElement(menuItem.icon, { size: 22 })}
              <span className="font-medium body-text">{menuItem.title}</span>
            </div>
          </div>
          //   </Link>
        ))}
      </nav>
      <div className="space-y-1">
        <div className="ml-6 w-fit h-fit">
          <Link href="https://zealy.io/cw/palladiumlabs/questboard">
            <Image src={zeally} alt="zeally" className="w-[227px] h-[100px]" />
          </Link>
        </div>
        <div className="flex items-center justify-center text-white gap-x-7 text-[19px] -mt-10">
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
  );
};
