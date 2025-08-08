import React from 'react';
import { MainContentProps } from '../types';

export const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <div className="main-content">
      <div className="content-container">
        {children}
      </div>
    </div>
  );
};

// SearchBar Component
export const SearchBar: React.FC<{
  query: string;
  onSearch: (query: string) => void;
}> = ({ query, onSearch }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search anime..."
        value={query}
        onChange={(e) => onSearch(e.target.value)}
        className="search-input"
      />
      <button className="search-button">🔍</button>
    </div>
  );
};

// AnimeGrid Component
export const AnimeGrid: React.FC<{
  animes: any[];
  onAnimeSelect: (anime: any) => void;
}> = ({ animes, onAnimeSelect }) => {
  return (
    <div className="anime-grid">
      {animes.map((anime) => (
        <div
          key={anime.id}
          className="anime-card"
          onClick={() => onAnimeSelect(anime)}
        >
          <img
            src={anime.poster || '/placeholder.jpg'}
            alt={anime.title}
            className="anime-poster"
          />
          <div className="anime-info">
            <h3 className="anime-title">{anime.title}</h3>
            <p className="anime-year">{anime.year}</p>
            <div className="anime-rating">⭐ {anime.rating || 'N/A'}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// VideoPlayer Component
export const VideoPlayer: React.FC<{
  anime: any;
  onBack: () => void;
}> = ({ anime, onBack }) => {
  return (
    <div className="video-player">
      <div className="player-header">
        <button onClick={onBack} className="back-button">
          ← Back
        </button>
        <h2>{anime?.title}</h2>
      </div>
      <div className="player-container">
        <div className="video-placeholder">
          <div className="play-icon">▶</div>
          <p>Video Player Placeholder</p>
          <p>Episode 1: {anime?.title}</p>
        </div>
      </div>
    </div>
  );
};

// EpisodeList Component
export const EpisodeList: React.FC<{
  episodes: any[];
  currentEpisode: number;
  onEpisodeSelect: (episode: any) => void;
}> = ({ episodes, currentEpisode, onEpisodeSelect }) => {
  return (
    <div className="episode-list">
      <h3>Episodes</h3>
      <div className="episodes-container">
        {episodes.length > 0 ? (
          episodes.map((episode, index) => (
            <div
              key={episode.id || index}
              className={`episode-item ${
                currentEpisode === index + 1 ? 'active' : ''
              }`}
              onClick={() => onEpisodeSelect(episode)}
            >
              <div className="episode-number">Episode {index + 1}</div>
              <div className="episode-title">{episode.title || `Episode ${index + 1}`}</div>
            </div>
          ))
        ) : (
          // Placeholder episodes
          Array.from({ length: 12 }, (_, index) => (
            <div
              key={index}
              className={`episode-item ${
                currentEpisode === index + 1 ? 'active' : ''
              }`}
              onClick={() => onEpisodeSelect({ id: index + 1, title: `Episode ${index + 1}` })}
            >
              <div className="episode-number">Episode {index + 1}</div>
              <div className="episode-title">Episode {index + 1}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
