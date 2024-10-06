"use client";

import React from "react";
import { TabsDemo } from "@/components/sidebar";
import NavBar from "@/components/navbar";
import Portfolio from "../portfolio/index"

export default function Home() {
  return (
    <div className="grid h-screen mainT w-full grid-cols-[max-content_1fr] overflow text-white">
      <TabsDemo />
      <div className="body text-black  overflow-y-scroll ">
        <div className="sticky z-50 mainT top-0  overflow-auto">
          <NavBar />
        </div>
        <div className="h-full w-screen md:w-full" style={{ backgroundColor: "black" }}>
          <div style={{ backgroundColor: "black" }}>
            <Portfolio />
          </div>
        </div>
      </div>
    </div>
  );
}