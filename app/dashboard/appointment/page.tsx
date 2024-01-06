"use client"
import React from 'react'
import BottomBar from '@/components/BottomBar';
import { CalendarDemo } from "@/components/appointmentPage";
import NavBar from '@/components/navbar';
import { TabsDemo } from '@/components/sidebar';
function index() {
  return (
   <>
        <div className="rounded-3xl p-3">
          < BottomBar />
        </div>
        <div className="rounded-3xl p-3 ">
        <CalendarDemo/>
        </div>
   </>
     
  )
}
export default index