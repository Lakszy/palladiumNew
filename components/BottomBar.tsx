import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { XCircle, MoveLeft } from 'lucide-react';
import Link from 'next/link';

interface MenuItem {
  title: string;
  placeholder: string;
  inputType: string;
  options?: string[];
  icon?: React.ElementType;
}
const menuItems: MenuItem[] = [
  { title: 'Name', placeholder: 'Enter patient name', inputType: 'text' },
  { title: 'Date of Birth', placeholder: 'DD/MM/YYYY', inputType: 'date' },
  { title: 'Gender', placeholder: 'Enter patient gender', inputType: 'text' },
  { title: 'Address', placeholder: 'Enter patient address', inputType: 'text' },
  { title: 'City', placeholder: 'Enter patient city', inputType: 'text' },
  { title: 'Zip Code', placeholder: 'Enter patient city', inputType: 'text' },
  {
    title: 'State',
    placeholder: 'Select patient State',
    inputType: 'select',
    options: [
      'Andhra Pradesh',
      'Arunachal Pradesh',
      'Assam',
      'Bihar',
      'Chhattisgarh',
      'Goa',
      'Gujarat',
      'Haryana',
      'Himachal Pradesh',
      'Jharkhand',
      'Karnataka',
      'Kerala',
      'Madhya Pradesh',
      'Maharashtra',
      'Manipur',
      'Meghalaya',
      'Mizoram',
      'Nagaland',
      'Odisha',
      'Punjab',
      'Rajasthan',
      'Sikkim',
      'Tamil Nadu',
      'Telangana',
      'Tripura',
      'Uttar Pradesh',
      'Uttarakhand',
      'West Bengal',
      'Andaman and Nicobar Islands',
      'Chandigarh',
      'Dadra and Nagar Haveli and Daman and Diu',
      'Delhi',
      'Lakshadweep',
      'Puducherry',
    ],
  },
  { title: 'Phone', placeholder: '+91', inputType: 'number' },
];

export const BottomBar = () => {
  const [selectedState, setSelectedState] = useState('');
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

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

  return (
    <div className="text-zinc-800 border border-[#F0E4E4] rounded-3xl p-2">
      <div className="flex items-center gap-x-2">
        <div className="p-3 bg-white rounded-[30px] border border-[#F0E4E4] justify-start items-center gap-2 flex">
          <Link href="/">
            <MoveLeft size={24} className="ps-0.5 cursor-pointer" />
          </Link>
        </div>
        <div className="text-xl font-semibold">Create new appointment</div>
      </div>
      <div>
        <h6 className="relative text-lg mt- md:top-1/2 md:transform md:translate-y-6 md:left-1">Basic Details</h6>
      </div>
      <div className="grid lg:grid-cols-[1fr_1fr] gap-y-8 p-3 mt-5 md:mt-12">
        {menuItems.map((menuItem) => (
          <div key={menuItem.title} className="text-zinc-800 items-center gap-x-1">
            <div className="text-xl font-semibold">{menuItem.title}</div>
            {menuItem.inputType === 'select' ? (
              <div className="relative">
                <select
                  className={`w-[19.75rem] lg:w-[35.25rem] py-4 bg-white rounded-2xl border border-stone-200 justify-around text-zinc-400 ${selectedState ? '' : 'text-black'
                    }`}
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    handleInputChange(menuItem.title, e.target.value);
                  }}
                >
                  <option value="" disabled hidden>
                    {menuItem.placeholder}
                  </option>
                  {menuItem.options &&
                    menuItem.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </div>
            ) : (
              <div className="relative text-zinc-800">
                <input
                  className="pl-2.5 justify-around w-[19.75rem] lg:w-[35.25rem] py-4 white-nowrap bg-white rounded-2xl text-zinc-800 border border-[#F0E4E4] items-center gap-2.5 inline-flex px-2"
                  placeholder={menuItem.placeholder}
                  type={menuItem.inputType}
                  value={inputValues[menuItem.title] || ''}
                  onChange={(e) => handleInputChange(menuItem.title, e.target.value)}
                />
                {inputValues[menuItem.title] && (
                  <XCircle
                    className="absolute top-1/2 transform -translate-y-1/2 -translate-x-10 right-0.5 cursor-pointer text-orange-300"
                    onClick={() => clearInput(menuItem.title)}
                  />
                )}
              </div>
            )}
          </div>
        ))}
        <div className="flex flex-col">
          <div className="w-[135px] h-[55px] px-[36px] py-[3px] bg-gray-900 bg-opacity-60 rounded-[30px] justify-start items-center gap-2 inline-flex">
            <div className="text-white text-lg font-semibold">Next</div>
            <FaArrowRight className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
