import { CustomConnectButton } from '@/components/connectBtn';
import React from 'react'
import img1 from "../assets/images/Group 771.png";
import img3 from "../assets/images/Group 661.svg";
import img4 from "../assets/images/Group 666.svg";
import Image from 'next/image';
import "../../app/App.css"
import { Label } from "@radix-ui/react-label";


const OpenTroveNotConnected = () => {
  return (
    <div className="md:pt-10 w-fu md:p-5 h-full px-2 pt-4 md:h-screen">
      <div className=" border border-black shadow-lg w-full" style={{ backgroundColor: "#3f3b2d" }}>
        <div className="flex flex-col md:flex-row m-1  gap-x-12">
          <div className="n">
            <Image src={img1} alt="home" />
          </div>
          <div className=" h-fit space-y-20">
            <div>  <h6 className="text-white  text-center text-3xl title-text  ">
              You dont have an existing trove  </h6>
            </div>
            <div>
              <h6 className="text-yellow-300 text-left title-text text-xl mb-2">
                Open a zero interest trove
              </h6>
              <h6 className="text-white body-text text-left text-base">
                Borrow against BTCs interest free
              </h6>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-2  body-text flex flex-col md:flex-row justify-between">
        <div className=''>
          <div className="grid space-y-5 w-full max-w-sm items-start gap-2 mx-auto   p-5">
            <div className="">
              <Label htmlFor="items" className="body-text text-lg text-gray-500 "> Deposit Collatoral </Label>
              <div className="flex mb-1.5 mt-[8px] items-center border md:w-full w-[20rem] border-yellow-300  "
                style={{ backgroundColor: "#3f3b2d" }}>
                <div className='flex items-center h-[3.5rem] '>
                  <Image src={img3} alt="home" className='ml-1' />
                  <h3 className='text-white body-text ml-1 '>BTC</h3>
                  <h3 className='h-full border mx-4'></h3>
                </div>
                <input id="items" placeholder="Enter Collateral Amount" disabled onChange={(e) => { const newCollValue = e.target.value; }} className="md:w-[23.75rem]  body-text text-sm text-gray-400 whitespace-nowrap cursor-not-allowed ml-1 h-[4rem] " style={{ backgroundColor: "#3f3b2d" }} />
              </div>
              <span className="body-text text-gray-500 text-sm">
                Availabe
                <span className='text-white body-text ml-05'>0.000000</span>
              </span>
            </div>
            <div className="">
              <Label htmlFor="quantity" className="body-text text-gray-500 text-lg">
                Borrow
              </Label>
              <div className="flex  mt-[8px]  items-center md:w-full w-[20rem] border border-yellow-300 "
                style={{ backgroundColor: "#3f3b2d" }}>
                <div className='flex items-center h-[3.5rem] '>
                  <Image src={img4} alt="home" className='ml-1' />
                  <h3 className='text-white body-text ml-1 '>PUSD</h3>
                  <h3 className='h-full border mx-4'></h3>
                </div>
                <input id="items" placeholder="Enter Borrow Amount" disabled onChange={(e) => { const newCollValue = e.target.value; }} className="md:w-[23.75rem]  body-text text-sm text-gray-400 whitespace-nowrap cursor-not-allowed ml-1 h-[4rem] " style={{ backgroundColor: "#3f3b2d" }} />
              </div>
              <div className="mt-05 body-text text-gray-500 text-sm">
                Available
                <span className='text-white ml-05 body-text'>0.00</span>
              </div>
            </div>
            <div className="">
              <CustomConnectButton className="w-full hover:scale-95" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OpenTroveNotConnected