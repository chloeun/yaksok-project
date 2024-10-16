'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
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
          .select('final_date, final_location')
          .eq('id', scheduleId)
          .single();

        if (error) {
          console.error('Error fetching schedule:', error);
        } else {
          setSchedule(data);
        }

        // Fetch the current last_page before updating
        const { data: currentInvitation } = await supabase
          .from('invitations')
          .select('last_page')
          .eq('schedule_id', scheduleId)
          .eq('user_id', session?.user?.id)
          .single();

        // Only update if last_page is not already 'final-schedule'
        if (currentInvitation?.last_page !== 'final-schedule') {
          await supabase
            .from('invitations')
            .update({ last_page: 'final-schedule' })
            .eq('schedule_id', scheduleId)
            .eq('user_id', session?.user?.id);
        }
      }
    };

    fetchSchedule();
  }, [params.id, session?.user?.id]);

  const handleGoToDetails = () => {
    if (schedule?.final_date && schedule?.final_location) {
      router.push(
        `/schedule-details/${params.id}?final_date=${schedule.final_date}&final_location=${encodeURIComponent(JSON.stringify(schedule.final_location))}`
      );
    }
  };

  if (status === 'loading' || !schedule) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F5F5F5] pt-16 md:pt-24">
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
        <button
          className="mt-6 py-2 px-4 bg-blue-500 text-white rounded-lg"
          onClick={handleGoToDetails}
        >
          약속 상세 페이지로 이동
        </button>
      </div>
    </div>
  );
};

export default FinalSchedulePage;
