import React from "react";
import { IoSettingsOutline } from "react-icons/io5";
// import {  CircleButton } from "@/components/common";
import CircleButton from "../CircleButton";

const TopNavBar = () => {
  return (
    <div className="navbar flex h-20 items-center justify-end bg-purple-50 px-5 gap-x-2">
      <button className="flex items-center gap-x-[10px] font-medium rounded-2xl text-sm px-4 py-3 bg-black text-white">
        <IoSettingsOutline size={18} className="font-medium"/>
        Add Layout
      </button>
      <CircleButton  icon={<IoSettingsOutline size={17} className="font-medium"/>} children={undefined} />
    </div>
  )
}

export default TopNavBar