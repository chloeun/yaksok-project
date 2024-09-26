'use client';

import { useEffect, useState } from 'react';
import LocationCard from './LocationCard'; // LocationCard 컴포넌트 임포트
import { supabase } from '@/lib/supabaseClient'; // Supabase 클라이언트 임포트

interface SearchResultItem {
  name: string;
  address: string;
  latlng: naver.maps.LatLng;
}

interface LocationTabProps {
  finalLocation: {
    title: string;
    roadAddress: string;
  } | null;
  userId: string | null; // userId를 prop으로 받음
  scheduleId: string; // scheduleId를 prop으로 받음
}

const LocationTab = ({ finalLocation, userId, scheduleId }: LocationTabProps) => {
  const [map, setMap] = useState<naver.maps.Map | null>(null);  // 지도 객체 상태
  const [query, setQuery] = useState('');  // 검색어 상태
  const [places, setPlaces] = useState<SearchResultItem[]>([]);  // 장소 리스트 상태
  const [error, setError] = useState<string | null>(null);  // 에러 메시지 상태
  const [markers, setMarkers] = useState<naver.maps.Marker[]>([]);  // 마커 리스트 상태
  const [selectedHearts, setSelectedHearts] = useState<{ [key: number]: boolean }>({});  // 하트 선택 상태

  // 기본 마커 위치를 설정하는 함수
  const setStaticMarker = (lat: number, lng: number, title: string, mapInstance: naver.maps.Map) => {
    const staticMarker = new naver.maps.Marker({
      position: new naver.maps.LatLng(lat, lng),  // 변환된 좌표를 사용하여 마커 위치 설정
      map: mapInstance,
      title: title,  // 장소 이름을 타이틀로 설정
    });
  };

  // 지도를 초기화하고 finalLocation을 처리하는 함수
  useEffect(() => {
    const initMap = () => {
      const mapOptions: naver.maps.MapOptions = {
        center: new naver.maps.LatLng(37.5665, 126.978),  // 서울 중심 좌표
        zoom: 12,
        minZoom: 11,
        maxZoom: 19,
        zoomControl: true,
        zoomControlOptions: {
          style: naver.maps.ZoomControlStyle.SMALL,
          position: naver.maps.Position.TOP_RIGHT,
        },
        mapDataControl: false,
      };
      const mapInstance = new naver.maps.Map('map', mapOptions);
      setMap(mapInstance);

      // 만약 finalLocation이 있으면, roadAddress를 이용해 좌표로 변환
      if (finalLocation) {
        naver.maps.Service?.geocode({ query: finalLocation.roadAddress }, (status, response) => {
          if (status === naver.maps.Service.Status.OK) {
            const { y, x } = response.v2.addresses[0];
            const lat = parseFloat(y);
            const lng = parseFloat(x);

            // 변환된 좌표로 마커를 설정하고 지도 중심을 설정
            setStaticMarker(lat, lng, finalLocation.title, mapInstance);
            mapInstance.setCenter(new naver.maps.LatLng(lat, lng));  // 지도 중심을 finalLocation으로 설정
            mapInstance.setZoom(15);  // 줌 레벨을 설정
          } else {
            console.error('좌표 변환 실패:', status);
            setError('기본 장소의 좌표를 변환하는 데 실패했습니다.');
          }
        });
      }
    };

    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder,transcoord`;
    script.onload = () => initMap();
    document.head.appendChild(script);
  }, [finalLocation]);

  // 장소를 검색하는 함수
  const searchPlaces = async () => {
    if (!query || !map) {
      setError('지도 또는 검색어가 초기화되지 않았습니다.');
      return;
    }

    try {
      const response = await fetch(`/api/search-place?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (response.ok && data.items && data.items.length > 0) {
        const searchResults: SearchResultItem[] = [];

        // 1. 하트된 장소 불러오기 (Supabase)
        const { data: heartedLocations, error: heartError } = await supabase
          .from('hearted_locations')
          .select('location')
          .eq('user_id', userId)
          .eq('schedule_id', scheduleId);

        if (heartError) {
          console.error('Error fetching hearted locations:', heartError);
        }

        const heartedAddresses = heartedLocations ? heartedLocations.map((item: { location: { address: string } }) => item.location.address) : [];

        // 2. 검색된 장소 처리
        data.items.forEach((place: any, index: number) => {
          const formattedPlace = {
            name: place.title.replace(/<[^>]+>/g, ''),  // 검색된 장소 이름
            address: place.roadAddress || place.address,  // 검색된 장소 주소
            latlng: new naver.maps.LatLng(0, 0),  // 좌표 초기화
          };

          // 주소를 좌표로 변환하는 함수
          naver.maps.Service.geocode({ query: formattedPlace.address }, (status, response) => {
            if (status === naver.maps.Service.Status.OK) {
              const { y, x } = response.v2.addresses[0];
              const lat = parseFloat(y);
              const lng = parseFloat(x);

              formattedPlace.latlng = new naver.maps.LatLng(lat, lng);

              // 마커를 지도에 추가하는 함수
              addMarker(formattedPlace.name, formattedPlace.latlng);

              if (map && index === 0) {
                map.setCenter(new naver.maps.LatLng(lat, lng));
                map.setZoom(15);  // 지도 줌 레벨 설정
              }

              // 장소 리스트에 추가
              searchResults.push(formattedPlace);

              // 3. heart 상태 업데이트
              setSelectedHearts((prev) => ({
                ...prev,
                [index]: heartedAddresses.includes(formattedPlace.address),  // 해당 장소가 하트된 경우 선택 상태로 설정
              }));

              if (index === data.items.length - 1) {
                setPlaces([...searchResults]);  // 장소 리스트 업데이트
              }
            }
          });
        });
      } else {
        setError('검색 결과가 없습니다.');
      }
    } catch (error) {
      setError('장소 검색 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  // 마커를 지도에 추가하는 함수
  const addMarker = (name: string, position: naver.maps.LatLng) => {
    if (!map) return;

    markers.forEach((marker) => marker.setMap(null));  // 기존 마커 삭제
    setMarkers([]);

    const marker = new naver.maps.Marker({
      position: position,
      map: map!,
      title: name,
    });

    marker.addListener('click', () => {
      const infoWindow = new naver.maps.InfoWindow({
        content: `<div style="padding:10px;">${name}</div>`,
      });
      infoWindow.open(map, marker);
    });

    setMarkers((prevMarkers) => [...prevMarkers, marker]);  // 마커 리스트 업데이트
  };

  // 하트를 토글하는 함수 (Supabase 연동)
  const toggleHeart = async (index: number, place: SearchResultItem) => {
    const isHearted = selectedHearts[index];
    setSelectedHearts((prev) => ({
      ...prev,
      [index]: !isHearted,  // 하트 상태 업데이트
    }));
  
    try {
      if (!userId || !scheduleId) {
        setError('User or Schedule ID is missing.');
        return;
      }
  
      if (!isHearted) {
        // Supabase를 사용해 하트(저장)
        const { error } = await supabase
          .from('hearted_locations')
          .insert([{ location: place, user_id: userId, schedule_id: scheduleId }]);
  
        if (error) {
          if (error.code === '23505') {
            console.error('This location is already hearted by this user for this schedule.');
          } else {
            throw error;
          }
        } else {
          console.log('Heart saved successfully!');
        }
      } else {
        // Supabase를 사용해 하트 해제(삭제) -> address를 고유값으로 사용
        const { error } = await supabase
          .from('hearted_locations')
          .delete()
          .match({ user_id: userId, schedule_id: scheduleId })
          .eq('location->>address', place.address); // JSON 필드 내 address 매칭
  
        if (error) throw error;
        console.log('Heart removed successfully!');
      }
    } catch (error) {
      console.error('Error toggling heart:', error);
    }
  };  

  // 선택한 장소를 지도 중심에 표시하고 줌 레벨을 조정하는 함수
  const focusOnPlace = (latlng: naver.maps.LatLng) => {
    if (map) {
      map.setCenter(latlng);
      map.setZoom(17);  // 줌 레벨을 17로 설정
    }
  };

  // Enter 키를 눌렀을 때 장소 검색 함수 실행
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      searchPlaces();
    }
  };

  return (
    <div>
      <h2 className="text-xl mb-6 font-gangwonEdu tracking-[0.10em] text-center text-gray-800">만나고 싶은 장소를 검색하세요! (역 800m 이내)</h2>

      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="검색할 장소를 입력하세요"
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="ml-2 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg whitespace-nowrap" onClick={searchPlaces}>
          검색
        </button>
      </div>

      <div id="map" className="w-full h-96 border-2 border-gray-300 rounded-lg" />

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <ul className="mt-4 space-y-2">
        {places.map((place, index) => (
          <LocationCard
            key={index}
            name={place.name}
            address={place.address}
            latlng={place.latlng}
            isSelected={selectedHearts[index] || false}
            onToggleHeart={() => toggleHeart(index, place)}  // 하트 토글 함수
            onFocusPlace={() => focusOnPlace(place.latlng)}  // 장소 포커스 함수
          />
        ))}
      </ul>
    </div>
  );
};

export default LocationTab;
