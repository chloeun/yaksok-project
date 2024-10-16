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
  const [errors, setErrors] = useState<Record<string, string>>({});  // 오류 메시지 상태
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

  // 유효성 검사 함수
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedDates.length) newErrors.dates = '약속 날짜를 선택하세요.';
    if (!selectedLocations.length) newErrors.locations = '약속 장소를 선택하세요.';
    
    setErrors(newErrors);

    // 오류가 없을 경우에만 form이 제출되도록 함
    return Object.keys(newErrors).length === 0;
  };

  // Enter 키로 인한 form 제출 방지
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();  // Enter 키로 인해 form이 제출되지 않도록 함
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!validateForm()) return;

    if (!schedule || !session) {
      console.error('Schedule or session is missing');
      return;
    }

    // 사용자의 응답 저장
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

    // 모든 초대 상태 확인
    const { data: invitationsData, error: invitationsError } = await supabase
      .from('invitations')
      .select('user_id, status')
      .eq('schedule_id', schedule.id);

    if (invitationsError) {
      console.error('Error fetching invitations:', invitationsError);
      return;
    }

    // 대기 중인 초대가 있는지 확인
    const pendingInvitations = invitationsData.filter(
      (invitation: { status: string }) => invitation.status === 'pending'
    );

    if (pendingInvitations.length > 0) {
      router.push(`/waiting-for-responses/${schedule.id}`);
      return;
    }

    // 응답 완료된 초대 확인
    const { data: responsesData, error: responsesError } = await supabase
      .from('responses')
      .select('user_id')
      .eq('schedule_id', schedule.id);

    if (responsesError) {
      console.error('Error fetching responses:', responsesError);
      return;
    }

    const acceptedInvitations = invitationsData.filter(
      (invitation: { status: string }) => invitation.status === 'accepted'
    );
    const respondedUserIds = responsesData.map((response: any) => response.user_id);

    // 모든 승인된 사용자가 응답했는지 확인
    const allAcceptedResponded = acceptedInvitations.every((invitation: { user_id: string }) =>
      respondedUserIds.includes(invitation.user_id)
    );

    // 모든 응답이 완료되었으면 일정 조율 페이지로 이동
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
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16" onKeyDown={handleKeyDown}>
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
            {errors.dates && <p className="text-red-500 text-sm mt-1">{errors.dates}</p>} {/* 날짜 오류 메시지 */}

            <LocationSelector selectedLocations={selectedLocations} setSelectedLocations={setSelectedLocations} />
            {errors.locations && <p className="text-red-500 text-sm mt-1">{errors.locations}</p>} {/* 장소 오류 메시지 */}

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
