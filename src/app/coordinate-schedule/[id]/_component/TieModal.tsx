import { useState } from 'react';

interface TieModalProps {
  tiedDates: string[];
  tiedLocations: string[];
  onResolve: (finalDate: string, finalLocation: string) => void;
  onClose: () => void;
}

const TieModal = ({ tiedDates, tiedLocations, onResolve, onClose }: TieModalProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const handleSubmit = () => {
    if (selectedDate && selectedLocation) {
      onResolve(selectedDate, selectedLocation);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">동률 해결</h2>
        <div className="mb-4">
          <h3 className="font-bold">날짜 선택</h3>
          {tiedDates.map((date) => (
            <div key={date} className="flex items-center">
              <input
                type="radio"
                name="date"
                value={date}
                onChange={() => setSelectedDate(date)}
                className="mr-2"
              />
              <label>{date}</label>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <h3 className="font-bold">장소 선택</h3>
          {tiedLocations.map((location) => (
            <div key={location} className="flex items-center">
              <input
                type="radio"
                name="location"
                value={location}
                onChange={() => setSelectedLocation(location)}
                className="mr-2"
              />
              <label>{location}</label>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default TieModal;
