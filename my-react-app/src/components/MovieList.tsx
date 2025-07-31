import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

interface MovieListProps {
  movies: Movie[];
}

const MovieList: React.FC<MovieListProps> = ({ movies }) => {
  const navigate = useNavigate();
  return (
    <div className="movie-list">
      {movies.length === 0 ? (
        <p>Hech narsa topilmadi.</p>
      ) : (
        movies.map(movie => (
          <div
            className="movie-card"
            key={movie.id}
            onClick={() => navigate(`/details/movie/${movie.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'}
              alt={movie.title}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default MovieList; 