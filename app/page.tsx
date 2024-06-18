"use client"; // This directive enables client-side rendering for this component

import { useEffect, useState } from 'react';

interface TV {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
  genre_names: string[];
}

const Home: React.FC = () => {
  const [tvs, setTvs] = useState<TV[]>([]);

  useEffect(() => {
    fetch('/api/tv/trending')
      .then(response => response.json())
      .then(data => {
        // Assuming data is an object with a 'results' key containing the array of TV shows
        if (data.results) {
          setTvs(data.results);
        } else {
          console.error('Error: Invalid data format from API');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h1>Popular TV Shows</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', textAlign:"center",}}>
        {tvs.map(tv => (
          <div key={tv.id} style={{ width: '200px' }}>
            <img
              src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
              alt={tv.name}
              style={{ width: '100%' }}
            />
            <h3>{tv.name}</h3>
            {/* <p>Release Date: {new Date(tv.first_air_date).toDateString()}</p>
            <p>Rating: {tv.vote_average}</p> */}
            {tv.genre_names.map(genre => (
              <div style={{backgroundColor:"darkRed", borderRadius:"4px",}}>{genre}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
