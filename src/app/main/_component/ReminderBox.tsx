'use client';
import Image from 'next/image';
import { GoClock } from "react-icons/go";
import { PiMapPinSimpleArea } from "react-icons/pi";
import { IoPeopleOutline } from "react-icons/io5";

interface ReminderBoxProps {
  title: string;
  date: string;
  location: string;
  participants: string;
}

const ReminderBox = ({ title, date, location, participants }: ReminderBoxProps) => {
  return (
    <div className="w-full min-w-[320px] max-w-md font-gangwonEdu bg-white p-5 py-5 mb-6 tracking-[0.20em] rounded-2xl shadow-md md:max-w-2xl lg:max-w-3xl md:p-6 lg:px-8 lg:py-8 relative">
      <h3 className="text-[22px] md:text-[24px] lg:text-[26px] font-semibold mb-2 ml-1 text-textMain tracking-[0.20em] overflow-hidden text-ellipsis whitespace-nowrap">
        {title} {/* Dynamic title */}
      </h3>
      <hr className="border-t border-gray-300 my-4 w-10/12" />  
      <div className="flex items-center text-[18px] md:text-[22px] lg:text-[24px] text-gray-600 mb-3">
        <GoClock className="mr-2 md:mr-3" />
        <p className="overflow-hidden text-ellipsis whitespace-nowrap">
          {date} {/* Dynamic date */}
        </p>
      </div>
      <div className="flex items-center text-[18px] md:text-[22px] lg:text-[24px] text-gray-600 mb-3">
        <PiMapPinSimpleArea className="mr-2 md:mr-3" />
        <p className="overflow-hidden text-ellipsis whitespace-nowrap">
          {location} {/* Dynamic location */}
        </p>
      </div>
      <div className="flex items-center text-[18px] md:text-[22px] lg:text-[24px] text-gray-600">
        <IoPeopleOutline className="mr-2 md:mr-3" />
        <p className="overflow-hidden text-ellipsis whitespace-nowrap">
          {participants} {/* Dynamic participants */}
        </p>
      </div>
    </div>
  );
};

export default ReminderBox;
