"use client"

import React from 'react'
import BottomBar from '@/components/BottomBar';
import { CalendarDemo } from "@/components/appointmentPage";
import NavBar from '@/components/navbar';
import { TabsDemo } from '@/components/sidebar';


type Props = {}

function index({ }: Props) {
  return (
    <div className="grid h-screen mainT w-full grid-cols-[max-content_1fr] overflow text-white">
      <TabsDemo />
      <div className="body text-black  overflow-y-scroll ">
        <div className="sticky z-50 mainT top-0 bg-gray-800 overflow-auto">
          <NavBar />
        </div>
        <div className="rounded-3xl p-3">
          < BottomBar />
        </div>
        <div className="rounded-3xl p-3 ">
        <CalendarDemo/>
        </div>
      </div>
    </div>
  )
}

export default index