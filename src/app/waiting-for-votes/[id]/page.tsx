'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

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
        const allParticipants = [...participantIds, organizerId];  // Include organizer in participants check

        // Fetch votes from the votes table
        const { data: votes, error: votesError } = await supabase
          .from('votes')
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
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16">
      <div className="md:text-center p-2 md:p-4">
        <h1 className="text-[22px] md:text-[30px] font-bold text-textMain font-pretendard tracking-[0.35em] mb-2 md:mb-3">
          투표 대기 중
        </h1>
        <h2 className="text-[14px] md:text-[16px] font-extrabold text-textMain font-deliusRegular tracking-[0.35em]">
          Waiting for Votes
        </h2>
      </div>

      <div className="flex flex-col p-6 w-full max-w-md mx-auto md:max-w-2xl bg-white rounded-xl shadow-lg mt-4 md:p-10">
        <div className="text-center p-4">
          <p className="mt-4 text-[14px] md:text-[16px] font-medium text-textMain">
            아직 모든 참여자가 투표를 완료하지 않았습니다. 모든 투표가 완료될 때까지 기다려 주세요.
          </p>
        </div>
        <div className="mt-6">
          <h3 className="text-[16px] md:text-[20px] font-semibold text-textMain">
            투표 대기 중인 사용자:
          </h3>
          <ul className="list-disc list-inside text-[14px] md:text-[16px] text-textMain mt-2">
            {pendingUsers.length > 0 ? (
              pendingUsers.map((username) => (
                <li key={username}>{username}</li>
              ))
            ) : (
              <p className="text-[14px] md:text-[16px] text-textMain">모든 참가자가 투표를 완료했습니다!</p>
            )}
          </ul>
        </div>
        <div className="flex justify-center mt-6">
          <button
            className="bg-[#838380] text-white hover:bg-buttonA hover:text-textButton tracking-[0.30em] w-full text-lg font-semibold py-[10px] px-16 rounded-lg focus:outline-none focus:shadow-outline shadow-lg"
            onClick={() => router.push('/main')}
          >
            메인 페이지로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaitingForVotesPage;
