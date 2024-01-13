import React from "react";
import Link from "next/link";
import { FaRegBell } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FiMessageSquare } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import IconComponent from "./generics/IconButton";
import { Search } from "lucide-react";

function NavBar() {
  return (
    <div className="flex bg-stone-50 border border-black border-opacity-10 items-center justify-between gap-x-4 border-l px-4 py-4 z-50">
      <div className="flex items-center gap-x-4">
        <div className="w-full min-w-[400px] rounded-xl">
          <div className="relative">
            <div className="flex w-[600px] items-center gap-[12px] p-[24px] relative bg-[#fefefe] rounded-[22px] overflow-hidden border border-solid border-[#f0e4e4]">
              <div
                className="relative w-[20.5px] h-[22.5px] mt-[-0.75px] mb-[-0.75px] ml-[-0.75px]"
              ><Search /></div>
              <input className="relative w-full h-full [font-family:'Manrope-Medium',Helvetica] font-medium text-[#2b2b2bb2] text-[20px] whitespace-nowrap"
                placeholder="Search patients, appointment.."
              />
            </div>
          </div>
        </div>
        <Link href="appointment">
          <button className="relative w-[216px] h-[66px] bg-[#243241] rounded-[22px]">
            <div className="inline-flex text-white items-center relative">
              <AiOutlinePlus className='font-bold' size={30}/>
              <div className="inline-flex items-center justify-center gap-[10px] p-[10px] relative">
                <div className="relative w-fit mt-[-1.00px] [font-family:'Manrope-SemiBold',Helvetica] font-semibold text-white text-[18px] tracking-[0] leading-[32px] whitespace-nowrap">
                  Add patient
                </div>
              </div>
            </div>
          </button>
        </Link>
      </div>
      <div className="flex items-center gap-x-4">
        <IconComponent icon={<IoSettingsOutline />} />
        <IconComponent icon={<FiMessageSquare />} />
        <IconComponent icon={<FaRegBell />} />
        <div className="w-[65px] h-[59.01px] rounded-lg ">
          <Avatar className="w-full h-full hover:cursor-pointer hover:scale-105">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
