"use client";
import Image from "next/image";
import dbBG from "../app/assets/dbBackground.png";
import "../app/App.css"
import coreLogo from "../app/assets/images/CoreLogo.png"
import { FaArrowRightLong } from "react-icons/fa6";
import Link from "next/link";

export const CardDemo = () => {
  return (
    <div className="relative w-[25rem] h-screen md:w-full bg-black">
      <Image src={dbBG} alt="" className="-mt-[5rem] object-cover w-full h-full" />
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-white px-4">
        <div className="flex gap-x-2 flex-wrap items-center">
          <h1 className="text-6xl mt-5 font-bold mb-4 titleTextSub">Instant Liquidity on</h1>
          <Image src={coreLogo} alt="corelogo" />
        </div>
        <p className="text-lg mb-6 text-center ">Grow your wealth with $ORE, Core’s native over-collateralized, yield-generating stablecoin</p>
        <Link href="trove">
          <button className="bg-gradient-to-r from-green-300 to-green-500 body-text text-black font-semibold py-3 px-4 text-lg rounded-3xl shadow-lg hover:from-green-500 hover:to-green-600 transition duration-300 flex items-center">
            Mint $ORE
            <FaArrowRightLong className="ml-[0.5rem]" size={20} />
          </button>
        </Link>
      </div>
    </div>
  );
};
