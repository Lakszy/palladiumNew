"use client"
import React from 'react'
import BottomBar from '@/components/BottomBar';
import { CalendarDemo } from "@/components/appointmentPage";
import NavBar from '@/components/navbar';
import { TabsDemo } from '@/components/sidebar';
import PatientProfile from './page1';
function index() {
    return (
       <>
              <PatientProfile />
       </>
       
    )
}
export default index