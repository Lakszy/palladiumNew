import { BiDollarCircle } from "react-icons/bi";
import { Card, CardTitle } from "@/components/ui/card";
import { CalendarDays,Stethoscope  } from "lucide-react";
import { GoPerson } from "react-icons/go";
type CardProps = React.ComponentProps<typeof Card>;
interface CardItemProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
}
const CardItem: React.FC<CardItemProps> = ({ title, value, icon, colorClass }) => (
  <div className="py-2">
    <div className="w-[310px] h-[95px] p-4 bg-white rounded-2xl border border-stone-200 flex-col justify-start items-start gap-2.5 inline-flex">
      <div className="flex justify gap-x-2 items-center">
        <div className={`rounded-md ${colorClass} p-3`}>{icon}</div>
        <div className=" gap-y-1">
          <CardTitle className="text-zinc-800 text-opacity-80 text-xl font-medium  leading-7">{title}</CardTitle>
          <CardTitle className="text-lg">{value}</CardTitle>
        </div>
      </div>
    </div>
  </div>
);
export function CardDemo({ }: CardProps) {
  return (
    <div className="gap-x-6 ml-7 flex mb-1">
      {[
        { title: "Appointments", value: "672", icon: <CalendarDays size={28} />, colorClass: "bg-stone-100" },
        { title: "Patients", value: "422", icon: <GoPerson size={28} />, colorClass: "bg-stone-100" },
        { title: "Optimizations", value: "672", icon: <Stethoscope  size={28} />, colorClass: "bg-stone-100" },
      ].map((item, index) => (
        <CardItem key={index} {...item} />
      ))}
      <div className="mt-2 w-[188px] h-[95px]  border border-stone-200 flex-col justify-center items-center gap-2.5 inline-flex bg-green-100 rounded-2xl px-2.5 gap-y-[0.5px]">
        <div className="justify-center items-center">
          <BiDollarCircle size={32} />
        </div>
        <div>
          <h1 className="text-gray-500 text-lg">Total Earning</h1>
        </div>
        <div>
          <CardTitle className="font-base text-sm">$8966</CardTitle>
        </div>
      </div>
    </div>
  );
}