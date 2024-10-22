'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // for redirecting after vote
import { supabase } from '@/lib/supabaseClient';

interface HeartedLocation {
  name: string;
  address: string;
}

interface VoteTabProps {
  userId: string | null; // Current user's ID
  scheduleId: string; // Current schedule ID
}

const VoteTab = ({ userId, scheduleId }: VoteTabProps) => {
  const [heartedLocations, setHeartedLocations] = useState<HeartedLocation[]>([]); // List of favorited locations
  const [selectedLocations, setSelectedLocations] = useState<HeartedLocation[]>([]); // Locations selected by user
  const [isOrganizer, setIsOrganizer] = useState(false); // Check if current user is the organizer
  const [votingStarted, setVotingStarted] = useState(false); // Check if voting has started
  const [votesCount, setVotesCount] = useState(0); // Number of people who voted
  const [totalParticipants, setTotalParticipants] = useState(0); // Total participants
  const [finalPlace, setFinalPlace] = useState<HeartedLocation | null>(null); // Final decided place
  const [userHasVoted, setUserHasVoted] = useState(false); // Check if current user has already voted

  const router = useRouter();

  // Calculate final place (majority vote)
  const calculateFinalPlace = useCallback(async () => {
    const { data, error } = await supabase
      .from('final_place_votes')
      .select('voted_place')
      .eq('schedule_id', scheduleId);

    if (error) {
      console.error('Error fetching votes:', error);
      return;
    }

    const voteCounts = data.reduce((acc: any, vote: any) => {
      const location = vote.voted_place.name;
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});

    const finalPlaceName = Object.keys(voteCounts).reduce((a, b) => (voteCounts[a] > voteCounts[b] ? a : b));

    const finalPlace = heartedLocations.find((location) => location.name === finalPlaceName);

    if (finalPlace) {
      await supabase
        .from('schedules')
        .update({ final_place: finalPlace })
        .eq('id', scheduleId);

      setFinalPlace(finalPlace);
    }

    router.push(`/final-results/${scheduleId}`);
  }, [heartedLocations, scheduleId, router]);

  // Check if all participants have voted
  const checkIfAllVoted = useCallback(async () => {
    const { data: votes, error } = await supabase
      .from('final_place_votes')
      .select('user_id')
      .eq('schedule_id', scheduleId);

    if (error) {
      console.error('Error fetching votes:', error);
      return;
    }

    const uniqueVotedUserIds = Array.from(new Set(votes.map((vote: { user_id: string }) => vote.user_id)));

    if (uniqueVotedUserIds.length === totalParticipants) {
      calculateFinalPlace();
    }
  }, [scheduleId, totalParticipants, calculateFinalPlace]);

  // Fetch schedule details (including voting status)
  useEffect(() => {
    const fetchScheduleDetails = async () => {
      const { data, error } = await supabase
        .from('schedules')
        .select('created_by, voting_started, participants, final_place')
        .eq('id', scheduleId)
        .single();

      if (error) {
        console.error('Error fetching schedule data:', error);
        return;
      }

      const participants = data.participants || [];
      if (!participants.includes(data.created_by)) {
        participants.push(data.created_by);
      }

      setIsOrganizer(data.created_by === userId); // Is the user the organizer?
      setVotingStarted(data.voting_started); // Has voting started?
      setTotalParticipants(participants.length);

      if (data.final_place) {
        setFinalPlace(data.final_place);
      }
    };

    fetchScheduleDetails();
  }, [userId, scheduleId]);

  // Fetch hearted locations
  useEffect(() => {
    const fetchHeartedLocations = async () => {
      const { data, error } = await supabase
        .from('hearted_locations')
        .select('location')
        .eq('schedule_id', scheduleId);

      if (error) {
        console.error('Error fetching hearted locations:', error);
        return;
      }
      setHeartedLocations(data.map((entry: any) => entry.location));
    };

    fetchHeartedLocations();
  }, [scheduleId]);

  // Check if the user has already voted
  useEffect(() => {
    const checkUserVoteStatus = async () => {
      const { data, error } = await supabase
        .from('final_place_votes')
        .select('user_id')
        .eq('schedule_id', scheduleId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error checking user vote status:', error);
        return;
      }
      setUserHasVoted(data.length > 0);
    };

    checkUserVoteStatus();
  }, [scheduleId, userId]);

  // Real-time vote count updates
  useEffect(() => {
    const votesListener = supabase
      .channel(`public:final_place_votes:schedule_id=eq.${scheduleId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'final_place_votes' }, () => {
        setVotesCount((prevCount) => prevCount + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(votesListener);
    };
  }, [scheduleId]);

  // Start voting (for organizer)
  const startVoting = async () => {
    try {
      const { error } = await supabase
        .from('schedules')
        .update({ voting_started: true })
        .eq('id', scheduleId);

      if (error) {
        console.error('Error starting voting:', error);
        return;
      }
      setVotingStarted(true);
    } catch (error) {
      console.error('Error starting voting:', error);
    }
  };

  // Handle location selection
  const toggleLocationSelection = (location: HeartedLocation) => {
    if (!votingStarted) {
      alert('투표가 아직 시작되지 않았습니다.');
      return;
    }
    setSelectedLocations((prevSelected) =>
      prevSelected.some((selected) => selected.name === location.name)
        ? prevSelected.filter((selected) => selected.name !== location.name)
        : [...prevSelected, location]
    );
  };

  // Submit votes
  const submitVotes = async () => {
    if (!votingStarted) {
      alert('투표가 아직 시작되지 않았습니다.');
      return;
    }
    if (selectedLocations.length === 0 || selectedLocations.length > 2) {
      alert('최소 한 개 이상의 장소를 선택하고, 최대 두 개까지 선택할 수 있습니다.');
      return;
    }

    try {
      const votes = selectedLocations.map((location) => ({
        voted_place: location,
        user_id: userId,
        schedule_id: scheduleId,
        voted_date: new Date().toISOString().split('T')[0],
      }));

      const { error } = await supabase
        .from('final_place_votes')
        .insert(votes);

      if (error) {
        console.error('Failed to submit votes:', error);
        return;
      }
      setSelectedLocations([]);
      setUserHasVoted(true);
      alert('투표가 완료되었습니다.');

      checkIfAllVoted();
    } catch (error) {
      console.error('Error submitting votes:', error);
    }
  };

  useEffect(() => {
    if (votesCount === totalParticipants && votingStarted) {
      checkIfAllVoted();
    }
  }, [votesCount, totalParticipants, votingStarted, checkIfAllVoted]);

  return (
    <div>
      {isOrganizer && !votingStarted && (
        <>
          <p className="text-lg mb-10 text-center ">투표할 준비가 완료되면 아래 버튼을 눌러주세요!</p>
          <button className="text-lg w-full bg-buttonA font-semibold hover:bg-secondaryHover text-textButton py-2 px-4 mb-4 rounded-lg shadow-lg tracking-[0.30em]" onClick={startVoting}>
            투표 시작
          </button>
        </>
      )}

      {votingStarted && !finalPlace ? (
        <>
          {!userHasVoted ? (
            <>
              <h2 className="text-xl mb-6">장소를 선택해주세요 (최대 2곳)</h2>
              <div className="space-y-4">
                {heartedLocations.map((location, index) => (
                  <button
                    key={index}
                    className={`w-full py-2 px-4 rounded-lg ${
                      selectedLocations.some((selected) => selected.name === location.name) ? 'bg-textButton text-white' : 'bg-buttonA text-textButton'
                    }`}
                    onClick={() => toggleLocationSelection(location)}
                  >
                    {location.name}
                  </button>
                ))}
              </div>

              <button className="w-full bg-textButton text-white py-2 px-4 mt-4 rounded-lg" onClick={submitVotes}>
                투표 완료
              </button>
            </>
          ) : (
            <p className="text-xl mt-6 text-center">다른 참가자들의 투표를 기다려주세요.</p>
          )}
        </>
      ) : (
        finalPlace && <p className="text-xl mt-6 text-center">최종 장소: {finalPlace.name}</p>
      )}
    </div>
  );
};

export default VoteTab;
