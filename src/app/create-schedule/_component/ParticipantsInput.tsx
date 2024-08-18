import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { IoIosSearch, IoMdAddCircleOutline } from 'react-icons/io';
import { CiCircleMinus } from 'react-icons/ci';
import { TiMinus } from "react-icons/ti";

interface ParticipantsInputProps {
  participants: string[];
  setParticipants: React.Dispatch<React.SetStateAction<string[]>>;
}

const ParticipantsInput = ({ participants, setParticipants }: ParticipantsInputProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string, username: string }[]>([]);
  const [participantUsernames, setParticipantUsernames] = useState<{ id: string, username: string }[]>([]);

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

    setSearchResults(data || []);
  };

  const handleAddParticipant = (userId: string, username: string) => {
    if (!participants.includes(userId)) {
      setParticipants([...participants, userId]);
      setParticipantUsernames([...participantUsernames, { id: userId, username }]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRemoveParticipant = (userId: string) => {
    setParticipants(participants.filter((id) => id !== userId));
    setParticipantUsernames(participantUsernames.filter((user) => user.id !== userId));
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
        />
        <button
          type="button"
          onClick={handleSearch}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
        >
          <IoIosSearch size={20} />
        </button>
      </div>

      {searchResults.length > 0 && (
        <ul className="bg-white border mt-2 rounded-lg shadow-lg max-h-60 overflow-y-auto p-2">
          {searchResults.map((user) => (
            <li key={user.id} className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-200 rounded-lg">
              <span>{user.username}</span>
              <button
                type="button"
                onClick={() => handleAddParticipant(user.id, user.username)}
                className="text-[#4D4C51] text-[18px] hover:text-[#838380]"
              >
                <IoMdAddCircleOutline size={20} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {participants.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {participantUsernames.map((participant, index) => (
            <div
              key={participant.id}
              className={`flex items-center px-3 py-2 rounded-lg bg-gray-100 shadow-md bg-${['[#FFEBE8]', '[#EAF7E9]', '[#E6F2FF]', '[#FFF4D4]'][index % 4]} text-[#4D4C51]`}
            >
              <span className="text-[19px] font-semibold font-gangwonEdu">{participant.username}</span>
              <button
                type="button"
                onClick={() => handleRemoveParticipant(participant.id)}
                className="ml-2 text-[#4D4C51] hover:text-red-700"
              >
                <CiCircleMinus size={16}/>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParticipantsInput;
