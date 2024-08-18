import React from 'react';
import Calendar from '@/components/Calendar';
import { IoMdInformationCircleOutline } from "react-icons/io";

interface CalendarSelectorProps {
  month: string;
  setSelectedDates: (dates: string[]) => void; // Add this prop to set selected dates
}

const CalendarSelector = ({ month, setSelectedDates }: CalendarSelectorProps) => (
  <div className="mb-6">
    <label className="block text-gray-700 text-[16px] font-semibold font-pretendard tracking-[0.10em] mb-2">가능한 날짜를 선택해주세요.</label>
    {!month ? (
      <p className="text-[16px] font-pretendard text-red-500 my-3 flex items-center">
        <IoMdInformationCircleOutline className="mr-1" size={20} />
        먼저 만날 달을 선택해주세요!
      </p>
    ) : (
      <Calendar onSelectDates={(dates) => setSelectedDates(dates)} selectedMonth={month} />
    )}
  </div>
);

export default CalendarSelector;