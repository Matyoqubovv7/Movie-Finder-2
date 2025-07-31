import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryPage.css';

interface FilmsPageProps {
  apiKey: string;
}

const FilmsPage: React.FC<FilmsPageProps> = ({ apiKey }) => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, [apiKey, page]);

  const fetchMovies = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ru-RU&page=${page}`
      );
      const data = await response.json();
      
      if (page === 1) {
        setMovies(data.results || []);
      } else {
        setMovies(prev => [...prev, ...(data.results || [])]);
      }
      
      setHasMore(data.page < data.total_pages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && page === 1) {
    return (
      <div className="category-page">
        <div className="category-header">
          <h1>🎬 Barcha Filmlar</h1>
          <button onClick={() => navigate('/')} className="back-button">
            ← Orqaga qaytish
          </button>
        </div>
        <div className="loading">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>🎬 Barcha Filmlar</h1>
        <button onClick={() => navigate('/')} className="back-button">
          ← Orqaga qaytish
        </button>
      </div>
      
      <div className="movies-grid">
        {movies.map(movie => (
          <div 
            className="movie-card" 
            key={movie.id}
            onClick={() => navigate(`/details/movie/${movie.id}`)}
          >
            <div className="movie-poster">
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'}
                alt={movie.title}
              />
              <div className="movie-overlay">
                <span className="play-icon">▶</span>
              </div>
            </div>
            <div className="movie-info">
              <h3 className="movie-title">{movie.title}</h3>
              <p className="movie-year">{movie.release_date?.split('-')[0] || 'N/A'}</p>
              <p className="movie-rating">⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>
      
      {hasMore && (
        <div className="load-more-container">
          <button onClick={loadMore} className="load-more-button">
            Ko'proq ko'rsatish
          </button>
        </div>
      )}
    </div>
  );
};

export default FilmsPage; 