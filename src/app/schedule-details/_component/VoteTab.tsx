'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface HeartedLocation {
  name: string;
  address: string;
}

const VoteTab = () => {
  const [heartedLocations, setHeartedLocations] = useState<HeartedLocation[]>([]);  // 하트된 장소 리스트 상태

  // 하트된 장소 목록을 가져오는 함수
  useEffect(() => {
    const fetchHeartedLocations = async () => {
      const { data, error } = await supabase
        .from('hearted_locations')
        .select('location')
        .eq('user_id', 'your_user_id');  // 현재 사용자 ID로 필터링

      if (error) {
        console.error('Error fetching hearted locations:', error);
      } else {
        setHeartedLocations(data.map((entry: any) => entry.location));  // 데이터에서 장소 정보 추출
      }
    };

    fetchHeartedLocations();
  }, []);

  // 투표 제출 함수 (선택된 장소에 투표)
  const submitVote = async (location: HeartedLocation) => {
    try {
      const { error } = await supabase
        .from('votes')
        .insert([{ voted_location: location, user_id: 'your_user_id', schedule_id: 'your_schedule_id' }]);  // 투표 데이터 삽입

      if (error) {
        console.error('Failed to vote for location:', error);
      }
    } catch (error) {
      console.error('Error voting for location:', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl mb-6 font-gangwonEdu tracking-[0.10em] text-center text-gray-800">만나고 싶은 장소에 투표해주세요! (최대 3곳)</h2>
      <div className="space-y-4">
        {heartedLocations.map((location, index) => (
          <button
            key={index}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg"
            onClick={() => submitVote(location)}  // 투표 제출 함수 호출
          >
            {location.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VoteTab;
