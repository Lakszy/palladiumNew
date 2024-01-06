import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import calender from "@/app/assets/images/calander.svg";
import icon from "@/app/assets/images/icon.svg";
import skeleton from '@/app/assets/images/skeleton.svg';
import girl from "@/app/assets/images/girl.svg";
import { IoIosArrowForward } from "react-icons/io";
import rightTick from "@/app/assets/images/rightTick.svg";
import loader from "@/app/assets/images/loader.svg";

export default function Tab() {
  return (
    <Tabs defaultValue="description" className="">
      <TabsList className="flex justify-start items-center gap-x-2 mt-4">
        <TabsTrigger
          value="description"
          className="rounded-full font-medium text-base border border-[#F0E4E4] px-5 py-2"
        >
          Description
        </TabsTrigger>
        <TabsTrigger
          value="schedule"
          className="rounded-full text-base font-medium border bg-black text-white border-[#F0E4E4] px-5 py-2"
        >
          Schedule
        </TabsTrigger>
        <TabsTrigger
          value="payment"
          className="rounded-full text-base font-medium border border-[#F0E4E4] px-5 py-2"
        >
          Payment Status
        </TabsTrigger>
      </TabsList>
      <TabsContent value="description" className="bg-white">
        <div className="mt-4 ml-4">
          <h3 className="font-bold text-[32px] leading-8 mb-4">
            I’m suffer from Jaundice for past “1 week”
          </h3>
          <p className="text-xl leading-7 text-[#2C2C2C70]">
            Ritu Singh suffering from jaundice presents with yellow
            discoloration of the skin and eyes, often accompanied by dark urine
            and pale stools. Jaundice may be indicative of a liver or bile duct
            problem, leading to an excess of bilirubin in the blood. Further
            investigation and medical evaluation are typically required to
            determine the underlying cause and initiate appropriate treatment.
          </p>
          <p className="text-xl leading-7 text-[#2C2C2C70] mt-4">
            Ritu Singh suffering from jaundice presents with yellow
            discoloration of the skin and eyes, often accompanied by dark urine
            and pale stools.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="schedule" className="bg-white">
        <div className="grid grid-cols-[400px,1fr] mt-4 ml-4">
          <div className="border border-[#F0E4E4] p-4 rounded-lg">
            <div className="rounded-lg py-10 bg-[#F3F6F3] flex items-center justify-center">
              <Image src={calender} width={100} alt="" />
            </div>
            <div className="flex items-center gap-x-2 mt-2">
              <div className="rounded-lg border  p-4">
                {/* <Image src={icon} alt="" width={45} /> */}
              </div>
              <div>
                <p className="text-xs font-semibold">Morning</p>
                <p className="text-xs">Jan 24, 2024</p>
                <p className="text-xs">10:20 Am to 11:20 Am</p>
              </div>
            </div>
            <div className="mt-2">
              <Image src={skeleton} alt="" />
            </div>
            <div className="mt-2">
              <Image src={skeleton} alt="" />
            </div>
          </div>
          <div className="flex items-center flex-col justify-center">
            <Image src={girl} alt="" />
            <p className="font-bold -mt-14">Re-schedule your appointment </p>
            <span className="text-center max-w-[450px] mt-2 text-sm font-medium text-[#2C2C2C70]">
              Jaundice may be indicative of a liver or bile duct problem,
              leading to an excess of bilirubin in the blood. Further
              investigation and medical evaluation
            </span>
            <button className="max-w-[450px] w-full border flex items-center justify-center rounded-full py-2 mt-3 bg-black text-white font-medium">
              Re-schedule <IoIosArrowForward />
            </button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="payment" className="bg-white">
        <div className="mt-4 ml-4 mr-4 flex flex-col gap-y-6">
          <div className="flex items-center justify-between border border-[#F0E4E4] rounded-xl p-2">
            <div className="flex items-center gap-x-2">
              <div className="bg-[#F3F6F3] p-6 rounded-md">
                <Image src={rightTick} alt="" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Payment done</span>
                <span className="font-semibold text-sm text-[#2C2C2C80]">
                  Rs. 1500
                </span>
                <span className="font-medium text-sm text-[#2C2C2C70] ">
                  Dec 12, 2023
                </span>
              </div>
            </div>
            <div className="text-[#2FB500] text-sm bg-[#2FB50010] rounded-3xl py-1 px-3">
              Jaundice
            </div>
          </div>
          <div className="flex items-center justify-between border border-[#F0E4E4] rounded-xl p-2">
            <div className="flex items-center gap-x-2">
              <div className="bg-[#F3F6F3] p-6 rounded-md">
                <Image src={rightTick} alt="" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Payment done</span>
                <span className="font-semibold text-sm text-[#2C2C2C80]">
                  Rs. 2000
                </span>
                <span className="font-medium text-sm text-[#2C2C2C70] ">
                  Nov 18, 2023
                </span>
              </div>
            </div>
            <div className="text-[#2FB500] text-sm bg-[#2FB50010] rounded-3xl py-1 px-3">
              Jaundice
            </div>
          </div>
          <div className="flex items-center justify-between border border-[#F0E4E4] rounded-xl p-2">
            <div className="flex items-center gap-x-2">
              <div className="bg-[#F3F6F3] p-6 rounded-md">
                <Image src={loader} alt="" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Pending...</span>
                <span className="font-semibold text-sm text-[#2C2C2C80]">
                  Rs. 2200
                </span>
                <span className="font-medium text-sm text-[#2C2C2C70] ">
                  Oct 02, 2023
                </span>
              </div>
            </div>
            <div className="text-[#0053F4] text-sm bg-[#0053F410] rounded-3xl py-1 px-3">
              Fever
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

export const Description = () => {
  return (
    <div className="mt-4 ml-4">
      <h3 className="font-bold text-[32px] leading-8 mb-4">
        I’m suffer from Jaundice for past “1 week”
      </h3>
      <p className="text-xl leading-7 text-[#2C2C2C70]">
        Ritu Singh suffering from jaundice presents with yellow discoloration of
        the skin and eyes, often accompanied by dark urine and pale stools.
        Jaundice may be indicative of a liver or bile duct problem, leading to
        an excess of bilirubin in the blood. Further investigation and medical
        evaluation are typically required to determine the underlying cause and
        initiate appropriate treatment.
      </p>
      <p className="text-xl leading-7 text-[#2C2C2C70] mt-4">
        Ritu Singh suffering from jaundice presents with yellow discoloration of
        the skin and eyes, often accompanied by dark urine and pale stools.
      </p>
    </div>
  );
};

export const Schedule = () => {
  return (
    <div className="grid grid-cols-[400px,1fr] mt-4 ml-4">
      <div className="border border-[#F0E4E4] p-4 rounded-lg">
        <div className="rounded-lg py-10 bg-[#F3F6F3] flex items-center justify-center">
          <Image src={calender} width={100} alt="" />
        </div>
        <div className="flex items-center gap-x-2 mt-2">
          <div className="rounded-lg border  p-4">
            <Image src={icon} alt="" width={45} />
          </div>
          <div>
            <p className="text-xs font-semibold">Morning</p>
            <p className="text-xs">Jan 24, 2024</p>
            <p className="text-xs">10:20 Am to 11:20 Am</p>
          </div>
        </div>
        <div className="mt-2">
          <Image src={skeleton} alt="" />
        </div>
        <div className="mt-2">
          <Image src={skeleton} alt="" />
        </div>
      </div>
      <div className="flex items-center flex-col justify-center">
        <Image src={girl} alt="" />
        <p className="font-bold -mt-14">Re-schedule your appointment </p>
        <span className="text-center max-w-[450px] mt-2 text-sm font-medium text-[#2C2C2C70]">
          Jaundice may be indicative of a liver or bile duct problem, leading to
          an excess of bilirubin in the blood. Further investigation and medical
          evaluation
        </span>
        <button className="max-w-[450px] w-full border flex items-center justify-center rounded-full py-2 mt-3 bg-black text-white font-medium">
          Re-schedule <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};

export const Payment = () => {
  return (
    <div className="mt-4 ml-4 mr-4 flex flex-col gap-y-6">
      <div className="flex items-center justify-between border border-[#F0E4E4] rounded-xl p-2">
        <div className="flex items-center gap-x-2">
          <div className="bg-[#F3F6F3] p-6 rounded-md">
            <Image src={rightTick} alt="" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Payment done</span>
            <span className="font-semibold text-sm text-[#2C2C2C80]">
              Rs. 1500
            </span>
            <span className="font-medium text-sm text-[#2C2C2C70] ">
              Dec 12, 2023
            </span>
          </div>
        </div>
        <div className="text-[#2FB500] text-sm bg-[#2FB50010] rounded-3xl py-1 px-3">
          Jaundice
        </div>
      </div>
      <div className="flex items-center justify-between border border-[#F0E4E4] rounded-xl p-2">
        <div className="flex items-center gap-x-2">
          <div className="bg-[#F3F6F3] p-6 rounded-md">
            <Image src={rightTick} alt="" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Payment done</span>
            <span className="font-semibold text-sm text-[#2C2C2C80]">
              Rs. 2000
            </span>
            <span className="font-medium text-sm text-[#2C2C2C70] ">
              Nov 18, 2023
            </span>
          </div>
        </div>
        <div className="text-[#2FB500] text-sm bg-[#2FB50010] rounded-3xl py-1 px-3">
          Jaundice
        </div>
      </div>
      <div className="flex items-center justify-between border border-[#F0E4E4] rounded-xl p-2">
        <div className="flex items-center gap-x-2">
          <div className="bg-[#F3F6F3] p-6 rounded-md">
            <Image src={loader} alt="" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Pending...</span>
            <span className="font-semibold text-sm text-[#2C2C2C80]">
              Rs. 2200
            </span>
            <span className="font-medium text-sm text-[#2C2C2C70] ">
              Oct 02, 2023
            </span>
          </div>
        </div>
        <div className="text-[#0053F4] text-sm bg-[#0053F410] rounded-3xl py-1 px-3">
          Fever
        </div>
      </div>
    </div>
  );
};

// const activeTabs = [
//   {
//     id: 1,
//     comp: <Description />,
//     value: "description",
//   },
//   {
//     id: 2,
//     comp: <Schedule />,
//     value: "schedule",
//   },
//   {
//     id: 3,
//     comp: <Payment />,
//     value: "payment",
//   },
// ];

interface ITestTabs {
  activeTab: string;
  activeTabs?:any;

}
export const TestTab = ({ activeTab, activeTabs }: ITestTabs) => {
  return (
    <Tabs defaultValue={activeTab}>
      <TabsList>
        {activeTabs.map((tab: any) => {
          return (
            <TabsTrigger
              key={tab.id}
              value={tab.value}
              className={`rounded-full text-base font-medium border ${
                tab.value === activeTabs[0].value
                  ? "bg-black text-white"
                  : "border-[#F0E4E4]"
              } px-5 py-2`}
            >
              {tab.value}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {activeTabs?.map((tab: any) => (
        <TabsContent key={tab.id} value={tab.value} className="bg-white">
          {tab.comp}
        </TabsContent>
      ))}
    </Tabs>
  );
};
