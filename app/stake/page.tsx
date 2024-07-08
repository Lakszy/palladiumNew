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
        <span className='title-text2 md:-ml-0'>{title}</span>
    );
  };
  return (
    <div className="grid h-screen mainT w-full grid-cols-[max-content_1fr] overflow text-white">
      <TabsDemo />
      <div className="body text-black  overflow-y-scroll ">
        <div className="sticky z-50 mainT top-0  overflow-auto">
          <NavBar />
        </div>

        <div className="md:h-screen " style={{ backgroundColor: '#272315' }}>
          <div className="text-center">
            <h1 className="text-2xl pt-10 font-semibold w-[23rem] ml-[5%] md:ml-0 text-center md:w-full text-yellow-300 title-text">Earn By Supplying PUSD to Stability Pool</h1>
          </div>
          <div className='md:p-10  pt-12 md:flex md:gap-x-36'>
            <div className="second_section w-[24rem] md:w-1/2 outer_section_detail pos_sticky">
              <TabView className='card'>
                <TabPanel className='p-[2px]  bg-yellow-400 text-sm text-black' header={<CustomTabHeader title="Stake" />}>
                  <StabilityPool />
                </TabPanel>
                <TabPanel className='p-[2px] bg-yellow-400 text-sm  text-black' header={<CustomTabHeader title="Unstake" />}>
                  <Unstake />
                </TabPanel>
              </TabView>
            </div>
            <div className='md:p-0 p-5 w-[25rem]'>
            <StabilityStats />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}