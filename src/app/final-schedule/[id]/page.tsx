'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import dayjs from 'dayjs';

const FinalSchedulePage = () => {
  const { data: session, status } = useSession();
  const [schedule, setSchedule] = useState<any>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchSchedule = async () => {
      const scheduleId = params.id;
      if (scheduleId) {
        const { data, error } = await supabase
          .from('schedules')
          .select('*')
          .eq('id', scheduleId)
          .single();

        if (error) {
          console.error('Error fetching schedule:', error);
        } else {
          setSchedule(data);
        }
      }
    };

    fetchSchedule();
  }, [params.id]);

  if (status === 'loading' || !schedule) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F5F5F5] pt-16 md:pt-24">
      <Navbar />
      <div className="flex flex-col p-6 w-full max-w-md mx-auto md:max-w-lg lg:max-w-xl">
        <div className="text-center p-4">
          <h1 className="text-[22px] md:text-[30px] font-bold text-[#333] font-pretendard tracking-[0.3em] mb-2">
            최종 약속
          </h1>
          <h2 className="text-[14px] md:text-[16px] font-extrabold text-[#666] font-deliusRegular tracking-[0.3em]">
            Final Schedule
          </h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg md:p-8 mt-6">
          <div className="text-center mb-6">
            <h1 className="text-[22px] md:text-[28px] font-semibold text-[#333] font-gangwonEdu tracking-[0.3em]">
              {`날짜: ${dayjs(schedule.final_date).format('YYYY년 M월 D일')}`}
            </h1>
          </div>
          <div className="text-center mb-6">
            <h1 className="text-[22px] md:text-[28px] font-semibold text-[#333] font-gangwonEdu tracking-[0.3em]">
              {`장소: ${schedule.final_location?.title}`}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalSchedulePage;
