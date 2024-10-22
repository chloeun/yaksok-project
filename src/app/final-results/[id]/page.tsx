'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; 
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { FaHome } from 'react-icons/fa'; // Import map icon for location button

interface HeartedLocation {
  name: string;
  address: string;
}

const FinalResultsPage = () => {
  const params = useParams(); 
  const scheduleId = params.id; 
  const [finalLocation, setFinalLocation] = useState<HeartedLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!scheduleId) {
      alert('잘못된 접근입니다.');
      router.push('/main'); 
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
        router.push('/main'); 
      } else {
        setFinalLocation(data.final_place); 
      }
      setLoading(false);
    };

    fetchFinalLocation();
  }, [scheduleId, router]);

  if (loading) {
    return <div className="text-center mt-10">로딩 중...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16 px-4"> 
      {/* Title Section */}
      <div className="text-center mb-8">
        <h1 className="text-[24px] md:text-[34px] font-bold text-textMain font-pretendard tracking-[0.25em] mb-3">
          최종 확정 장소
        </h1>
        <h2 className="text-[16px] md:text-[20px] font-extrabold text-textMain font-deliusRegular tracking-[0.35em]">
          Final Location
        </h2>
      </div>

      {/* White Box Section */}
      {finalLocation ? (
        <div className="w-full max-w-screen-sm bg-white rounded-lg shadow-lg p-8 md:p-10 lg:p-12 space-y-6">
          <div className="text-center">
            <h3 className="text-[22px] md:text-[28px] font-semibold text-gray-800 mb-4 font-gangwonEdu tracking-[0.10em]">
              {finalLocation.name}
            </h3>
            <hr className="border-t border-gray-300 my-4 w-10/12 mx-auto" />
            <p className="text-[18px] md:text-[22px] text-gray-600">
              주소: {finalLocation.address}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-xl font-gangwonEdu tracking-[0.10em] text-center text-gray-800">
          최종 장소가 아직 결정되지 않았습니다.
        </p>
      )}

      {/* Button Section */}
      <div className="flex justify-center mt-8 w-full max-w-screen-sm">
        <button
          className="bg-buttonA hover:bg-secondaryHover text-textButton tracking-[0.30em] w-full text-lg md:text-xl lg:text-2xl font-semibold py-[10px] md:py-[12px] lg:py-[14px] rounded-lg shadow-lg flex items-center justify-center"
          onClick={() => router.push('/main')}
        >
          <FaHome className="mr-3 w-5" /> {/* Home Icon */}
          메인 페이지로 이동
        </button>
      </div>
    </div>
  );
};

export default FinalResultsPage;
