'use client';

import LocationTab from './LocationTab';
import HeartTab from './HeartTab';
import VoteTab from './VoteTab';

interface TabMenuProps {
  selectedTab: string;
  handleTabChange: (tab: string) => void;
  finalLocation: { title: string; roadAddress: string; lat: number; lng: number } | null; // finalLocation 타입을 지정
  userId: string | null; // userId 추가, nullable
  scheduleId: string; // scheduleId 추가
}

const TabMenu = ({ selectedTab, handleTabChange, finalLocation, userId, scheduleId }: TabMenuProps) => {
  return (
    <div className="w-full min-w-[320px] max-w-md font-gangwonEdu bg-white p-5 py-7 rounded-2xl shadow-md md:max-w-2xl lg:max-w-3xl">
      <div className="flex justify-around mb-6 text-[25px] tracking-[0.10em]">
        <button
          onClick={() => handleTabChange('장소')}
          className={`font-bold ${selectedTab === '장소' ? 'text-black border-b-2 border-black' : 'text-gray-400'}`}
        >
          장소
        </button>
        <button
          onClick={() => handleTabChange('하트')}
          className={`font-bold ${selectedTab === '하트' ? 'text-black border-b-2 border-black' : 'text-gray-400'}`}
        >
          하트
        </button>
        <button
          onClick={() => handleTabChange('투표')}
          className={`font-bold ${selectedTab === '투표' ? 'text-black border-b-2 border-black' : 'text-gray-400'}`}
        >
          투표
        </button>
      </div>

      {/* Pass scheduleId and userId to LocationTab, HeartTab, and VoteTab */}
      {selectedTab === '장소' && <LocationTab finalLocation={finalLocation} userId={userId} scheduleId={scheduleId} />}
      {selectedTab === '하트' && <HeartTab userId={userId} scheduleId={scheduleId} />}
      {selectedTab === '투표' && <VoteTab userId={userId} scheduleId={scheduleId} />} {/* Pass userId and scheduleId */}
    </div>
  );
};

export default TabMenu;
