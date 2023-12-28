import { Card, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
type CardProps = React.ComponentProps<typeof Card>;


const StatsCard: React.FC<{ value: number; label: string; color: string; icon: React.ElementType }> = ({ value, label, color, icon: Icon }) => (
  <div className={`flex flex-col gap-y-1 p-2 bg-white rounded-2xl items-center justify-center h-full border border-stone-200`}>
    <div><CardTitle className="font-base text-4xl">{value}</CardTitle></div>
    <div><h1 className="text-gray-500 text-2xl">{label}</h1></div>
    <div className={`w-fit text-${color}-600 gap-x-2 items-center flex bg-${color}-200 rounded-lg justify-center px-2 py-0.5`}>
      <Icon />
      <h1 className={`font-medium text-${color}-600`}>5%</h1>
    </div>
  </div>


);
export const CenterBar: React.FC = () => (
  <div className=" grid grid-cols-[1fr_max-content]">
    <div className="bg-green-50 border border-green-400 h-[21.5rem] mt-2 rounded-xl"></div>
    <div className="grid h-fit p-2 gap-y-2 ">
      <div className="bg-white border-stone-200 h-full rounded-md border flex items-center ">
        <div className="w-32 m-2 h-32 bg-black rounded-full"></div>
        <div className="space-y-2">
          {["Male", "Female"].map((gender) => (
            <div key={gender} className="flex gap-x-2 items-center">
              <div className="rounded-full w-5 h-5 bg-red-900"></div>
              <div className="text-xl font-semibold">{`${gender}(66%)`}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid-flow-col w-stretch h-48 item-stretch left-[182px] top-[60px]  justify-start items-center gap-2 inline-flex">
        <StatsCard value={58} label="Total Earning" color="green" icon={ChevronDown} />
        <StatsCard value={34} label="Total Earning" color="red" icon={ChevronUp} />
      </div>
    </div>
  </div>
);