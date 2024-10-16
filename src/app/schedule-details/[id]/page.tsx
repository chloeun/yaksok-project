'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation'; // URL 파라미터 및 검색 매개변수 가져오기
import { useSession } from 'next-auth/react'; // useSession 가져오기
import { supabase } from '@/lib/supabaseClient'; // Supabase 클라이언트
import ScheduleCard from '../_component/ScheduleCard'; // 일정 카드 컴포넌트
import TabMenu from '../_component/TabMenu'; // 탭 메뉴 컴포넌트

const ScheduleDetailsPage = () => {
  const { data: session } = useSession(); // NextAuth로부터 사용자 세션을 가져옴
  const userId = session?.user?.id || null; // 세션에서 사용자 ID를 가져옴, 없을 시 null 처리
  const params = useParams(); // URL의 일정 ID를 가져옴
  const router = useRouter();
  const scheduleId = Array.isArray(params.id) ? params.id[0] : params.id; // Ensure scheduleId is a string

  // 선택된 탭 상태 (장소, 날짜 등)
  const [selectedTab, setSelectedTab] = useState<string>('장소');
  const [scheduleTitle, setScheduleTitle] = useState<string>(''); // 일정 제목 상태
  const [participants, setParticipants] = useState<string[]>([]); // 참가자 이름들 상태

  // URL에서 검색 매개변수 (final_date, final_location)를 가져옴
  const searchParams = useSearchParams();
  const finalDate = searchParams.get('final_date') || '';
  const finalLocationParam = searchParams.get('final_location');
  const finalLocation = finalLocationParam ? JSON.parse(decodeURIComponent(finalLocationParam)) : null;

  // Fetch schedule and participants
  useEffect(() => {
    const fetchScheduleData = async () => {
      if (!scheduleId) return;

      // 일정 정보 가져오기 (plan_name)
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('schedules')
        .select('plan_name')
        .eq('id', scheduleId)
        .single(); // 해당 ID에 해당하는 일정 정보 가져옴

      if (scheduleError) {
        console.error('Error fetching schedule:', scheduleError); // 오류 처리
        return;
      }
      setScheduleTitle(scheduleData.plan_name); // 일정 제목 상태 업데이트

      // 초대 상태가 'accepted'인 참가자의 user_id 가져오기
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('invitations')
        .select('user_id')
        .eq('schedule_id', scheduleId)
        .eq('status', 'accepted');

      if (invitationsError) {
        console.error('Error fetching participants:', invitationsError); // 오류 처리
        return;
      }

      const participantIds = invitationsData.map((invitation: { user_id: string }) => invitation.user_id); // 참가자 ID 배열 생성

      // 참가자들의 이름 가져오기 (user_id로 users 테이블에서 name을 조회)
      const { data: userData, error: usersError } = await supabase
        .from('users')
        .select('name')
        .in('id', participantIds);

      if (usersError) {
        console.error('Error fetching user names:', usersError); // 오류 처리
        return;
      }

      const participantNames = userData.map((user: { name: string }) => user.name); // 참가자 이름 배열 생성
      setParticipants(participantNames); // 참가자 이름 상태 업데이트

      // Update last_page to 'schedule-details'
      await supabase
        .from('invitations')
        .update({ last_page: 'schedule-details' })
        .eq('schedule_id', scheduleId)
        .eq('user_id', session?.user?.id);
    };

    fetchScheduleData();
  }, [scheduleId, session]);

  // 탭 변경 시 상태 업데이트
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#FAFAF5] pt-24 md:pt-16">
      <div className="text-center p-4">
        <h1 className="text-[22px] md:text-[30px] font-bold text-[#333] font-pretendard tracking-[0.2em] mb-2">
          약속 장소 정하기
        </h1>
        <h2 className="text-[14px] md:text-[16px] font-extrabold text-[#666] font-deliusRegular tracking-[0.3em]">
          Make Decisions
        </h2>
      </div>

      {/* 일정 정보 카드에 필요한 데이터를 props로 전달 */}
      <ScheduleCard
        title={scheduleTitle}
        date={finalDate}
        time="시간 입력" // 시간은 임의로 입력
        location={finalLocation?.title || '장소 입력'} // finalLocation이 없을 경우 기본값 '장소 입력'
        participants={participants} // 참가자 이름 배열
      />

      {/* 탭 메뉴 컴포넌트에 userId와 scheduleId를 내려줌 */}
      <TabMenu
        selectedTab={selectedTab}
        handleTabChange={handleTabChange}
        finalLocation={finalLocation}
        userId={userId}
        scheduleId={scheduleId} // Pass scheduleId as string
      />
    </div>
  );
};

export default ScheduleDetailsPage;
