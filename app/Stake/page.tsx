"use client";
import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { TabsDemo } from "@/components/sidebar";
import NavBar from "@/components/navbar";
import { StabilityPool } from "@/components/stabilityPool";
import { Unstake } from "@/components/unStake";
import { StabilityStats } from "@/components/stabilityStats";
import "../../app/App.css"

export default function Home() {
  interface CustomTabHeaderProps {
    title: string;
  }

  const CustomTabHeader: React.FC<CustomTabHeaderProps> = ({ title }) => {
    return (
      <>
        <span>{title}</span>
      </>
    );
  };
  return (
    <div className="grid h-screen mainT w-full grid-cols-[max-content_1fr] overflow text-white">
      <TabsDemo />
      <div className="body text-black  overflow-y-scroll ">
        <div className="sticky z-50 mainT top-0  overflow-auto">
          <NavBar />
        </div>

        <div className="h-screen" style={{ backgroundColor: '#272315' }}>
          <div className='p-10 pt-24 flex gap-x-36'>
            <div className="second_section outer_section_detail pos_sticky ">
              <TabView className='card'>
            <TabPanel className='p-1 bg-yellow-400 text-xl text-black' header={<CustomTabHeader title="Stake" />}>

                {/* <TabPanel className=' p-1 bg-yellow-400 text-xl font-semibold text-black' header="Stake"> */}
                  <StabilityPool />
                </TabPanel>
            <TabPanel className='p-1 bg-yellow-400 text-xl text-black' header={<CustomTabHeader title="Unstake" />}>
                {/* <TabPanel className='p-1 bg-yellow-400 text-xl text-black' header="Unstake"> */}
                  <Unstake />
                </TabPanel>
              </TabView>
            </div>
            <StabilityStats />
          </div>
        </div>
      </div>
    </div>
  );
}