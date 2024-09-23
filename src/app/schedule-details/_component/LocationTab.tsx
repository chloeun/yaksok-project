'use client';

import { useEffect, useState } from 'react';
import LocationCard from './LocationCard'; // Import the LocationCard component

interface SearchResultItem {
  name: string;
  address: string;
  latlng: naver.maps.LatLng;
}

const LocationTab = () => {
  const [map, setMap] = useState<naver.maps.Map | null>(null); 
  const [query, setQuery] = useState(''); 
  const [places, setPlaces] = useState<SearchResultItem[]>([]);
  const [error, setError] = useState<string | null>(null); 
  const [markers, setMarkers] = useState<naver.maps.Marker[]>([]); 
  const [selectedHearts, setSelectedHearts] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
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

      const staticMarker = new naver.maps.Marker({
        position: new naver.maps.LatLng(37.5665, 126.978),
        map: mapInstance,
        title: 'Seoul Central',
      });
    };

    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder,transcoord`;
    script.onload = () => initMap();
    document.head.appendChild(script);
  }, []);

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

        data.items.forEach((place: any, index: number) => {
          const formattedPlace = {
            name: place.title.replace(/<[^>]+>/g, ''),
            address: place.roadAddress || place.address,
            latlng: new naver.maps.LatLng(0, 0),
          };

          naver.maps.Service.geocode({ query: formattedPlace.address }, (status, response) => {
            if (status === naver.maps.Service.Status.OK) {
              const { y, x } = response.v2.addresses[0];
              const lat = parseFloat(y);
              const lng = parseFloat(x);

              formattedPlace.latlng = new naver.maps.LatLng(lat, lng);

              addMarker(formattedPlace.name, formattedPlace.latlng);

              if (map && index === 0) {
                map.setCenter(new naver.maps.LatLng(lat, lng));
                map.setZoom(15);
              }

              searchResults.push(formattedPlace);
              if (index === data.items.length - 1) {
                setPlaces([...searchResults]);
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

  const addMarker = (name: string, position: naver.maps.LatLng) => {
    if (!map) return;

    markers.forEach((marker) => marker.setMap(null));
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

    setMarkers((prevMarkers) => [...prevMarkers, marker]);
  };

  const toggleHeart = (index: number) => {
    setSelectedHearts((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const focusOnPlace = (latlng: naver.maps.LatLng) => {
    if (map) {
      map.setCenter(latlng);
      map.setZoom(17);
    }
  };

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
            onToggleHeart={() => toggleHeart(index)}
            onFocusPlace={() => focusOnPlace(place.latlng)}
          />
        ))}
      </ul>
    </div>
  );
};

export default LocationTab;
