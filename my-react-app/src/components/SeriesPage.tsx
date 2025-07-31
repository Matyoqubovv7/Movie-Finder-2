import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryPage.css';

interface SeriesPageProps {
  apiKey: string;
}

const SeriesPage: React.FC<SeriesPageProps> = ({ apiKey }) => {
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSeries();
  }, [apiKey, page]);

  const fetchSeries = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=ru-RU&page=${page}`
      );
      const data = await response.json();
      
      if (page === 1) {
        // "The Late Show with Stephen Colbert" ni chiqarib tashlash
        setSeries((data.results || []).filter(show => show.name !== "The Late Show with Stephen Colbert"));
      } else {
        setSeries(prev => [...prev, ...((data.results || []).filter(show => show.name !== "The Late Show with Stephen Colbert"))]);
      }
      
      setHasMore(data.page < data.total_pages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching series:', error);
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
          <h1>📺 Barcha Seriallar</h1>
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
        <h1>📺 Barcha Seriallar</h1>
        <button onClick={() => navigate('/')} className="back-button">
          ← Orqaga qaytish
        </button>
      </div>
      
      <div className="movies-grid">
        {(() => {
          // Nomaqbul nomlar ro'yxati
          const blocked = [
            "The Late Show with Stephen Colbert",
            "Riley Steele: Scream",
            "DP Digital Playground",
            "Scream",
            "Scream: The TV Series"
          ];
          let allowed = series.filter(show => !blocked.includes(show.name));
          let blockedShows = series.filter(show => blocked.includes(show.name));
          // Prison Break yoki Breaking Bad ni birinchi qilib chiqarish
          const pb = allowed.find(show => show.name.toLowerCase() === "prison break");
          const bb = allowed.find(show => show.name.toLowerCase() === "breaking bad");
          if (pb) {
            allowed = [pb, ...allowed.filter(show => show.name.toLowerCase() !== "prison break")];
          } else if (bb) {
            allowed = [bb, ...allowed.filter(show => show.name.toLowerCase() !== "breaking bad")];
          }
          // Avval allowed, oxirida blockedShows
          return [...allowed, ...blockedShows].map((show: any) => (
            <div 
              className="movie-card" 
              key={show.id}
              onClick={() => navigate(`/details/tv/${show.id}`)}
            >
              <div className="movie-poster">
                <img
                  src={show.poster_path ? `https://image.tmdb.org/t/p/w300${show.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'}
                  alt={show.name}
                />
                <div className="movie-overlay">
                  <span className="play-icon">▶</span>
                </div>
              </div>
              <div className="movie-info">
                <h3 className="movie-title">{show.name}</h3>
                <p className="movie-year">{show.first_air_date?.split('-')[0] || 'N/A'}</p>
                <p className="movie-rating">⭐ {show.vote_average?.toFixed(1) || 'N/A'}</p>
              </div>
            </div>
          ));
        })()}
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

export default SeriesPage; 