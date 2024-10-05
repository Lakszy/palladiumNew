"use client";
import React from "react";
import { TabsDemo } from "@/components/sidebar";
import NavBar from "@/components/navbar";
import BorrowCore from "@/CompBorrow/BorrowCore";
export default function Home() {
  
  return (
    <div className="grid h-screen mainT w-full grid-cols-[max-content_1fr] overflow text-white">
      <TabsDemo />
      <div className="body text-black  overflow-y-scroll ">
        <div className="sticky z-50 mainT top-0  overflow-auto">
          <NavBar />
        </div>
        <div className="h-screen md:w-full w-screen " style={{ backgroundColor: "#272315" }}>
          <BorrowCore />
        </div>
      </div>
    </div>
  );
}