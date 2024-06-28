"use client";
import React from "react";
import useMatchups from "@/app/hooks/use_matchups";
import MatchupCard from "./matchup_card";
import Loading from "@/app/components/loading";

export default function Home() {
  const {
    matchups,
    currentRound,
    currentMatchupIndex,
    initialise,
    handleWinnerSelect,
    currentMatchup,
    loading,
  } = useMatchups()

  if (matchups.length === 0) {
    return (
      <div>
        <Loading />
        <button onClick={initialise}>Get Shows</button>
      </div>
    );
  }

  if (matchups.length === 1) {
    return (
      <div className="p-4">
        <h1>Winner</h1>
        <MatchupCard
          showId={currentMatchup.show1_id}
          showName={currentMatchup.show1_name}
          showPosterPath={currentMatchup.show1_poster_path}
          handleWinnerSelect={handleWinnerSelect}
        />
        <button onClick={initialise}>Restart</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
      <h1>Movie Tournament</h1>
      <button onClick={initialise}>Restart</button>
      <h2>
        Round {currentRound} Matchup {currentMatchup.match_id}
      </h2>
      <div className="p-4" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <section
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            height: '100%',
            overflowY: 'auto',
          }}
        >
          <MatchupCard
            showId={currentMatchup.show1_id}
            showName={currentMatchup.show1_name}
            showPosterPath={currentMatchup.show1_poster_path}
            handleWinnerSelect={handleWinnerSelect}
          />
          <div
            style={{ margin: "0 20px", fontSize: "24px", fontWeight: "bold" }}
          >
            VS
          </div>
          {currentMatchup.show2_id && (
            <MatchupCard
              showId={currentMatchup.show2_id}
              showName={currentMatchup.show2_name!}
              showPosterPath={currentMatchup.show2_poster_path!}
              handleWinnerSelect={handleWinnerSelect}
            />
          )}
        </section>
      </div>
    </div>
  );
}
