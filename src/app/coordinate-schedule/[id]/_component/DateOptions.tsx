import dayjs from 'dayjs';

interface DateOptionsProps {
  allAvailableDates: string[];
  bestDateOptions: string[];
  setUserVoteDate: (date: string) => void;
}

const DateOptions = ({ allAvailableDates, bestDateOptions, setUserVoteDate }: DateOptionsProps) => {
  return (
    <div className="mb-12">
      {allAvailableDates.length > 0 ? (
        <>
          <h3 className="font-semibold font-pretendard tracking-[0.10em] text-gray-700 text-[18px] mb-2">
            아래는 모두가 가능한 날짜입니다.
          </h3>
          <p className="text-sm font-pretendard tracking-[0.05em] text-[#737370] mb-4">
            아래는 모두가 가능한 날짜입니다.
          </p>
          {allAvailableDates.map((date) => (
            <label key={date} className="flex items-center mb-2 font-bold text-[22px] text-gray-600 font-gangwonEdu tracking-[0.05em]">
              <input
                type="radio"
                name="date"
                value={date}
                onChange={() => setUserVoteDate(date)}
                className="mr-2"
              />
              {dayjs(date).format('M월 D일')}
            </label>
          ))}
        </>
      ) : bestDateOptions.length > 0 ? (
        <>
          <h3 className="font-semibold font-pretendard tracking-[0.10em] text-gray-700 text-[18px] mb-2">
            가장 많은 사람들이 선택한 날짜입니다.
          </h3>
          <p className="text-sm font-pretendard tracking-[0.05em] text-[#737370] mb-4">
            아래는 가장 많이 선택된 날짜입니다.
          </p>
          {bestDateOptions.map((date) => (
            <label key={date} className="flex items-center mb-2 font-bold text-[22px] text-gray-600 font-gangwonEdu tracking-[0.05em]">
              <input
                type="radio"
                name="date"
                value={date}
                onChange={() => setUserVoteDate(date)}
                className="mr-2"
              />
              {dayjs(date).format('M월 D일')}
            </label>
          ))}
        </>
      ) : (
        <p className="text-[18px] font-pretendard tracking-[0.05em] text-red-500 mb-4 text-center">겹치는 날짜가 없습니다.</p>
      )}
    </div>
  );
};

export default DateOptions;
