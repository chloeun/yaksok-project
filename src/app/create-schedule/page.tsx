'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import dayjs from 'dayjs';
import PlanNameInput from './_component/PlanNameInput';
import MonthSelector from './_component/MonthSelector';
import CalendarSelector from './_component/CalendarSelector';
import LocationSelector from './_component/LocationSelector';
import SelectedLocationsList from './_component/SelectedLocationsList';
import ParticipantsInput from './_component/ParticipantsInput';

interface Location {
  title: string;
  roadAddress: string;
}

const CreateSchedulePage = () => {
  const { data: session, status } = useSession();
  
  // 상태 값에 명시적으로 타입 지정
  const [planName, setPlanName] = useState<string>(''); // 문자열 상태
  const [month, setMonth] = useState<string>(''); // 문자열 상태
  const [participants, setParticipants] = useState<string[]>([]); // 문자열 배열 상태
  const [monthsOptions, setMonthsOptions] = useState<string[]>([]); // 문자열 배열 상태
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]); // 객체 배열 상태
  const [selectedDates, setSelectedDates] = useState<string[]>([]); // 문자열 배열 상태
  
  const [errors, setErrors] = useState<Record<string, string>>({});  // 오류 메시지 상태

  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const options = Array.from({ length: 6 }, (_, i) => {
      const date = dayjs().add(i, 'month');
      return date.format('YYYY-MM');
    });
    setMonthsOptions(options);
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!planName) newErrors.planName = '약속 이름을 입력하세요.';
    if (!month) newErrors.month = '약속 기간을 선택하세요.';
    if (!selectedDates.length) newErrors.dates = '약속 날짜를 선택하세요.';
    if (!selectedLocations.length) newErrors.locations = '약속 장소를 선택하세요.';
    if (!participants.length) newErrors.participants = '참여자를 입력하세요.';
    
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();  // Enter로 인해 form이 제출되지 않도록 방지
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!session) {
      console.error('Session is missing');
      return;
    }

    const { data: scheduleData, error: scheduleError } = await supabase
      .from('schedules')
      .insert([
        {
          plan_name: planName,
          month,
          dates: selectedDates,
          locations: selectedLocations,
          participants,
          created_by: session?.user?.id,
        }
      ])
      .select();

    if (scheduleError) {
      console.error('Error saving schedule:', scheduleError);
      return;
    }

    const scheduleId = scheduleData[0].id;

    const { error: organizerResponseError } = await supabase
      .from('responses')
      .insert({
        schedule_id: scheduleId,
        user_id: session.user?.id,
        selected_dates: selectedDates,
        selected_locations: selectedLocations,
      });

    if (organizerResponseError) {
      console.error('Error saving organizer response:', organizerResponseError);
      return;
    }

    await supabase
      .from('invitations')
      .insert({
        schedule_id: scheduleId,
        user_id: session.user?.id,
        username: session.user?.name,
        status: 'accepted',
        last_page: 'waiting-for-responses',
        is_final_confirmed: false,
      });

    for (const participantId of participants) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('username')
        .eq('id', participantId)
        .single();

      if (userError) {
        console.error('Error fetching username:', userError);
      } else {
        await supabase
          .from('invitations')
          .insert({
            schedule_id: scheduleId,
            user_id: participantId,
            username: userData.username,
            status: 'pending',
            is_final_confirmed: false,
          });
      }
    }

    router.push(`/waiting-for-responses/${scheduleId}`);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in</div>; 
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16" onKeyDown={handleKeyDown}>
      <div className="flex flex-col p-6 w-full max-w-md mx-auto md:max-w-2xl">
        <div className="md:text-center p-2 md:p-4">
          <h1 className="text-[22px] md:text-[30px] font-bold text-textMain font-pretendard tracking-[0.35em] mb-2 md:mb-3">새 약속 만들기</h1>
          <h1 className="text-[14px] md:text-[16px] font-extrabold text-textMain font-deliusRegular tracking-[0.35em]">Make a Plan</h1>
        </div> 
        <form className="w-full max-w-md bg-white p-5 py-7 rounded-2xl shadow-md md:max-w-2xl mt-4 md:p-10" onSubmit={handleSubmit}>
          <PlanNameInput planName={planName} setPlanName={setPlanName} />
          {errors.planName && <p className="text-red-500 text-sm mt-1">{errors.planName}</p>}

          <MonthSelector month={month} setMonth={setMonth} monthsOptions={monthsOptions} />
          {errors.month && <p className="text-red-500 text-sm mt-1">{errors.month}</p>}

          <CalendarSelector month={month} setSelectedDates={setSelectedDates} />
          {errors.dates && <p className="text-red-500 text-sm mt-1">{errors.dates}</p>}

          <LocationSelector selectedLocations={selectedLocations} setSelectedLocations={setSelectedLocations} />
          {errors.locations && <p className="text-red-500 text-sm mt-1">{errors.locations}</p>}

          <SelectedLocationsList selectedLocations={selectedLocations} setSelectedLocations={setSelectedLocations} />
          
          <ParticipantsInput participants={participants} setParticipants={setParticipants} hostId={session?.user?.id ?? ''} />

          {errors.participants && <p className="text-red-500 text-sm mt-1">{errors.participants}</p>}

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
  );
};

export default CreateSchedulePage;
