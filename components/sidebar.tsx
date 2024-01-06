"use client";
import React, { useState } from "react";
import { GoGraph } from "react-icons/go";
import { MdOutlineInventory2 } from "react-icons/md";
import { TbPhoto } from "react-icons/tb";
import { BiDollar } from "react-icons/bi";
import { RiBillLine } from "react-icons/ri";
import { RiLogoutBoxLine } from "react-icons/ri";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import Image from "next/image";
import gift from "../app/assets/images/svgviewer-output (2).svg"

interface TabsDemoProps {
  className?: string;
}

export const TabsDemo: React.FC<TabsDemoProps> = ({ className, ...props }) => {
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);

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
    { id: "Summary", icon: LayoutGrid, title: "Overview", link: "" },
    { id: "Inventory", icon: MdOutlineInventory2, title: "Patient Profile", link: "patient-profile" },
    { id: "Estimate", icon: BiDollar, title: "Patients Details", link: "patientsdetails" },
    { id: "Billing", icon: RiBillLine, title: "Detailed Overview", link: "detailedOverview" },
    { id: "Finance", icon: GoGraph, title: "Appointment", link: "appointment" },
    { id: "Photos", icon: TbPhoto, title: "Payment", link: "payment" },
  ];

  return (
    <div className={`sidebar w-72 grid h-full grid-rows-[max-content_fr_max-content] bg-gray-800 text-white ${className}`}>
      <div className="flex items-center gap-x-1 justify-center">
        <div className="bg-white rounded-full w-10 h-10"></div>
        <div className="logo flex h-20 items-center justify-center">
          <Link href="/">
            <h1 className="text-2xl font-extrabold">Company Name</h1>
          </Link>
        </div>
      </div>
      <nav className="flex flex-col gap-y-2 px-4">
        {menuItems.map((menuItem) => (
          <Link legacyBehavior key={menuItem.id} href={menuItem.link}>
            <a
              className={`cursor-pointer menu flex min-w-[200px] items-center gap-x-3 rounded-lg p-2 ${isMenuSelected(menuItem.id) ? "bg-white text-black" : " text-white"
                }`}
              onClick={() => handleMenuClick(menuItem.id)}
            >
              <div className={`cursor-pointer menu flex items-center gap-x-3 rounded-full p-2 ${isMenuSelected(menuItem.id) ? "bg-white text-black" : " text-white"
                }`}>
                {React.createElement(menuItem.icon, { size: 22 })}
              </div>
              <span className="font-medium">{menuItem.title}</span>
            </a>
          </Link>
        ))}
      </nav>
      <div className="w-[217px] h-[198px] relative mt-16 ml-7 bg-neutral-600 rounded-[18px] border border-white">
        <div className="p-2.5 left-[46px] top-[-65px] absolute flex-col justify-start items-start gap-2.5 inline-flex">
          <Image className="w-[142px] h-[136px]" src={gift} alt="gift" />
        </div>
        <div className="left-[12px] top-[80px] absolute flex-col justify-start items-center gap-5 inline-flex">
          <div className="flex-col justify-start items-center gap-2 flex">
            <div className="text-white text-base font-bold  leading-7">Unlock winters gift</div>
            <div className="text-white text-opacity-70 text-xs font-medium leading-7">Subscribe and get our special gift</div>
            <div className="justify-start items-center gap-1 inline-flex">
            </div>
            {/* <h1>Logout</h1> */}
          </div>
        </div>
      </div>
        <div className="flex items-center justify-center text-white text-[19px] mt-2">
          <RiLogoutBoxLine/>
          <h1>Logout</h1>
        </div>
    </div>
  );
};