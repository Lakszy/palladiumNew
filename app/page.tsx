"use client";
import React from "react";
import { TabsDemo } from "@/components/sidebar";
import { CardDemo } from "@/components/cards";
import NavBar from "@/components/navbar";

export default function Home() {
  return (
    <div className="grid h-screen font-mono font-extrabold mainT w-full grid-cols-[max-content_1fr] overflow text-white">
      <TabsDemo />
      <div className="body text-black  overflow-y-scroll ">
        <div className="sticky z-50 mainT top-0  overflow-auto">
          <NavBar />
        </div>
        <div className=" w-full">
        <CardDemo />
        </div>
      </div>
    </div>
  );
}