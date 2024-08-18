import { generateDate } from "@/utils/dateutils";
import dayjs, { Dayjs } from "dayjs";
import { useState, useEffect } from "react";

interface CalendarProps {
  onSelectDates: (dates: string[]) => void;
  selectedMonth: string;
}

const Calendar = ({ onSelectDates, selectedMonth }: CalendarProps) => {
  const days = ["일", "월", "화", "수", "목", "금", "토"]; // 요일 배열

  // selectedMonth에서 연도와 월을 분리
  const [selectedDate, setSelectedDate] = useState<Dayjs>(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    return dayjs().year(year).month(month - 1); // 연도와 월을 설정
  });

  // 다중 선택된 날짜를 관리하는 상태
  const [selectedDates, setSelectedDates] = useState<Dayjs[]>([]);

  // 선택한 달이 변경될 때마다 실행되는 효과
  useEffect(() => {
    const [year, month] = selectedMonth.split('-').map(Number); // 연도와 월을 추출
    setSelectedDate(dayjs().year(year).month(month - 1)); // 선택한 달로 날짜 설정
    setSelectedDates([]); // 달이 변경되면 선택된 날짜를 초기화
  }, [selectedMonth]);

  // 사용자가 특정 날짜를 클릭했을 때 호출되는 함수
  const handleDateClick = (date: Dayjs) => {
    const today = dayjs(); // 현재 날짜 가져오기
    if (date.isBefore(today, "day")) {
      return; // 과거 날짜는 선택하지 않음
    }
    let updatedDates: Dayjs[];
    if (selectedDates.some(d => d.isSame(date, "day"))) {
      updatedDates = selectedDates.filter(d => !d.isSame(date, "day")); // 이미 선택된 날짜는 제거
    } else {
      updatedDates = [...selectedDates, date]; // 새로 선택한 날짜 추가
    }
    setSelectedDates(updatedDates); // 상태 업데이트
    onSelectDates(updatedDates.map(d => d.format("YYYY-MM-DD"))); // 상위 컴포넌트로 선택된 날짜 전달
  };

  // 특정 날짜가 선택되었는지 확인하는 함수
  const isDateSelected = (date: Dayjs) => {
    return selectedDates.some(d => d.isSame(date, "day")); // 날짜가 선택된 상태인지 확인
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 mt-5 border border-gray-200">
      {/* 선택된 달과 년도를 표시하는 제목 */}
      <h2 className="text-center text-lg md:text-xl font-semibold font-pretendard tracking-[0.05em] text-textMain mb-4">
        {selectedDate.year()}년 {selectedDate.month() + 1}월
      </h2>
      
      {/* 요일을 표시하는 부분 */}
      <div className="grid grid-cols-7 font-semibold font-pretendard text-textMain">
        {days.map((day, index) => (
          <div key={index} className="h-10 flex items-center justify-center text-sm md:text-base">
            {day}
          </div>
        ))}
      </div>
      
      {/* 날짜를 표시하는 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {generateDate(selectedDate.month(), selectedDate.year()).map(
          ({ date, currentMonth, today, visible }, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(date)} // 날짜 클릭 시 처리
              className={`h-12 md:h-14 flex items-center justify-center cursor-pointer rounded-lg transition-all duration-200 ${
                !visible ? "invisible" : "" // 해당 월에 해당하지 않는 날짜는 보이지 않게 처리
              } ${today && currentMonth ? "bg-blue-200 text-blue-900" : ""} ${ // 오늘 날짜를 강조
                isDateSelected(date) ? "bg-[#FFE1DB] text-[#ff5837]" : "hover:bg-gray-100" // 선택된 날짜 강조
              }`}
            >
              <span className={`text-sm md:text-base ${!currentMonth ? "text-gray-400" : ""}`}>
                {visible ? date.date() : ""} {/* 날짜 표시 (해당 월만) */}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Calendar;
