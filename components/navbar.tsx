// NavBar.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { FaRegBell } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FiMessageSquare } from "react-icons/fi";
import { IoMdSearch } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
import IconComponent from "./generics/IconButton";

function NavBar() {
  return (
    <div className="flex items-center justify-between gap-x-4 border-l px-4 py-4 z-50">
      <div className="flex items-center gap-x-4">
        <div className="h-16 w-full min-w-[400px] rounded-xl">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 ">
              <IoMdSearch size={26} />
            </div>
            <Input
              type="search"
              id="default-search"
              className="block py-6 w-full ps-10 text-md items-center text-gray-900 border border-gray-300 rounded-lg bg-gray-50 "
              placeholder="Search patients, appointments..."
              required
            />
          </div>
        </div>
        <div className="hidden sm:flex items-center text-center justify-center bg-black rounded-2xl font-medium border-2 lg:w-72 text-white ">
          <div className="p-3 flex items-center gap-x-1">
            <AiOutlinePlus size={18} />
            <span className="text-sm">Appointment</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-x-4">
        <IconComponent icon={<IoSettingsOutline />} />
        <IconComponent icon={<FiMessageSquare />} />
        <IconComponent icon={<FaRegBell />} />
        <div className="h-12 w-12 rounded-lg ">
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
