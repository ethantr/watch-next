// hooks/useTvShowSearch.ts
import { useState } from "react";

interface Show {
  id: number;
  name: string;
  poster_path: string;
}

const useSearchTVShows = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Show[]>([]);
  const [selectedTv_shows, setSelectedTv_shows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text: string) => {
    setLoading(true);
    if (text.length < 1) {
      setLoading(false);
      setResults([]);
      return;
    }
    const response = await fetch(
      `/api/tv/tournament/search_tv_show?query=${text}`
    );

    const data = await response.json();
    setLoading(false);
    setResults(data);
  };

  const handleSelectTv_show = (tv_show: Show) => {
    if (!selectedTv_shows.includes(tv_show))
      setSelectedTv_shows([...selectedTv_shows, tv_show]);
  };

  const handleDeselectTv_show = (tv_showId: number) => {
    setSelectedTv_shows(
      selectedTv_shows.filter((tv_show) => tv_show.id !== tv_showId)
    );
  };

  const handleSubmit = (onTv_showsSelected: (tv_shows: Show[]) => void) => {
    onTv_showsSelected(selectedTv_shows);
  };

  return {
    query,
    setQuery,
    results,
    loading,
    selectedTv_shows,
    handleSearch,
    handleSelectTv_show,
    handleDeselectTv_show,
    handleSubmit,
  };
};

export default useSearchTVShows;
