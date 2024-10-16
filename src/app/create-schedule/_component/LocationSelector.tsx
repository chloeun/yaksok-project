import React, { useState } from 'react';

// Suggestion 인터페이스 정의: title과 roadAddress를 가진 객체 타입
interface Suggestion {
  title: string;
  roadAddress: string;
}

// LocationSelector 컴포넌트의 props 타입 정의
interface LocationSelectorProps {
  selectedLocations: Suggestion[];
  setSelectedLocations: React.Dispatch<React.SetStateAction<Suggestion[]>>;
}

// LocationSelector 컴포넌트
const LocationSelector = ({ selectedLocations, setSelectedLocations }: LocationSelectorProps) => {
  // 상태 선언: 사용자가 입력한 위치와 추천된 위치 목록
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null); // 에러 메시지 상태

  // 사용자가 위치를 입력할 때 호출되는 함수
  const handleLocationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value; // 입력된 쿼리 값을 가져옴
    setLocation(query); // location 상태를 업데이트

    if (!query) {
      // 입력된 쿼리가 없을 경우 추천 목록과 에러를 초기화
      setSuggestions([]);
      setError(null);
      return;
    }

    try {
      // 프록시 API를 통해 검색 쿼리로 데이터를 가져옴 (지하철역을 검색)
      const response = await fetch(`/api/proxy?query=${encodeURIComponent(query + ' 지하철역')}`);
      const data = await response.json();

      if (response.ok && data.items && data.items.length > 0) {
        const filteredItems = data.items
          .filter((item: any) => item.title.includes('역') || item.category.includes('지하철'))
          .map((item: any) => ({
            title: item.title
              .replace(/<[^>]+>/g, '') // HTML 태그 제거
              .replace(/\([^)]*\)/g, '') // 괄호 안의 내용 제거 (동서울대학 같은 정보)
              .replace(/\d+-\d+번출구/g, '') // #-#번출구 제거 (예: 1-1번출구, 2-3번출구)
              .replace(/\d+번출구/g, '') // 출구 번호 제거 (예: 1번출구, 10번출구)
              .replace(/\d+호선/g, '') // 호선 정보 제거 (예: 1호선, 2호선)
              .replace(/수인분당선|신분당선|경의중앙선|공사중/g, '') // 불필요한 노선 정보 제거
              .trim(), // 앞뒤 공백 제거
            roadAddress: item.address,
          }))
          // 중복 제거 (같은 역 이름이 여러 번 나올 때)
          .filter((item: any, index: number, self: any[]) =>
            index === self.findIndex((t) => t.title === item.title)
          );

        setSuggestions(filteredItems); // 필터링된 항목을 상태에 저장
        setError(null); // 에러 상태 초기화
      } else {
        setSuggestions([]); // 검색 결과가 없을 경우 추천 목록 초기화
        setError('검색 결과가 없습니다.'); // 에러 메시지 설정
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
      setError('데이터를 가져오는 중 오류가 발생했습니다.'); // API 요청 중 오류 발생 시 에러 메시지 설정
      setSuggestions([]); // 추천 목록 초기화
    }
  };

  // 추천된 지하철역을 클릭했을 때 호출되는 함수
  const handleSuggestionClick = (suggestion: Suggestion) => {
    // 선택된 목록에 해당 지하철역이 없을 경우에만 추가
    if (!selectedLocations.some(location => location.title === suggestion.title)) {
      setSelectedLocations([...selectedLocations, suggestion]); // 새로운 역을 선택된 목록에 추가
    }
    setLocation(''); // 입력 필드 초기화
    setSuggestions([]); // 추천 목록 초기화
  };

  return (
    <div className="mb-6 relative">
      {/* 역 이름 입력 필드와 레이블 */}
      <label className="block text-gray-700 text-[16px] font-semibold font-pretendard tracking-[0.10em] mb-2">어디서 만날까요?</label>
      <input
        className="shadow appearance-none border rounded w-full py-3 px-3 font-gangwonEdu text-[18px] tracking-[0.1em] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="location"
        type="text"
        value={location} // 사용자가 입력한 값
        onChange={handleLocationChange} // 입력 변경 시 호출
        placeholder="역 이름을 입력하세요"
      />
      {/* 에러 메시지가 있을 경우 렌더링 */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {/* 추천된 지하철역 목록 렌더링 */}
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto w-full z-10">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSuggestionClick(suggestion)} // 역 클릭 시 호출
            >
              {suggestion.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSelector;
