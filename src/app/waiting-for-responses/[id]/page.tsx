'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { FaHome } from 'react-icons/fa'; // Import home icon

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
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16 px-4"> 
      
      {/* Title Section with smooth loading bar */}
      <div className="text-center mb-5">
        <h1 className="text-[22px] md:text-[30px] font-bold text-textMain font-pretendard tracking-[0.35em] mb-2 text-center">
          대기 중
        </h1>
        <h2 className="text-[14px] md:text-[16px] font-extrabold text-textMain font-deliusRegular tracking-[0.35em] text-center">
          Waiting for Responses
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
          아직 모든 참여자가 답변을 제출하지 않았습니다.<br />
          답변이 완료될 때까지 기다려 주세요.
        </p>
        <div>
          <h3 className="text-[16px] md:text-[18px] font-semibold text-gray-800 mb-2 text-left"> 
            대기 중인 사용자:
          </h3>
          <ul className="list-disc list-inside text-[14px] md:text-[16px] text-gray-700 text-left"> 
            {pendingUsers.length > 0 ? (
              pendingUsers.map((username) => (
                <li key={username}>{username}</li>
              ))
            ) : (
              <p className="text-[14px] md:text-[16px] text-gray-700">
                모든 참가자가 답변을 제출했습니다!
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

export default WaitingForResponsesPage;
