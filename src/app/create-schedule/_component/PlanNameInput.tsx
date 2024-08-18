import React from 'react';

interface PlanNameInputProps {
  planName: string;
  setPlanName: React.Dispatch<React.SetStateAction<string>>;
}

// 약속 이름을 입력받는 컴포넌트
const PlanNameInput = ({ planName, setPlanName }: PlanNameInputProps) => (
  <div className="mb-6">
    <label className="block text-gray-700 text-[16px] font-semibold font-pretendard tracking-[0.10em] mb-2">어떤 약속인가요?</label>
    <input
      className="shadow appearance-none border rounded w-full py-3 px-3 font-gangwonEdu text-[18px] tracking-[0.1em] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      id="planName"
      type="text"
      value={planName}
      onChange={(e) => setPlanName(e.target.value)} // 사용자가 입력할 때마다 상태 업데이트
      placeholder="약속 이름을 입력하세요"
    />
  </div>
);

export default PlanNameInput;
