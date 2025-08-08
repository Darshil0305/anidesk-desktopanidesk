import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { VideoPlayer } from './components/VideoPlayer';
import { EpisodeList } from './components/EpisodeList';
import { SearchBar } from './components/SearchBar';
import { AnimeGrid } from './components/AnimeGrid';
import { apiClient, AnimeItem, SearchResult, AnimeDetails } from './lib/api';
import { sampleAnime } from './data/sampleData';
import './App.css';

type ViewType = 'home' | 'trending' | 'search' | 'popular' | 'recent';

interface AppState {
  trending: AnimeItem[];
  searchResults: AnimeItem[];
  popular: AnimeItem[];
  recent: AnimeItem[];
  loading: boolean;
  error: string | null;
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnime, setSelectedAnime] = useState<AnimeDetails | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'healthy' | 'unhealthy'>('checking');
  
  // App state for live data
  const [state, setState] = useState<AppState>({
    trending: [],
    searchResults: [],
    popular: [],
    recent: [],
    loading: false,
    error: null
  });

  // Check API health on mount
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const health = await apiClient.healthCheck();
        setApiStatus(health.status === 'healthy' ? 'healthy' : 'unhealthy');
      } catch (error) {
        setApiStatus('unhealthy');
        console.error('API health check failed:', error);
      }
    };
    
    checkApiHealth();
  }, []);

  // Load trending anime on mount and when trending view is active
  useEffect(() => {
    if (apiStatus === 'healthy' && (activeView === 'trending' || activeView === 'home')) {
      loadTrending();
    }
  }, [activeView, apiStatus]);

  // Load popular anime when popular view is active
  useEffect(() => {
    if (apiStatus === 'healthy' && activeView === 'popular') {
      loadPopular();
    }
  }, [activeView, apiStatus]);

  // Load recent episodes when recent view is active
  useEffect(() => {
    if (apiStatus === 'healthy' && activeView === 'recent') {
      loadRecent();
    }
  }, [activeView, apiStatus]);

  // Search when query changes
  useEffect(() => {
    if (apiStatus === 'healthy' && searchQuery.trim() && activeView === 'search') {
      searchAnime(searchQuery);
    }
  }, [searchQuery, activeView, apiStatus]);

  const loadTrending = async () => {
    if (state.trending.length > 0) return; // Avoid unnecessary calls
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await apiClient.getTrending();
      setState(prev => ({ 
        ...prev, 
        trending: result.results,
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to load trending anime',
        loading: false 
      }));
      console.error('Failed to load trending:', error);
    }
  };

  const loadPopular = async () => {
    if (state.popular.length > 0) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await apiClient.getPopular();
      setState(prev => ({ 
        ...prev, 
        popular: result.results,
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to load popular anime',
        loading: false 
      }));
      console.error('Failed to load popular:', error);
    }
  };

  const loadRecent = async () => {
    if (state.recent.length > 0) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await apiClient.getRecentEpisodes();
      setState(prev => ({ 
        ...prev, 
        recent: result.results,
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to load recent episodes',
        loading: false 
      }));
      console.error('Failed to load recent:', error);
    }
  };

  const searchAnime = async (query: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await apiClient.search(query);
      setState(prev => ({ 
        ...prev, 
        searchResults: result.results,
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Search failed',
        loading: false 
      }));
      console.error('Search failed:', error);
    }
  };

  const handleAnimeSelect = async (anime: AnimeItem) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const details = await apiClient.getAnimeDetails(anime.id);
      setSelectedAnime(details);
      setShowPlayer(true);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to load anime details',
        loading: false 
      }));
      console.error('Failed to load anime details:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setActiveView('search');
    }
  };

  // Get current anime list based on active view
  const getCurrentAnimeList = (): AnimeItem[] => {
    if (apiStatus !== 'healthy') {
      return sampleAnime; // Fallback to sample data
    }
    
    switch (activeView) {
      case 'trending':
        return state.trending;
      case 'search':
        return state.searchResults;
      case 'popular':
        return state.popular;
      case 'recent':
        return state.recent;
      case 'home':
        return state.trending.length > 0 ? state.trending : sampleAnime;
      default:
        return sampleAnime;
    }
  };

  const getStatusMessage = () => {
    if (apiStatus === 'checking') return 'Connecting to API...';
    if (apiStatus === 'unhealthy') return 'API unavailable - using sample data';
    if (state.loading) return 'Loading...';
    if (state.error) return state.error;
    return null;
  };

  return (
    <div className="app">
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView}
        apiStatus={apiStatus}
      />
      
      <div className="main-area">
        <SearchBar 
          query={searchQuery}
          onSearch={handleSearch}
        />
        
        {/* Status message */}
        {getStatusMessage() && (
          <div className="status-message">
            {getStatusMessage()}
          </div>
        )}
        
        {!showPlayer ? (
          <MainContent>
            <AnimeGrid 
              animes={getCurrentAnimeList()}
              onAnimeSelect={handleAnimeSelect}
              loading={state.loading}
              currentView={activeView}
            />
          </MainContent>
        ) : (
          <div className="player-area">
            <VideoPlayer 
              anime={selectedAnime}
              onBack={() => {
                setShowPlayer(false);
                setSelectedAnime(null);
              }}
            />
            <EpisodeList 
              episodes={selectedAnime?.episodes || []}
              currentEpisode={1}
              onEpisodeSelect={(episode) => {
                console.log('Episode selected:', episode);
                // TODO: Load episode streaming links
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
