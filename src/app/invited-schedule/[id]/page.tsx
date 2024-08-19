'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import CalendarSelector from '../../create-schedule/_component/CalendarSelector';
import LocationSelector from '../../create-schedule/_component/LocationSelector';
import SelectedLocationsList from '../../create-schedule/_component/SelectedLocationsList';
import dayjs from 'dayjs'; // Import dayjs

interface Schedule {
  id: string;
  plan_name: string;
  month: string;
  dates: string[];
  created_by: string;
  users: { name: string }[];
}

const InvitedSchedulePage = () => {
  const { data: session, status } = useSession();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<{ title: string, roadAddress: string }[]>([]);
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
          setSchedule(data as Schedule);
        }
      }
    };

    fetchSchedule();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!schedule || !session) {
      console.error('Schedule or session is missing');
      return;
    }

    const { error } = await supabase
      .from('invitations')
      .update({
        dates: selectedDates,
        locations: selectedLocations,
      })
      .eq('schedule_id', schedule.id)
      .eq('user_id', session.user?.id);

    if (error) {
      console.error('Error updating invitation:', error);
    } else {
      router.push('/');
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in</div>;
  }

  // Parse and format the month correctly
  const formattedMonth = schedule?.month ? dayjs(schedule.month).format('M') + '월' : '';

  return (
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16">
      <Navbar />
      <div className="flex flex-col p-6 w-full max-w-md mx-auto md:max-w-2xl">
        <div className="md:text-center p-2 md:p-4">
          {/* Page Title */}
          <h1 className="text-[22px] md:text-[30px] font-bold text-textMain font-pretendard tracking-[0.35em] mb-2 md:mb-3">
            초대받은 약속
          </h1>
          <h2 className="text-[14px] md:text-[16px] font-extrabold text-textMain font-deliusRegular tracking-[0.35em]">
            Invited Plans
          </h2>
        </div>

        {/* White Box with Schedule Details */}
        <div className="w-full max-w-md bg-white p-5 py-7 rounded-2xl shadow-md md:max-w-2xl mt-4 md:p-10">
          <div className="text-center">
            <h1 className="text-[22px] md:text-[32px] font-semibold text-textMain font-gangwonEdu tracking-[0.35em] mb-8 md:mb-12">
              {formattedMonth} | {schedule?.plan_name}
            </h1>
          </div>
          <form onSubmit={handleSubmit}>
            <CalendarSelector month={schedule?.month || ''} setSelectedDates={setSelectedDates} />
            <LocationSelector selectedLocations={selectedLocations} setSelectedLocations={setSelectedLocations} />
            <SelectedLocationsList selectedLocations={selectedLocations} setSelectedLocations={setSelectedLocations} />
            <div className="flex items-center justify-center mt-10">
              <button
                className="bg-[#838380] text-white hover:bg-buttonA hover:text-textButton tracking-[0.30em] w-full text-lg font-semibold py-[10px] px-16 rounded-lg focus:outline-none focus:shadow-outline shadow-lg"
                type="submit"
              >
                완료
              </button>
            </div>
          </form>
        </div>
      </div>
      <div id="map" style={{ width: '100%', height: '0', visibility: 'hidden' }}></div>
    </div>
  );
};

export default InvitedSchedulePage;
