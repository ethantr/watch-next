// hooks/useMatchups.ts
import { useState, useEffect } from 'react';

interface Matchup {
  match_id: number;
  round_number: number;
  show1_id: number;
  show1_name: string;
  show1_poster_path: string;
  show2_id: null | number;
  show2_name: null | string;
  show2_poster_path: null | string;
  winner_id: null | number;
}

const useMatchups = () => {
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [currentMatchupIndex, setCurrentMatchupIndex] = useState<number>(0);

  const initialise = () => {
    fetch('/api/tv/trending/initialise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .catch((error) => console.error('Error initializing matchups:', error));
    setCurrentRound(1)
    setCurrentMatchupIndex(0);
  };

  useEffect(() => {
    fetchRound();
  }, [currentRound]);

  const fetchRound = () => {
    fetch(`/api/tv/trending/matchups?round=${currentRound}`)
      .then((response) => response.json())
      .then((data) => {
        setMatchups(data);
        setCurrentMatchupIndex(0); // Reset to the first matchup of the new round
      })
      .catch((error) => console.error('Error fetching matchups:', error));
  };

  const handleWinnerSelect = (winnerId: number | null) => {
    const currentMatchup = matchups[currentMatchupIndex];
    fetch('/api/tv/trending/winner', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        matchup_id: currentMatchup.match_id,
        winner_id: winnerId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message, data.result);

        // Update the current matchup with the winner
        const updatedMatchups = matchups.map((m, index) => {
          if (index === currentMatchupIndex) {
            return { ...m, winner_id: winnerId };
          }
          return m;
        });

        setMatchups(updatedMatchups);

        // Move to the next matchup or the next round if all matchups are resolved
        if (currentMatchupIndex < matchups.length - 1) {
          setCurrentMatchupIndex(currentMatchupIndex + 1);
        } else {
          const allResolved = updatedMatchups.every((m) => m.winner_id !== null);
          if (allResolved) {
            setCurrentRound(currentRound + 1);
          }
        }
      })
      .catch((error) => {
        console.error('Error setting winner:', error);
      });
  };

  return {
    matchups,
    currentRound,
    currentMatchupIndex,
    initialise,
    handleWinnerSelect,
    currentMatchup: matchups[currentMatchupIndex],
  };
};

export default useMatchups;
