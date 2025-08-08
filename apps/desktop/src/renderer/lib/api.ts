/**
 * HiAnime API Client for Desktop App
 * Provides REST client functionality for interacting with the backend HiAnime API
 */

// Types for API responses
interface AnimeItem {
  id: string;
  title: string;
  image: string;
  releaseDate?: string;
  status?: string;
  type?: string;
  totalEpisodes?: number;
}

interface Episode {
  id: string;
  number: number;
  title?: string;
  url?: string;
  duration?: string;
}

interface SearchResult {
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
  totalResults: number;
  results: AnimeItem[];
}

interface AnimeDetails extends AnimeItem {
  description?: string;
  genres?: string[];
  episodes?: Episode[];
  otherNames?: string[];
}

// API Configuration
const API_BASE_URL = 'http://localhost:3030';

class HiAnimeAPI {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Make HTTP request to API
   */
  private async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * Get trending anime
   */
  async getTrending(page: number = 1): Promise<SearchResult> {
    return this.makeRequest<SearchResult>(`/anime/gogoanime/top-airing?page=${page}`);
  }

  /**
   * Search for anime
   */
  async search(query: string, page: number = 1): Promise<SearchResult> {
    const encodedQuery = encodeURIComponent(query);
    return this.makeRequest<SearchResult>(`/anime/gogoanime/${encodedQuery}?page=${page}`);
  }

  /**
   * Get anime details and episodes
   */
  async getAnimeDetails(animeId: string): Promise<AnimeDetails> {
    return this.makeRequest<AnimeDetails>(`/anime/gogoanime/info/${animeId}`);
  }

  /**
   * Get episode streaming links
   */
  async getEpisodeLinks(episodeId: string): Promise<any> {
    return this.makeRequest(`/anime/gogoanime/watch/${episodeId}`);
  }

  /**
   * Get recent episodes
   */
  async getRecentEpisodes(page: number = 1): Promise<SearchResult> {
    return this.makeRequest<SearchResult>(`/anime/gogoanime/recent-episodes?page=${page}`);
  }

  /**
   * Get popular anime
   */
  async getPopular(page: number = 1): Promise<SearchResult> {
    return this.makeRequest<SearchResult>(`/anime/gogoanime/popular?page=${page}`);
  }

  /**
   * Health check for API
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      if (response.ok) {
        return { status: 'healthy', timestamp: new Date().toISOString() };
      }
      throw new Error('API unhealthy');
    } catch (error) {
      return { status: 'unhealthy', timestamp: new Date().toISOString() };
    }
  }
}

// Export singleton instance
export const apiClient = new HiAnimeAPI();

// Export types for use in components
export type {
  AnimeItem,
  Episode,
  SearchResult,
  AnimeDetails
};

// Export class for custom instances if needed
export { HiAnimeAPI };
