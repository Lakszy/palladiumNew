import { BiDollarCircle } from "react-icons/bi";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { User, CalendarDays } from "lucide-react";
import { SlGraph } from "react-icons/sl";

type CardProps = React.ComponentProps<typeof Card>;

interface CardItemProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
}
const CardItem: React.FC<CardItemProps> = ({ title, value, icon, colorClass }) => (
  <CardHeader>
    <div className="rounded-xl border-[3px] border-gray-300 px-2 py-3">
      <div className="flex justify gap-x-2 items-center">
        <div className={`rounded-md ${colorClass} p-3`}>{icon}</div>
        <div className=" gap-y-1">
          <CardTitle className="text-xl text-gray-500">{title}</CardTitle>
          <CardTitle className="text-md font-semibold">{value}</CardTitle>
        </div>
      </div>
    </div>
  </CardHeader>
);
export function CardDemo({ }: CardProps) {
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_max-content]">
      {[
        { title: "Appointments", value: "672", icon: <CalendarDays size={28} />, colorClass: "bg-orange-400" },
        { title: "Patients", value: "672", icon: <SlGraph size={28} />, colorClass: "bg-green-600" },
        { title: "Optimizations", value: "672", icon: <User size={28} />, colorClass: "bg-red-400" },
      ].map((item, index) => (
        <CardItem key={index} {...item} />
      ))}
      <div className="flex flex-col h-full rounded-2xl items-center justify-center border-2 bg-green-100 border-green-300 px-2">
        <div className="justify-center items-center">
          <BiDollarCircle size={32} />
        </div>
        <div>
          <h1 className="text-gray-500 text-xl">Total Earning</h1>
        </div>
        <div>
          <CardTitle className="font-base text-md">$8966</CardTitle>
        </div>
      </div>
    </div>
  );
}