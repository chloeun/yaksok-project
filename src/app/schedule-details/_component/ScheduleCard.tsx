'use client';

import { GoClock } from "react-icons/go";
import { PiMapPinSimpleArea } from "react-icons/pi";
import { IoPeopleOutline } from "react-icons/io5";
import Image from 'next/image';
import BirthdayTheme from '@/assets/images/birthdayTheme.png';

const ScheduleCard = () => {
  return (
    <div className="w-full min-w-[320px] max-w-md font-gangwonEdu bg-white p-5 py-5 mb-6 tracking-[0.20em] rounded-2xl shadow-md md:max-w-2xl lg:max-w-3xl md:p-6 lg:px-8 lg:py-8 relative">
      <h3 className="text-[22px] md:text-[24px] lg:text-[26px] font-semibold mb-2 ml-1 text-textMain tracking-[0.20em] overflow-hidden text-ellipsis whitespace-nowrap">
        홍주 생일 🎂
      </h3>
      <hr className="border-t border-gray-300 my-4 w-10/12" />
      <Image
        src={BirthdayTheme}
        alt="Birthday Theme Icon"
        width={50}
        height={50}
        className="absolute top-2 right-2 md:top-3 md:right-3 lg:top-5 lg:right-5 md:w-[60px] md:h-[60px] lg:w-[70px] lg:h-[70px]"
      />
      <div className="flex items-center text-[18px] md:text-[22px] lg:text-[24px] text-gray-600 mb-3">
        <GoClock className="mr-2 md:mr-3" />
        <p className="overflow-hidden text-ellipsis whitespace-nowrap">
          <span>8월 6일 (화)</span>
          <span className="mx-4">|</span>
          <span className="mx-2 text-red-500">시간 입력</span>
        </p>
      </div>
      <div className="flex items-center text-[18px] md:text-[22px] lg:text-[24px] text-gray-600 mb-3">
        <PiMapPinSimpleArea className="mr-2 md:mr-3" />
        <p className="overflow-hidden text-ellipsis whitespace-nowrap">용산역</p>
      </div>
      <div className="flex items-center text-[18px] md:text-[22px] lg:text-[24px] text-gray-600">
        <IoPeopleOutline className="mr-2 md:mr-3" />
        <p className="overflow-hidden text-ellipsis whitespace-nowrap">홍주, 정은</p>
      </div>
    </div>
  );
};

export default ScheduleCard;
