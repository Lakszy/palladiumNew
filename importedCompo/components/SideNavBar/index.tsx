"use client";
import React, { useState } from "react";
import { RiLogoutBoxLine } from "react-icons/ri";
import { Separator } from "@/components/ui/separator";
import { LuLayoutGrid } from "react-icons/lu";
import { BsPersonCheckFill } from "react-icons/bs";
import { TbMessageCircle2 } from "react-icons/tb";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";

interface TabsDemoProps {
  className?: string;
}

const data = [
  {
    Icon: <LuLayoutGrid size={24} />,
    Title: "My-Qr-Codes",
    href: "/dashboard/my-qr-codes",
  },
  {
    Icon: <TbMessageCircle2 size={24} />,
    Title: "New Qr",
    href: "/dashboard/new-qr",
  },
  {
    Icon: <BsPersonCheckFill size={24} />,
    Title: "Layout",
    href: "/dashboard/layout",
  },
  // { Icon: <RxCalendar size={24} />, Title: "Appointments", href: "/pages/finance" },
  // { Icon: <HiCurrencyDollar size={24} />, Title: "Payments", href: "/pages/finance" },
];

const SideNavBar: React.FC<TabsDemoProps> = ({ className, ...props }) => {
  const [selectedMenu, setSelectedMenu] = useState<string | null>("/dashboard/layout");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const pathName = usePathname();
  const user = useSelector((state: any) => state.auth.isLoggedIn);

  console.log(selectedMenu);

  // const handleMenuClick = (menu: string) => {
  //   setSelectedMenu(menu);
  // };

  // const toggleSidebar = () => {
  //   setIsOpen(!isOpen);
  // };

  // const isMenuSelected = (menu: string) => {
  //   return selectedMenu === menu;
  // };

  const handleNavigate = (to: string) => {
    router.push(to);
    if(pathName === to) return setSelectedMenu(to);
  };

  return (
    <div
      className={`sidebar grid min-h-screen grid-rows-[max-content_1fr_max-content] bg-black text-black ${
        isOpen ? "open" : ""
      }`}
    >
      <div className="logo flex h-20 items-center justify-center gap-x-1">
        {/* <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar> */}
        <Link href="/">
          <h1 className="text-xl text-white font-bold">Q Scan</h1>
        </Link>
        {/* {isOpen ? (
          <MdClose onClick={toggleSidebar} />
        ) : (
          <GiHamburgerMenu onClick={toggleSidebar} />
        )} */}
      </div>
      <nav className="flex flex-col gap-y-6 px-4 py-11">
        {data.map((item, index) => (
          // <Link href={item.href} key={index}>
          <div
            className={`cursor-pointer menu flex min-w-[200px] items-center gap-x-3 rounded-xl p-2 ${
              selectedMenu == item.href ? "bg-white text-black" : "text-white"
            }`}
            onClick={() => handleNavigate(item.href)}
          >
            <div
              className={`h-10 w-10 flex items-center justify-center rounded-full${
                selectedMenu==item.href ? "text-black" : " text-white"
              }`}
            >
              {item.Icon}
            </div>
            <span className="font-medium">{item.Title}</span>
          </div>
          // </Link>
        ))}
      </nav>
      <Separator className="my-4" />
      {user && (
        <div className="flex text-white justify-center items-center font-medium text-lg">
          <RiLogoutBoxLine />
          <h1>Logout</h1>
        </div>
      )}
    </div>
  );
};

export default SideNavBar;