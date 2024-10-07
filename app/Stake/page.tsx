"use client";
import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { TabsDemo } from "@/components/sidebar";
import NavBar from "@/components/navbar";
import { StabilityPool } from "@/components/stabilityPool";
import { Unstake } from "@/components/unStake";
import { StabilityStats } from "@/components/stabilityStats";
import "../../app/App.css"
import Claim from "@/components/claim";

export default function Home() {
  interface CustomTabHeaderProps {
    title: string;
  }

  const CustomTabHeader: React.FC<CustomTabHeaderProps> = ({ title }) => {
    return (
        <span className='title-text2 text-sm md:-ml-0'>{title}</span>
    );
  };
  return (
    <div className="grid h-screen mainT w-full grid-cols-[max-content_1fr] overflow text-white" style={{ backgroundColor: 'black' }}>
      <TabsDemo />
      <div className="body text-black  overflow-y-scroll ">
        <div className="sticky z-50 mainT top-0  overflow-auto">
          <NavBar />
        </div>

        <div className="h-screen w-screen  md:w-full" style={{ backgroundColor: 'black' }}>
          <div className="text-center">
            <h1 className="text-2xl pt-10 font-semibold w-[23rem] ml-[5%] md:ml-0 text-center md:w-full text-white title-text">Earn By Supplying PUSD to Stability Pool</h1>
          </div>
          <div className='md:p-10  pt-12 md:flex md:gap-x-36' style={{ backgroundColor: 'black' }}>
            <div className="second_section w-[100%] md:w-1/2 outer_section_detail pos_sticky">
              <TabView className='card '>
                <TabPanel className='p-[1px]' header={<CustomTabHeader title="Stake" />}>
                  <div className='border rounded-lg  md:h-[25.6rem] border-[#88e273]  w-fit flex md:flex-row flex-col gap-x-10 items-center'>
                    <StabilityPool />
                    <div className='md:p-0 p-5 md:mr-10 mt-12 md:mt-8 md:w-[25rem]'>
                      <StabilityStats />
                    </div>
                  </div>
                </TabPanel>
                <TabPanel className='p-[1px] rounded-lg' header={<CustomTabHeader title="Unstake" />}>
                  <div className='border  md:h-[25.6rem] rounded-lg border-[#88e273] w-fit flex md:flex-row flex-col gap-x-10 items-center'>
                  <Unstake />
                    <div className='md:p-0 p-5 md:mr-10 md:mt-8 md:w-[25rem]'>
                      <StabilityStats />
                    </div>
                  </div>
                </TabPanel>
                <TabPanel className='p-[1px] w-full rounded-lg md:w-[56rem]' header={<CustomTabHeader title="Claim" />}>
                  <div className='border rounded-lg border-[#88e273] md:w-[56rem] h-2 ' style={{ backgroundColor: 'black' }}>
                    <Claim/>
                  </div>
                </TabPanel>
              </TabView>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}