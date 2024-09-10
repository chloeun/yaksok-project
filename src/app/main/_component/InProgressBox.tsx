'use client';

import dayjs from "dayjs";
import { FaLongArrowAltRight } from "react-icons/fa"; // 화살표 아이콘 가져오기

const InProgressBox = ({ schedule, onGoTo }: any) => {
  // 초대한 사람의 이름 추출
  const inviterName = Array.isArray(schedule.users)
    ? schedule.users[0]?.name || "알 수 없음"
    : schedule?.users?.name || "알 수 없음";

  // 약속의 월 포맷팅
  const formattedMonth = schedule?.month ? dayjs(schedule.month).format('M') + '월' : '';

  return (
    <div className="w-full min-w-[320px] bg-white px-2 py-4 md:px-4 lg:px-6 rounded-2xl shadow-md border border-gray-300 flex items-center justify-between">
      {/* 초대한 사람, 약속 이름, 약속 기간을 표시하는 영역 */}
      <div className="flex items-center flex-grow">
        {/* 초대한 사람 */}
        <div className="text-center flex-grow border-r border-gray-300 px-2 md:px-4 lg:px-6">
          <p className="text-[12px] md:text-[14px] lg:text-[16px] font-pretendard text-textMain">초대한 사람</p>
          <div className="flex items-center justify-center">
            <p className="font-gangwonEdu text-[20px] md:text-[22px] lg:text-[24px] mt-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px] md:max-w-[100px] lg:max-w-[120px]">
              {inviterName}
            </p>
          </div>
        </div>
        
        {/* 약속 이름 */}
        <div className="text-center flex-grow border-r border-gray-300 px-2 md:px-4 lg:px-6">
          <p className="text-[12px] md:text-[14px] lg:text-[16px] font-pretendard text-textMain">약속 이름</p>
          <div className="flex items-center justify-center">
            <p className="font-gangwonEdu text-[20px] md:text-[22px] lg:text-[24px] mt-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[100px] md:max-w-[120px] lg:max-w-[140px]">
              {schedule.plan_name}
            </p>
          </div>
        </div>
        
        {/* 약속 기간 */}
        <div className="text-center flex-grow px-2 md:px-4 lg:px-6">
          <p className="text-[12px] md:text-[14px] lg:text-[16px] font-pretendard text-textMain">약속 기간</p>
          <div className="flex items-center justify-center">
            <p className="font-gangwonEdu text-[20px] md:text-[22px] lg:text-[24px] mt-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[60px] md:max-w-[80px] lg:max-w-[100px]">
              {formattedMonth}
            </p>
          </div>
        </div>
      </div>

      {/* Go 버튼 대신 화살표 아이콘 */}
      <div className="flex flex-col items-center ml-4 space-y-3">
        <button 
          className="px-4 py-2 rounded-lg bg-[#eafcff] text-[#4D4C51] text-[12px] md:text-[14px] lg:text-[16px] font-semibold hover:bg-[#b5e7f5] tracking-[0.20em] shadow-md flex items-center justify-center"
          onClick={onGoTo}
        >
          <FaLongArrowAltRight size={25} /> {/* 화살표 아이콘 */}
        </button>
      </div>
    </div>
  );
};

export default InProgressBox;
