"use client";

import CB from "../../app/assets/images/CB.svg"
import BORDER from "../../app/assets/images/BORDER.svg"
import crate from "../../app/assets/images/crate.svg"
import qMARK from "../../app/assets/imageS/qMARK.svg"
import "../../app/App.css";
import Image from "next/image";

export default function NFT2() {
    return (
        <>
            <div className="w-full  upper mr-10 border-yellow-300  p-6 border items-center justify-center" style={{ backgroundColor: '#272315' }}>
                <div className="box-1 w-[20rem] space-y-3 ">
                    <Image src={CB} alt="circuit breaker" />
                </div>
                <div className=" flex gap-x-5">
                    <div>
                        <div className="relative mt-11 flex items-center justify-center max-sm:px-5">
                            <Image src={BORDER} alt="border" height={100} width={340} className="" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <Image src={crate} width={240} height={20} alt="home" className="mb-4 hover:cursor-not-allowed" />
                                <div className="w-4/5 title-text hover:cursor-not-allowed h-10 bg-[#806800] flex items-center justify-center">
                                    MINTING IS OVER...
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className=" w-full justify-between">
                        <p className="title-text text-2xl mb-10 text-center text-yellow-400  items-center">
                            Surprise NFT<span>s</span> Coming soon <span className="hover:animate-pulse cursor-wait">✨✨</span>
                        </p>

                        <div className="flex justify-between">
                            <div className="">
                                <Image src={qMARK} alt="mark" height={100} width={150} className="hover:cursor-not-allowed" />
                            </div>
                            <div className="">
                                <Image src={qMARK} alt="mark" height={100} width={150} className="hover:cursor-not-allowed" />
                            </div>
                            <div className="">
                                <Image src={qMARK} alt="mark" height={100} width={150} className="hover:cursor-not-allowed" />
                            </div>
                            <div className="">
                                <Image src={qMARK} alt="mark" height={100} width={150} className="hover:cursor-not-allowed" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
