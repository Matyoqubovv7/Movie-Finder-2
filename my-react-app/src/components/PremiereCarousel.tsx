import React, { useEffect, useState, useRef } from 'react';
import './PremiereCarousel.css';

interface PremiereCarouselProps {
  movies: any[];
  onMovieClick?: (movieId: string | number) => void;
}

const AUTO_ROTATE_INTERVAL = 10000; // 10 seconds

const PremiereCarousel: React.FC<PremiereCarouselProps> = ({ movies, onMovieClick }) => {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (movies.length === 0) return;
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % movies.length);
    }, AUTO_ROTATE_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [movies]);

  const goTo = (idx: number) => {
    setCurrent(idx);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrent(prev => (prev + 1) % movies.length);
      }, AUTO_ROTATE_INTERVAL);
    }
  };

  if (!movies.length) return null;
  const movie = movies[current];

  return (
    <div className="premiere-carousel">
      <div className="carousel-movie-card" onClick={() => onMovieClick && onMovieClick(movie.id)}>
        <img
          className="carousel-movie-img"
          src={movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/800x400?text=No+Image')}
          alt={movie.title || movie.name}
        />
        <div className="carousel-movie-info">
          <h3 className="carousel-movie-title">{movie.title || movie.name}</h3>
          <p className="carousel-movie-overview">{movie.overview?.slice(0, 120)}...</p>
        </div>
      </div>
      <div className="carousel-controls">
        <button className="carousel-arrow" onClick={() => goTo((current - 1 + movies.length) % movies.length)}>&lt;</button>
        <div className="carousel-dots">
          {movies.map((_, idx) => (
            <span
              key={idx}
              className={`carousel-dot${idx === current ? ' active' : ''}`}
              onClick={() => goTo(idx)}
            />
          ))}
        </div>
        <button className="carousel-arrow" onClick={() => goTo((current + 1) % movies.length)}>&gt;</button>
      </div>
    </div>
  );
};

export default PremiereCarousel;