"use client";
import React from "react";
import { HiArrowLongLeft } from "react-icons/hi2";
import { MdSaveAlt } from "react-icons/md";
import patient from "@/app/assets/images/patient.svg";
import Image from "next/image";
import { PhoneCall, Mail, ArrowBigUp } from "lucide-react";
import { Thermometer, Ruler, Weight, Activity, Brain, Stethoscope, Plus } from 'lucide-react';
import { IoMdSearch } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
function index() {

    const prescription = [
        'Asthma Inhaler',
        'Antibiotics',
        'Pain Reliever',
        'Amoxicillin',
        'Lisinopril',
        'Atorvastatin',
        'Sertraline'
    ];
    const vitals = [
        { icon: <Thermometer />, text: "30°C", scale: "" },
        { icon: <Ruler />, text: "165 cm", scale: "" },
        { icon: <Weight />, text: "82 Kg", scale: "" },
        { icon: "", text: "SPO2-12 %", scale: "" },
        { icon: <Activity />, text: "165 bpm", scale: "" },
        { icon: <Brain />, text: "61 cm", scale: "" },
        { icon: <Stethoscope />, text: "34 Kg.m2", scale: "" },
        { icon: <Plus />, text: "Add Other", scale: "" },
    ];

    return (
        <>
            <div className="p-4 ">
                <div className="flex justify-between mb-6">
                    <div className="flex items-center gap-x-2">
                        <div className="border rounded-full w-fit p-2">
                            <HiArrowLongLeft size={32} className="font-xs" />
                        </div>
                        <h1 className="text-zinc-800 text-xl font-bold  ">
                            Patient Details
                        </h1>
                    </div>
                    <div className="gap-x-3 flex">
                        <div className="flex h-full border items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[325px]">
                            <p className="pl-3 pr-2 text-xl">
                                <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
                            </p>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                            />
                        </div>

                        <div className="w-[130px] h-[55px] px-[21px] py-[3px] bg-blue-700 bg-opacity-10 rounded-[30px] border border-blue-700 justify-start items-center gap-2 inline-flex">
                            <div className="justify-start items-center gap-2 flex">
                                <MdSaveAlt className="text-blue-700" />
                                <div className="text-blue-700 text-lg font-semibold ">
                                    Export
                                </div>
                            </div>
                        </div>
                        <div className="w-[155px] h-[55px] px-[24px] py-[21px] bg-slate-800 rounded-[30px] justify-start items-center inline-flex">
                            <div className="text-white text-lg font-semibold ">
                                Recommend
                            </div>
                        </div>
                    </div>
                </div>


                <div className="w-[75rem] ml-2 justify-between px-2 border-gray-200 rounded-3xl  bg-white border-2 h-[177px] items-center gap-3 inline-flex">
                    <div className="gap-x-4 flex">
                        <Image
                            alt="patient"
                            className="w-[141px] h-[145px] rounded-[10px]"
                            src={patient}
                        />
                        <div>
                            <div className=" mb-1">
                                <div className="text-zinc-800 text-2xl font-bold whitespace-nowrap">
                                    Dheeraj Pandey
                                </div>
                                <div className="text-zinc-800 text-opacity-70 text-xl font-medium whitespace-nowrap">
                                    Noida, Uttar Pradesh
                                </div>
                            </div>
                            <div className="justify-start pt-2 pb-2 items-start gap-x-3 flex">
                                <div className="px-5 w-[147px] bg-lime-600 bg-opacity-10 rounded-[30px] justify-center items-center gap-2.5 flex">
                                    <div className="text-lime-600 text-xl font-medium  whitespace-nowrap">
                                        Sore throat
                                    </div>
                                </div>
                                <div className="px-5 bg-blue-700 bg-opacity-10 rounded-[30px] justify-center items-center gap-2.5 flex">
                                    <div className="text-blue-700 text-xl font-medium  whitespace-nowrap">
                                        Male
                                    </div>
                                </div>
                                <div className="px-5 bg-pink-600 bg-opacity-10 rounded-[30px] justify-center items-center gap-2.5 flex">
                                    <div className="text-pink-600 text-xl font-medium  whitespace-nowrap">
                                        42 Yr
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-x-4 -mt-[1rem] mr-6">
                        <div className="p-[18px] bg-white rounded-[30px] border border-stone-200 justify-start items-start gap-2.5 flex w-fit">
                            <PhoneCall className="text-gray-400" />
                        </div>
                        <div className="px-4 py-[18px] bg-white rounded-[30px] border border-stone-200 justify-start items-start gap-2.5 flex w-fit">
                            <Mail className="text-gray-400" />
                        </div>
                    </div>
                </div>
                <div className="w-[1051px] mt-5  whitespace-nowrap inline-flex gap-3 gap-x-4 ml-3">
                    {prescription.map((medication, index) => (
                        <div key={index} className="bg-white border border-stone-200 rounded-[30px] px-6 py-2">
                            <div className="text-zinc-800 text-opacity-80 text-lg font-medium ">
                                {medication}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex h-full border border-stone-200 mt-3 py-4 items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white w-[11rem] ml-2">
                    <p className="pl-3 pr-2 text-xl text-gray-800 ">
                        <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
                    </p>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="block text-lg h-full w-full rounded-full bg-lightPrimary font-medium text-navy-700 outline-none placeholder:!text-gray-600 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white "
                    />
                </div>

                <div className="grid grid-cols-[65%_35%] h-fit mt-2 gap-x-4 pr-10 ">
                    <div className="border-2 rounded-lg ">
                        <h1 className="text-[22px] font-semibold text-gray-500 p-2 pl-5">Vitals</h1>
                        <div className="w-[759px] h-[122px] justify-start items-start gap-x-3 gap-y-2 inline-flex flex-wrap ml-4 mb-4">
                            {vitals.map((vital, index) => (
                                <div
                                    key={index}
                                    className="w-fit h-[55px] px-[10px] py-[3px] bg-white rounded-[30px] border border-stone-200 justify-start items-center gap-3 flex "
                                >
                                    {vital.icon && (
                                        <div className="justify-start items-center gap-2 flex ">
                                            {vital.icon}
                                        </div>
                                    )}
                                    <div className="text-zinc-800 text-opacity-50 text-lg font-semibold whitespace-nowrap">
                                        {vital.text}
                                    </div>
                                    <div className="ml-2 text-zinc-800 text-opacity-50 text-sm whitespace-nowrap">
                                        {vital.scale}
                                    </div>
                                </div>
                            ))}
                            <div

                                className="  w-fit h-[55px] px-[10px] py-[3px]  rounded-[30px] border border-stone-200 justify-start items-center gap-3 flex "
                            >

                                <div className="text-red-500  text-lg font-semibold whitespace-nowrap">
                                    Remove
                                </div>

                            </div>




                        </div>
                        <div className="ml-3 pl-3 w-[739px] h-[244px] py-[22px] bg-green-500 bg-opacity-20 rounded-[22px] flex-col justify-start items-start gap-2.5 inline-flex mt-3">
                            <div className="flex-col justify-start items-start gap-5 flex">
                                <div className="text-zinc-800 text-xl font-bold  leading-7">Complaints</div>
                                <div className="flex-col justify-start items-start gap-[26px] flex">
                                    <div className="w-[659px] h-[13px] relative">
                                        <div className="left-0 top-0 absolute text-zinc-800 text-opacity-80 text-lg font-semibold  ">#</div>
                                        <div className="left-[43px] top-0 absolute text-zinc-800 text-opacity-80 text-lg font-semibold  ">Complaints</div>
                                        <div className="left-[263px] top-0 absolute text-zinc-800 text-opacity-80 text-lg font-semibold  ">Frequency</div>
                                        <div className="left-[414px] top-0 absolute text-zinc-800 text-opacity-80 text-lg font-semibold  ">Severity</div>
                                        <div className="left-[517px] top-0 absolute text-zinc-800 text-opacity-80 text-lg font-semibold  ">Duration</div>
                                        <div className="left-[618px] top-0 absolute text-zinc-800 text-opacity-80 text-lg font-semibold  ">Date</div>
                                    </div>
                                    <div className="w-[725px] h-[13px] relative">
                                        <div className="left-0 top-0 absolute text-zinc-800 text-lg font-semibold  ">1</div>
                                        <div className="left-[43px] top-0 absolute text-zinc-800 text-md font-semibold  whitespace-nowrap">Frequent urination </div>
                                        <div className="left-[263px] top-0 absolute text-zinc-800 text-md font-semibold  whitespace-nowrap">10 times a day</div>
                                        <div className="left-[414px] top-0 absolute text-zinc-800 text-md font-semibold  whitespace-nowrap">Severe</div>
                                        <div className="left-[517px] top-0 absolute text-zinc-800 text-md font-semibold  whitespace-nowrap">2 weeks</div>
                                        <div className="left-[618px] top-0 absolute text-zinc-800 text-md font-semibold  whitespace-nowrap">Sep 12, 2022</div>
                                    </div>
                                    <div className="w-[725px] h-[13px] relative">
                                        <div className="left-0 top-0 absolute text-zinc-800 text-lg font-semibold  ">2</div>
                                        <div className="left-[43px] top-0 absolute text-zinc-800 text-md font-semibold  whitespace-nowrap">Fever</div>
                                        <div className="left-[263px] top-0 absolute text-zinc-800 text-md font-semibold  whitespace-nowrap">2 weeks</div>
                                        <div className="left-[414px] top-0 absolute text-zinc-800 text-md font-semibold  whitespace-nowrap">Moderate</div>
                                        <div className="left-[517px] top-0 absolute text-zinc-800 text-md font-semibold  whitespace-nowrap">2 weeks</div>
                                        <div className="left-[618px] top-0 absolute text-zinc-800 text-md font-semibold  whitespace-nowrap">Sep 12, 2022</div>
                                    </div>
                                </div>
                                <div className="flex gap-x-2">
                                    <div className="h-[55px] px-[21px] py-[3px] bg-white rounded-[30px] border border-stone-200 justify-start items-center gap-3 inline-flex">
                                        <div className="justify-start items-center gap-2 flex">
                                            <Plus />
                                            <div className="text-zinc-800 text-opacity-80 text-lg font-semibold ">Add new </div>
                                        </div>

                                    </div>
                                    <div className="h-[55px] px-[21px] py-[3px] text-red-500 bg-white rounded-[30px] border border-stone-200 justify-start items-center gap-3 inline-flex">
                                        <div className="text-red-500 text-opacity-80 text-lg font-semibold ">Remove </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="ml-3 pl-3 w-[739px] h-[244px] py-[22px] bg-green-500 bg-opacity-20 rounded-[22px] flex-col justify-start items-start gap-2.5 inline-flex mt-3">
                            <div className="flex-col justify-start items-start gap-5 flex">
                                <div className="text-zinc-800 text-xl font-bold  leading-7">Complaints</div>
                                <div className="flex-col justify-start items-start gap-[26px] flex">
                                    <div className="w-[659px] h-[13px] relative">
                                        <div className="left-0 top-0 absolute text-zinc-800 text-opacity-80 text-lg font-semibold  ">#</div>
                                        <div className="left-[43px] top-0 absolute text-zinc-800 text-opacity-80 text-lg font-semibold  ">Complaints</div>
                                        <div className="left-[263px] top-0 absolute text-zinc-800 text-opacity-80 text-lg font-semibold  ">Frequency</div>
                                        <div className="left-[414px] top-0 absolute text-zinc-800 text-opacity-80 text-lg font-semibold  ">Severity</div>
                                        <div className="left-[517px] top-0 absolute text-zinc-800 text-opacity-80 text-lg font-semibold  ">Duration</div>
                                        <div className="left-[618px] top-0 absolute text-zinc-800 text-opacity-80 text-lg font-semibold  ">Date</div>
                                    </div>
                                    <div className="w-[725px] h-[13px] relative">
                                        <div className="left-0 top-0 absolute text-zinc-800 text-lg font-semibold  ">1</div>
                                        <div className="left-[43px] top-0 absolute text-zinc-800 text-md font-semibold  whitespace-nowrap">Frequent urination </div>
                                        <div className="left-[263px] top-0 absolute text-zinc-800 text-md font-semibold  whitespace-nowrap">10 times a day</div>
                                        <div className="left-[414px] top-0 absolute text-zinc-800 text-md font-semibold  whitespace-nowrap">Severe</div>
                                        <div className="left-[517px] top-0 absolute text-zinc-800 text-md font-semibold  whitespace-nowrap">2 weeks</div>
                                        <div className="left-[618px] top-0 absolute text-zinc-800 text-md font-semibold  whitespace-nowrap">Sep 12, 2022</div>
                                    </div>
                                    <div className="w-[725px] h-[13px] relative">
                                        <div className="left-0 top-0 absolute text-zinc-800 text-lg font-semibold  ">2</div>
                                        <div className="left-[43px] top-0 absolute text-zinc-800 text-md font-semibold  whitespace-nowrap">Fever</div>
                                        <div className="left-[263px] top-0 absolute text-zinc-800 text-md font-semibold  whitespace-nowrap">2 weeks</div>
                                        <div className="left-[414px] top-0 absolute text-zinc-800 text-md font-semibold  whitespace-nowrap">Moderate</div>
                                        <div className="left-[517px] top-0 absolute text-zinc-800 text-md font-semibold  whitespace-nowrap">2 weeks</div>
                                        <div className="left-[618px] top-0 absolute text-zinc-800 text-md font-semibold  whitespace-nowrap">Sep 12, 2022</div>
                                    </div>
                                </div>
                                <div className="flex gap-x-2">
                                    <div className="h-[55px] px-[21px] py-[3px] bg-white rounded-[30px] border border-stone-200 justify-start items-center gap-3 inline-flex">
                                        <div className="justify-start items-center gap-2 flex">
                                            <Plus />
                                            <div className="text-zinc-800 text-opacity-80 text-lg font-semibold ">Add new </div>
                                        </div>

                                    </div>
                                    <div className="h-[55px] px-[21px] py-[3px] text-red-500 bg-white rounded-[30px] border border-stone-200 justify-start items-center gap-3 inline-flex">
                                        <div className="text-red-500 text-opacity-80 text-lg font-semibold ">Remove </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div className="border-2 pl-5 pt-3 bg-white rounded-lg overflow-y-auto pr-10">
                        <div className="w-[343px] h-[49px] px-[62px] py-5 bg-emerald-100 rounded-xl justify-center items-center gap-2.5 inline-flex">
                            <div className="text-zinc-800 text-md font-bold ">Suggestive Medications</div>
                        </div>
                        <div className="border-2 w-fit flex-col justify-start items-start gap-2.5 inline-flex p-2 m-2 bg-gray-100 rounded-xl">
                            <div className="w-[250px] justify-start items-center gap-1.5 inline-flex">
                                <div className="w-[35px] h-[35px] bg-stone-100 rounded-full flex items-center justify-center">
                                    <ArrowBigUp />
                                </div>
                                <div className="text-zinc-800 text-md font-bold">Growth charts</div>
                            </div>
                            <div className="flex-col justify-start items-start gap-3 flex">
                                <div className="text-zinc-800 text-base font-bold ">#8 visits</div>
                                <div className="text-zinc-800 text-opacity-70 text-md font-medium leading-none">Growth chart data is incomplete for the last<br />8 visits, Enter data via visits.</div>
                            </div>
                            <div className="p-2.5 justify-center items-center gap-2.5 ml-auto">
                                <div className="text-zinc-800 text-md font-bold">Ok, thanks</div>
                            </div>
                        </div>
                        <div className="border-2 w-fit flex-col justify-start items-start gap-2.5 inline-flex p-2 m-2 bg-gray-100 rounded-xl">
                            <div className="w-[250px] justify-start items-center gap-1.5 inline-flex">
                                <div className="w-[35px] h-[35px] bg-stone-100 rounded-full flex items-center justify-center">
                                    <ArrowBigUp />
                                </div>
                                <div className="text-zinc-800 text-md font-bold">Growth charts</div>
                            </div>
                            <div className="flex-col justify-start items-start gap-3 flex">
                                <div className="text-zinc-800 text-base font-bold ">#8 visits</div>
                                <div className="text-zinc-800 text-opacity-70 text-md font-medium leading-none">Growth chart data is incomplete for the last<br />8 visits, Enter data via visits.</div>
                            </div>
                            <div className="p-2.5 justify-center items-center gap-2.5 ml-auto">
                                <div className="text-zinc-800 text-md font-bold">Ok, thanks</div>
                            </div>
                        </div>
                        <div className="border-2 w-fit flex-col justify-start items-start gap-2.5 inline-flex p-2 m-2 bg-gray-100 rounded-xl">
                            <div className="w-[250px] justify-start items-center gap-1.5 inline-flex">
                                <div className="w-[35px] h-[35px] bg-stone-100 rounded-full flex items-center justify-center">
                                    <ArrowBigUp />
                                </div>
                                <div className="text-zinc-800 text-md font-bold">Growth charts</div>
                            </div>
                            <div className="flex-col justify-start items-start gap-3 flex">
                                <div className="text-zinc-800 text-base font-bold ">#8 visits</div>
                                <div className="text-zinc-800 text-opacity-70 text-md font-medium leading-none">Growth chart data is incomplete for the last<br />8 visits, Enter data via visits.</div>
                            </div>
                            <div className="p-2.5 justify-center items-center gap-2.5 ml-auto">
                                <div className="text-zinc-800 text-md font-bold">Ok, thanks</div>
                            </div>
                        </div>
                        <div className="border-2 w-fit flex-col justify-start items-start gap-2.5 inline-flex p-2 m-2 bg-gray-100 rounded-xl">
                            <div className="w-[250px] justify-start items-center gap-1.5 inline-flex">
                                <div className="w-[35px] h-[35px] bg-stone-100 rounded-full flex items-center justify-center">
                                    <ArrowBigUp />
                                </div>
                                <div className="text-zinc-800 text-md font-bold">Growth charts</div>
                            </div>
                            <div className="flex-col justify-start items-start gap-3 flex">
                                <div className="text-zinc-800 text-base font-bold ">#8 visits</div>
                                <div className="text-zinc-800 text-opacity-70 text-md font-medium leading-none">Growth chart data is incomplete for the last<br />8 visits, Enter data via visits.</div>
                            </div>
                            <div className="p-2.5 justify-center items-center gap-2.5 ml-auto">
                                <div className="text-zinc-800 text-md font-bold">Ok, thanks</div>
                            </div>
                        </div>
                        <div className="border-2 w-fit flex-col justify-start items-start gap-2.5 inline-flex p-2 m-2 bg-gray-100 rounded-xl">
                            <div className="w-[250px] justify-start items-center gap-1.5 inline-flex">
                                <div className="w-[35px] h-[35px] bg-stone-100 rounded-full flex items-center justify-center">
                                    <ArrowBigUp />
                                </div>
                                <div className="text-zinc-800 text-md font-bold">Growth charts</div>
                            </div>
                            <div className="flex-col justify-start items-start gap-3 flex">
                                <div className="text-zinc-800 text-base font-bold ">#8 visits</div>
                                <div className="text-zinc-800 text-opacity-70 text-md font-medium leading-none">Growth chart data is incomplete for the last<br />8 visits, Enter data via visits.</div>
                            </div>
                            <div className="p-2.5 justify-center items-center gap-2.5 ml-auto">
                                <div className="text-zinc-800 text-md font-bold">Ok, thanks</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div >
        </>
    );
}
export default index;