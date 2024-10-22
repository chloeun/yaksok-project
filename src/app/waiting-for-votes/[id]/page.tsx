'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { FaHome } from 'react-icons/fa'; // Import home icon

interface VoteData {
  user_id: string;
}

const WaitingForVotesPage = () => {
  const { data: session, status } = useSession();
  const [allVoted, setAllVoted] = useState(false);
  const [pendingUsers, setPendingUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const checkVotes = async () => {
      setLoading(true);
      const scheduleId = params.id;
  
      if (scheduleId && session?.user?.id) {
        // Update the 'last_page' to 'waiting-for-votes'
        await supabase
          .from('invitations')
          .update({ last_page: 'waiting-for-votes' })
          .eq('schedule_id', scheduleId)
          .eq('user_id', session.user.id);
  
        // Fetch participants and organizer (created_by) for the schedule
        const { data: scheduleData, error: scheduleError } = await supabase
          .from('schedules')
          .select('participants, created_by')
          .eq('id', scheduleId)
          .single();
  
        if (scheduleError) {
          console.error('Error fetching schedule participants and organizer:', scheduleError);
          setLoading(false);
          return;
        }
  
        const participantIds = scheduleData?.participants ?? [];
        const organizerId = scheduleData?.created_by;
        const allParticipants = [...participantIds, organizerId]; // Include organizer in participants check
  
        // Fetch votes from the coordinate_votes table
        const { data: votes, error: votesError } = await supabase
          .from('coordinate_votes')
          .select('user_id')
          .eq('schedule_id', scheduleId);
  
        if (votesError) {
          console.error('Error fetching votes:', votesError);
          setLoading(false);
          return;
        }
  
        const votedUserIds = votes.map((vote: VoteData) => vote.user_id);
        const pendingUserIds = allParticipants.filter((id: string) => !votedUserIds.includes(id));
  
        // If there are any pending votes, mark users who haven't voted yet
        if (pendingUserIds.length > 0) {
          const { data: pendingUsernames, error: pendingUsersError } = await supabase
            .from('users')
            .select('username')
            .in('id', pendingUserIds);
  
          if (pendingUsersError) {
            console.error('Error fetching pending users:', pendingUsersError);
          } else if (pendingUsernames) {
            setPendingUsers(pendingUsernames.map((user: { username: string }) => user.username));
          }
          setAllVoted(false);
        } else {
          // All participants and the organizer have voted
          setAllVoted(true);
        }
  
        setLoading(false);
      }
    };
  
    checkVotes();
  }, [params.id, session?.user?.id]);
  

  useEffect(() => {
    if (!loading && allVoted) {
      router.push(`/final-schedule/${params.id}`);
    }
  }, [allVoted, loading, router, params.id]);

  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16 px-4"> 
      
      {/* Title Section with smooth loading bar */}
      <div className="text-center mb-5">
        <h1 className="text-[22px] md:text-[30px] font-bold text-textMain font-pretendard tracking-[0.35em] mb-2 text-center">
          투표 대기 중
        </h1>
        <h2 className="text-[14px] md:text-[16px] font-extrabold text-textMain font-deliusRegular tracking-[0.35em] text-center">
          Waiting for Votes
        </h2>
        <div className="flex justify-center mb-4 w-full max-w-md">
          {/* Smooth Loading Bar */}
          <div className="mt-7 w-full h-2 bg-blockGray rounded-full overflow-hidden">
            <div className="h-full bg-gray-600 animate-smoothLoading"></div>
          </div>
        </div>
      </div>

      {/* White Box Section */}
      <div className="w-full max-w-screen-sm bg-white rounded-lg shadow-lg p-8 md:p-10 lg:p-12 space-y-4">
        <p className="text-[14px] md:text-[16px] text-gray-700 text-center mb-10">
          아직 모든 참여자가 투표를 완료하지 않았습니다.<br />
          모든 투표가 완료될 때까지 기다려 주세요.
        </p>
        <div>
          <h3 className="text-[16px] md:text-[18px] font-semibold text-gray-800 mb-2 text-left"> 
            투표 대기 중인 사용자:
          </h3>
          <ul className="list-disc list-inside text-[14px] md:text-[16px] text-gray-700 text-left"> 
            {pendingUsers.length > 0 ? (
              pendingUsers.map((username) => (
                <li key={username}>{username}</li>
              ))
            ) : (
              <p className="text-[14px] md:text-[16px] text-gray-700">
                모든 참가자가 투표를 완료했습니다!
              </p>
            )}
          </ul>
        </div>
      </div>

      {/* Button Section with home icon */}
      <div className="flex justify-center mt-6 w-full max-w-screen-sm"> 
        <button
          className="bg-buttonA hover:bg-secondaryHover text-textButton tracking-[0.30em] w-full text-lg md:text-xl lg:text-2xl font-semibold py-[10px] md:py-[12px] lg:py-[14px] rounded-lg shadow-lg flex items-center justify-center"
          onClick={() => router.push('/main')}
        >
          <FaHome className="mr-3 w-5" /> {/* Home Icon */}
          메인 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default WaitingForVotesPage;
