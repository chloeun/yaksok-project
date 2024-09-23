'use client';

import LocationTab from './LocationTab';
import HeartTab from './HeartTab';
import VoteTab from './VoteTab';

interface TabMenuProps {
  selectedTab: string;
  handleTabChange: (tab: string) => void;
}

const TabMenu = ({ selectedTab, handleTabChange }: TabMenuProps) => {
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

      {/* 탭 내용 */}
      {selectedTab === '장소' && <LocationTab />}
      {selectedTab === '하트' && <HeartTab />}
      {selectedTab === '투표' && <VoteTab />}
    </div>
  );
};

export default TabMenu;
