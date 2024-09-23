'use client';

const VoteTab = () => {
  return (
    <div>
      <h2 className="text-xl mb-6 font-gangwonEdu tracking-[0.10em] text-center text-gray-800">만나고 싶은 장소에 투표해주세요! (최대 3곳)</h2>
      <div className="space-y-4">
        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg">용산역</button>
        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg">강남역</button>
        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg">홍대입구역</button>
      </div>

      <div className="mt-6">
        <h3 className="text-md font-bold mb-2">투표 결과</h3>
        <p>투표된 장소가 없습니다.</p>
      </div>
    </div>
  );
};

export default VoteTab;
