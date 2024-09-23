interface LocationOptionsProps {
  allAvailableLocations: string[];
  bestLocationOptions: string[];
  setUserVoteLocation: (location: { title: string; roadAddress: string }) => void;
}

const LocationOptions = ({ allAvailableLocations, bestLocationOptions, setUserVoteLocation }: LocationOptionsProps) => {
  return (
    <div className="mb-6">
      {allAvailableLocations.length > 0 ? (
        <>
          <h3 className="font-semibold font-pretendard tracking-[0.10em] text-gray-700 text-[18px] mb-2">
            아래는 모두가 가능한 장소입니다.
          </h3>
          <p className="text-sm font-pretendard tracking-[0.05em] text-[#737370] mb-4">
            아래는 모두가 가능한 장소입니다.
          </p>
          {allAvailableLocations.map((location) => {
            const [title, roadAddress] = location.split(':');
            return (
              <label key={location} className="flex items-center mb-2 font-bold text-[22px] text-gray-600 font-gangwonEdu tracking-[0.05em]">
                <input
                  type="radio"
                  name="location"
                  value={location}
                  onChange={() => setUserVoteLocation({ title, roadAddress })}
                  className="mr-2"
                />
                {title}
              </label>
            );
          })}
        </>
      ) : bestLocationOptions.length > 0 ? (
        <>
          <h3 className="font-semibold font-pretendard tracking-[0.10em] text-gray-700 text-[18px] mb-2">
            가장 많은 사람들이 선택한 장소입니다.
          </h3>
          <p className="text-sm font-pretendard tracking-[0.05em] text-[#737370] mb-4">
            아래는 가장 많이 선택된 장소입니다.
          </p>
          {bestLocationOptions.map((location) => {
            const [title, roadAddress] = location.split(':');
            return (
              <label key={location} className="flex items-center mb-2 font-bold text-[22px] text-gray-600 font-gangwonEdu tracking-[0.05em]">
                <input
                  type="radio"
                  name="location"
                  value={location}
                  onChange={() => setUserVoteLocation({ title, roadAddress })}
                  className="mr-2"
                />
                {title}
              </label>
            );
          })}
        </>
      ) : (
        <p className="text-[18px] font-pretendard tracking-[0.05em] text-center text-red-500 mb-4">겹치는 장소가 없습니다.</p>
      )}
    </div>
  );
};

export default LocationOptions;
