// components/MatchupCard.tsx
import React from 'react';

interface MatchupCardProps {
  showId: number;
  showName: string;
  showPosterPath: string;
  handleWinnerSelect: (winnerId: number) => void;
}

const MatchupCard: React.FC<MatchupCardProps> = ({
  showId,
  showName,
  showPosterPath,
  handleWinnerSelect,
}) => {
  return (
    <div style={{ textAlign: 'center', margin: '0 20px' }}>
      <button onClick={() => handleWinnerSelect(showId)}>
        <img
          src={`https://image.tmdb.org/t/p/w500${showPosterPath}`}
          alt={showName}
          style={{ width: '150px', height: '225px' }}
        />
        {showName}
      </button>
    </div>
  );
};

export default MatchupCard;
