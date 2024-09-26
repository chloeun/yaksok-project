'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import LocationCard from './LocationCard'; // LocationCard 컴포넌트 임포트

interface HeartedLocation {
  name: string;
  address: string;
  latlng: naver.maps.LatLng | null;
}

interface HeartTabProps {
  userId: string | null;
  scheduleId: string;
}

const HeartTab = ({ userId, scheduleId }: HeartTabProps) => {
  const [heartedLocations, setHeartedLocations] = useState<HeartedLocation[]>([]);
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]); // useRef로 마커 관리

  // 하트된 장소 목록을 가져오는 함수
  useEffect(() => {
    if (!userId || !scheduleId) return;

    const fetchHeartedLocations = async () => {
      const { data, error } = await supabase
        .from('hearted_locations')
        .select('location')
        .eq('schedule_id', scheduleId);

      if (error) {
        console.error('Error fetching hearted locations:', error);
      } else {
        const formattedLocations = data.map((entry: any) => ({
          ...entry.location,
          latlng: entry.location.lat && entry.location.lng
            ? new naver.maps.LatLng(entry.location.lat, entry.location.lng)
            : null,
        }));

        setHeartedLocations(formattedLocations);
      }
    };

    fetchHeartedLocations();
  }, [userId, scheduleId]);

  // 지도 초기화
  useEffect(() => {
    if (heartedLocations.length === 0) return; // 저장한 장소가 없으면 지도 생성 안함

    const initMap = () => {
      const mapOptions: naver.maps.MapOptions = {
        center: new naver.maps.LatLng(37.5665, 126.978),
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
    };

    if (!map && heartedLocations.length > 0) {
      const script = document.createElement('script');
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder,transcoord`;
      script.onload = () => initMap();
      document.head.appendChild(script);
    }

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null)); // 컴포넌트 해제 시 마커 제거
    };
  }, [map, heartedLocations]);

  // 하트를 토글하여 장소를 삭제하는 함수
  const toggleHeart = async (location: HeartedLocation) => {
    if (!userId || !scheduleId) return;

    try {
      const { error } = await supabase
        .from('hearted_locations')
        .delete()
        .match({ schedule_id: scheduleId, 'location->>address': location.address });

      if (error) {
        console.error('Error removing heart:', error);
      } else {
        // 삭제 후 리스트에서 장소 제거
        setHeartedLocations((prevLocations) =>
          prevLocations.filter((loc) => loc.address !== location.address)
        );
        // 해당 마커도 지도에서 제거
        markersRef.current = markersRef.current.filter((marker) => {
          if (marker.getTitle() === location.name) {
            marker.setMap(null);
            return false;
          }
          return true;
        });
      }
    } catch (error) {
      console.error('Error toggling heart:', error);
    }
  };

  // 마커를 추가하고 지도에 반영하는 함수
  useEffect(() => {
    if (map && heartedLocations.length > 0) {
      markersRef.current.forEach((marker) => marker.setMap(null)); // 기존 마커 제거
      markersRef.current = []; // 마커 배열 초기화

      const markerPositions: naver.maps.LatLng[] = [];

      heartedLocations.forEach((location) => {
        if (location.latlng) {
          const marker = new naver.maps.Marker({
            position: location.latlng,
            map: map!,
            title: location.name,
          });

          marker.addListener('click', () => {
            const infoWindow = new naver.maps.InfoWindow({
              content: `<div style="padding:10px;">${location.name}</div>`,
            });
            infoWindow.open(map, marker);
          });

          markersRef.current.push(marker);
          markerPositions.push(location.latlng);
        }
      });

      if (markerPositions.length > 0) {
        const bounds = new naver.maps.LatLngBounds(markerPositions[0], markerPositions[0]);
        markerPositions.forEach((latlng) => {
          bounds.extend(latlng);
        });
        map.fitBounds(bounds); // 마커들이 있는 범위로 지도를 맞춤
      }
    }
  }, [map, heartedLocations]);

  return (
    <div>
      {heartedLocations.length > 0 ? (
        <>
          <h2 className="text-xl mb-6 font-gangwonEdu tracking-[0.10em] text-center text-gray-800">
            저장한 장소를 확인하세요!
          </h2>
          <div id="map" className="w-full h-96 border-2 border-gray-300 rounded-lg mb-4"></div> {/* 지도 */}
          <ul className="mt-4 space-y-2">
            {heartedLocations.map((location, index) => (
              <LocationCard
                key={index}
                name={location.name}
                address={location.address}
                latlng={location.latlng || new naver.maps.LatLng(0, 0)}
                isSelected={true}
                onToggleHeart={() => toggleHeart(location)} // 하트 토글 함수
                onFocusPlace={() => map?.setCenter(location.latlng || new naver.maps.LatLng(0, 0))}
              />
            ))}
          </ul>
        </>
      ) : (
        <p className="text-xl mb-6 font-gangwonEdu tracking-[0.10em] text-center text-gray-800">
          저장한 장소가 없습니다.
        </p>
      )}
    </div>
  );
};

export default HeartTab;
