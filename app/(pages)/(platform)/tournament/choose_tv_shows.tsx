import React, { useState } from "react";

interface Show {
  id: number;
  name: string;
  poster_path: string;
}

interface ShowSearchProps {
  onTv_showsSelected: (tv_shows: Show[]) => void;
}

const TVSearch: React.FC<ShowSearchProps> = ({ onTv_showsSelected }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Show[]>([]);
  const [selectedTv_shows, setSelectedTv_shows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const response = await fetch(
      `/api/tv/tournament/search_tv_show?query=${query}`
    );
    await response.json().then((data) => {
      setLoading(false);
      setResults(data);
    });
  };

  const handleSelectTv_show = (tv_show: Show) => {
    setSelectedTv_shows([...selectedTv_shows, tv_show]);
  };

  const handleDeselectTv_show = (tv_showId: number) => {
    setSelectedTv_shows(selectedTv_shows.filter((tv_show) => tv_show.id !== tv_showId));
  };

  const handleSubmit = () => {
    onTv_showsSelected(selectedTv_shows);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a tv_show"
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
            style={{ minWidth: "150px", textAlign: "center", margin: "0 10px" }}
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
      <button onClick={handleSubmit}>Start Tournament</button>
    </div>
  );
};

export default TVSearch;
