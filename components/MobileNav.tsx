
"use client";
import React, { useState } from "react";
import { MdOutlineInventory2 } from "react-icons/md";
import { BiDollar } from "react-icons/bi";
import { RiBillLine } from "react-icons/ri";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import Image from "next/image";
import logo from "../app/assets/images/newpalladium.svg"
import zeally from "../app/assets/images/zeally.svg"
import tweet from "../app/assets/images/tweet.svg"
import discord from "../app/assets/images/discord.svg"
import medium from "../app/assets/images/medium.svg"
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import "../app/App.css"


export default function MobileNav() {
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
        { id: "Portfolio", icon: MdOutlineInventory2, title: "Portfolio", link: "portfolio" },
        { id: "Borrow", icon: RiBillLine, title: "Borrow PUSD", link: "Borrow" },
        { id: "Stake-pusd", icon: BiDollar, title: "Stake PUSD", link: "Stake" },
        { id: "Redeem", icon: RiBillLine, title: "Redeem PUSD", link: "Redeem" },
    ];
    return (
        <div className="w-10 h-10 flex">
            <Sidebar  visible={visible} onHide={() => setVisible(false)}>
                <div className={`sidebar h-full pt-[4rem] font-mono font-extrabold  w-full grid-rows-[max-content_fr_max-content] text-white`} style={{ backgroundColor: '#2c2819' }}>
                    <div className="flex items-center gap-x-1  justify-center">
                        <Link href="/">
                            <Image src={logo} alt="Logo" className="mr-10 w-56" />
                        </Link>
                    </div>
                    <nav className="flex flex-col gap-y-2 px-4">
                        {menuItems.map((menuItem) => (
                            <Link legacyBehavior key={menuItem.id} href={menuItem.link}>
                                <a
                                    className={`cursor-pointer text-xl menu flex min-w-[200px] items-center gap-x-3 rounded-lg p-2 ${isMenuSelected(menuItem.id) ? "bg-yellow-400 text-black" : "text-gray-500"
                                        }`}
                                    onClick={() => handleMenuClick(menuItem.id)}
                                >
                                    <div className={`cursor-pointer menu flex items-center gap-x-3 rounded-full p-2 ${isMenuSelected(menuItem.id) ? "text-black" : " text-white"
                                        }`}>
                                        {React.createElement(menuItem.icon, { size: 22 })}
                                    </div>
                                    <span className="font-medium body-text">{menuItem.title}</span>
                                </a>
                            </Link>
                        ))}
                    </nav>
                    <div className="space-y-1 pt-16">
                        <div className=" w-full h-full">
                            <Link href="https://zealy.io/cw/palladiumlabs/questboard">
                                <Image src={zeally} alt="zeally" className="w-[297px] h-[100px]" />
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
            <Button icon="pi pi-arrow-right z-10" onClick={() => setVisible(true)} />
        </div>
    )
}
