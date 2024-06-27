"use client"
// pages/index.tsx
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

export default function Home() {
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const [currentRound, setCurrentRound] = useState<number>(1);

  useEffect(() => {
    fetch(`/api/tv/trending/matchups?round=${currentRound}`)
      .then((response) => response.json())
      .then((data) => setMatchups(data))
      .catch((error) => console.error('Error fetching matchups:', error));
  }, [currentRound]);

  const handleWinnerSelect = (matchup: Matchup, winnerId: number | null) => {
    fetch('/api/tv/trending/winner', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ matchup_id: matchup.match_id, winner_id: winnerId }), // Replace with actual matchup_id and winner_id
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message,data.result); // Handle success response
        
        // Create a new array with the updated matchup
        const updatedMatchups = matchups.map(m => {
          if (m.match_id === matchup.match_id) {
            return { ...m, winner_id: winnerId };
          }
          return m;
        });

        // Update the state
        setMatchups(updatedMatchups);

        // Check if all matchups in the current round are resolved
        const allResolved = updatedMatchups.every(m => m.winner_id !== null);

        // If all matchups are resolved, move to the next round
        if (allResolved) {
          setCurrentRound(currentRound + 1);
        }
      })
      .catch(error => {
        console.error('Error setting winner:', error); // Handle error
      });
  };

  return (
    <div>
      <h1>Movie Tournament</h1>
      {matchups.map((matchup) => (
        <div key={matchup.match_id} className='p-4'>
          <h2>Round {matchup.round_number} Key {matchup.match_id} Winner {matchup.winner_id}</h2>
          <button onClick={() => handleWinnerSelect(matchup, matchup.show1_id)}>
            {matchup.show1_name}
          </button> <div className='p-1'>
            </div>
          {matchup.show2_id && (
            <button onClick={() => handleWinnerSelect(matchup, matchup.show2_id)}>
              {matchup.show2_name}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
