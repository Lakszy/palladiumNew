import React from 'react'
import "../app/App.css"
import Image from 'next/image'
import floatPUSD from "../app/assets/images/floatPUSD.png";
import trove3 from "../app/assets/images/TROVE2.svg"
import trove2 from "../app/assets/images/TROVE1.svg"
import trove1 from "../app/assets/images/TROVE3.svg"

import { Button } from './ui/button';
import Link from 'next/link';

const ThreeTroveCard = () => {
    return (
        <div className='p-5  w-full'>
            <div className="p-5">
                <div className="md:ml-2 -ml-7 h-[10rem] p-2 md:w-full w-[22.5rem]" style={{ backgroundColor: "#2e2a1c" }}>
                    <div className="flex p-2 w-full">
                        <div className="hidden md:block w-[22%]">
                            <Image src={floatPUSD} height={200} alt="home" className="-mt-[3.5rem]" />
                        </div>
                        <div className=" h-fit py- space-y-5">
                            <div>
                                <p className="text-white body-text  text-lg font-medium ">
                                    You dont have an existing trove
                                </p>
                            </div>
                            <div>
                                <p className="text-yellow-300 body-text font-medium text-left text-lg">
                                    Open a Zero-Interest trove
                                </p>
                                <p className="text-[#827f77] text-sm  font-medium body-text text-left">
                                    Borrow against BTCs interest free
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex md:flex-row flex-col md:pl-5 pt-5 pb-5 w-full justify-between items-center'>
                {/* Card 1 */}
                <div className="bg-[#2e2a1c] text-white md:p-6 md:mb-0 mb-3 p-16 rounded-none flex-1 space-y-10 mx-2">
                    <div className="flex items-center mb-6">
                        <div className="rounded-full">
                            <Image src={trove1} alt='btc' />
                        </div>
                        <h2 className="ml-4 text-xl font-medium body-text">BTC Trove</h2>
                    </div>
                    <div className='space-y-9'>
                        <div className="flex justify-between mb-4">
                            <div className='whitespace-nowrap'>
                                <p className="body-text font-medium text-gray-400">MAX LTV</p>
                                <p className="body-text font-medium">90.00%</p>
                            </div>
                            <div className='whitespace-nowrap'>
                                <p className="body-text text-gray-400 body-text font-medium">One-time Fee</p>
                                <p className="body-text font-medium">9.00% or less</p>
                            </div>
                        </div>
                        <div className="flex justify-between mb-4">
                            <div>
                                <p className="body-text font-medium text-gray-400">Min Debt</p>
                                <p className="body-text font-medium">2,000.00</p>
                            </div>
                            <div>
                                <p className="body-text font-medium text-gray-400">PUSD Minted</p>
                                <p className="body-text font-medium">101,580 / 2.5M</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Link href="/trove/susdt" passHref>
                            <Button
                                className="bg-yellow-500 rounded-none text-black font-semibold w-full title-text hover:bg-yellow-600 transition">
                                OPEN TROVE
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-[#2e2a1c] text-white md:p-6 p-16  md:mb-0 mb-3 rounded-none flex-1 space-y-10 mx-2">
                    <div className="flex items-center mb-6">
                        <div className="rounded-full">
                            <Image src={trove3} alt='btc' />
                        </div>
                        <h2 className="ml-4 text-xl font-medium body-text">rovBTC Trove</h2>
                    </div>
                    <div className='space-y-9'>
                        <div className="flex justify-between mb-4">
                            <div className='whitespace-nowrap'>
                                <p className="body-text font-medium text-gray-400">MAX LTV</p>
                                <p className="body-text font-medium">90.00%</p>
                            </div>
                            <div className='whitespace-nowrap'>
                                <p className="body-text text-gray-400 body-text font-medium">One-time Fee</p>
                                <p className="body-text font-medium">9.00% or less</p>
                            </div>
                        </div>
                        <div className="flex justify-between mb-4">
                            <div>
                                <p className="body-text font-medium text-gray-400">Min Debt</p>
                                <p className="body-text font-medium">2,000.00</p>
                            </div>
                            <div>
                                <p className="body-text font-medium text-gray-400">PUSD Minted</p>
                                <p className="body-text font-medium">101,580 / 2.5M</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Link href="/trove/wbtc" passHref>
                            <Button
                                className="bg-yellow-500 rounded-none text-black font-semibold w-full title-text hover:bg-yellow-600 transition">
                                OPEN TROVE
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-[#2e2a1c] text-white  md:mb-0 mb-3 md:p-6 p-[3.7rem] rounded-none flex-1 space-y-10 mx-2">
                    <div className="flex items-center mb-6">
                        <div className="rounded-full">
                            <Image src={trove2} alt='btc' />
                        </div>
                        <h2 className="ml-4 text-xl font-medium body-text">bbnBTC Trove</h2>
                    </div>
                    <div className='space-y-9'>
                        <div className="flex justify-between mb-4">
                            <div className='whitespace-nowrap'>
                                <p className="body-text font-medium text-gray-400">MAX LTV</p>
                                <p className="body-text font-medium">90.00%</p>
                            </div>
                            <div className='whitespace-nowrap'>
                                <p className="body-text text-gray-400 body-text font-medium">One-time Fee</p>
                                <p className="body-text font-medium">9.00% or less</p>
                            </div>
                        </div>
                        <div className="flex justify-between mb-4">
                            <div>
                                <p className="body-text font-medium text-gray-400">Min Debt</p>
                                <p className="body-text font-medium">2,000.00</p>
                            </div>
                            <div>
                                <p className="body-text font-medium text-gray-400">PUSD Minted</p>
                                <p className="body-text font-medium">101,580 / 2.5M</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Link href="/trove/wcore" passHref>
                            <Button
                                className="bg-yellow-500 rounded-none text-black font-semibold w-full title-text hover:bg-yellow-600 transition">
                                OPEN TROVE
                            </Button>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ThreeTroveCard