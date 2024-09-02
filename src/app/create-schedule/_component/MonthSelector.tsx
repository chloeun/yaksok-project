import React from 'react';

interface MonthSelectorProps {
  month: string;
  setMonth: React.Dispatch<React.SetStateAction<string>>;
  monthsOptions: string[];
}

// 달 선택을 위한 컴포넌트
const MonthSelector = ({ month, setMonth, monthsOptions }: MonthSelectorProps) => (
  <div className="mb-6">
    <label className="block text-gray-700 text-[16px] font-semibold font-pretendard tracking-[0.10em] mb-2">어느 달에 만날까요?</label>
    <select
      className="shadow appearance-none border rounded w-full py-3 px-3 font-gangwonEdu text-[18px] tracking-[0.1em] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      id="month"
      value={month}
      onChange={(e) => setMonth(e.target.value)} // 사용자가 선택한 달을 상태로 저장
    >
      <option value="">달을 선택하세요</option>
      {monthsOptions.map((monthOption, index) => (
        <option key={index} value={monthOption}>
          {monthOption}
        </option>
      ))}
    </select>
  </div>
);

export default MonthSelector;
