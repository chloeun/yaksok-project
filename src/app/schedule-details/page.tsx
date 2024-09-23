'use client';

import { useState } from 'react';
import ScheduleCard from './_component/ScheduleCard';
import TabMenu from './_component/TabMenu';

const ScheduleDetailsPage = () => {
  const [selectedTab, setSelectedTab] = useState<string>('장소'); // 탭 상태

  // 탭 변경 핸들러
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#FAFAF5] pt-24 md:pt-16">
      <div className="text-center p-4">
        <h1 className="text-[22px] md:text-[30px] font-bold text-[#333] font-pretendard tracking-[0.2em] mb-2">
          약속 장소 정하기
        </h1>
        <h2 className="text-[14px] md:text-[16px] font-extrabold text-[#666] font-deliusRegular tracking-[0.3em]">
          Make Decisions
        </h2>
      </div>

      {/* 일정 정보 카드 */}
      <ScheduleCard />

      {/* 탭 메뉴 */}
      <TabMenu selectedTab={selectedTab} handleTabChange={handleTabChange} />
    </div>
  );
};

export default ScheduleDetailsPage;
