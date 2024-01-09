import React from 'react';
import { Card, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

type CardProps = React.ComponentProps<typeof Card>;

const StatsCard: React.FC<{ value: number; label: string; color: string; icon: React.ElementType }> = ({ value, label, color, icon: Icon }) => (
  <div className={`flex flex-col gap-y-1 p-2 bg-white rounded-2xl items-center justify-center h-full border border-stone-200`}>
    <div><CardTitle className="font-base text-4xl">{value}</CardTitle></div>
    <div><h1 className="text-gray-500 text-2xl">{label}</h1></div>
    <div className={`w-fit text-${color}-600 gap-x-2 items-center flex bg-${color}-200 rounded-lg justify-center px-2 py-0.5`}>
      <Icon />
      <h1 className={`font-medium text-${color}-600`}>{value}%</h1>
    </div>
  </div>
);

export default StatsCard;
