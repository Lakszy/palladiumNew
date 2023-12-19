import React from "react";
interface TimeSlotsProps {
  timeSlots: { timeSlot: string; icon: React.ReactNode }[];
}
const TimeSlots: React.FC<TimeSlotsProps> = ({ timeSlots }) => (
  <div className="flex flex-wrap gap-3">
    {timeSlots.map((slot, index) => (
      <div key={index} className="rounded-3xl border-[3px] px-4 py-1">
       
        {slot.timeSlot}
      </div>
    ))}
  </div>
);
export default TimeSlots;