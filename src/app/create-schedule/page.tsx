'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import { IoIosAddCircleOutline } from 'react-icons/io';
import dayjs from 'dayjs';
import PlanNameInput from './_component/PlanNameInput';
import MonthSelector from './_component/MonthSelector';
import CalendarSelector from './_component/CalendarSelector';
import LocationSelector from './_component/LocationSelector';
import SelectedLocationsList from './_component/SelectedLocationsList';
import ParticipantsInput from './_component/ParticipantsInput';

const CreateSchedulePage = () => {
  const { data: session, status } = useSession();
  const [planName, setPlanName] = useState('');
  const [month, setMonth] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [monthsOptions, setMonthsOptions] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<{ title: string, roadAddress: string }[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]); // Define the type explicitly

  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [status, router]);

  useEffect(() => {
    const options = Array.from({ length: 6 }, (_, i) => {
      const date = dayjs().add(i, 'month');
      return date.format('YYYY-MM');
    });
    setMonthsOptions(options);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // 약속 생성
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
  
    // 참가자들에게 초대 생성
    const invitations = participants.map(participantId => ({
      schedule_id: scheduleId,
      user_id: participantId,
    }));
  
    const { error: invitationError } = await supabase
      .from('invitations')
      .insert(invitations);
  
    if (invitationError) {
      console.error('Error sending invitations:', invitationError);
      return;
    }
  
    // 약속 상세 페이지로 이동
    router.push(`/schedule/${scheduleId}`);
  };
  

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16">
      <Navbar />
      <div className="flex flex-col p-6 w-full max-w-md mx-auto md:max-w-2xl">
        <div className="md:text-center p-2 md:p-4">
          <h1 className="text-[22px] md:text-[30px] font-bold text-textMain font-pretendard tracking-[0.35em] mb-2 md:mb-3">새 약속 만들기</h1>
          <h1 className="text-[14px] md:text-[16px] font-extrabold text-textMain font-deliusRegular tracking-[0.35em]">Make a Plan</h1>
        </div>
        <form className="w-full max-w-md bg-white p-5 py-7 rounded-2xl shadow-md md:max-w-2xl mt-4 md:p-10" onSubmit={handleSubmit}>
          <PlanNameInput planName={planName} setPlanName={setPlanName} />
          <MonthSelector month={month} setMonth={setMonth} monthsOptions={monthsOptions} />
          <CalendarSelector month={month} setSelectedDates={setSelectedDates} />
          <LocationSelector selectedLocations={selectedLocations} setSelectedLocations={setSelectedLocations} />
          <SelectedLocationsList selectedLocations={selectedLocations} setSelectedLocations={setSelectedLocations} />
          <ParticipantsInput participants={participants} setParticipants={setParticipants} />
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
      <div id="map" style={{ width: '100%', height: '0', visibility: 'hidden' }}></div>
    </div>
  );
};

export default CreateSchedulePage;
