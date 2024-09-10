'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import dayjs from 'dayjs';

interface ResponseData {
  user_id: string;
  selected_dates: string[];
  selected_locations: { title: string; roadAddress: string }[];
}

const CoordinateSchedulePage = () => {
  const { data: session, status } = useSession(); // 현재 세션 및 로그인 상태를 가져옴
  const [responses, setResponses] = useState<ResponseData[]>([]); // 응답 데이터를 저장하는 상태
  const [bestDateOptions, setBestDateOptions] = useState<string[]>([]); // 가장 많이 선택된 날짜 옵션 저장 상태
  const [bestLocationOptions, setBestLocationOptions] = useState<string[]>([]); // 가장 많이 선택된 장소 옵션 저장 상태
  const [allAvailableDates, setAllAvailableDates] = useState<string[]>([]); // 모두가 선택한 날짜 저장 상태
  const [allAvailableLocations, setAllAvailableLocations] = useState<string[]>([]); // 모두가 선택한 장소 저장 상태
  const [userVoteDate, setUserVoteDate] = useState<string | null>(null); // 사용자가 선택한 날짜 상태
  const [userVoteLocation, setUserVoteLocation] = useState<string | null>(null); // 사용자가 선택한 장소 상태
  const router = useRouter();
  const params = useParams(); // URL 파라미터에서 schedule ID를 가져옴

  // 일정 데이터를 가져오는 상태
  const [schedule, setSchedule] = useState<any>(null);

  // 로그인이 되어 있지 않을 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login'); // 로그인이 되어 있지 않으면 로그인 페이지로 이동
    }
  }, [status, router]);

  // 일정 및 응답 데이터를 가져옴
  useEffect(() => {
    const fetchResponses = async () => {
      const scheduleId = params.id; // URL에서 schedule ID 가져오기
      if (scheduleId && session?.user) {
        // 일정 데이터를 가져옴
        const { data: scheduleData, error: scheduleError } = await supabase
          .from('schedules')
          .select('*')
          .eq('id', scheduleId)
          .single();

        if (scheduleError) {
          console.error('Error fetching schedule:', scheduleError);
          return;
        }

        setSchedule(scheduleData); // 가져온 일정 데이터를 상태에 저장

        // 응답 데이터를 가져옴
        const { data: responsesData, error: responsesError } = await supabase
          .from('responses')
          .select('*')
          .eq('schedule_id', scheduleId);

        if (responsesError) {
          console.error('Error fetching responses:', responsesError);
        } else {
          setResponses(responsesData); // 응답 데이터를 상태에 저장
          calculateBestOptions(responsesData); // 응답 데이터를 기반으로 계산
        }
      }
    };

    fetchResponses();
  }, [params.id, session]);

  // 응답 데이터를 기반으로 날짜 및 장소 계산
  const calculateBestOptions = (responsesData: ResponseData[]) => {
    const dateOccurrences: { [key: string]: number } = {};
    const locationOccurrences: { [key: string]: number } = {};

    // 날짜 및 장소의 빈도 계산
    responsesData.forEach((response) => {
      response.selected_dates.forEach((date) => {
        dateOccurrences[date] = (dateOccurrences[date] || 0) + 1;
      });

      response.selected_locations.forEach((location) => {
        const locationKey = `${location.title}:${location.roadAddress}`;
        locationOccurrences[locationKey] = (locationOccurrences[locationKey] || 0) + 1;
      });
    });

    // 모두가 선택한 날짜와 장소 계산
    const totalResponses = responsesData.length;
    const commonDates = Object.keys(dateOccurrences).filter((date) => dateOccurrences[date] === totalResponses);
    const commonLocations = Object.keys(locationOccurrences).filter(
      (location) => locationOccurrences[location] === totalResponses
    );

    setAllAvailableDates(commonDates); // 모두가 선택한 날짜 저장
    setAllAvailableLocations(commonLocations); // 모두가 선택한 장소 저장

    // 모두가 선택한 날짜와 장소가 없을 때, 최다 선택한 항목 중 두 명 이상이 선택한 날짜/장소를 저장
    const filteredBestDates = Object.keys(dateOccurrences).filter((date) => dateOccurrences[date] > 1);
    const filteredBestLocations = Object.keys(locationOccurrences).filter((location) => locationOccurrences[location] > 1);

    setBestDateOptions(filteredBestDates);
    setBestLocationOptions(filteredBestLocations);
  };

  // 사용자가 선택한 날짜와 장소를 제출하는 함수
  const handleVoteSubmit = async () => {
    if (userVoteDate && userVoteLocation) {
      const { error } = await supabase
        .from('votes')
        .insert({
          schedule_id: params.id,
          user_id: session?.user?.id,
          voted_date: userVoteDate,
          voted_location: userVoteLocation,
        });

      if (error) {
        console.error('Error submitting vote:', error);
        return;
      }

      // 투표 완료 후 결과 페이지로 리다이렉트
      router.push(`/final-schedule/${params.id}`);
    }
  };

  if (status === 'loading' || !schedule) {
    return <div>Loading...</div>; // 데이터 로딩 중일 때 표시
  }

  // 날짜를 포맷하여 표시
  const formattedMonth = schedule?.month ? dayjs(schedule.month).format('M') + '월' : '';

  return (
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16">
      <div className="flex flex-col p-6 w-full max-w-md mx-auto md:max-w-2xl">
        <div className="md:text-center p-2 md:p-4">
          <h1 className="text-[22px] md:text-[30px] font-bold text-textMain font-pretendard tracking-[0.35em] mb-2 md:mb-3">
            일정 조율
          </h1>
          <h2 className="text-[14px] md:text-[16px] font-extrabold text-textMain font-deliusRegular tracking-[0.35em]">
            Match Schedules
          </h2>
        </div>
        <div className="w-full max-w-md bg-white p-5 py-7 rounded-2xl shadow-md md:max-w-2xl mt-4 md:p-10">
          <div className="text-center">
            <h1 className="text-[22px] md:text-[32px] font-semibold text-textMain font-gangwonEdu tracking-[0.35em] mb-8 md:mb-12">
              {formattedMonth} | {schedule?.plan_name}
            </h1>
          </div>

          <form>
            {/* 날짜 선택 섹션 */}
            <div className="mb-12">
              {allAvailableDates.length > 0 ? (
                <>
                  <h3 className="font-semibold font-pretendard tracking-[0.10em] text-gray-700 text-[18px] mb-2">
                    아래는 모두가 가능한 날짜입니다.
                  </h3>
                  <p className="text-sm font-pretendard tracking-[0.05em] text-[#737370] mb-4">
                    아래는 모두가 가능한 날짜입니다.
                  </p>
                  {allAvailableDates.map((date) => (
                    <label key={date} className="flex items-center mb-2 font-bold text-[22px] text-gray-600 font-gangwonEdu tracking-[0.05em]">
                      <input
                        type="radio"
                        name="date"
                        value={date}
                        onChange={() => setUserVoteDate(date)} // 사용자가 날짜를 선택하면 상태를 업데이트
                        className="mr-2"
                      />
                      {dayjs(date).format('M월 D일')}
                    </label>
                  ))}
                </>
              ) : bestDateOptions.length > 0 ? (
                <>
                  <h3 className="font-semibold font-pretendard tracking-[0.10em] text-gray-700 text-[18px] mb-2">
                    가장 많은 사람들이 선택한 날짜입니다.
                  </h3>
                  <p className="text-sm font-pretendard tracking-[0.05em] text-[#737370] mb-4">
                    아래는 가장 많이 선택된 날짜입니다.
                  </p>
                  {bestDateOptions.map((date) => (
                    <label key={date} className="flex items-center mb-2 font-bold text-[22px] text-gray-600 font-gangwonEdu tracking-[0.05em]">
                      <input
                        type="radio"
                        name="date"
                        value={date}
                        onChange={() => setUserVoteDate(date)} // 사용자가 날짜를 선택하면 상태를 업데이트
                        className="mr-2"
                      />
                      {dayjs(date).format('M월 D일')}
                    </label>
                  ))}
                </>
              ) : (
                <p className="text-[18px] font-pretendard tracking-[0.05em] text-red-500 mb-4 text-center">겹치는 날짜가 없습니다.</p>
              )}
            </div>

            {/* 장소 선택 섹션 */}
            <div className="mb-6">
              {allAvailableLocations.length > 0 ? (
                <>
                  <h3 className="font-semibold font-pretendard tracking-[0.10em] text-gray-700 text-[18px] mb-2">
                    아래는 모두가 가능한 장소입니다.
                  </h3>
                  <p className="text-sm font-pretendard tracking-[0.05em] text-[#737370] mb-4">
                    아래는 모두가 가능한 장소입니다.
                  </p>
                  {allAvailableLocations.map((location) => (
                    <label key={location} className="flex items-center mb-2 font-bold text-[22px] text-gray-600 font-gangwonEdu tracking-[0.05em]">
                      <input
                        type="radio"
                        name="location"
                        value={location}
                        onChange={() => setUserVoteLocation(location)} // 사용자가 장소를 선택하면 상태를 업데이트
                        className="mr-2"
                      />
                      {location.split(':')[0]}
                    </label>
                  ))}
                </>
              ) : bestLocationOptions.length > 0 ? (
                <>
                  <h3 className="font-semibold font-pretendard tracking-[0.10em] text-gray-700 text-[18px] mb-2">
                    가장 많은 사람들이 선택한 장소입니다.
                  </h3>
                  <p className="text-sm font-pretendard tracking-[0.05em] text-[#737370] mb-4">
                    아래는 가장 많이 선택된 장소입니다.
                  </p>
                  {bestLocationOptions.map((location) => (
                    <label key={location} className="flex items-center mb-2 font-bold text-[22px] text-gray-600 font-gangwonEdu tracking-[0.05em]">
                      <input
                        type="radio"
                        name="location"
                        value={location}
                        onChange={() => setUserVoteLocation(location)} // 사용자가 장소를 선택하면 상태를 업데이트
                        className="mr-2"
                      />
                      {location.split(':')[0]}
                    </label>
                  ))}
                </>
              ) : (
                <p className="text-[18px] font-pretendard tracking-[0.05em] text-center text-red-500 mb-4">겹치는 장소가 없습니다.</p>
              )}
            </div>

            {/* 선택 완료 버튼 */}
            <div className="flex justify-center mt-14">
              <button
                className="bg-[#838380] text-white hover:bg-buttonA hover:text-textButton tracking-[0.30em] w-full text-lg font-semibold py-[10px] px-16 rounded-lg focus:outline-none focus:shadow-outline shadow-lg"
                onClick={handleVoteSubmit} // 사용자가 선택을 완료하면 제출
              >
                선택 완료
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CoordinateSchedulePage;
