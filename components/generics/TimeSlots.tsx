import React from "react";
interface TimeSlotsProps {
  timeSlots: { timeSlot: string; icon: React.ReactNode }[];
}
const TimeSlots: React.FC<TimeSlotsProps> = ({ timeSlots }) => (
  <div className="grid md:grid-cols-2  gap-3">
    {timeSlots.map((slot, index) => (
      <div key={index} className="rounded-lg border-[3px] px-4 py-2">
        {slot.timeSlot}
      </div>
    ))}
  </div>
);
export default TimeSlots;