"use client";
import React from "react";
import { HiArrowLongLeft } from "react-icons/hi2";
import { MdSaveAlt } from "react-icons/md";
import patient from "@/app/assets/images/patient.svg";
import hand from "@/app/assets/images/injection.svg";
import lady from "@/app/assets/images/ladyPatient.svg";
import Image from "next/image";
import LineChart from "@/importedCompo/components/charts/LineChart";
import heart from "@/app/assets/images/heart.svg";
import { MessageCircle, PhoneCall } from "lucide-react";
import { FaChevronRight } from "react-icons/fa";
import VerticalBarDemo from "@/components/ui/lineGraph";
function index() {

  const data = [
    { title: "Heart Failure", date: "OCT 14, 2022", status: "Completed" },
    { title: "Lorem Ipsum", date: "DEC 25, 2022", status: "In Progress" },
    { title: "Sample Task", date: "JAN 5, 2023", status: "Not Started" },
  ];

const lineData = {
  labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  datasets: [
    {
      label: 'First Dataset',
      data: [20, 60, 50, 70, 80, 90],
      fill: false,
      borderColor: '#22C55E',
      tension: 0.4,
    },
  ],
};

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
              {data.map((item, index) => (
                <div key={index} className="w-full h-[91px] bg-slate-200 rounded-xl gap-x-2 items-center grid grid-cols-[max-content_1fr_max-content]">
                  <div className="w-[66px] h-[67px] bg-white rounded-md ml-2 flex items-center justify-center">
                    <Image src={heart} alt="heart" />
                  </div>
                  <div className="">
                    <h1 className="text-zinc-800 text-xs font-bold leading-loose">
                      {item.title}
                    </h1>
                    <h1 className="text-zinc-800 text-opacity-70 text-xs font-medium leading-loose">
                      {item.date}
                    </h1>
                    <div className="flex gap-x-1 items-center">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                      <h1 className="text-zinc-800 text-opacity-70 text-xs font-medium leading-loose">
                        {item.status}
                      </h1>
                    </div>
                  </div>
                  <div className="mr-2">
                    <FaChevronRight />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[32rem] p-2 rounded-lg">
            <div className="w-[731px] ml-4 h-full relative bg-white rounded-[22px] border border-stone-200">
            <VerticalBarDemo/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default index;