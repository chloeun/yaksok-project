import React from 'react';
import { CiCircleMinus } from 'react-icons/ci';

interface SelectedLocation {
  title: string;
  roadAddress: string;
}

interface SelectedLocationsListProps {
  selectedLocations: SelectedLocation[];
  setSelectedLocations: React.Dispatch<React.SetStateAction<SelectedLocation[]>>;
}

const SelectedLocationsList = ({ selectedLocations, setSelectedLocations }: SelectedLocationsListProps) => {
  const handleRemoveLocation = (title: string) => {
    setSelectedLocations(selectedLocations.filter(location => location.title !== title));
  };

  if (selectedLocations.length === 0) return null;

  return (
    <div className="mb-6">
      <label className="block text-gray-700 text-[16px] font-semibold font-pretendard tracking-[0.10em] mb-2">선택된 역:</label>
      <div className="mt-4 flex flex-wrap gap-2">
        {selectedLocations.map((location, index) => (
          <div
            key={index}
            className={`flex items-center px-3 py-2 rounded-lg bg-gray-100 shadow-md bg-${['[#FFEBE8]', '[#EAF7E9]', '[#E6F2FF]', '[#FFF4D4]'][index % 4]} text-[#4D4C51]`}
          >
            <span className="text-[18px] font-semibold font-gangwonEdu">{location.title}</span>
            <button
              type="button"
              onClick={() => handleRemoveLocation(location.title)}
              className="ml-2 text-[#4D4C51] hover:text-red-700"
            >
              <CiCircleMinus size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedLocationsList;
