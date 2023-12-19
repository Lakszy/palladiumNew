"use client";
import React, { useState } from "react";
import { GoGraph } from "react-icons/go";
import { MdOutlineInventory2 } from "react-icons/md";
import { TbPhoto } from "react-icons/tb";
import { BiDollar } from "react-icons/bi";
import { RiBillLine } from "react-icons/ri";
import { RiLogoutBoxLine } from "react-icons/ri";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { LayoutGrid } from "lucide-react";

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
  }

  const menuItems: MenuItem[] = [
    { id: "Summary", icon: LayoutGrid , title: "Overview" },
    { id: "Inventory", icon: MdOutlineInventory2, title: "Messages" },
    { id: "Estimate", icon: BiDollar, title: "Patients" },
    { id: "Billing", icon: RiBillLine, title: "Billing" },
    { id: "Finance", icon: GoGraph, title: "Appointment" },
    { id: "Photos", icon: TbPhoto, title: "Payment" },
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
      <nav className="flex flex-col gap-y-4 px-4">
        {menuItems.map((menuItem) => (
          <div
            key={menuItem.id}
            className={`cursor-pointer menu flex min-w-[200px] items-center gap-x-3 rounded-full p-2 ${
              isMenuSelected(menuItem.id) ? "bg-white text-black" : " text-white"
            }`}
            onClick={() => handleMenuClick(menuItem.id)}
          >
            <div
              key={menuItem.id}
              className={`cursor-pointer menu flex items-center gap-x-3 rounded-full p-2 ${
                isMenuSelected(menuItem.id) ? "bg-white text-black" : " text-white"
              }`}
              >
              {React.createElement(menuItem.icon, { size: 22 })}
            </div>
            <span className="font-medium">{menuItem.title}</span>
          </div>
        ))}
      </nav>
      <Separator className="my-4" />
      <div className="items-center justify-center flex text-lg">
        <RiLogoutBoxLine />
        <h1>Logout</h1>
      </div>
    </div>
  );
};