import React, { useState } from "react";

interface TimeSlotsProps {
  timeSlots: { timeSlot: string; icon: React.ReactNode }[];
}

const TimeSlot: React.FC<{
  timeSlot: string;
  icon: React.ReactNode;
  onClick: () => void;
  isSelected: boolean;
}> = ({ timeSlot, icon, onClick, isSelected }) => {
  const handleClick = () => {
    onClick && onClick();
  };

  return (
    <div
      className={`rounded-lg border border-[#F0E4E4] px-4 py-2 cursor-pointer ${
        isSelected ? "bg-blue-100 text-[#0053F4]" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-x-2">
        
        <p className="font-sm">{timeSlot}</p>
      </div>
    </div>
  );
};

const TimeSlots: React.FC<TimeSlotsProps> = ({ timeSlots }) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const handleTimeSlotClick = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  return (
    <div className="grid md:grid-cols-2 gap-3">
      {timeSlots.map((slot, index) => (
        <TimeSlot
          key={index}
          timeSlot={slot.timeSlot}
          icon={slot.icon}
          onClick={() => handleTimeSlotClick(slot.timeSlot)}
          isSelected={selectedTimeSlot === slot.timeSlot}
        />
      ))}
    </div>
  );
};

export default TimeSlots;
