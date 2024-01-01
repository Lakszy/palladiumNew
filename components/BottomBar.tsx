import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FaArrowRight } from 'react-icons/fa';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import InputField from './ui/InputField';

interface MenuItemType {
  title: string;
  placeholder: string;
  inputType: string;
  options?: string[];
}

const menuItems: MenuItemType[] = [
  { title: 'Name', placeholder: 'Enter patient name', inputType: 'text' },
  { title: 'Date of Birth', placeholder: 'DD/MM/YYYY', inputType: 'date' },
  { title: 'Gender', placeholder: 'Enter patient gender', inputType: 'text' },
  { title: 'Address', placeholder: 'Enter patient address', inputType: 'text' },
  { title: 'City', placeholder: 'Enter patient city', inputType: 'text' },
  { title: 'Zip Code', placeholder: 'Enter patient zip code', inputType: 'text' },
  {
    title: 'State',
    placeholder: 'Select patient state',
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
];

const BottomBar = () => {
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

  return (
    <div className="text-zinc-800 border  rounded-3xl p-2">
      <div className="flex items-center gap-x-2">
        <div className="p-3 bg-white rounded-[30px] border border-[#] justify-start items-center gap-2 flex">
          <Link href="/">
            <MoveLeft size={24} className="ps-0.5 cursor-pointer" />
          </Link>
        </div>
        <div className="text-xl font-semibold">Create new appointment</div>
      </div>
      <div>
        <h6 className="relative text-xl mt- md:top-1/2 md:transform md:translate-y-6 md:left-1">Basic Details</h6>
      </div>
      <div className="justify-end items-end flex cursor-pointer">
        <div className="w-[135px] h-[55px] px-[36px] lg:mt-6 hover:bg-zinc-800 bg-zinc-700 rounded-[30px] justify-start items-center gap-2 inline-flex">
          <div className="text-white text-lg font-semibold">Next</div>
          <FaArrowRight className="text-white" />
        </div>
      </div>
      <div className="grid lg:grid-cols-[1fr_1fr] gap-y-8 p-3 mt-5 md:mt-12">
        {menuItems.map((menuItem) => (
          <div key={menuItem.title} className="text-zinc-800 items-center gap-x-1">
            {menuItem.inputType === 'select' ? (
              <div className="relative">
                <div style={{ fontSize: '1.3rem', fontWeight: '500', fontFamily: "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif" }}>
                  {menuItem.title}
                </div>
                <div className=' justify-around w-[19.75rem] lg:w-[35.25rem]  white-nowrap bg-white rounded-2xl text-zinc-800 items-center'>
                  <FormControl fullWidth className="no-border ">
                    <Select
                      labelId={`select-label-${menuItem.title}`}
                      id={`select-${menuItem.title}`}
                      value={selectedState}
                      onChange={(e: SelectChangeEvent<string>) => {
                        setSelectedState(e.target.value);
                        handleInputChange(menuItem.title, e.target.value);
                      }}
                    >
                      <MenuItem value="" disabled>
                        {menuItem.placeholder}
                      </MenuItem>
                      {menuItem.options &&
                        menuItem.options.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>
              </div>

            ) : (
              <InputField
                label={menuItem.title}
                placeholder={menuItem.placeholder}
                inputType={menuItem.inputType}
                value={inputValues[menuItem.title] || ''}
                onChange={(value: string) => handleInputChange(menuItem.title, value)}
                onClear={() => clearInput(menuItem.title)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomBar;
