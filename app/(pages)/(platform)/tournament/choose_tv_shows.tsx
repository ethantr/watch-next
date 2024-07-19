// components/TVSearch.tsx
import React from "react";
import useSearchTVShows from "@/app/hooks/use_search_tv_shows";
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
    <div className="p-4 bg-gray-900 text-white rounded-lg shadow-md">
      <div className="flex flex-col items-center mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a TV show"
          className="w-full p-2 mb-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        >
          Search
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-xl mb-2">Search Results</h3>
        <div className="flex overflow-x-auto space-x-4 p-2 bg-gray-800 rounded">
          {loading ? (
            <p className="animate-pulse">Loading...</p>
          ) : (
            results.map((tv_show) => (
              <div
                key={tv_show.id}
                onClick={() => handleSelectTv_show(tv_show)}
                className="flex flex-col items-center cursor-pointer hover:bg-gray-700 p-2 rounded transition duration-300"
              >
                <div
                  className="relative w-24"
                  style={{ paddingBottom: "150%" }}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${tv_show.poster_path}`}
                    alt={tv_show.name}
                    className="absolute top-0 left-0 w-full h-full object-cover rounded"
                  />
                </div>
                <p className="text-sm text-center mt-2">{tv_show.name}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl mb-2">Selected Shows</h3>
        <div className="flex overflow-x-auto space-x-4 p-2 bg-gray-800 rounded">
          {selectedTv_shows.map((tv_show) => (
            <div
              key={tv_show.id}
              onClick={() => handleDeselectTv_show(tv_show.id)}
              className="flex flex-col items-center cursor-pointer hover:bg-opacity-40 hover:bg-red-950  p-2 rounded transition duration-300"
            >
              <div className="relative w-24" style={{ paddingBottom: "150%" }}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${tv_show.poster_path}`}
                  alt={tv_show.name}
                  className="absolute top-0 left-0 w-full h-full object-cover rounded"
                />
              </div>
              <p className="text-sm text-center mt-2">{tv_show.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => handleSubmit(onTv_showsSelected)}
          className="px-6 py-2 bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          Start Tournament
        </button>
      </div>
    </div>
  );
};

export default TVSearch;
