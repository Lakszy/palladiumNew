"use client";

import CB from "../../app/assets/images/CB.svg"
import BORDER from "../../app/assets/images/BORDER.svg"
import newNFTCrate from "../../app/assets/images/newNFTCrate.png"
import question from "../../app/assets/images/questionMarkBox.png"
import Image from "next/image";
// import "../../app/App.css";

export default function NFT2() {
    return (
        <div className="w-full  border-yellow-300  p-6 border items-center justify-center" style={{ backgroundColor: '#272315' }}>
            <div className="box-1 md:ml-4">
                <Image src={CB} alt="circuit breaker" className="-mb-5" />
            </div>
            <div className=" flex items-center">
                <div className="ml-[14px] flex gap-x-6">
                    <div className="">
                        <div className="relative hidden md:flex mt-[3.9rem] p-5 items-center justify-center max-sm:px-5">
                            <Image src={BORDER} alt="border" height={100} width={340} className="absolute" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <Image src={newNFTCrate} width={305} height={25} alt="home" className="mb-4 hover:cursor-not-allowed p-2" />
                                <div className=" title-text whitespace-nowrap hover:cursor-not-allowed h-10 w-fit px-3 bg-[#806800] flex items-center justify-center">
                                    MINTING IS OVER...
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=" w-full justify-between">
                        <p className="title-text md:hidden whitespace-nowrap text-2xl mb-5 text-center -ml-10 text-yellow-400  items-center">
                            MINTING IS OVER...
                        </p>
                        <div className="flex md:hidden items-left align-text- gap-x-1 ">
                        </div>
                        <div className="flex justify-start ml-1">
                            <p className="title-text2 hidden md:block text-xl mb-10 md:text-center text-yellow-400  items-center">
                                Surprise NFT<span className="title-text2 text-xs">s</span> Coming soon <span className="hover:animate-pulse  cursor-wait">✨✨</span>
                            </p>
                        </div>
                        <div className="gap-x-7 hidden md:flex  p-1 ml-1 justify-between">
                            <div className="">
                                <Image src={question} alt="mark" height={100} width={150} className="hover:cursor-not-allowed" />
                            </div>
                            <div className="">
                                <Image src={question} alt="mark" height={100} width={150} className="hover:cursor-not-allowed" />
                            </div>
                            <div className="">
                                <Image src={question} alt="mark" height={100} width={150} className="hover:cursor-not-allowed" />
                            </div>
                            <div className="">
                                <Image src={question} alt="mark" height={100} width={150} className="hover:cursor-not-allowed" />
                            </div>
                        </div>
                        <div className="relative md:hidden mt-[2.5rem] -ml-8 flex items-center justify-center max-sm:px-5">
                            <Image src={BORDER} alt="border" height={100} width={340} className="" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <Image src={newNFTCrate} width={240} height={20} alt="home" className="mt-1 hover:cursor-not-allowed p-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
