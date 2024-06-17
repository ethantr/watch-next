"use client"; // This directive enables client-side rendering for this component

import { useEffect, useState } from 'react';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetch('/api/movies')
      .then(response => response.json())
      .then(data => setMovies(data.results));
  }, []);

  return (
    <div>
      <h1>Popular Movies</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {movies.map(movie => (
          <div key={movie.id} style={{ width: '200px' }}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              style={{ width: '100%' }}
            />
            <h3>{movie.title}</h3>
            <p>Release Date: {new Date(movie.release_date).toDateString()}</p>
            <p>Rating: {movie.vote_average}</p>
            <p>{movie.overview}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
