import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { IoIosSearch } from 'react-icons/io';
import { CiCircleMinus } from 'react-icons/ci';

interface ParticipantsInputProps {
  participants: string[];
  setParticipants: React.Dispatch<React.SetStateAction<string[]>>;
  hostId: string; // 주최자의 ID를 추가로 받아옴
}

const ParticipantsInput = ({ participants, setParticipants, hostId }: ParticipantsInputProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string, username: string }[]>([]);
  const [participantUsernames, setParticipantUsernames] = useState<{ id: string, username: string }[]>([]);
  const [searchAttempted, setSearchAttempted] = useState(false); // 검색 시도 여부를 추적

  // 사용자 검색 함수
  const handleSearch = async () => {
    if (!searchQuery) return;

    const { data, error } = await supabase
      .from('users')
      .select('id, username')
      .ilike('username', `%${searchQuery}%`);

    if (error) {
      console.error('Error searching for users:', error);
      return;
    }

    const filteredResults = (data || []).filter((user) => user.id !== hostId);
    setSearchResults(filteredResults);
    setSearchAttempted(true); // 검색을 시도했음을 기록
  };

  // 참가자 추가 함수
  const handleAddParticipant = (userId: string, username: string) => {
    if (!participants.includes(userId)) {
      setParticipants([...participants, userId]);
      setParticipantUsernames([...participantUsernames, { id: userId, username }]);
    }
    setSearchQuery('');
    setSearchResults([]);
    setSearchAttempted(false); // 검색 시도를 초기화
  };

  // 참가자 제거 함수
  const handleRemoveParticipant = (userId: string) => {
    setParticipants(participants.filter((id) => id !== userId));
    setParticipantUsernames(participantUsernames.filter((user) => user.id !== userId));
  };

  // Enter 키로 검색 수행
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-gray-700 text-[16px] font-semibold font-pretendard tracking-[0.15em] mb-2">누구와 만날까요?</label>
      <div className="relative mb-2">
        <input
          className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="사용자 이름으로 검색하세요"
          onKeyDown={handleKeyDown} // Enter 누르면 검색
        />
        <button
          type="button"
          onClick={handleSearch}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
        >
          <IoIosSearch size={20} />
        </button>
      </div>

      {/* 검색 시도 후 결과가 없을 때 문구 표시 */}
      {searchAttempted && searchResults.length === 0 && (
        <p className="text-red-500 text-md mt-1 ml-1">검색 결과가 없습니다.</p>
      )}

      {searchResults.length > 0 && (
        <ul className="bg-white border mt-2 rounded-lg shadow-lg max-h-60 overflow-y-auto p-2">
          {searchResults.map((user) => (
            <li
              key={user.id}
              className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-200 rounded-lg"
              onClick={() => handleAddParticipant(user.id, user.username)} // 어느 부분을 클릭해도 추가
            >
              <span>{user.username}</span>
            </li>
          ))}
        </ul>
      )}

      {participants.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {participantUsernames.map((participant, index) => (
            <div
              key={participant.id}
              className={`flex items-center px-3 py-2 rounded-lg bg-gray-100 shadow-md bg-${['[#FFEBE8]', '[#EAF7E9]', '[#E6F2FF]', '[#FFF4D4]'][index % 4]} text-[#4D4C51] cursor-pointer`}
              onClick={() => handleRemoveParticipant(participant.id)} // 전체 항목 클릭 시 제거
            >
              <span className="text-[19px] font-semibold font-gangwonEdu">{participant.username}</span>
              <button
                type="button"
                onClick={() => handleRemoveParticipant(participant.id)}
                className="ml-2 text-[#4D4C51] hover:text-red-700"
              >
                <CiCircleMinus size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParticipantsInput;
