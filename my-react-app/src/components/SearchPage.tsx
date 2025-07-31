import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './CategoryPage.css';

interface SearchPageProps {
  apiKey: string;
}

const SearchPage: React.FC<SearchPageProps> = ({ apiKey }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim()) {
      setPage(1);
      setResults([]);
      fetchSearchResults();
    }
  }, [query, apiKey]);

  useEffect(() => {
    if (page > 1) {
      fetchSearchResults();
    }
  }, [page]);

  const fetchSearchResults = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ru-RU&query=${encodeURIComponent(query)}&page=${page}`
      );
      const data = await response.json();
      
      // Filter out non-movie and non-tv results
      const filteredResults = (data.results || []).filter((item: any) => 
        item.media_type === 'movie' || item.media_type === 'tv'
      );
      
      if (page === 1) {
        setResults(filteredResults);
      } else {
        setResults(prev => [...prev, ...filteredResults]);
      }
      
      setHasMore(data.page < data.total_pages && filteredResults.length > 0);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (!query.trim()) {
    return (
      <div className="category-page">
        <div className="category-header">
          <h1>🔍 Qidiruv</h1>
          <button onClick={() => navigate('/')} className="back-button">
            ← Orqaga qaytish
          </button>
        </div>
        <div className="loading">Qidiruv so'rovini kiriting</div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>🔍 Qidiruv natijalari: "{query}"</h1>
        <button onClick={() => navigate('/')} className="back-button">
          ← Orqaga qaytish
        </button>
      </div>
      
      {loading && page === 1 ? (
        <div className="loading">Qidirilmoqda...</div>
      ) : results.length === 0 ? (
        <div className="no-results">
          <h2>Hech narsa topilmadi</h2>
          <p>"{query}" uchun natija topilmadi. Boshqa so'rovni sinab ko'ring.</p>
        </div>
      ) : (
        <>
          <div className="movies-grid">
            {results.map(item => (
              <div 
                className="movie-card" 
                key={`${item.media_type}-${item.id}`}
                onClick={() => navigate(`/details/${item.media_type}/${item.id}`)}
              >
                <div className="movie-poster">
                  <img
                    src={item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'}
                    alt={item.title || item.name}
                  />
                  <div className="movie-overlay">
                    <span className="play-icon">▶</span>
                  </div>
                  <div className="media-type-badge">
                    {item.media_type === 'movie' ? '🎬' : '📺'}
                  </div>
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{item.title || item.name}</h3>
                  <p className="movie-year">
                    {(item.release_date || item.first_air_date)?.split('-')[0] || 'N/A'}
                  </p>
                  <p className="movie-rating">⭐ {item.vote_average?.toFixed(1) || 'N/A'}</p>
                  <p className="media-type">{item.media_type === 'movie' ? 'Film' : 'Serial'}</p>
                </div>
              </div>
            ))}
          </div>
          
          {hasMore && (
            <div className="load-more-container">
              <button 
                onClick={loadMore} 
                className="load-more-button"
                disabled={loading}
              >
                {loading ? 'Yuklanmoqda...' : 'Ko\'proq ko\'rsatish'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage; 