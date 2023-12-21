import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { FiSunrise, FiSunset } from "react-icons/fi";
import TimeSlots from '../components/generics/TimeSlots';

export function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const startTime = 9; 
  const gap = 60; 

  const morningTimeSlots = generateTimeSlots(startTime, 12, gap, <FiSunrise size={20} />);
  const eveningTimeSlots = generateTimeSlots(18, 24, gap, <FiSunset size={20} />);

  function generateTimeSlots(start: number, end: number, gap: number, icon: React.ReactNode) {
    const timeSlots: { timeSlot: string; icon: React.ReactNode }[] = [];
    for (let i = start; i < end; i++) {
      const startTimeStr = `${i % 12 || 12}:00 ${i < 12 ? "AM" : "PM"}`;
      const endTimeStr = `${(i + 1) % 12 || 12}:00 ${(i + 1) < 12 ? "AM" : "PM"}`;
      timeSlots.push({ timeSlot: `${startTimeStr} to ${endTimeStr}`, icon });
    }
    return timeSlots;
  }
  return (
    <div className="w-full mainT overflow-auto rounded-3xl border-2 flex flex-col p-3 ">
      <h3 className="text-xl ">Appointment</h3>
      <div className="flex gap-x-2  rounded-3xl">
        <img
          src="https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg"
          width="100px"
          height="100px"
          className="p-3" />
        <div className="p-2">
          <p className="font-medium">Dheeraj Pandey</p>
          <p className="text-gray-400">Greater Noida, Uttar Pradesh</p>
          <p className="text-gray-400">Age:30 yr</p>
        </div>
      </div>
      <div className="flex flex-1">
        <div className="flex-1 border-2 h-full rounded-3xl p-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md" />
        </div>
        <div className="border-2 ml-3  rounded-3xl p-3 space-y-10 flex-1">
          <div className="flex items-center gap-x-2">
            <div className="p-4 bg-white rounded-full border border-stone-200 gap w-fit">
              <FiSunrise size={20} />
            </div>
            <div>
              <p className="font-medium">Morning</p>
              <p className="font-medium text-gray-500 whitespace-nowrap">
                {`${startTime % 12 || 12}:00 AM to ${(startTime + 4) % 13 || 2}:00 PM`}
              </p>
            </div>
          </div>
          <TimeSlots timeSlots={morningTimeSlots} />
          <div className="flex items-center gap-x-2">
            <div className="p-4 bg-white rounded-full border border-stone-200 gap w-fit">
              <FiSunset size={20} />
            </div>
            <div>
              <p className="font-medium">Evening</p>
              <p className="font-medium text-gray-500 whitespace-nowrap justify-center items-center">
                {`6:00 PM to 10:00 PM`}
              </p>
            </div>
          </div>
          <TimeSlots timeSlots={eveningTimeSlots} />
        </div>
      </div>
    </div>
  );
}
