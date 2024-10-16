'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Correct way to get the URL params
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface HeartedLocation {
  name: string;
  address: string;
}

const FinalResultsPage = () => {
  const params = useParams(); // Fetching the scheduleId from URL params
  const scheduleId = params.id; // Use params.id instead of query params
  const [finalLocation, setFinalLocation] = useState<HeartedLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch the final location based on scheduleId
  useEffect(() => {
    if (!scheduleId) {
      alert('잘못된 접근입니다.');
      router.push('/main'); // Redirect to main page if no scheduleId
      return;
    }

    const fetchFinalLocation = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('schedules')
        .select('final_place')
        .eq('id', scheduleId)
        .single();

      if (error || !data.final_place) {
        console.error('Error fetching final location:', error);
        alert('최종 장소를 불러오는 중 오류가 발생했습니다.');
        router.push('/main'); // Redirect to main page on error
      } else {
        setFinalLocation(data.final_place); // Set final location
      }
      setLoading(false);
    };

    fetchFinalLocation();
  }, [scheduleId, router]);

  if (loading) {
    return <div className="text-center mt-10">로딩 중...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#FAFAF5] pt-24 md:pt-16">
      <div className="text-center p-4">
        <h1 className="text-[22px] md:text-[30px] font-bold text-[#333] font-pretendard tracking-[0.2em] mb-2">
          최종 확정 장소
        </h1>
        <h2 className="text-[14px] md:text-[16px] font-extrabold text-[#666] font-deliusRegular tracking-[0.3em]">
          Final Location
        </h2>
      </div>

      {finalLocation ? (
        <div className="w-full max-w-md font-gangwonEdu bg-white p-5 py-5 mb-6 tracking-[0.20em] rounded-2xl shadow-md md:max-w-2xl lg:max-w-3xl">
          <h3 className="text-[22px] md:text-[24px] lg:text-[26px] font-semibold mb-2 text-center text-textMain tracking-[0.20em]">
            {finalLocation.name} {/* 최종 장소 이름 */}
          </h3>
          <hr className="border-t border-gray-300 my-4 w-10/12 mx-auto" />
          <p className="text-[18px] md:text-[22px] lg:text-[24px] text-gray-600 text-center">
            주소: {finalLocation.address} {/* 최종 장소 주소 */}
          </p>
        </div>
      ) : (
        <p className="text-xl font-gangwonEdu tracking-[0.10em] text-center text-gray-800">
          최종 장소가 아직 결정되지 않았습니다.
        </p>
      )}

      <button
        className="w-full max-w-md bg-blue-500 text-white py-2 px-4 mt-4 rounded-lg"
        onClick={() => router.push('/main')}
      >
        메인 페이지로 이동
      </button>
    </div>
  );
};

export default FinalResultsPage;
