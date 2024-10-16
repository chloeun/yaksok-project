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
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const checkResponses = async () => {
      setLoading(true);
      const scheduleId = params.id;
      
      if (scheduleId && session?.user?.id) {
        // Update last_page for current user
        await supabase
          .from('invitations')
          .update({ last_page: 'waiting-for-responses' })
          .eq('schedule_id', scheduleId)
          .eq('user_id', session.user.id);

        // Fetch all invitations
        const { data: invitations, error: invitationsError } = await supabase
          .from('invitations')
          .select('user_id, username, status')
          .eq('schedule_id', scheduleId);
  
        if (invitationsError) {
          console.error('Error fetching invitations:', invitationsError);
          setLoading(false);
          return;
        }

        // Fetch all responses
        const { data: responses, error: responsesError } = await supabase
          .from('responses')
          .select('user_id')
          .eq('schedule_id', scheduleId);
  
        if (responsesError) {
          console.error('Error fetching responses:', responsesError);
          setLoading(false);
          return;
        }

        // Get list of accepted invitations and pending users
        const acceptedInvitations = invitations.filter(
          (invitation: { status: string }) => invitation.status === 'accepted'
        );
        const pendingInvitations = invitations.filter(
          (invitation: { status: string }) => invitation.status === 'pending'
        );

        const respondedUserIds = responses.map((response: ResponseData) => response.user_id);
        const pendingUsernames = acceptedInvitations
          .filter((invitation: { user_id: string }) => !respondedUserIds.includes(invitation.user_id))
          .map((invitation: { username: string }) => invitation.username);

        // If there are any pending invitations, users are still pending
        if (pendingInvitations.length > 0) {
          setPendingUsers(pendingInvitations.map((invitation: { username: string }) => invitation.username));
          setAllResponded(false);
        } else if (pendingUsernames.length === 0) {
          // All accepted users have responded
          setAllResponded(true);
        } else {
          setPendingUsers(pendingUsernames);
          setAllResponded(false);
        }

        setLoading(false);
      }
    };
  
    checkResponses();
  }, [params.id, session?.user?.id]);

  useEffect(() => {
    if (!loading && allResponded) {
      router.push(`/coordinate-schedule/${params.id}`);
    }
  }, [allResponded, loading, router, params.id]);

  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16">
      {/* <Navbar /> */}
      <div className="md:text-center p-2 md:p-4">
        <h1 className="text-[22px] md:text-[30px] font-bold text-textMain font-pretendard tracking-[0.35em] mb-2 md:mb-3">
          대기 중
        </h1>
        <h2 className="text-[14px] md:text-[16px] font-extrabold text-textMain font-deliusRegular tracking-[0.35em]">
          Waiting for Responses
        </h2>
      </div>

      <div className="flex flex-col p-6 w-full max-w-md mx-auto md:max-w-2xl bg-white rounded-xl shadow-lg mt-4 md:p-10">
        <div className="text-center p-4">
          <p className="mt-4 text-[14px] md:text-[16px] font-medium text-textMain">
            아직 모든 참여자가 답변을 제출하지 않았습니다. 답변이 완료될 때까지 기다려 주세요.
          </p>
        </div>
        <div className="mt-6">
          <h3 className="text-[16px] md:text-[20px] font-semibold text-textMain">
            대기 중인 사용자:
          </h3>
          <ul className="list-disc list-inside text-[14px] md:text-[16px] text-textMain mt-2">
            {pendingUsers.length > 0 ? (
              pendingUsers.map((username) => (
                <li key={username}>{username}</li>
              ))
            ) : (
              <p className="text-[14px] md:text-[16px] text-textMain">모든 참가자가 답변을 제출했습니다!</p>
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

export default WaitingForResponsesPage;
