import { generateDate, months } from "@/utils/dateutils";
import dayjs, { Dayjs } from "dayjs";
import { useState, useEffect } from "react";

interface CalendarProps {
  onSelectDates: (dates: string[]) => void;
  selectedMonth: string;
}

const Calendar = ({ onSelectDates, selectedMonth }: CalendarProps) => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const currentDate = dayjs();

  const [selectedDate, setSelectedDate] = useState<Dayjs>(() => {
    const monthIndex = months.indexOf(selectedMonth);
    return monthIndex >= 0 ? currentDate.month(monthIndex) : currentDate;
  });

  const [selectedDates, setSelectedDates] = useState<Dayjs[]>([]);

  useEffect(() => {
    const monthIndex = months.indexOf(selectedMonth);
    if (monthIndex >= 0) {
      setSelectedDate(currentDate.month(monthIndex));
    }
    setSelectedDates([]); // Clear selected dates when the month changes
  }, [selectedMonth]);

  const handleDateClick = (date: Dayjs) => {
    const today = dayjs();
    if (date.isBefore(today, "day")) {
      return;
    }
    let updatedDates: Dayjs[];
    if (selectedDates.some(d => d.isSame(date, "day"))) {
      updatedDates = selectedDates.filter(d => !d.isSame(date, "day"));
    } else {
      updatedDates = [...selectedDates, date];
    }
    setSelectedDates(updatedDates);
    onSelectDates(updatedDates.map(d => d.format("YYYY-MM-DD")));
  };

  const isDateSelected = (date: Dayjs) => {
    return selectedDates.some(d => d.isSame(date, "day"));
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 mt-5 border border-gray-200">
      <h2 className="text-center text-lg md:text-xl font-semibold font-pretendard tracking-[0.05em] text-textMain mb-4">
        {selectedDate.year()}년 {selectedMonth}
      </h2>
      <div className="grid grid-cols-7 font-semibold font-pretendard text-textMain">
        {days.map((day, index) => (
          <div key={index} className="h-10 flex items-center justify-center text-sm md:text-base">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {generateDate(selectedDate.month(), selectedDate.year()).map(
          ({ date, currentMonth, today, visible }, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(date)}
              className={`h-12 md:h-14 flex items-center justify-center cursor-pointer rounded-lg transition-all duration-200 ${
                !visible ? "invisible" : ""
              } ${today && currentMonth ? "bg-blue-200 text-blue-900" : ""} ${
                isDateSelected(date) ? "bg-[#FFE1DB] text-[#ff5837]" : "hover:bg-gray-100"
              }`}
            >
              <span className={`text-sm md:text-base ${!currentMonth ? "text-gray-400" : ""}`}>
                {visible ? date.date() : ""}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Calendar;
