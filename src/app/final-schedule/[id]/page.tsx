'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import dayjs from 'dayjs';
import { FaCalendarAlt } from 'react-icons/fa'; // Import schedule icon

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

        const { data: currentInvitation } = await supabase
          .from('invitations')
          .select('last_page')
          .eq('schedule_id', scheduleId)
          .eq('user_id', session?.user?.id)
          .single();

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
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16 px-4">
      {/* Title Section */}
      <div className="text-center mb-6">
        <h1 className="text-[24px] md:text-[34px] font-bold text-textMain font-pretendard tracking-[0.35em] mb-3">
          약속 일정
        </h1>
        <h2 className="text-[16px] md:text-[20px] font-extrabold text-textMain font-deliusRegular tracking-[0.35em]">
          Coordinated Schedule
        </h2>
      </div>

      {/* White Box Section */}
      <div className="w-full max-w-screen-sm bg-white rounded-lg shadow-lg p-8 md:p-10 lg:p-12 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-[20px] md:text-[26px] font-semibold text-gray-800">
            날짜:
          </h3>
          <p className="text-[22px] md:text-[28px] text-gray-600 font-gangwonEdu ml-2">
            {dayjs(schedule.final_date).format('YYYY년 M월 D일')}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <h3 className="text-[20px] md:text-[26px] font-semibold text-gray-800">
            지하철역:
          </h3>
          <p className="text-[22px] md:text-[28px] text-gray-600 font-gangwonEdu ml-2">
            {schedule.final_location?.title || '장소 없음'}
          </p>
        </div>
      </div>

      {/* Button Section */}
      <div className="flex justify-center mt-6 w-full max-w-screen-sm">
        <button
          className="bg-buttonA hover:bg-secondaryHover text-textButton tracking-[0.30em] w-full text-lg md:text-xl lg:text-2xl font-semibold py-[10px] md:py-[12px] lg:py-[14px] rounded-lg shadow-lg flex items-center justify-center"
          onClick={handleGoToDetails}
        >
          <FaCalendarAlt className="mr-3 w-5" /> {/* Schedule Icon */}
          약속 상세 페이지
        </button>
      </div>
    </div>
  );
};

export default FinalSchedulePage;
