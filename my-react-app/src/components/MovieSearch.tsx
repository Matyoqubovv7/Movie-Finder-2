import React, { useState } from 'react';

interface MovieSearchProps {
  onSearch: (query: string) => void;
}

const MovieSearch: React.FC<MovieSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form className="movie-search" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Film nomini kiriting..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button type="submit">Qidirish</button>
    </form>
  );
};

export default MovieSearch; 