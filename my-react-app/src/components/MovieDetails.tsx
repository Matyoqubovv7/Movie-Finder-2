import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface MovieDetailsProps {
  apiKey: string;
  omdbApiKey: string;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ apiKey, omdbApiKey }) => {
  const { id, type } = useParams(); // type: 'movie' yoki 'tv'
  const { t } = useTranslation();
  const [item, setItem] = useState<any>(null);
  const [backdrops, setBackdrops] = useState<string[]>([]);
  const [imdbRating, setImdbRating] = useState<string | null>(null);
  const [comments, setComments] = useState<string[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [cast, setCast] = useState<CastMember[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id || !type) return;
      // TMDB tafsilotlari
      const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}`);
      const data = await res.json();
      setItem(data);
      
      // Kadrlar (backdrops)
      const imgRes = await fetch(`https://api.themoviedb.org/3/${type}/${id}/images?api_key=${apiKey}`);
      const imgData = await imgRes.json();
      setBackdrops(imgData.backdrops?.slice(0, 4).map((b: any) => `https://image.tmdb.org/t/p/w500${b.file_path}`) || []);
      
      // Aktyorlar va rejissorlar (credits)
      const creditsRes = await fetch(`https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${apiKey}`);
      const creditsData = await creditsRes.json();
      setCast(creditsData.cast?.slice(0, 10) || []); // Top 10 aktyorlar
      setCrew(creditsData.crew || []);
      
      // IMDb reytingi (faqat movie uchun)
      if (type === 'movie' && data.imdb_id && omdbApiKey !== 'YOUR_OMDB_API_KEY') {
        const omdbRes = await fetch(`https://www.omdbapi.com/?i=${data.imdb_id}&apikey=${omdbApiKey}`);
        const omdbData = await omdbRes.json();
        setImdbRating(omdbData.imdbRating || null);
      } else {
        setImdbRating(null);
      }
    };
    fetchDetails();
    // Kommentlarni localStorage dan yuklash
    const saved = localStorage.getItem(`comments_${type}_${id}`);
    if (saved) setComments(JSON.parse(saved));
  }, [id, type, apiKey, omdbApiKey]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentInput.trim()) {
      const newComments = [...comments, commentInput.trim()];
      setComments(newComments);
      localStorage.setItem(`comments_${type}_${id}`, JSON.stringify(newComments));
      setCommentInput('');
    }
  };

  const handlePersonClick = (name: string) => {
    const searchQuery = encodeURIComponent(name);
    window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
  };

  const getDirectors = () => {
    return crew.filter(member => member.job === 'Director');
  };

  const getWriters = () => {
    return crew.filter(member => member.job === 'Writer' || member.job === 'Screenplay');
  };

  if (!item) return <p>{t('loading')}</p>;

  return (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginTop: 32 }}>
      {/* Chapda rasm */}
      <div style={{ flex: '0 0 300px' }}>
        <img
          src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'}
          alt={item.title || item.name}
          style={{ width: 300, borderRadius: 12 }}
        />
      </div>
      {/* O'ngda tafsilotlar */}
      <div style={{ flex: 1, minWidth: 250 }}>
        <h2>{item.title || item.name}</h2>
        <p><b>{t('year')}:</b> {item.release_date || item.first_air_date}</p>
        <p><b>{t('tmdb_rating')}:</b> {item.vote_average}</p>
        {type === 'movie' && <p><b>{t('imdb_rating')}:</b> {imdbRating ? imdbRating : t('not_available')}</p>}
        <p><b>{t('overview')}:</b> {item.overview}</p>
        <p><b>{t('genres')}:</b> {item.genres?.map((g: any) => g.name).join(', ')}</p>
        {type === 'movie' && <p><b>{t('duration')}:</b> {item.runtime} {t('minutes')}</p>}
        {type === 'tv' && <p><b>{t('number_of_seasons')}:</b> {item.number_of_seasons}, <b>{t('number_of_episodes')}:</b> {item.number_of_episodes}</p>}
      </div>
      
      {/* Aktyorlar va rejissorlar */}
      <div style={{ width: '100%' }}>
        {/* Rejissorlar */}
        {getDirectors().length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3>🎬 {t('directors')}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {getDirectors().map((director, index) => (
                <button
                  key={director.id}
                  onClick={() => handlePersonClick(director.name)}
                  style={{
                    background: '#ff6b6b',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'background 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#ff5252'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#ff6b6b'}
                >
                  <span>🔍</span>
                  {director.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ssenariy mualliflari */}
        {getWriters().length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3>✍️ {t('writers')}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {getWriters().slice(0, 5).map((writer, index) => (
                <button
                  key={writer.id}
                  onClick={() => handlePersonClick(writer.name)}
                  style={{
                    background: '#4ecdc4',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'background 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#45b7aa'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#4ecdc4'}
                >
                  <span>🔍</span>
                  {writer.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Aktyorlar */}
        {cast.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3>🎭 {t('actors')}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {cast.map((actor, index) => (
                <button
                  key={actor.id}
                  onClick={() => handlePersonClick(actor.name)}
                  style={{
                    background: '#ffb400',
                    color: '#181c24',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'background 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#ffa000'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#ffb400'}
                >
                  <span>🔍</span>
                  {actor.name}
                  {actor.character && (
                    <span style={{ fontSize: '12px', opacity: 0.8 }}>
                      ({actor.character})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Kadrlar */}
        <h3>Kadrlar</h3>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 24 }}>
          {backdrops.length === 0 ? <span>Kadrlar yo'q</span> : backdrops.map((src, i) => (
            <div key={i} style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.18)', borderRadius: 10, overflow: 'hidden', background: '#181c24' }}>
              <img src={src} alt="kadr" style={{ width: 220, height: 120, objectFit: 'cover', display: 'block' }} />
            </div>
          ))}
        </div>
        
        {/* Kommentlar */}
        <h3>Kommentlar</h3>
        <form onSubmit={handleCommentSubmit} style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
            placeholder="Komment yozing..."
            style={{ padding: 8, width: 300, borderRadius: 6, border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '8px 18px', borderRadius: 6, background: '#ffb400', color: '#181c24', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Yuborish</button>
        </form>
        <div>
          {comments.length === 0 ? <span>Kommentlar yo'q</span> : comments.map((c, i) => (
            <div key={i} style={{ background: '#232a34', color: '#fff', padding: 10, borderRadius: 6, marginBottom: 8 }}>{c}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails; 