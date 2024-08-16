'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image'; 
import YaksokLogo from '@/assets/images/YaksokLogo.png';
import BirthdayTheme from '@/assets/images/birthdayTheme.png';  // Import the uploaded image
import { FaRegClock } from "react-icons/fa6";
import { PiMapPinSimpleArea } from "react-icons/pi";
import { IoPeopleOutline } from "react-icons/io5";
import { GoClock } from "react-icons/go";
import { IoIosAddCircleOutline } from "react-icons/io";
import ReminderBox from './_component/ReminderBox';
import InvitationBox from './_component/InvitationBox';
import { useRouter } from 'next/navigation';  // Import the useRouter hook

const MainPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();  // Initialize the router

  useEffect(() => {
    console.log("Session data:", session);
  }, [session]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in</div>;
  }

  const handleCreateSchedule = () => {
    router.push('/create-schedule');  // Navigate to the create-schedule page
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16 lg:pt-16">
      <Navbar />
      <div className="flex flex-col p-6 w-full max-w-md mx-auto md:max-w-2xl lg:max-w-3xl">
        <div className="ml-2 flex items-center justify-left md:justify-start my-4 md:mb-6 lg:mb-8">
          <Image 
            src={YaksokLogo}
            alt="Yaksok Logo"
            layout="fixed"
            width={40} 
            height={54} 
            className="md:w-[60px] md:h-[85px] lg:w-[70px] lg:h-[100px] mr-5" 
          />
          <h1 className="text-[22px] md:text-[30px] lg:text-[32px] font-bold text-textMain font-deliusRegular tracking-[0.20em] mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
            <span>안녕하세요! </span>
            <span className="text-[28px] md:text-[36px] lg:text-[38px] font-bold text-black font-gangwonEdu mr-1">{session.user?.name}</span>
            <span>님</span>
          </h1>
        </div>

        {/* New Invitation Box Section */}
        <h2 className="text-[17px] md:text-[22px] lg:text-[24px] font-semibold font-pretendard tracking-[0.20em] text-[#4D4C51] ml-2 md:ml-3 lg:ml-5 my-4">
          초대받은 약속:
        </h2>
        <InvitationBox />

        {/* Reminder Box Section */}
        <h2 className="text-[17px] md:text-[22px] lg:text-[24px] font-semibold font-pretendard tracking-[0.20em] text-[#4D4C51] ml-2 md:ml-3 lg:ml-5 my-4 mt-7">
          다가오는 약속:
        </h2>
        <ReminderBox />
        <button 
          onClick={handleCreateSchedule}  // Add the onClick event handler
          className="bg-buttonA hover:bg-secondaryHover min-w-[320px] tracking-[0.30em] mt-3 w-full text-lg md:text-xl lg:text-2xl text-textButton font-semibold py-[8px] md:py-[12px] lg:py-[14px] px-14 md:px-16 rounded-lg focus:outline-none focus:shadow-outline shadow-lg flex items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis">
          <IoIosAddCircleOutline className="mr-2 text-xl md:text-3xl lg:text-4xl" /> {/* Icon added here */}
          약속 만들기
        </button>
      </div>
    </div>
  );
};

export default MainPage;
