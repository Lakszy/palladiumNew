"use client";
import React from "react";
import InputField from "@/components/ui/InputField";
import { HiArrowLongLeft } from "react-icons/hi2";
import { MdClose, MdSaveAlt } from "react-icons/md";
import patient from "@/app/assets/images/patient.svg";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Image from "next/image";
import { PhoneCall, Mail } from "lucide-react";
import { Thermometer, Ruler, Weight, Activity, Brain, Stethoscope, Plus } from 'lucide-react';
import { FiSearch } from "react-icons/fi";
import { BsChevronRight } from "react-icons/bs";
import { InputTextarea } from "primereact/inputtextarea";
function index() {


    interface MenuItemType {
        title: string;
        placeholder: string;
        inputType: string;
        options?: string[];
    }
    interface MenuItemType2 {
        title: string;
        placeholder: string;
        inputType: string;
        options?: string[];
    }
    const menuItems2: MenuItemType2[] = [
        { title: 'DocName', placeholder: 'Enter patient name', inputType: 'text1' },
        { title: 'Title', placeholder: 'Physician', inputType: 'text' },
        { title: 'Mobile', placeholder: '+91-8034896146', inputType: 'number' },
        { title: 'Email', placeholder: 'dr.nityasen@gmail.com', inputType: 'text' },

    ]
    const menuItems: MenuItemType[] = [
        { title: 'Next Visit', placeholder: '16 Days', inputType: 'text' },
        { title: 'Calendar', placeholder: 'DD/MM/YYYY', inputType: 'date' },
    ]
    const [selectedState, setSelectedState] = React.useState<string>('');
    const [inputValues, setInputValues] = React.useState<{ [key: string]: string }>({});

    const handleInputChange = (key: string, value: string) => {
        setInputValues((prev) => {
            const updatedValues = { ...prev, [key]: value };
            console.log(updatedValues);
            return updatedValues;
        });
    };

    const clearInput = (key: string) => {
        setInputValues((prev) => ({ ...prev, [key]: '' }));
    };
    const prescription = [
        'Asthma Inhaler',
        'Antibiotics',
        'Pain Reliever',
        'Amoxicillin',
        'Lisinopril',
        'Atorvastatin',
        'Sertraline'
    ];
    const complaints = [
        {
            id: 1,
            medicine: 'Razel CV 10MG Tablet',
            medicineSalt: '(CLSDDSHJK75MG + RTYUJWHS 10MG)',
            dose: '1 - 0 - 1y',
            when: 'After Food',
            duration: '1 Month',
            frequency: 'Daily',
            notes: '-',
        },
        {
            id: 2,
            medicine: 'Razel CV 10MG Tablet',
            medicineSalt: '(CLSDDSHJK 75 MG + RTYUJWHS 10MG)',
            dose: '1 - 0 - 1y',
            when: 'After Food',
            duration: '1 Month',
            frequency: 'Daily',
            notes: '-',
        }
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
            <div className="p-4 bg-gray-50">
                <div className="flex overflow-x-auto salts justify-between mb-6">
                    <div className="flex  items-center gap-x-2">
                        <div className="border rounded-full w-fit p-2">
                            <HiArrowLongLeft size={32} className="font-xs" />
                        </div>
                        <h1 className="text-zinc-800 text-xl font-bold  ">
                            Patient Details
                        </h1>
                    </div>
                    <div className="gap-x-3 flex">
                        <div className="bg-white flex h-full border items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[325px]">
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
                <div className="w-full overflow-x-auto salts ml-2 justify-between px-2 border-gray-200 rounded-3xl  bg-white border-2 h-[177px] items-center gap-3 inline-flex">
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
                        <div className="hover:cursor-pointer p-[18px] bg-white rounded-[30px] border border-stone-200 justify-start items-start gap-2.5 flex w-fit">
                            <PhoneCall className="text-gray-400" />
                        </div>
                        <div className="hover:cursor-pointer px-4 py-[18px] bg-white rounded-[30px] border border-stone-200 justify-start items-start gap-2.5 flex w-fit">
                            <Mail className="text-gray-400" />
                        </div>
                    </div>
                </div>
                <div className="max-w-full salts overflow-x-auto mt-5 whitespace-nowrap inline-flex gap-3 gap-x-4 ml-3">
                    {prescription.map((medication, index) => (
                        <div key={index} className="bg-white border hover:cursor-pointer border-stone-200 rounded-[30px] px-6 py-2">
                            <div className="text-zinc-800 text-opacity-80 text-lg font-medium ">
                                {medication}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex bg-white h-full border border-stone-200 mt-3 py-4 items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white w-[11rem] ml-3">
                    <p className=" pl-3 pr-2 text-xl text-gray-800 ">
                        <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
                    </p>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="block text-lg h-full w-full rounded-full bg-lightPrimary font-medium text-navy-700 outline-none placeholder:!text-gray-600 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white "
                    />
                </div>
                <div className="h-fit mt-2 gap-x-4 bg-white   ">
                    <div className="border-2 rounded-lg ">
                        <h1 className="text-[22px] font-semibold text-gray-500  p-2 pl-7 pt-3">Vitals</h1>
                        <div className="w-full h-[122px] justify-start items-start gap-x-3 gap-y-2 inline-flex flex-wrap ml-4 mb-4">
                            {vitals.map((vital, index) => (
                                <div
                                    key={index}
                                    className="w-fit hover:cursor-pointer h-[55px] px-[10px] py-[3px] bg-white rounded-[30px] border border-stone-200 justify-start items-center gap-3 flex "
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
                                <div className="text-red-500  text-lg font-semibold whitespace-nowrap hover:cursor-pointer">
                                    Remove
                                </div>
                            </div>
                        </div>


                        <div className=" ml-5 overflow-x-auto salts grid grid-cols-[1fr_1fr] lg:gap-x-2">
                            <div>
                                <h1 className="text-[22px] font-semibold text-gray-500 p-2 pl-5">Diagnosis</h1>
                                <div className="border w-fit px-2 items-center gap-x-8 h-[5.5rem] rounded-xl flex whitespace-nowrap min-w-[30rem]">


                                    <div className="w-[8.6rem] h-12 px-3.5 py-3 bg-blue-700 bg-opacity-10 rounded-xl justify-center items-center gap-x-2 inline-flex">
                                        <div className="text-blue-700 text-base font-semibold  leading-7">Diabetes</div>
                                        <div className="self-stretch justify-start items-start  flex">
                                            <MdClose className="bg-white rounded-full mt-1" />
                                        </div>
                                    </div>
                                    <div className="w-[8.6rem] h-12 px-3.5 py-3 bg-blue-700 bg-opacity-10 rounded-xl justify-center items-center gap-x-2 inline-flex">
                                        <div className="text-blue-700 text-base font-semibold  leading-7">Jaundice</div>
                                        <div className="self-stretch justify-start items-start  flex">
                                            <MdClose className="bg-white rounded-full mt-1" />
                                        </div>
                                    </div>
                                    <div className="w-[8.6rem] h-12 px-3.5 py-3 bg-blue-700 bg-opacity-10 rounded-xl justify-center items-center gap-x-2 inline-flex">
                                        <div className="text-blue-700 text-base font-semibold  leading-7">Diarrhea</div>
                                        <div className="self-stretch justify-start items-start  flex">
                                            <MdClose className="bg-white rounded-full mt-1" />
                                        </div>
                                    </div>

                                    <BsChevronRight className="-" />
                                </div>
                                <div className="max-w-full  salts overflow-x-auto mt-3 whitespace-nowrap inline-flex gap-3 gap-x-4 ml">
                                    <div className="bg-white border hover:cursor-pointer border-stone-200 rounded-[30px] px-4 py-2">
                                        <div className="text-zinc-800 text-opacity-80 text-lg font-medium ">
                                            Hypothroidism
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div>
                                <h1 className="text-[22px] font-semibold text-gray-500 p-2 pl-5">Complaints</h1>
                                <div className="border w-fit px-2 items-center gap-x-8 h-[5.5rem] rounded-xl flex whitespace-nowrap min-w-[30rem]">


                                    <div className="w-[8.6rem] h-12 px-3.5 py-3 bg-blue-700 bg-opacity-10 rounded-xl justify-center items-center gap-x-2 inline-flex">
                                        <div className="text-blue-700 text-base font-semibold  leading-7">Hair fall</div>
                                        <div className="self-stretch justify-start items-start  flex">
                                            <MdClose className="bg-white rounded-full mt-1" />
                                        </div>
                                    </div>
                                    <div className="w-[8.6rem] h-12 px-3.5 py-3 bg-blue-700 bg-opacity-10 rounded-xl justify-center items-center gap-x-2 inline-flex">
                                        <div className="text-blue-700 text-base font-semibold  leading-7">Swollen Foot</div>
                                        <div className="self-stretch justify-start items-start  flex">
                                            <MdClose className="bg-white rounded-full mt-1" />
                                        </div>
                                    </div>
                                    <div className="w-[8.6rem] h-12 px-3.5 py-3 bg-blue-700 bg-opacity-10 rounded-xl justify-center items-center gap-x-2 inline-flex">
                                        <div className="text-blue-700 text-base font-semibold  leading-7">Fever</div>
                                        <div className="self-stretch justify-start items-start  flex">
                                            <MdClose className="bg-white rounded-full mt-1" />
                                        </div>
                                    </div>

                                    <BsChevronRight className="-" />
                                </div>
                                <div className="max-w-full  salts overflow-x-auto mt-3  whitespace-nowrap inline-flex gap-3 gap-x-4 ml">

                                    <div className="bg-white border hover:cursor-pointer border-stone-200 rounded-[30px] px-4 py-2">
                                        <div className="text-zinc-800 text-opacity-80 text-lg font-medium ">
                                            Headache
                                        </div>
                                    </div>
                                    <div className="bg-white border hover:cursor-pointer border-stone-200 rounded-[30px] px-4 py-2">
                                        <div className="text-zinc-800 text-opacity-80 text-lg font-medium ">
                                            Joint Pain
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                        <div className="text-[22px] font-semibold text-gray-500  p-2 pl-7 pt-6">Medical Prescription</div>
                        <div className="bg-green-500 salts bg-opacity-20 rounded-[22px] mt-4 mx-6">
                            <div className="p-5">
                                <DataTable value={complaints} className="p-datatable-custom">
                                    <Column className="text-gray-800 font-medium" field="id" header="#" style={{ width: '10%' }} />
                                    <Column
                                        field="medicine"
                                        header="Medicine"
                                        body={(rowData) => (
                                            <>
                                                <div className="font-medium text-[18px]">{rowData.medicine}</div>
                                                <div className="text-gray-400 font-medium w-[10rem]">{rowData.medicineSalt}</div>
                                            </>
                                        )}
                                        style={{ width: '30%' }}
                                    />
                                    <Column className="text-gray-800 font-medium text-[18px]" field="dose" header="Dose" style={{ width: '15%' }} />
                                    <Column className="text-gray-800 font-medium text-[18px]" field="when" header="When" style={{ width: '15%' }} />
                                    <Column className="text-gray-800 font-medium text-[18px]" field="duration" header="Duration" style={{ width: '15%' }} />
                                    <Column className="text-gray-800 font-medium text-[18px]" field="frequency" header="Frequency" style={{ width: '15%' }} />
                                    <Column className="text-gray-800 font-medium text-[18px]" field="notes" header="Notes" style={{ width: '20%' }} />
                                </DataTable>
                                <div className="flex gap-x-2 mt-5 mb-5">
                                    <div className="h-[55px] px-[21px] py-[3px] bg-white rounded-[30px] border border-stone-200 justify-start items-center gap-3 inline-flex">
                                        <div className="justify-start items-center gap-2 flex hover:cursor-pointer">
                                            <Plus />
                                            <div className="text-zinc-800 text-opacity-80 text-lg font-semibold">Add new </div>
                                        </div>
                                    </div>
                                    <div className="hover:cursor-pointer h-[55px] px-[21px] py-[3px] text-red-500 bg-white rounded-[30px] border border-stone-200 justify-start items-center gap-3 inline-flex">
                                        <div className="text-red-500 text-opacity-80 text-lg font-semibold">Remove </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-[22px] font-semibold text-gray-500  p-2 pl-8 pt-5">Advice</div>
                        <div className="card border-2 mx-6 flex justify-content-center rounded-lg">
                            <InputTextarea
                                className="rounded-lg"
                                placeholder="Reduce salt intake and Exercise Regularly"
                                rows={10}
                                cols={500}
                                style={{ width: '100%', padding: '10px', margin: '10px' }}
                            />
                        </div>
                        <div className="text-[22px] font-semibold text-gray-500  p-2 pl-6 pt-3">Test Requested</div>
                        <div className=" ml-5 overflow-x-auto salts grid grid-cols-[1fr_1fr] gap-x-5">
                            <div>
                                <h1 className="text-xl text-gray-800 font-medium border-[#F0E4E4] mb-2"></h1>
                                <div className="border w-fit px-2 items-center gap-x-8 h-[5.5rem] rounded-xl flex whitespace-nowrap min-w-[30rem]">


                                    <div className="w-[8.6rem] h-12 px-3.5 py-3 bg-blue-700 bg-opacity-10 rounded-xl justify-center items-center gap-x-2 inline-flex">
                                        <div className="text-blue-700 text-base font-semibold  leading-7">Diabetes</div>
                                        <div className="self-stretch justify-start items-start  flex">
                                            <MdClose className="bg-white rounded-full mt-1" />
                                        </div>
                                    </div>
                                    <div className="w-[8.6rem] h-12 px-3.5 py-3 bg-blue-700 bg-opacity-10 rounded-xl justify-center items-center gap-x-2 inline-flex">
                                        <div className="text-blue-700 text-base font-semibold  leading-7">Jaundice</div>
                                        <div className="self-stretch justify-start items-start  flex">
                                            <MdClose className="bg-white rounded-full mt-1" />
                                        </div>
                                    </div>
                                    <div className="w-[8.6rem] h-12 px-3.5 py-3 bg-blue-700 bg-opacity-10 rounded-xl justify-center items-center gap-x-2 inline-flex">
                                        <div className="text-blue-700 text-base font-semibold  leading-7">Diarrhea</div>
                                        <div className="self-stretch justify-start items-start  flex">
                                            <MdClose className="bg-white rounded-full mt-1" />
                                        </div>
                                    </div>

                                    <BsChevronRight className="-" />
                                </div>
                                <div className="max-w-full  salts overflow-x-auto mt-3  whitespace-nowrap inline-flex gap-3 gap-x-4 ml">
                                    <div className="bg-white border hover:cursor-pointer border-stone-200 rounded-[30px] px-2 py-2">
                                        <div className="text-zinc-800 text-opacity-80 text-lg font-medium rounded-2xl ">
                                            CBC
                                        </div>
                                    </div>
                                    <div className="bg-white border hover:cursor-pointer border-stone-200 rounded-[30px] px-2 py-2">
                                        <div className="text-zinc-800 text-opacity-80 text-lg font-medium rounded-2xl ">
                                            MRI
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div>
                                <h1 className="text-xl text-gray-800 font-medium border-[#F0E4E4] mb-2"></h1>
                                <div className="border w-fit px-2 items-center gap-x-8 h-[5.5rem] rounded-xl flex whitespace-nowrap min-w-[30rem]">


                                    <div className="w-[8.6rem] h-12 px-3.5 py-3 bg-blue-700 bg-opacity-10 rounded-xl justify-center items-center gap-x-2 inline-flex">
                                        <div className="text-blue-700 text-base font-semibold  leading-7">Hair fall</div>
                                        <div className="self-stretch justify-start items-start  flex">
                                            <MdClose className="bg-white rounded-full mt-1" />
                                        </div>
                                    </div>
                                    <div className="w-[8.6rem] h-12 px-3.5 py-3 bg-blue-700 bg-opacity-10 rounded-xl justify-center items-center gap-x-2 inline-flex">
                                        <div className="text-blue-700 text-base font-semibold  leading-7">Swollen Feet</div>
                                        <div className="self-stretch justify-start items-start  flex">
                                            <MdClose className="bg-white rounded-full mt-1" />
                                        </div>
                                    </div>

                                    <div className="w-[8.6rem] h-12 px-3.5 py-3 bg-blue-700 bg-opacity-10 rounded-xl justify-center items-center gap-x-2 inline-flex">
                                        <div className="text-blue-700 text-base font-semibold  leading-7">Fever</div>
                                        <div className="self-stretch justify-start items-start  flex">
                                            <MdClose className="bg-white rounded-full mt-1" />
                                        </div>
                                    </div>

                                    <BsChevronRight className="-" />
                                </div>
                                <div className="max-w-full  salts overflow-x-auto mt-3  whitespace-nowrap inline-flex gap-3 gap-x-4 ml">

                                    <div className="bg-white border hover:cursor-pointer border-stone-200 rounded-[30px] px-4 py-2">
                                        <div className="text-zinc-800 text-opacity-80 text-lg font-medium rounded-2xl">
                                            Morning
                                        </div>
                                    </div>
                                    <div className="bg-white border hover:cursor-pointer border-stone-200 rounded-[30px] px-4 py-2">
                                        <div className="text-zinc-800 text-opacity-80 text-lg font-medium rounded-2xl">
                                            After Breakfast
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                        <div className="mx-6  gap-x-4 mt-5 salts">
                            <div className="flex gap-x-10 overflow-x-auto salts">
                                {menuItems.map((menuItem) => (
                                    <div key={menuItem.title} className="text-zinc-800 items-center gap-x-1">
                                        <InputField
                                           
                                            label={menuItem.title}
                                            placeholder={menuItem.placeholder}
                                            inputType={menuItem.inputType}
                                            value={inputValues[menuItem.title] || ''}
                                            onChange={(value: string) => handleInputChange(menuItem.title, value)}
                                            onClear={() => clearInput(menuItem.title)}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="max-w-full  salts overflow-x-auto mt-3 whitespace-nowrap inline-flex gap-3 gap-x-4 ml">
                                <div className="bg-white border hover:cursor-pointer border-stone-200 rounded-[30px]  px-2 py-2">
                                    <div className="text-zinc-800 text-opacity-80 text-lg font-medium rounded-2xl  ">
                                        Days
                                    </div>
                                </div>
                                <div className="bg-white border hover:cursor-pointer border-stone-200 rounded-[30px] px-2 py-2">
                                    <div className="text-zinc-800 text-opacity-80 text-lg font-medium rounded-2xl ">
                                        Week
                                    </div>
                                </div>
                                <div className="bg-white border hover:cursor-pointer border-stone-200 rounded-[30px] px-2 py-2">
                                    <div className="text-zinc-800 text-opacity-80 text-lg font-medium rounded-2xl ">
                                        Month
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="text-[22px] font-semibold text-gray-500 mt-5 p-2 pl-7">Reffered to</div>
                        <div>
                            <div className="bg-green-500 salts bg-opacity-20 rounded-[22px] pb-6 mx-7 mb-4 overflow-x-auto">
                                {/* <div className="p-5"> */}
                                <div className="grid grid-cols-[1fr_1fr] p-5 gap-x-10">
                                    {menuItems2.map((menuItem) => (
                                        <div key={menuItem.title} className="text-zinc-800 items-center gap-x-1">
                                            <InputField
                                                label={menuItem.title}
                                                placeholder={menuItem.placeholder}
                                                inputType={menuItem.inputType}
                                                value={inputValues[menuItem.title] || ''}
                                                onChange={(value: string) => handleInputChange(menuItem.title, value)}
                                                onClear={() => clearInput(menuItem.title)}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-x-2 ml-5  ">
                                    <div className="h-[55px] px-[21px] py-[3px] bg-white rounded-[30px] border border-stone-200 justify-start items-center gap-3 inline-flex">
                                        <div className="justify-start items-center gap-2 flex hover:cursor-pointer">
                                            <Plus />
                                            <div className="text-zinc-800 text-opacity-80 text-lg font-semibold">Add new </div>
                                        </div>
                                    </div>
                                    <div className="hover:cursor-pointer h-[55px] px-[21px] py-[3px] text-red-500 bg-white rounded-[30px] border border-stone-200 justify-start items-center gap-3 inline-flex">
                                        <div className="text-red-500 text-opacity-80 text-lg font-semibold">Remove </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* </div> */}
        </>
    );
}
export default index;