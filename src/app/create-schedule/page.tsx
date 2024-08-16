'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { IoIosAddCircleOutline } from 'react-icons/io';
import Calendar from '@/components/Calendar'; // Import the Calendar component
import dayjs from 'dayjs';

const CreateSchedulePage = () => {
  const [planName, setPlanName] = useState('');
  const [month, setMonth] = useState('');
  const [location, setLocation] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [monthsOptions, setMonthsOptions] = useState<string[]>([]);

  useEffect(() => {
    // 현재 달부터 6개월 후까지의 달을 계산하여 드롭다운 옵션으로 설정
    const currentMonth = dayjs().month();
    const options = [];

    for (let i = 0; i < 6; i++) {
      const date = dayjs().month(currentMonth + i).startOf('month');
      options.push(date.format('M월'));
    }

    setMonthsOptions(options);
  }, []);

  const handleAddParticipant = () => {
    setParticipants([...participants, '']);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(e.target.value);
  };

  const handleSelectDates = (dates: string[]) => {
    console.log('Selected Dates:', dates); // Log selected dates to the console
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      planName,
      month,
      location,
      participants,
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16">
      <Navbar />
      <div className="flex flex-col p-6 w-full max-w-md mx-auto md:max-w-2xl">
        <div className="md:text-center p-2 md:p-4">
          <h1 className="text-[22px] md:text-[30px] font-bold text-textMain font-pretendard tracking-[0.35em] mb-2 md:mb-3">새 약속 만들기</h1>
          <h1 className="text-[14px] md:text-[16px] font-extrabold text-textMain font-deliusRegular tracking-[0.35em]">Make a Plan</h1>
        </div>
        <form className="w-full max-w-md bg-white p-5 py-7 rounded-2xl shadow-md md:max-w-2xl mt-4 md:p-10" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-[16px] font-semibold font-pretendard tracking-[0.10em] mb-2">어떤 약속인가요?</label>
            <input
              className="shadow appearance-none border rounded w-full py-3 px-3 font-gangwonEdu text-[18px] tracking-[0.1em] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="planName"
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="약속 이름을 입력하세요"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-[16px] font-semibold font-pretendard tracking-[0.10em] mb-2">어느 달에 만날까요?</label>
            <select
              className="shadow appearance-none border rounded w-full py-3 px-3 font-gangwonEdu text-[18px] tracking-[0.1em] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="month"
              value={month}
              onChange={handleMonthChange}
            >
              <option value="">달을 선택하세요</option>
              {monthsOptions.map((monthOption, index) => (
                <option key={index} value={monthOption}>
                  {monthOption}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-[16px] font-semibold font-pretendard tracking-[0.10em] mb-2">가능한 날짜를 선택해주세요.</label>
            {!month ? (
              <p className="text-sm font-pretendard text-red-500 ml-2 my-2">💡 먼저 만날 달을 선택해주세요!</p>
            ) : (
              <Calendar onSelectDates={handleSelectDates} selectedMonth={month} />
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-[16px] font-semibold font-pretendard tracking-[0.10em] mb-2">어디서 만날까요?</label>
            <input
              className="shadow appearance-none border rounded w-full py-3 px-3 font-gangwonEdu text-[18px] tracking-[0.1em] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="만날 장소를 입력하세요"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-[16px] font-semibold font-pretendard tracking-[0.15em] mb-2">누구와 만날까요?</label>
            {participants.map((participant, index) => (
              <div key={index} className="flex items-center justify-between mb-2">
                <input
                  className="shadow appearance-none border rounded w-full py-3 px-3 font-gangwonEdu text-[18px] tracking-[0.1em] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  value={participant}
                  onChange={(e) => {
                    const newParticipants = [...participants];
                    newParticipants[index] = e.target.value;
                    setParticipants(newParticipants);
                  }}
                  placeholder="참가자 이름을 입력하세요"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddParticipant}
              className="mt-2 text-blue-500 text-sm font-semibold flex items-center"
            >
              <IoIosAddCircleOutline className="mr-2" size={18} />
              참가자 추가
            </button>
          </div>
          <div className="flex items-center justify-center mt-10">
            <button
              className="bg-[#838380] text-white hover:bg-buttonA hover:text-textButton tracking-[0.30em] w-full text-lg font-semibold py-[10px] px-16 rounded-lg focus:outline-none focus:shadow-outline shadow-lg"
              type="submit"
            >
              완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSchedulePage;
