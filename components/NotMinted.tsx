
import React from "react";
import Image from "next/image";
import nouser from "../app/assets/images/nouser.png";
import discord from "../app/assets/images/Group 857.png";

const NotMinted = () => {
  return (
    <div className="h-screen w-full pb-16 sm:pb-1 max-sm:px-5" style={{ backgroundColor: "#272315" }}>
      <div className=" md:w-full h-full flex flex-col items-center justify-center md:mt-[-5rem]">
        <div className="max-sm:w-[20rem]  md:px-[2rem] pb-[2rem] flex flex-col items-center justify-center" style={{ backgroundColor: "#2D2A1C" }}>
          <div className="lg:mt-[2rem]">
            {" "}
            <Image src={nouser} alt="home" className=" lg:w-full h-full" />
          </div>
          <p className="title-text text-lightyellow text-xl text-center">
            You don’t have access to the private testnet
          </p>
          <p className="font-medium body-text text-gray-500 text-sm text-center">
            Stay tuned on our Discord for next phase of whitelisting
          </p>
          <span>
            <a className="w-full md:w-[10rem] title-text bg-lightyellow text-black text-lg   mt-4 md:mt-[2rem] px-4 py-2 text-center flex flex-row border border-lightyellow items-center justify-center place-items-center gap-x-2" href="https://discord.com/invite/9MMEyJ4JDz" target="_blank"            >
              {" "}
              <Image src={discord} alt="discord" width={30} height={30} />
              <b className="title-text font-thin">DISCORD </b>
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotMinted;
