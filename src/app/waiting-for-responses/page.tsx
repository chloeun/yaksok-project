'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';

interface ResponseData {
  user_id: string;
}

const WaitingForResponsesPage = () => {
  const { data: session, status } = useSession();
  const [allResponded, setAllResponded] = useState(false);
  const [pendingUsers, setPendingUsers] = useState<string[]>([]);
  const router = useRouter();
  const params = useParams();

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // 응답 체크 및 last_page 업데이트
  useEffect(() => {
    const checkResponses = async () => {
      const scheduleId = params.id;
      if (scheduleId && session?.user?.id) {
        // Update the last_page in the invitations table
        await supabase
          .from('invitations')
          .update({ last_page: 'waiting-for-responses' })
          .eq('schedule_id', scheduleId)
          .eq('user_id', session.user.id);

        // 초대 상태가 'accepted'인 초대 목록 가져오기
        const { data: invitations, error: invitationsError } = await supabase
          .from('invitations')
          .select('user_id')
          .eq('schedule_id', scheduleId)
          .eq('status', 'accepted');

        if (invitationsError) {
          console.error('Error fetching invitations:', invitationsError);
          return;
        }

        // 해당 일정에 대한 응답 가져오기
        const { data: responses, error: responsesError } = await supabase
          .from('responses')
          .select('user_id')
          .eq('schedule_id', scheduleId);

        if (responsesError) {
          console.error('Error fetching responses:', responsesError);
          return;
        }

        const { data: votes, error: votesError } = await supabase
          .from('votes')
          .select('user_id')
          .eq('schedule_id', scheduleId);

        if (votesError) {
          console.error('Error fetching votes:', votesError);
          return;
        }

        // 응답하지 않은 사용자 목록 확인
        const respondedUserIds = [...responses.map((response: ResponseData) => response.user_id), ...votes.map((vote: ResponseData) => vote.user_id)];
        const pendingUserIds = invitations
          .map((invitation: { user_id: string }) => invitation.user_id)
          .filter((user_id) => !respondedUserIds.includes(user_id));

        if (pendingUserIds.length === 0) {
          setAllResponded(true);
        } else {
          setPendingUsers(pendingUserIds);
        }
      }
    };

    checkResponses();
  }, [params.id, session?.user?.id]);

  // 모든 응답이 완료된 경우 조율 페이지로 리다이렉트
  useEffect(() => {
    if (allResponded) {
      router.push(`/coordinate-schedule/${params.id}`);
    }
  }, [allResponded, router, params.id]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16">
      <Navbar />
      <div className="flex flex-col p-6 w-full max-w-md mx-auto md:max-w-2xl">
        <div className="text-center p-4">
          <h1 className="text-[22px] md:text-[30px] font-bold text-textMain font-pretendard tracking-[0.35em] mb-2">
            대기 중
          </h1>
          <h2 className="text-[14px] md:text-[16px] font-extrabold text-textMain font-deliusRegular tracking-[0.35em]">
            Waiting for Responses
          </h2>
          <p className="mt-4 text-[14px] md:text-[16px] font-medium text-textMain">
            아직 모든 참가자가 답변을 제출하지 않았습니다. 답변이 완료될 때까지 기다려 주세요.
          </p>
        </div>
        <div className="mt-6">
          <h3 className="text-[16px] md:text-[20px] font-semibold text-textMain">
            대기 중인 사용자:
          </h3>
          <ul className="list-disc list-inside text-[14px] md:text-[16px] text-textMain mt-2">
            {pendingUsers.length > 0 ? (
              pendingUsers.map((userId) => (
                <li key={userId}>{userId}</li> // Replace userId with actual user name if available
              ))
            ) : (
              <p className="text-[14px] md:text-[16px] text-textMain">모든 참가자가 답변을 제출했습니다!</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WaitingForResponsesPage;
