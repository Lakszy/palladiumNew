"use client";
import React from "react";
import NavBar from "@/components/navbar";
import { TabsDemo } from "@/components/sidebar";
import { HiArrowLongLeft } from "react-icons/hi2";
import { MdSaveAlt } from "react-icons/md";
import patient from "@/app/assets/images/patient.svg";
import hand from "@/app/assets/images/injection.svg";
import lady from "@/app/assets/images/ladyPatient.svg";
import Image from "next/image";
import heart from "@/app/assets/images/heart.svg";
import { ArrowBigRight, Heart, MessageCircle, PhoneCall } from "lucide-react";
import { FaChevronRight } from "react-icons/fa";
function index() {
  return (
    <>
        <div className="p-4 ">
          <div className="flex justify-between">
            <div className="flex items-center gap-x-2">
              <div className="border rounded-full w-fit p-2">
                <HiArrowLongLeft size={32} className="font-xs" />
              </div>
              <h1 className="text-zinc-800 text-xl font-bold  leading-7">
                Patient Details
              </h1>
            </div>
            <div className="w-[130px] h-[55px] px-[21px] py-[3px] bg-blue-700 bg-opacity-10 rounded-[30px] border border-blue-700 justify-start items-center gap-2 inline-flex">
              <div className="justify-start items-center gap-2 flex">
                <MdSaveAlt className="text-blue-700" />
                <div className="text-blue-700 text-lg font-semibold leading-loose">
                  Export
                </div>
              </div>
            </div>
          </div>

          <div className="w-full pt-4 rounded-lg inline-flex justify-between px-2">
            <div className="gap-x-4 flex">
              <Image
                alt="patient"
                className="w-[247px] h-[233px] rounded-[10px]"
                src={patient}
              />
              <div>
                <div>
                  <div className="text-zinc-800 text-2xl font-bold whitespace-nowrap">
                    Dheeraj Pandey
                  </div>
                  <div className="text-zinc-800 text-opacity-70 text-xl font-medium whitespace-nowrap">
                    Noida, Uttar Pradesh
                  </div>
                </div>
                <div className="justify-start pt-2 pb-2 items-start gap-x-3 flex">
                  <div className="px-5 w-[147px] bg-lime-600 bg-opacity-10 rounded-[30px] justify-center items-center gap-2.5 flex">
                    <div className="text-lime-600 text-xl font-medium leading-loose whitespace-nowrap">
                      Sore throat
                    </div>
                  </div>
                  <div className="px-5 bg-blue-700 bg-opacity-10 rounded-[30px] justify-center items-center gap-2.5 flex">
                    <div className="text-blue-700 text-xl font-medium leading-loose whitespace-nowrap">
                      Male
                    </div>
                  </div>
                  <div className="px-5 bg-pink-600 bg-opacity-10 rounded-[30px] justify-center items-center gap-2.5 flex">
                    <div className="text-pink-600 text-xl font-medium leading-loose whitespace-nowrap">
                      42 Yr
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-x-2 ">
                  <div className="p-[18px] bg-white rounded-[30px] border border-stone-200 justify-start items-start gap-2.5 flex w-fit">
                    <PhoneCall />
                  </div>
                  <div className="px-4 py-[18px] bg-white rounded-[30px] border border-stone-200 justify-start items-start gap-2.5 flex w-fit">
                    <MessageCircle />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-col rounded-2xl justify-start items-center gap-2.5 inline-flex bg-blue-200">
              <Image alt="hand" className="w-[100px] h-[89px]" src={hand} />
              <div className="text-zinc-800 text-base font-bold  leading-loose">
                Recommend Prescriptions
              </div>
              <div className="text-center text-zinc-800 text-opacity-70 text-xs font-medium  leading-none">
                Treat your patient in a effectively and <br />
                professional way
              </div>
              <div className="mx-2 my-2 w-[222px] h-[42px] px-[63px] py-[15px] bg-slate-800 rounded-md justify-start items-center gap-2.5 inline-flex">
                <div className="text-white text-base font-semibold leading-loose">
                  Recommend
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mt-2 pl-4 pr-[781px] py-4 bg-stone-100 rounded-[22px] justify-start items-center gap-3 inline-flex">
            <Image
              alt="ladyPatient"
              className="w-[108px] h-[105px] rounded-xl"
              src={lady}
            />
            <div className="flex-col justify-start items-start inline-flex">
              <div className="text-zinc-800 text-2xl font-bold">
                Dr. Anisha Mehta
              </div>
              <div className="text-zinc-800 text-opacity-70 text-xl font-base">
                Otolaryngologist
              </div>
            </div>
          </div>
          <div className="h-full grid grid-cols-[35%_65%]  p-2">
            <div className="bg-slate-50 h-[32rem] overflow-y-auto p-2 rounded-lg pr-2 items-center justify-center">
              <h1 className="items-center justify-center font-[500] text-xl mb-3 mt-3 ">
                Medical History
              </h1>

              <div className="space-y-4">
                <div className="w-full h-[91px] bg-slate-200 rounded-xl gap-x-2 items-center grid grid-cols-[max-content_1fr_max-content]">
                  <div className="w-[66px] h-[67px] bg-white rounded-md ml-2 flex items-center justify-center">
                    <Image src={heart} alt="heart" />
                  </div>
                  <div className="">
                    <h1 className="text-zinc-800 text-xs font-bold leading-loose">
                      Heart Failure
                    </h1>
                    <h1 className="text-zinc-800 text-opacity-70 text-xs font-medium leading-loose">
                      OCT 14, 2022
                    </h1>
                    <div className="flex gap-x-1 items-center">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                      <h1 className="text-zinc-800 text-opacity-70 text-xs font-medium leading-loose">
                        Completed
                      </h1>
                    </div>
                  </div>
                  <div className="mr-2">
                    <FaChevronRight />
                  </div>
                </div>
                <div className="w-full h-[91px] bg-slate-200 rounded-xl gap-x-2 items-center grid grid-cols-[max-content_1fr_max-content]">
                  <div className="w-[66px] h-[67px] bg-white rounded-md ml-2 flex items-center justify-center">
                    <Image src={heart} alt="heart" />
                  </div>
                  <div className="">
                    <h1 className="text-zinc-800 text-xs font-bold leading-loose">
                      Heart Failure
                    </h1>
                    <h1 className="text-zinc-800 text-opacity-70 text-xs font-medium leading-loose">
                      OCT 14, 2022
                    </h1>
                    <div className="flex gap-x-1 items-center">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                      <h1 className="text-zinc-800 text-opacity-70 text-xs font-medium leading-loose">
                        Completed
                      </h1>
                    </div>
                  </div>
                  <div className="mr-2">
                    <FaChevronRight />
                  </div>
                </div>
                <div className="w-full h-[91px] bg-slate-200 rounded-xl gap-x-2 items-center grid grid-cols-[max-content_1fr_max-content]">
                  <div className="w-[66px] h-[67px] bg-white rounded-md ml-2 flex items-center justify-center">
                    <Image src={heart} alt="heart" />
                  </div>
                  <div className="">
                    <h1 className="text-zinc-800 text-xs font-bold leading-loose">
                      Heart Failure
                    </h1>
                    <h1 className="text-zinc-800 text-opacity-70 text-xs font-medium leading-loose">
                      OCT 14, 2022
                    </h1>
                    <div className="flex gap-x-1 items-center">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                      <h1 className="text-zinc-800 text-opacity-70 text-xs font-medium leading-loose">
                        Completed
                      </h1>
                    </div>
                  </div>
                  <div className="mr-2">
                    <FaChevronRight />
                  </div>
                </div>
                <div className="w-full h-[91px] bg-slate-200 rounded-xl gap-x-2 items-center grid grid-cols-[max-content_1fr_max-content]">
                  <div className="w-[66px] h-[67px] bg-white rounded-md ml-2 flex items-center justify-center">
                    <Image src={heart} alt="heart" />
                  </div>
                  <div className="">
                    <h1 className="text-zinc-800 text-xs font-bold leading-loose">
                      Heart Failure
                    </h1>
                    <h1 className="text-zinc-800 text-opacity-70 text-xs font-medium leading-loose">
                      OCT 14, 2022
                    </h1>
                    <div className="flex gap-x-1 items-center">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                      <h1 className="text-zinc-800 text-opacity-70 text-xs font-medium leading-loose">
                        Completed
                      </h1>
                    </div>
                  </div>
                  <div className="mr-2">
                    <FaChevronRight />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[32rem] p-2 rounded-lg">
              <div className="w-[731px] ml-4 h-full relative bg-white rounded-[22px] border border-stone-200">
                <div className="left-[20px] top-[20px] absolute text-zinc-800 text-base font-bold  leading-loose">
                  Visits
                </div>
                <div className="left-[21px] top-[64px] absolute flex-col justify-start items-start gap-[41px] inline-flex">
                  <div className="text-zinc-800 text-opacity-70 text-base font-medium font-['Manrope'] leading">
                    Sat
                  </div>
                  <div className="text-zinc-800 text-opacity-70 text-base font-medium font-['Manrope'] leading">
                    Fri
                  </div>
                  <div className="text-zinc-800 text-opacity-70 text-base font-medium font-['Manrope'] leading">
                    Thu
                  </div>
                  <div className="text-zinc-800 text-opacity-70 text-base font-medium font-['Manrope'] leading">
                    Wed
                  </div>
                  <div className="text-zinc-800 text-opacity-70 text-base font-medium font-['Manrope'] leading">
                    Tue
                  </div>
                  <div className="text-zinc-800 text-opacity-70 text-base font-medium font-['Manrope'] leading">
                    Mon
                  </div>
                  <div className="text-zinc-800 text-opacity-70 text-base font-medium font-['Manrope'] leading">
                    Sun
                  </div>
                </div>
                <div className="left-[79px] top-[436px] absolute flex-col justify-start items-start gap-[69px] grid grid-flow-col">
                  <div className="text-zinc-800 text-opacity-70 text-base font-medium font-['Manrope'] leading-loose">
                    09:00
                  </div>
                  <div className="text-zinc-800 text-opacity-70 text-base font-medium font-['Manrope'] leading-loose">
                    10:45
                  </div>
                  <div className="text-zinc-800 text-opacity-70 text-base font-medium font-['Manrope'] leading-loose">
                    11:45
                  </div>
                  <div className="text-zinc-800 text-opacity-70 text-base font-medium font-['Manrope'] leading-loose">
                    05:00
                  </div>
                  <div className="text-zinc-800 text-opacity-70 text-base font-medium font-['Manrope'] leading-loose">
                    07:20
                  </div>
                  <div className="text-zinc-800 text-opacity-70 text-base font-medium font-['Manrope'] leading-loose">
                    09:20
                  </div>
                </div>
                <div className="w-[39px] h-[106px] left-[85px] top-[304px] absolute bg-green-500 rounded-lg"></div>
                <div className="w-[39px] h-[212px] left-[194px] top-[198px] absolute bg-green-500 rounded-lg"></div>
                <div className="w-[39px] h-1.5 left-[302px] top-[404px] absolute bg-green-500 rounded-lg"></div>
                <div className="w-[39px] h-[53px] left-[412px] top-[357px] absolute bg-green-500 rounded-lg"></div>
                <div className="w-[39px] h-[106px] left-[525px] top-[304px] absolute bg-green-500 rounded-lg"></div>
                <div className="w-[39px] h-[265px] left-[638px] top-[145px] absolute bg-green-500 rounded-lg"></div>

                <div className="w-[150px] p-[21px] left-[561px]  absolute bg-white rounded-[30px]  flex-col justify-start items-start gap-2.5 inline-flex">
                  <div className="w-[126px] px-[29px] py-3 bg-gray-900 rounded-[18px] flex-col justify-start items-start gap-2.5 inline-flex">
                    <div className="text-white text-xs font-semibold font-['Manrope'] leading-loose">
                      Select Date
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  );
}
export default index;