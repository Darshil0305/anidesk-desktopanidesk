// TypeScript interfaces for React UI components

export interface Anime {
  id: string;
  title: string;
  poster?: string;
  year: number;
  rating?: number;
  description?: string;
  episodes: Episode[];
  genre: string[];
  status: 'ongoing' | 'completed' | 'upcoming';
}

export interface Episode {
  id: string;
  title: string;
  episode_number: number;
  duration?: number;
  thumbnail?: string;
  url?: string;
}

export interface SidebarProps {
  activeView: 'home' | 'trending' | 'search';
  onViewChange: (view: 'home' | 'trending' | 'search') => void;
}

export interface MainContentProps {
  children: React.ReactNode;
}

export interface AnimeGridProps {
  animes: Anime[];
  onAnimeSelect: (anime: Anime) => void;
}

export interface VideoPlayerProps {
  anime: Anime;
  currentEpisode?: Episode;
  onBack: () => void;
}

export interface EpisodeListProps {
  episodes: Episode[];
  currentEpisode: number;
  onEpisodeSelect: (episode: Episode) => void;
}

export interface SearchBarProps {
  query: string;
  onSearch: (query: string) => void;
}

// API Response types
export interface AnimeSearchResponse {
  results: Anime[];
  totalResults: number;
  currentPage: number;
  hasNextPage: boolean;
}

export interface StreamingInfo {
  url: string;
  quality: string;
  server: string;
}

// Application State
export interface AppState {
  currentView: 'home' | 'trending' | 'search';
  selectedAnime: Anime | null;
  searchQuery: string;
  isPlaying: boolean;
  currentEpisode: Episode | null;
}
