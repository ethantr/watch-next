// components/TVSearch.tsx
import React from "react";
import useSearchTVShows from "@/app/hooks/use_search_tv_shows";
import useMatchups from "@/app/hooks/use_matchups";
import { TVShow } from "@/app/models/tv_show";

interface ShowSearchProps {
  onTv_showsSelected: (tv_shows: TVShow[]) => void;
}

const TVSearch: React.FC<ShowSearchProps> = ({ onTv_showsSelected }) => {
  const {
    query,
    setQuery,
    results,
    loading,
    selectedTv_shows,
    handleSearch,
    handleSelectTv_show,
    handleDeselectTv_show,
    handleSubmit,
  } = useSearchTVShows();


  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a tv show"
        className="bg-slate-800"
      />
      <button onClick={handleSearch}>Search</button>
      <div
        style={{
          display: "flex",
          overflowX: "scroll",
          height: "33vh",
          marginTop: "10px",
        }}
      >
        {loading ? (
          <p>Loading...</p>
        ) : (
          results.map((tv_show) => (
            <div
              key={tv_show.id}
              onClick={() => handleSelectTv_show(tv_show)}
              style={{
                minWidth: "150px",
                textAlign: "center",
                margin: "0 10px",
               
              }}
               className="hover:bg-green-900"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${tv_show.poster_path}`}
                alt={tv_show.name}
                style={{ width: "100px", height: "150px" }}
                
              />
              {tv_show.name}
            </div>
          ))
        )}
      </div>
      <h3>Selected Shows</h3>
      <div
        style={{
          display: "flex",
          overflowX: "scroll",
          height: "33vh",
          marginTop: "10px",
        }}
      >
        {selectedTv_shows.map((tv_show) => (
          <div
            key={tv_show.id}
            onClick={() => handleDeselectTv_show(tv_show.id)}
            style={{
              minWidth: "150px",
              textAlign: "center",
              margin: "0 10px",
            }}
            className="hover:bg-red-900"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${tv_show.poster_path}`}
              alt={tv_show.name}
              style={{ width: "100px", height: "150px" }}
            />
            {tv_show.name}
          </div>
        ))}
      </div>
      <button onClick={() => handleSubmit(onTv_showsSelected)}>
        Start Tournament
      </button>
    </div>
  );
};

export default TVSearch;
