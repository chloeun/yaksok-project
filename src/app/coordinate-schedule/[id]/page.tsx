'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import ScheduleHeader from './_component/ScheduleHeader';
import DateOptions from './_component/DateOptions';
import LocationOptions from './_component/LocationOptions';
import VoteButton from './_component/VoteButton';

interface ResponseData {
  user_id: string;
  selected_dates: string[];
  selected_locations: { title: string; roadAddress: string }[];
}

const CoordinateSchedulePage = () => {
  const { data: session, status } = useSession();
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [bestDateOptions, setBestDateOptions] = useState<string[]>([]);
  const [bestLocationOptions, setBestLocationOptions] = useState<string[]>([]);
  const [allAvailableDates, setAllAvailableDates] = useState<string[]>([]);
  const [allAvailableLocations, setAllAvailableLocations] = useState<string[]>([]);
  const [userVoteDate, setUserVoteDate] = useState<string | null>(null);
  const [userVoteLocation, setUserVoteLocation] = useState<{ title: string; roadAddress: string } | null>(null);
  const router = useRouter();
  const params = useParams();
  const [schedule, setSchedule] = useState<any>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchResponses = async () => {
      const scheduleId = params.id;
      if (scheduleId && session?.user) {
        const { data: scheduleData, error: scheduleError } = await supabase
          .from('schedules')
          .select('*')
          .eq('id', scheduleId)
          .single();

        if (scheduleError) {
          console.error('Error fetching schedule:', scheduleError);
          return;
        }

        setSchedule(scheduleData);

        const { data: responsesData, error: responsesError } = await supabase
          .from('responses')
          .select('*')
          .eq('schedule_id', scheduleId);

        if (responsesError) {
          console.error('Error fetching responses:', responsesError);
        } else {
          setResponses(responsesData);
          calculateBestOptions(responsesData);
        }
      }
    };

    fetchResponses();
  }, [params.id, session]);

  const calculateBestOptions = (responsesData: ResponseData[]) => {
    const dateOccurrences: { [key: string]: number } = {};
    const locationOccurrences: { [key: string]: number } = {};

    responsesData.forEach((response) => {
      response.selected_dates.forEach((date) => {
        dateOccurrences[date] = (dateOccurrences[date] || 0) + 1;
      });

      response.selected_locations.forEach((location) => {
        const locationKey = `${location.title}:${location.roadAddress}`;
        locationOccurrences[locationKey] = (locationOccurrences[locationKey] || 0) + 1;
      });
    });

    const totalResponses = responsesData.length;
    const commonDates = Object.keys(dateOccurrences).filter((date) => dateOccurrences[date] === totalResponses);
    const commonLocations = Object.keys(locationOccurrences).filter(
      (location) => locationOccurrences[location] === totalResponses
    );

    setAllAvailableDates(commonDates);
    setAllAvailableLocations(commonLocations);

    const filteredBestDates = Object.keys(dateOccurrences).filter((date) => dateOccurrences[date] > 1);
    const filteredBestLocations = Object.keys(locationOccurrences).filter((location) => locationOccurrences[location] > 1);

    setBestDateOptions(filteredBestDates);
    setBestLocationOptions(filteredBestLocations);
  };

  const calculateFinalDecision = (votes: { voted_date: string; voted_location: { title: string; roadAddress: string } }[]) => {
    const dateCounts: { [key: string]: number } = {};
    const locationCounts: { [key: string]: number } = {};

    votes.forEach((vote) => {
      dateCounts[vote.voted_date] = (dateCounts[vote.voted_date] || 0) + 1;
      const locationKey = `${vote.voted_location.title}:${vote.voted_location.roadAddress}`;
      locationCounts[locationKey] = (locationCounts[locationKey] || 0) + 1;
    });

    const finalDate = Object.keys(dateCounts).reduce((a, b) => (dateCounts[a] > dateCounts[b] ? a : b));
    const finalLocationKey = Object.keys(locationCounts).reduce((a, b) => (locationCounts[a] > locationCounts[b] ? a : b));
    const [finalLocationTitle, finalLocationAddress] = finalLocationKey.split(':');
    const finalLocation = { title: finalLocationTitle, roadAddress: finalLocationAddress };

    return { finalDate, finalLocation };
  };

  const handleVoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userVoteDate && userVoteLocation) {
      const { error: voteError } = await supabase
        .from('votes')
        .insert({
          schedule_id: params.id,
          user_id: session?.user?.id,
          voted_date: userVoteDate,
          voted_location: userVoteLocation,
        });

      if (voteError) {
        console.error('Error submitting vote:', voteError);
        return;
      }

      const { data: scheduleData, error: scheduleError } = await supabase
        .from('schedules')
        .select('participants, created_by')
        .eq('id', params.id)
        .single();

      if (scheduleError) {
        console.error('Error fetching schedule participants:', scheduleError);
        return;
      }

      const participantIds = scheduleData?.participants ?? [];
      const organizerId = scheduleData?.created_by;
      const allParticipants = [...participantIds, organizerId];

      const { data: votes, error: votesError } = await supabase
        .from('votes')
        .select('voted_date, voted_location')
        .eq('schedule_id', params.id);

      if (votesError) {
        console.error('Error fetching votes:', votesError);
        return;
      }

      const allVoted = votes.length === allParticipants.length;

      if (allVoted) {
        const { finalDate, finalLocation } = calculateFinalDecision(votes);

        const { error: updateError } = await supabase
          .from('schedules')
          .update({
            final_date: finalDate,
            final_location: finalLocation,
          })
          .eq('id', params.id);

        if (updateError) {
          console.error('Error updating final schedule:', updateError);
          return;
        }

        await router.push(`/final-schedule/${params.id}`);
      } else {
        await router.push(`/waiting-for-votes/${params.id}`);
      }
    }
  };

  if (status === 'loading' || !schedule) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-primary pt-24 md:pt-16">
      <div className="flex flex-col p-6 w-full max-w-md mx-auto md:max-w-2xl">
        <div className="md:text-center p-2 md:p-4">
          <h1 className="text-[22px] md:text-[30px] font-bold text-textMain font-pretendard tracking-[0.35em] mb-2 md:mb-3">
            일정 조율
          </h1>
          <h2 className="text-[14px] md:text-[16px] font-extrabold text-textMain font-deliusRegular tracking-[0.35em]">
            Match Schedules
          </h2>
        </div>
        <div className="w-full max-w-md bg-white p-5 py-7 rounded-2xl shadow-md md:max-w-2xl mt-4 md:p-10">
          <ScheduleHeader schedule={schedule} />
          <DateOptions allAvailableDates={allAvailableDates} bestDateOptions={bestDateOptions} setUserVoteDate={setUserVoteDate} />
          <LocationOptions allAvailableLocations={allAvailableLocations} bestLocationOptions={bestLocationOptions} setUserVoteLocation={setUserVoteLocation} />
          <VoteButton handleVoteSubmit={handleVoteSubmit} />
        </div>
      </div>
    </div>
  );
};

export default CoordinateSchedulePage;
