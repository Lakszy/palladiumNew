import UiWrapper from "../../importedCompo/components/wrapper/uiWrapper";
import { IoIosArrowRoundBack, IoMdSearch } from "react-icons/io";
import pills from "../assets/images/pills.svg";
import Image from "next/image";
import { PrimaryButton } from "../../importedCompo/components/Button";
import { GoDownload } from "react-icons/go";



const PatientProfile = () => {
  const menus = ["Asthma inhaler", "Antibiotic", "Pain reliver", "Axoxicilim", "Lisinopril","Atorvastatin", "Sertraline"];
  return (
    <UiWrapper >
      <div className="flex items-center justify-between ">
        <div className="flex  items-center gap-x-2 ">
          <PrimaryButton leftIcon={<IoIosArrowRoundBack size={20} />} btnClases="rounded-full p-2 border"/>
          <p className="text-[#2C2C2C] font-semibold leading-7">
            Recommended Prescription
          </p>
        </div>
        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-1 px-4 py-3 rounded-full border max-w-[300px]">
            <IoMdSearch size={18} />
            <input
              type="text"
              placeholder="Search medications..."
              className="text-sm max-w-[300px] w-full"
            />
          </div>
          <div className="">
            <div className="flex  items-center gap-x-2 ">
              <PrimaryButton lable="Export" leftIcon={<GoDownload size={18} className="font-medium"/>} btnClases="text-[#0053F4] flex items-center gap-x-2  px-4 py-2 rounded-full border border-[#0053F4] text-[#0053F4] bg-[#0053F410]  font-medium leading-7"/>
            </div>
          </div>
          <div>
            <div className="flex  items-center gap-x-2 ">
            <PrimaryButton lable="Recommend" btnClases="text-white  px-4 py-2 rounded-full bg-[#243241]  font-medium leading-7"/>
            </div>
          </div>
        </div>
      </div>
      <div className=" mt-4 mb-4 nav-menus flex items-center justify-between ">
        {menus.map((menu, index) => {
          return (
            <div key={index} className="bg-white border text-[#2C2C2C80] font-medium border-[#F0E4E4] rounded-full px-5 py-2">
              {menu}
            </div>
          )
        })}
      </div>
      <div className="grid grid-cols-[64%_35%] gap-x-2">
        <div className="flex items-center justify-center border-2 border-dashed bg-[#F8F8F9] min-h-[70vh] border-[#0053F4]  rounded-lg">
          <div className="flex items-center flex-col justify-center"> 
            <Image src={pills} alt=""/>
            <p className="max-w-[350px] font-semibold text-center leading-7 text-[#2C2C2C]">Your recommended prescription for patient will be shown here</p>
            <PrimaryButton lable="Recommend" btnClases="bg-[#243241] text-white  w-[200px]  py-2 rounded-full mt-3"/>
          </div>
        </div>
        <div className="border-2 border-dashed bg-[#F8F8F9] min-h-[40vh] border-[#0053F4]  rounded-lg">
          
        </div>
      </div>
    </UiWrapper>
  );
};

export default PatientProfile;