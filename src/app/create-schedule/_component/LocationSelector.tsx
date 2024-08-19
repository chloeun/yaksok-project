import React, { useState } from 'react';

interface Suggestion {
  title: string;
  roadAddress: string;
}

interface LocationSelectorProps {
  selectedLocations: Suggestion[];
  setSelectedLocations: React.Dispatch<React.SetStateAction<Suggestion[]>>;
}

const LocationSelector = ({ selectedLocations, setSelectedLocations }: LocationSelectorProps) => {
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleLocationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const query = e.target.value;
  setLocation(query);

  if (!query) {
    setSuggestions([]);
    setError(null);
    return;
  }

  try {
    const response = await fetch(`/api/proxy?query=${encodeURIComponent(query + " 지하철역")}`);
    const data = await response.json();

    if (response.ok && data.items && data.items.length > 0) {
      const filteredItems = data.items.filter((item: any) =>
        item.title.includes("역") || item.category.includes("지하철")
      );

      setSuggestions(
        filteredItems.map((item: any) => ({
          title: item.title.replace(/<[^>]+>/g, ''), 
          roadAddress: item.address,
        }))
      );
      setError(null);
    } else {
      setSuggestions([]);
      setError('No results found for your search.');
    }
  } catch (error) {
    console.error('Error fetching location data:', error);
    setError('An error occurred while fetching data.');
    setSuggestions([]);
  }
};


  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (!selectedLocations.some(location => location.title === suggestion.title)) {
      setSelectedLocations([...selectedLocations, suggestion]);
    }
    setLocation('');
    setSuggestions([]); 
  };

  return (
    <div className="mb-6 relative">
      <label className="block text-gray-700 text-[16px] font-semibold font-pretendard tracking-[0.10em] mb-2">어디서 만날까요?</label>
      <input
        className="shadow appearance-none border rounded w-full py-3 px-3 font-gangwonEdu text-[18px] tracking-[0.1em] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="location"
        type="text"
        value={location}
        onChange={handleLocationChange}
        placeholder="역 이름을 입력하세요"
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto w-full z-10">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSuggestionClick(suggestion)}
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
