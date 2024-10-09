import { CustomConnectButton } from '@/components/connectBtn';
import React from 'react'
import img1 from "../assets/images/Group 771.png";
import img3 from "../assets/images/Group 661.svg";
import floatPUSD from "../assets/images/floatPUSD2.png";
import img4 from "../assets/images/Group 666.svg";
import Image from 'next/image';
import "../../app/App.css"
import { EVMConnect } from '@/components/EVMConnect';
import { Label } from "@radix-ui/react-label";


const OpenTroveNotConnected = () => {
  return (
    <div className="md:pt-10  md:p-5 h-full px-2 pt-4 md:h-full">
      <div className=" shadow-lg md:w-[92%] rounded-2xl mx-2" style={{ backgroundColor: "#222222" }}>
        <div className="flex flex-col md:flex-row m-1  gap-x-12">
          <div className="n">
            <Image src={floatPUSD} width={175} alt="home" className='md:ml-0 ml-[20%]'/>
          </div>
          <div className=" h-fit mb-3 md:mb-1 mt-[10px] space-y-20">
            <div>  <h6 className="text-white  text-center text-2xl title-text2  ">
              You dont have an existing trove  </h6>
            </div>
            <div className=' md:ml-0 ml-[1.2rem]'>
              <h6 className="text-[#88e273] text-left title-text2 text-xl mb-2">
                Open a zero interest trove
              </h6>
              <h6 className="text-white md:ml-0 ml-[3%] body-text text-left font-medium">
                Borrow against BTCs interest free
              </h6>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-2  body-text flex flex-col md:flex-row justify-between">
        <div className=''>
          <div className="grid space-y-5 w-full rounded-2xl max-w-sm items-start gap-2 mx-auto   p-5">
            <div className="">
              <Label htmlFor="items" className="body-text text-gray-500 font-medium body-text text-md "> Deposit Collateral </Label>
              <div className="flex mb-1.5 mt-[8px] rounded-2xl items-center border w-[345px] md:w-[410px] border-[#88e273]  "
                style={{ backgroundColor: "black" }}>
                <div className='flex items-center h-[3.5rem] rounded-2xl'>
                  <Image src={img3} alt="home" className='ml-1' />
                  <h3 className='text-white body-text ml-1 font-medium '>BTC</h3>
                  <h3 className='h-full border   border-[#88e273] mx-3  text-[#88e273]'></h3>
                </div>
                <input id="items" placeholder="" disabled onChange={(e) => { const newCollValue = e.target.value; }} className="w-full body-text text-sm text-gray-400 whitespace-nowrap cursor-not-allowed ml-1 h-[4rem] rounded-2xl " style={{ backgroundColor: "black" }} />
              </div>
              <span className="body-text font-medium text-gray-500 text-sm">
                Availabe
                <span className='text-white body-text ml-05'>0.000000</span>
              </span>
            </div>
            <div className="">
              <Label htmlFor="quantity" className="body-text text-gray-500 font-medium text-md">
                Borrow
              </Label>
              <div className="flex  mt-[8px]  items-center w-[345px] rounded-2xl md:w-[410px] border border-[#88e273] "
                style={{ backgroundColor: "black" }}>
                <div className='flex items-center h-[3.5rem] '>
                  <Image src={img4} alt="home" className='ml-1' />
                  <h3 className='text-white body-text ml-1 font-medium '>ORE</h3>
                  <h3 className='h-full border   border-[#88e273] mx-3   text-[#88e273]'></h3>
                </div>
                <input id="items" placeholder="" disabled onChange={(e) => { const newCollValue = e.target.value; }} className="md:w-[23.75rem]  body-text text-sm text-gray-400 whitespace-nowrap rounded-2xl cursor-not-allowed ml-1 h-[4rem] " style={{ backgroundColor: "black" }} />
              </div>
              <div className="mt-05 body-text font-medium text-gray-500 text-sm">
                Available
                <span className='text-white ml-05 body-text'>0.00</span>
              </div>
            </div>
            <div className="">
            <EVMConnect className="w-full " />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OpenTroveNotConnected