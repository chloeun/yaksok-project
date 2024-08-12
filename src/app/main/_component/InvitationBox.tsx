'use client';

const InvitationBox = () => {
  return (
    <div className="w-full min-w-[320px] bg-white px-2 py-4 md:px-4 lg:px-6 rounded-2xl shadow-md border border-gray-300 flex items-center justify-between">
      <div className="flex items-center flex-grow">
        <div className="text-center flex-grow border-r border-gray-300 px-2 md:px-4 lg:px-6">
          <p className="text-[12px] md:text-[14px] lg:text-[16px] font-pretendard text-textMain">초대한 사람</p>
          <div className="flex items-center justify-center">
            <p className="font-gangwonEdu text-[20px] md:text-[22px] lg:text-[24px] mt-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px] md:max-w-[100px] lg:max-w-[120px]">
              나윤
            </p>
          </div>
        </div>
        <div className="text-center flex-grow border-r border-gray-300 px-2 md:px-4 lg:px-6">
          <p className="text-[12px] md:text-[14px] lg:text-[16px] font-pretendard text-textMain">약속 이름</p>
          <div className="flex items-center justify-center">
            <p className="font-gangwonEdu text-[20px] md:text-[22px] lg:text-[24px] mt-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[100px] md:max-w-[120px] lg:max-w-[140px]">
              외대모임 🎀
            </p>
          </div>
        </div>
        <div className="text-center flex-grow px-2 md:px-4 lg:px-6">
          <p className="text-[12px] md:text-[14px] lg:text-[16px] font-pretendard text-textMain">약속 기간</p>
          <div className="flex items-center justify-center">
            <p className="font-gangwonEdu text-[20px] md:text-[22px] lg:text-[24px] mt-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[60px] md:max-w-[80px] lg:max-w-[100px]">
              8월
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center ml-4 space-y-3">
        <button className="px-2 py-1 rounded-lg bg-[#eafcff] text-[#4D4C51] text-[10px] md:text-[12px] lg:text-[14px] font-semibold hover:bg-[#b5e7f5] tracking-[0.20em] shadow-md">
          수락
        </button>
        <button className="px-2 py-1 rounded-lg bg-[#FFE6E0] text-[#4D4C51] text-[10px] md:text-[12px] lg:text-[14px] font-semibold hover:bg-[#f4c8bd] tracking-[0.20em] shadow-md">
          거절
        </button>
      </div>
    </div>
  );
};

export default InvitationBox;
