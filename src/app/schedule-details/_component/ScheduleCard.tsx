'use client';

import { GoClock } from "react-icons/go";  // 시계 아이콘
import { PiMapPinSimpleArea } from "react-icons/pi";  // 핀 아이콘
import { IoPeopleOutline } from "react-icons/io5";  // 사람 아이콘
import Image from 'next/image';  // 이미지 컴포넌트
import BirthdayTheme from '@/assets/images/birthdayTheme.png';  // 생일 테마 이미지

// ScheduleCard의 props 인터페이스 정의
interface ScheduleCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  participants: string[];
}

// 일정 정보 카드 컴포넌트
const ScheduleCard = ({ title, date, time, location, participants }: ScheduleCardProps) => {
  return (
    <div className="w-full min-w-[320px] max-w-md font-gangwonEdu bg-white p-5 py-5 mb-6 tracking-[0.20em] rounded-2xl shadow-md md:max-w-2xl lg:max-w-3xl md:p-6 lg:px-8 lg:py-8 relative">
      <h3 className="text-[22px] md:text-[24px] lg:text-[26px] font-semibold mb-2 ml-1 text-textMain tracking-[0.20em] overflow-hidden text-ellipsis whitespace-nowrap">
        {title}  {/* 일정 제목 */}
      </h3>
      <hr className="border-t border-gray-300 my-4 w-10/12" />
      <Image
        src={BirthdayTheme}
        alt="Birthday Theme Icon"  // 대체 텍스트
        width={50}
        height={50}
        className="absolute top-2 right-2 md:top-3 md:right-3 lg:top-5 lg:right-5 md:w-[60px] md:h-[60px] lg:w-[70px] lg:h-[70px]"
      />
      <div className="flex items-center text-[18px] md:text-[22px] lg:text-[24px] text-gray-600 mb-3">
        <GoClock className="mr-2 md:mr-3" />  {/* 시계 아이콘 */}
        <p className="overflow-hidden text-ellipsis whitespace-nowrap">
          <span>{date}</span>  {/* 일정 날짜 */}
          <span className="mx-4">|</span>
          <span className="mx-2 text-red-500">{time || '시간 입력'}</span>  {/* 일정 시간 */}
        </p>
      </div>
      <div className="flex items-center text-[18px] md:text-[22px] lg:text-[24px] text-gray-600 mb-3">
        <PiMapPinSimpleArea className="mr-2 md:mr-3" />  {/* 핀 아이콘 */}
        <p className="overflow-hidden text-ellipsis whitespace-nowrap">{location}</p>  {/* 장소 정보 */}
      </div>
      <div className="flex items-center text-[18px] md:text-[22px] lg:text-[24px] text-gray-600">
        <IoPeopleOutline className="mr-2 md:mr-3" />  {/* 사람 아이콘 */}
        <p className="overflow-hidden text-ellipsis whitespace-nowrap">
          {participants.join(', ')}  {/* 참가자들 이름을 쉼표로 구분하여 출력 */}
        </p>
      </div>
    </div>
  );
};

export default ScheduleCard;
