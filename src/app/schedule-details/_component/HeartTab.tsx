'use client';

const HeartTab = () => {
  return (
    <div>
      <h2 className="text-xl mb-6 font-gangwonEdu tracking-[0.10em] text-center text-gray-800">저장한 장소들을 확인해보세요!</h2>
      <div className="border-2 border-gray-300 rounded-lg h-48 flex items-center justify-center">
        <p className="text-gray-500">하트를 누른 장소가 없습니다.</p>
      </div>
    </div>
  );
};

export default HeartTab;
