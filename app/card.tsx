// components/TVShowCard.tsx
import React from 'react';
import { TVShow } from './(pages)/(landing)/page';

interface TVShowCardProps {
  show: TVShow;
}

const TVShowCard: React.FC<TVShowCardProps> = ({ show }) => {
    console.log(show)
  return (
    <div className="relative bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="aspect-w-2 aspect-h-3">
      <img
              src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
              alt={show.name}
       className="absolute inset-0 w-full h-full object-cover transform transition-transform hover:scale-105"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-transparent to-transparent">
        <h3 className="text-xl font-bold text-white">{show.name}</h3>
        <div className="flex mt-1">
          {show.genre_names.map((genre, index) => (
            <span key={index} className="bg-gray-800 dark:bg-gray-200 text-sm text-white dark:text-gray-800 px-2 py-1 rounded mr-2">
              {genre}
            </span>
          ))}
        </div>
      </div>
      </div>
  );
};

export default TVShowCard;
