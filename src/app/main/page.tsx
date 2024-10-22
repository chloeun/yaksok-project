'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image'; 
import YaksokLogo from '@/assets/images/YaksokLogo.png';
import { IoIosAddCircleOutline } from 'react-icons/io';
import InvitationBox from './_component/InvitationBox';
import InProgressBox from './_component/InProgressBox'; 
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
  users: User[] | null;
  final_date: string | null;
  final_place: { title: string; address: string } | null;
}

interface Invitation {
  id: string;
  schedule_id: string;
  last_page: string;
  schedules: Schedule[];
  status: string;
}

const MainPage = () => {
  const { data: session, status } = useSession();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [inProgress, setInProgress] = useState<Invitation[]>([]);
  const [reminderSchedules, setReminderSchedules] = useState<Schedule[]>([]);
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
              users (name),
              final_date,
              final_place
            )
          `)
          .eq('user_id', session.user.id);

        if (error) {
          console.error('Error fetching invitations:', error);
        } else {
          setInvitations(data.filter((inv: any) => inv.status === 'pending'));
          setInProgress(data.filter((inv: any) => inv.status === 'accepted'));

          // Extract and flatten the schedule array and filter for finalized schedules
          const finalizedSchedules = data
            .flatMap((inv: any) => inv.schedules)
            .filter((schedule: Schedule) => schedule.final_place);
          
          setReminderSchedules(finalizedSchedules);
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
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16">
      <div className="flex flex-col p-6 w-full max-w-md mx-auto md:max-w-2xl lg:max-w-3xl">
        {/* Header Section */}
        <div className="flex items-center justify-left md:justify-start my-4 md:mb-6">
          <Image 
            src={YaksokLogo}
            alt="Yaksok Logo"
            layout="fixed"
            width={50} 
            height={65} 
            className="md:w-[60px] md:h-[85px] lg:w-[70px] lg:h-[100px] mr-5" 
          />
          <h1 className="text-[22px] md:text-[28px] lg:text-[32px] font-bold text-textMain font-deliusRegular tracking-[0.20em] mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
            안녕하세요! <span className="text-[28px] md:text-[36px] lg:text-[38px] font-bold text-black">{session.user?.name}</span>님
          </h1>
        </div>

        {/* Invitations Section */}
        <h2 className="text-[17px] md:text-[22px] lg:text-[24px] font-semibold font-pretendard tracking-[0.20em] text-[#4D4C51] mb-4">
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
          <p className="text-[#4D4C51]">초대받은 약속이 없습니다.</p>
        )}

        {/* First decorative dotted divider */}
        <div className="w-full flex justify-center mt-8">
          <div className="w-[90%] border-t border-dotted border-gray-400"></div>
        </div>

        {/* In-Progress Section */}
        <h2 className="text-[17px] md:text-[22px] lg:text-[24px] font-semibold font-pretendard tracking-[0.20em] text-[#4D4C51] mb-4 mt-7">
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
          <p className="text-[#4D4C51]">진행 중인 약속이 없습니다.</p>
        )}

        {/* Second decorative dotted divider */}
        <div className="w-full flex justify-center mt-8">
          <div className="w-[90%] border-t border-dotted border-gray-400"></div>
        </div>

        {/* Reminder Section */}
        <h2 className="text-[17px] md:text-[22px] lg:text-[24px] font-semibold font-pretendard tracking-[0.20em] text-[#4D4C51] mb-4 mt-7">
          다가오는 약속:
        </h2>
        {reminderSchedules.length > 0 ? (
          reminderSchedules.map(schedule => (
            <div key={schedule.id} className="mb-4">
              <ReminderBox 
                title={schedule.plan_name}
                date={schedule.final_date || '날짜 미정'}
                location={schedule.final_place?.title || '장소 미정'}
                participants={Array.isArray(schedule.users) ? schedule.users.map(user => user.name).join(', ') : '참여자 없음'}
              />
            </div>
          ))
        ) : (
          <p className="text-[#4D4C51]">다가오는 약속이 없습니다.</p>
        )}

        {/* Create Schedule Button */}
        <button 
          onClick={handleCreateSchedule}
          className="bg-buttonA hover:bg-secondaryHover tracking-[0.30em] mt-10 w-full text-lg md:text-xl lg:text-2xl text-textButton font-semibold py-[10px] md:py-[12px] lg:py-[14px] rounded-lg focus:outline-none shadow-lg flex items-center justify-center">
          <IoIosAddCircleOutline className="mr-2 text-xl md:text-3xl lg:text-4xl" />
          약속 만들기
        </button>
      </div>
    </div>
  );
};

export default MainPage;
