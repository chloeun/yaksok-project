'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';

const MainPage = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("Session data:", session);
  }, [session]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16">
      <Navbar />
      <div className="flex flex-col md:items-center p-6 w-full max-w-md mx-auto md:max-w-2xl">
        <div className="md:text-center p-2 md:p-4">
          <h1 className="text-[22px] md:text-[30px] font-bold text-textButton font-pretendard tracking-[0.35em] mb-2 md:mb-3">안녕하세요! {session.user?.name}님</h1>
        </div>
        <div className="w-full max-w-md bg-white p-5 pt-10 pb-12 rounded-2xl shadow-md md:max-w-2xl mt-4 md:p-10">
          <h2 className="text-[18px] font-bold text-textMain mb-4">다가오는 약속:</h2>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
            <h3 className="text-[16px] font-semibold mb-2">홍주생일 🎂</h3>
            <p className="text-[14px] mb-1">📅 8월 6일 (화) | 오후 5시</p>
            <p className="text-[14px] mb-1">📍 카페포이어</p>
            <p className="text-[14px]">👥 홍주, 정은</p>
          </div>
          <button className="bg-buttonA hover:bg-secondaryHover tracking-[0.30em] w-full text-lg text-textButton font-semibold py-[10px] px-16 rounded-lg focus:outline-none focus:shadow-outline shadow-lg">
            약속 만들기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;