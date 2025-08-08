import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { VideoPlayer } from './components/VideoPlayer';
import { EpisodeList } from './components/EpisodeList';
import { SearchBar } from './components/SearchBar';
import { AnimeGrid } from './components/AnimeGrid';
import { sampleAnime } from './data/sampleData';
import './App.css';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'home' | 'trending' | 'search'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnime, setSelectedAnime] = useState<any>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <div className="app">
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView}
      />
      
      <div className="main-area">
        <SearchBar 
          query={searchQuery}
          onSearch={setSearchQuery}
        />
        
        {!showPlayer ? (
          <MainContent>
            <AnimeGrid 
              animes={sampleAnime}
              onAnimeSelect={(anime) => {
                setSelectedAnime(anime);
                setShowPlayer(true);
              }}
            />
          </MainContent>
        ) : (
          <div className="player-area">
            <VideoPlayer 
              anime={selectedAnime}
              onBack={() => setShowPlayer(false)}
            />
            <EpisodeList 
              episodes={selectedAnime?.episodes || []}
              currentEpisode={1}
              onEpisodeSelect={(episode) => console.log('Episode selected:', episode)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
