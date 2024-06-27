"use client";
import { useState, useEffect } from "react";

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
  const [currentMatchupIndex, setCurrentMatchupIndex] = useState<number>(0);

  const handlerInitialise = () => {
    fetch("/api/tv/trending/initialise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error fetching matchups:", error));
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
      .catch((error) => console.error("Error fetching matchups:", error));
  };

  const handleWinnerSelect = (winnerId: number | null) => {
    const currentMatchup = matchups[currentMatchupIndex];
    fetch("/api/tv/trending/winner", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
          const allResolved = updatedMatchups.every(
            (m) => m.winner_id !== null
          );
          if (allResolved) {
            setCurrentRound(currentRound + 1);
          }
        }
      })
      .catch((error) => {
        console.error("Error setting winner:", error);
      });
  };

  if (matchups.length === 0) {
    return (
      <div>
        Loading...
        <button onClick={handlerInitialise}>Get Shows</button>
      </div>
    );
  }

  const currentMatchup = matchups[currentMatchupIndex];

  if (matchups.length === 1) {
    return (
      <div className="p-4">
        <h1>Winner</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center", margin: "0 20px" }}>
            <img
              src={`https://image.tmdb.org/t/p/w500${currentMatchup.show1_poster_path}`}
              alt={currentMatchup.show1_name}
              style={{ width: "150px", height: "225px" }}
            />
            <button onClick={() => handleWinnerSelect(currentMatchup.show1_id)}>
              {currentMatchup.show1_name}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // const imagesLoaded = usePreloadImages([
  //   `https://image.tmdb.org/t/p/w500${currentMatchup?.show1_poster_path}`,
  //   currentMatchup?.show2_poster_path ? `https://image.tmdb.org/t/p/w500${currentMatchup.show2_poster_path}` : ''
  // ]);

  return (
    <div>
      <h1>Movie Tournament</h1>
      <button onClick={handlerInitialise}>Restart</button>
      <h2>
        Round {currentMatchup.round_number} Matchup {currentMatchup.match_id}
      </h2>

      <div className="p-4">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center", margin: "0 20px" }}>
          <button onClick={() => handleWinnerSelect(currentMatchup.show1_id)}>
            <img
              src={`https://image.tmdb.org/t/p/w500${currentMatchup.show1_poster_path}`}
              alt={currentMatchup.show1_name}
              style={{ width: "150px", height: "225px" }}
            />
     
              {currentMatchup.show1_name}
            </button>
          </div>
          <div
            style={{ margin: "0 20px", fontSize: "24px", fontWeight: "bold" }}
          >
            VS
          </div>
          {currentMatchup.show2_id && (
            <div style={{ textAlign: "center", margin: "0 20px" }}>
              <button
                onClick={() => handleWinnerSelect(currentMatchup.show2_id)}
              >
              <img
                src={`https://image.tmdb.org/t/p/w500${currentMatchup.show2_poster_path}`}
                alt={currentMatchup.show2_name!}
                style={{ width: "150px", height: "225px" }}
              />
              {/* <Image src={`https://image.tmdb.org/t/p/w500${currentMatchup.show2_poster_path}`} alt={currentMatchup.show2_name!} width={150} height={255}/> */}
              
                {currentMatchup.show2_name}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
