import React, { useEffect, useState } from 'react';
import MovieList from './MovieList';
import PremiereCarousel from './PremiereCarousel';
import './HomePage.css';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface HomePageProps {
  apiKey: string;
}

const HomePage: React.FC<HomePageProps> = ({ apiKey }) => {
  const { t } = useTranslation();
  const [premieres, setPremieres] = useState<any[]>([]);
  const [serials, setSerials] = useState<any[]>([]);
  const [cartoons, setCartoons] = useState<any[]>([]);
  const [anime, setAnime] = useState<any[]>([]);
  const [topMovies, setTopMovies] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Premyeralar (now playing)
    fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ru-RU&page=1&include_adult=false`)
      .then(res => res.json())
      .then(data => setPremieres((data.results || []).filter(item => item.title !== "Riley Steele: Scream")));
    
    // Seriallar (tv/popular)
    fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=ru-RU&page=1&include_adult=false`)
      .then(res => res.json())
      .then(data => {
        let arr = (data.results || []).filter(item => item.name !== "The Late Show with Stephen Colbert" && item.name !== "Riley Steele: Scream");
        // "Stranger Things" ni birinchi qilib qo'yish
        const stranger = arr.find(tv => tv.name === "Stranger Things");
        if (stranger) {
          arr = [stranger, ...arr.filter(tv => tv.name !== "Stranger Things")];
        }
        setSerials(arr);
      });
    
    // Multfilmlar (animated movies)
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=ru-RU&with_genres=16&sort_by=popularity.desc&page=1&include_adult=false`)
      .then(res => res.json())
      .then(data => setCartoons((data.results || []).filter(item => item.title !== "Riley Steele: Scream")));
    
    // Anime (Japanese animation)
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=ru-RU&with_genres=16&with_origin_country=JP&sort_by=popularity.desc&page=1&include_adult=false`)
      .then(res => res.json())
      .then(data => setAnime((data.results || []).filter(item => item.title !== "Riley Steele: Scream")));
    
    // Top kinolar
    fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=ru-RU&page=1&include_adult=false`)
      .then(res => res.json())
      .then(data => setTopMovies((data.results || []).filter(item => item.title !== "Riley Steele: Scream")));
  }, [apiKey]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      {/* Hero sectionni olib tashladim */}

      {/* Premyeralar Section */}
      <section className="content-section">
        <div className="section-header">
          <h2 className="section-title">{t('premieres')}</h2>
          <Link to="/films" className="section-link">{t('viewAll')}</Link>
        </div>
        <PremiereCarousel movies={premieres.slice(0, 8)} onMovieClick={id => navigate(`/details/movie/${id}`)} />
      </section>

      {/* Seriallar Section */}
      <section className="content-section">
        <div className="section-header">
          <h2 className="section-title">{t('series')}</h2>
          <Link to="/series" className="section-link">{t('viewAll')}</Link>
        </div>
        <div className="movies-grid">
          {serials.slice(0, 6).map(tv => (
            <div 
              className="movie-card" 
              key={tv.id}
              onClick={() => navigate(`/details/tv/${tv.id}`)}
            >
              <div className="movie-poster">
                <img
                  src={tv.poster_path ? `https://image.tmdb.org/t/p/w300${tv.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'}
                  alt={tv.name}
                />
                <div className="movie-overlay">
                  <span className="play-icon">▶</span>
                </div>
              </div>
              <div className="movie-info">
                <h3 className="movie-title">{tv.name}</h3>
                <p className="movie-year">{tv.first_air_date?.split('-')[0] || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Multfilmlar Section */}
      <section className="content-section">
        <div className="section-header">
          <h2 className="section-title">{t('cartoons')}</h2>
          <Link to="/cartoons" className="section-link">{t('viewAll')}</Link>
        </div>
        <div className="movies-grid">
          {cartoons.slice(0, 6).map(movie => (
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
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Anime Section */}
      <section className="content-section">
        <div className="section-header">
          <h2 className="section-title">{t('anime')}</h2>
          <Link to="/anime" className="section-link">{t('viewAll')}</Link>
        </div>
        <div className="movies-grid">
          {anime.slice(0, 6).map(movie => (
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
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Movies Section */}
      <section className="content-section">
        <div className="section-header">
          <h2 className="section-title">{t('topMovies')}</h2>
          <Link to="/top-movies" className="section-link">{t('viewAll')}</Link>
        </div>
        <div className="top-movies-carousel">
          {topMovies.slice(0, 8).map((movie, index) => (
            <div
              className="top-movie-card"
              key={movie.id}
              onClick={() => navigate(`/details/movie/${movie.id}`)}
            >
              <div className="rank-badge">{index + 1}</div>
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image'}
                alt={movie.title}
              />
              <div className="top-movie-info">
                <h3 className="top-movie-title">{movie.title}</h3>
                <p className="top-movie-rating">⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage; 