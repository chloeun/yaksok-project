import { FaHeart } from 'react-icons/fa';

// 장소 카드 컴포넌트의 Props 정의
interface LocationCardProps {
  name: string;
  address: string;
  latlng: naver.maps.LatLng;
  isSelected: boolean;
  onToggleHeart: () => void;
  onFocusPlace: () => void;
}

// 장소 카드 컴포넌트 정의
const LocationCard = ({ name, address, latlng, isSelected, onToggleHeart, onFocusPlace }: LocationCardProps) => {
  return (
    <li
      className="relative py-4 px-6 bg-white border border-gray-300 rounded-lg shadow flex justify-between items-center cursor-pointer"
      onClick={onFocusPlace} // 클릭 시 해당 장소로 지도 포커스
    >
      <div>
        <h3 className="text-xl font-semibold font-gangwonEdu tracking-[0.10em] text-gray-800 mb-2">{name}</h3>
        <p className="text-lg font-gangwonEdu tracking-[0.10em] text-gray-600">{address}</p>
      </div>

      {/* 하트 아이콘 */}
      <button
        onClick={onToggleHeart} // 하트 클릭 시 토글
        className="absolute top-3 right-3 text-gray-300 focus:outline-none"
      >
        <FaHeart size={24} color={isSelected ? '#ffc6bb' : '#e1e4e8'} /> {/* Heart icon with dynamic color */}
      </button>
    </li>
  );
};

export default LocationCard;
