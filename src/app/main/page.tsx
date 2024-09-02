'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Image from 'next/image'; 
import YaksokLogo from '@/assets/images/YaksokLogo.png';
import { IoIosAddCircleOutline } from 'react-icons/io';
import InvitationBox from './_component/InvitationBox';
import InProgressBox from './_component/InProgressBox'; // New component for in-progress schedules
import ReminderBox from './_component/ReminderBox';

interface User {
  name: string;
}

interface Schedule {
  id: string;
  plan_name: string;
  month: string;
  dates: string[];
  locations: Array<{ title: string; roadAddress: string }>;
  created_by: string;
  users: User[];
}

interface Invitation {
  id: string;
  schedule_id: string;
  last_page: string; // Track the last page the user visited
  schedules: Schedule[]; 
  status: string;
}

const MainPage = () => {
  const { data: session, status } = useSession();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [inProgress, setInProgress] = useState<Invitation[]>([]); // Schedules in progress
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated' && session === null) {
      router.push('/login');
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchInvitations = async () => {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('invitations')
          .select(`
            id,
            schedule_id,
            status,
            last_page,
            schedules (
              id,
              plan_name,
              month,
              dates,
              locations,
              created_by,
              users (name)
            )
          `)
          .eq('user_id', session.user.id);

        if (error) {
          console.error('Error fetching invitations:', error);
        } else {
          setInvitations(data.filter((inv: any) => inv.status === 'pending'));
          setInProgress(data.filter((inv: any) => inv.status === 'accepted'));
        }
      }
    };

    if (session?.user?.id) {
      fetchInvitations();
    }
  }, [session]);

  const handleCreateSchedule = () => {
    router.push('/create-schedule');
  };

  const handleAcceptInvitation = async (scheduleId: string, invitationId: string) => {
    try {
      const { error } = await supabase
        .from('invitations')
        .update({ status: 'accepted', last_page: 'invited-schedule' })
        .eq('id', invitationId);

      if (error) {
        console.error('Error accepting invitation:', error);
      } else {
        router.push(`/invited-schedule/${scheduleId}`);
      }
    } catch (error) {
      console.error('Unexpected error accepting invitation:', error);
    }
  };

  const handleRejectInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', invitationId);

      if (error) {
        console.error('Error rejecting invitation:', error);
      } else {
        setInvitations(prevInvitations => 
          prevInvitations.filter(invitation => invitation.id !== invitationId)
        );
      }
    } catch (error) {
      console.error('Unexpected error rejecting invitation:', error);
    }
  };

  const handleGoToLastPage = (scheduleId: string, lastPage: string) => {
    router.push(`/${lastPage}/${scheduleId}`);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16 lg:pt-16">
      <Navbar />
      <div className="flex flex-col p-6 w-full max-w-md mx-auto md:max-w-2xl lg:max-w-3xl">
        <div className="ml-2 flex items-center justify-left md:justify-start my-4 md:mb-6 lg:mb-8">
          <Image 
            src={YaksokLogo}
            alt="Yaksok Logo"
            layout="fixed"
            width={40} 
            height={54} 
            className="md:w-[60px] md:h-[85px] lg:w-[70px] lg:h-[100px] mr-5" 
          />
          <h1 className="text-[22px] md:text-[30px] lg:text-[32px] font-bold text-textMain font-deliusRegular tracking-[0.20em] mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
            <span>안녕하세요! </span>
            <span className="text-[28px] md:text-[36px] lg:text-[38px] font-bold text-black font-gangwonEdu mr-1">{session.user?.name}</span>
            <span>님</span>
          </h1>
        </div>

        <h2 className="text-[17px] md:text-[22px] lg:text-[24px] font-semibold font-pretendard tracking-[0.20em] text-[#4D4C51] ml-2 md:ml-3 lg:ml-5 my-4">
          초대받은 약속:
        </h2>
        {invitations.length > 0 ? (
          invitations.map(invitation => (
            <div key={invitation.id} className="mb-4">
              <InvitationBox 
                schedule={invitation.schedules as any} 
                onAccept={() => handleAcceptInvitation(invitation.schedule_id, invitation.id)} 
                onReject={() => handleRejectInvitation(invitation.id)}
              />
            </div>
          ))
        ) : (
          <p className="ml-2 md:ml-3 lg:ml-5 text-[#4D4C51]">초대받은 약속이 없습니다.</p>
        )}

        <h2 className="text-[17px] md:text-[22px] lg:text-[24px] font-semibold font-pretendard tracking-[0.20em] text-[#4D4C51] ml-2 md:ml-3 lg:ml-5 my-4 mt-7">
          조율 진행 중인 약속:
        </h2>
        {inProgress.length > 0 ? (
          inProgress.map(invitation => (
            <div key={invitation.id} className="mb-4">
              <InProgressBox 
                schedule={invitation.schedules as any} 
                onGoTo={() => handleGoToLastPage(invitation.schedule_id, invitation.last_page)}
              />
            </div>
          ))
        ) : (
          <p className="ml-2 md:ml-3 lg:ml-5 text-[#4D4C51]">진행 중인 약속이 없습니다.</p>
        )}

        <h2 className="text-[17px] md:text-[22px] lg:text-[24px] font-semibold font-pretendard tracking-[0.20em] text-[#4D4C51] ml-2 md:ml-3 lg:ml-5 my-4 mt-7">
          다가오는 약속:
        </h2>
        <ReminderBox />

        <button 
          onClick={handleCreateSchedule}
          className="bg-buttonA hover:bg-secondaryHover min-w-[320px] tracking-[0.30em] mt-3 w-full text-lg md:text-xl lg:text-2xl text-textButton font-semibold py-[8px] md:py-[12px] lg:py-[14px] px-14 md:px-16 rounded-lg focus:outline-none focus:shadow-outline shadow-lg flex items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis">
          <IoIosAddCircleOutline className="mr-2 text-xl md:text-3xl lg:text-4xl" />
          약속 만들기
        </button>
      </div>
    </div>
  );
};

export default MainPage;
