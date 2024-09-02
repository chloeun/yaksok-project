'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import dayjs from 'dayjs';

interface ResponseData {
  user_id: string;
  selected_dates: string[];
  selected_locations: { title: string, roadAddress: string }[];
}

const CoordinateSchedulePage = () => {
  const { data: session, status } = useSession();
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [bestDateOptions, setBestDateOptions] = useState<string[]>([]);
  const [bestLocationOptions, setBestLocationOptions] = useState<string[]>([]);
  const [userVoteDate, setUserVoteDate] = useState<string | null>(null);
  const [userVoteLocation, setUserVoteLocation] = useState<string | null>(null);
  const [allResponded, setAllResponded] = useState(false);
  const router = useRouter();
  const params = useParams();

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // 응답 데이터 가져오기 및 last_page 업데이트
  useEffect(() => {
    const fetchResponses = async () => {
      const scheduleId = params.id;
      if (scheduleId && session?.user) {
        const { data: responsesData, error: responsesError } = await supabase
          .from('responses')
          .select('*')
          .eq('schedule_id', scheduleId);

        if (responsesError) {
          console.error('Error fetching responses:', responsesError);
        } else {
          setResponses(responsesData);
          calculateBestOptions(responsesData);

          // Update the last_page in the invitations table
          await supabase
            .from('invitations')
            .update({ last_page: 'coordinate-schedule' })
            .eq('schedule_id', scheduleId)
            .eq('user_id', session?.user?.id);
        }
      }
    };

    fetchResponses();
  }, [params.id, session]);

  // 최적의 날짜와 장소 계산
  const calculateBestOptions = (responsesData: ResponseData[]) => {
    const dateOccurrences: { [key: string]: number } = {};
    const locationOccurrences: { [key: string]: number } = {};

    responsesData.forEach((response) => {
      response.selected_dates.forEach((date) => {
        dateOccurrences[date] = (dateOccurrences[date] || 0) + 1;
      });

      response.selected_locations.forEach((location) => {
        const locationKey = `${location.title}:${location.roadAddress}`;
        locationOccurrences[locationKey] = (locationOccurrences[locationKey] || 0) + 1;
      });
    });

    const maxDateVotes = Math.max(...Object.values(dateOccurrences));
    const bestDates = Object.keys(dateOccurrences).filter(date => dateOccurrences[date] === maxDateVotes);

    const maxLocationVotes = Math.max(...Object.values(locationOccurrences));
    const bestLocations = Object.keys(locationOccurrences).filter(location => locationOccurrences[location] === maxLocationVotes);

    setBestDateOptions(bestDates);
    setBestLocationOptions(bestLocations);
  };

  const handleVoteSubmit = async () => {
    if (userVoteDate && userVoteLocation) {
      // Save the vote in the 'votes' table
      const { error } = await supabase
        .from('votes')
        .insert({
          schedule_id: params.id,
          user_id: session?.user?.id,
          voted_date: userVoteDate,  // Corrected field name
          voted_location: userVoteLocation,  // Corrected field name
        });
  
      if (error) {
        console.error('Error submitting vote:', error);
        return;
      }
  
      // Check if all users have voted
      const { data: votesData, error: votesError } = await supabase
        .from('votes')
        .select('user_id')
        .eq('schedule_id', params.id);
  
      if (votesError) {
        console.error('Error fetching votes:', votesError);
        return;
      }
  
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('invitations')
        .select('user_id')
        .eq('schedule_id', params.id)
        .eq('status', 'accepted');
  
      if (invitationsError) {
        console.error('Error fetching invitations:', invitationsError);
        return;
      }
  
      const votedUserIds = votesData.map((vote: any) => vote.user_id);
      const allVoted = invitationsData.every((invitation: { user_id: string }) =>
        votedUserIds.includes(invitation.user_id)
      );
  
      if (allVoted) {
        console.log('All users have voted, redirecting to the final schedule page');
        router.push(`/final-schedule/${params.id}`);
      } else {
        console.log('Not all users have voted, redirecting to the waiting page');
        router.push(`/waiting-for-responses/${params.id}`);
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F5F5F5] pt-16 md:pt-24">
      <Navbar />
      <div className="flex flex-col p-6 w-full max-w-md mx-auto md:max-w-lg lg:max-w-xl">
        <div className="text-center p-4">
          <h1 className="text-[22px] md:text-[30px] font-bold text-[#333] font-pretendard tracking-[0.3em] mb-2">
            일정 조율
          </h1>
          <h2 className="text-[14px] md:text-[16px] font-extrabold text-[#666] font-deliusRegular tracking-[0.3em]">
            Match Schedules
          </h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg md:p-8 mt-6">
          <div className="text-center mb-6">
            <h1 className="text-[22px] md:text-[28px] font-semibold text-[#333] font-gangwonEdu tracking-[0.3em]">
              {bestDateOptions.length > 0 ? `최적의 날짜를 선택하세요:` : '추천 날짜가 없습니다'}
            </h1>
            {bestDateOptions.map(date => (
              <div key={date} className="my-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="date"
                    value={date}
                    onChange={() => setUserVoteDate(date)}
                  />
                  <span className="ml-2">{dayjs(date).format('M월 D일')}</span>
                </label>
              </div>
            ))}
          </div>
          <div className="text-center mb-6">
            <h1 className="text-[22px] md:text-[28px] font-semibold text-[#333] font-gangwonEdu tracking-[0.3em]">
              {bestLocationOptions.length > 0 ? `최적의 장소를 선택하세요:` : '추천 장소가 없습니다'}
            </h1>
            {bestLocationOptions.map(location => (
              <div key={location} className="my-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="location"
                    value={location}
                    onChange={() => setUserVoteLocation(location)}
                  />
                  <span className="ml-2">{location.split(':')[0]}</span>
                </label>
              </div>
            ))}
          </div>
          {bestDateOptions.length > 0 && bestLocationOptions.length > 0 && (
            <div className="flex justify-center">
              <button
                className="bg-[#5BB75B] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-[#4cae4c] transition-all"
                onClick={handleVoteSubmit}
              >
                선택 완료
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoordinateSchedulePage;
