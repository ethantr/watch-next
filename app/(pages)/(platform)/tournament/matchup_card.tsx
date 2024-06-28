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
    <div style={{ textAlign: 'center', margin: '0 20px', maxWidth: '45%' }}>
      <button onClick={() => handleWinnerSelect(showId)} style={{ border: 'none', background: 'none' }}>
        <img
          src={`https://image.tmdb.org/t/p/w500${showPosterPath}`}
          alt={showName}
          style={{ width: '100%', height: 'auto', maxHeight: '70vh' }}
        />
        <div style={{ marginTop: '10px' }}>{showName}</div>
      </button>
    </div>
  );
};

export default MatchupCard;
