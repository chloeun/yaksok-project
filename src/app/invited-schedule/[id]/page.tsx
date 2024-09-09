'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import CalendarSelector from '../../create-schedule/_component/CalendarSelector';
import LocationSelector from '../../create-schedule/_component/LocationSelector';
import SelectedLocationsList from '../../create-schedule/_component/SelectedLocationsList';
import dayjs from 'dayjs';

interface Schedule {
  id: string;
  plan_name: string;
  month: string;
  dates: string[];
  created_by: string;
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

  // 일정 데이터 가져오기 및 last_page 업데이트
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

          // Update last_page in invitations table
          await supabase
            .from('invitations')
            .update({ last_page: 'invited-schedule' })
            .eq('schedule_id', scheduleId)
            .eq('user_id', session?.user?.id);
        }
      }
    };

    fetchSchedule();
  }, [params.id, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!schedule || !session) {
      console.error('Schedule or session is missing');
      return;
    }

    // Save user's response
    const { error: responseError } = await supabase
      .from('responses')
      .insert({
        schedule_id: schedule.id,
        user_id: session.user?.id,
        selected_dates: selectedDates,
        selected_locations: selectedLocations,
      });

    if (responseError) {
      console.error('Error saving response:', responseError);
      return;
    }

    // Fetch all invitations for this schedule
    const { data: invitationsData, error: invitationsError } = await supabase
      .from('invitations')
      .select('user_id, status')
      .eq('schedule_id', schedule.id);

    if (invitationsError) {
      console.error('Error fetching invitations:', invitationsError);
      return;
    }

    // Check if there are any pending invitations
    const pendingInvitations = invitationsData.filter(
      (invitation: { status: string }) => invitation.status === 'pending'
    );

    if (pendingInvitations.length > 0) {
      // If there are any pending invitations, stay on the waiting page
      router.push(`/waiting-for-responses/${schedule.id}`);
      return;
    }

    // Fetch responses of accepted invitations
    const { data: responsesData, error: responsesError } = await supabase
      .from('responses')
      .select('user_id')
      .eq('schedule_id', schedule.id);

    if (responsesError) {
      console.error('Error fetching responses:', responsesError);
      return;
    }

    // Filter accepted invitations
    const acceptedInvitations = invitationsData.filter(
      (invitation: { status: string }) => invitation.status === 'accepted'
    );
    const respondedUserIds = responsesData.map((response: any) => response.user_id);

    // Check if all accepted users have responded
    const allAcceptedResponded = acceptedInvitations.every((invitation: { user_id: string }) =>
      respondedUserIds.includes(invitation.user_id)
    );

    // If all accepted users have responded, redirect to coordinate schedule
    if (allAcceptedResponded) {
      router.push(`/coordinate-schedule/${schedule.id}`);
    } else {
      router.push(`/waiting-for-responses/${schedule.id}`);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in</div>;
  }

  const formattedMonth = schedule?.month ? dayjs(schedule.month).format('M') + '월' : '';

  return (
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16">
      {/* <Navbar /> */}
      <div className="flex flex-col p-6 w-full max-w-md mx-auto md:max-w-2xl">
        <div className="md:text-center p-2 md:p-4">
          <h1 className="text-[22px] md:text-[30px] font-bold text-textMain font-pretendard tracking-[0.35em] mb-2 md:mb-3">
            초대받은 약속
          </h1>
          <h2 className="text-[14px] md:text-[16px] font-extrabold text-textMain font-deliusRegular tracking-[0.35em]">
            Invited Plans
          </h2>
        </div>

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
    </div>
  );
};


export default InvitedSchedulePage;
