import { Anime, Episode } from '../types';

// Sample episode data
const createEpisodes = (count: number, animeTitle: string): Episode[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `ep-${index + 1}`,
    title: `${animeTitle} Episode ${index + 1}`,
    episode_number: index + 1,
    duration: 24 * 60, // 24 minutes in seconds
    thumbnail: `/thumbnails/ep-${index + 1}.jpg`,
    url: `/episodes/${animeTitle.toLowerCase().replace(/\s+/g, '-')}-episode-${index + 1}`
  }));
};

// Sample anime data
export const sampleAnime: Anime[] = [
  {
    id: 'anime-1',
    title: 'Attack on Titan',
    poster: '/posters/aot.jpg',
    year: 2013,
    rating: 9.0,
    description: 'Humanity fights for survival against giant humanoid Titans.',
    episodes: createEpisodes(25, 'Attack on Titan'),
    genre: ['Action', 'Drama', 'Fantasy'],
    status: 'completed'
  },
  {
    id: 'anime-2',
    title: 'Demon Slayer',
    poster: '/posters/demon-slayer.jpg',
    year: 2019,
    rating: 8.7,
    description: 'A young man becomes a demon slayer to save his sister.',
    episodes: createEpisodes(26, 'Demon Slayer'),
    genre: ['Action', 'Supernatural', 'Shounen'],
    status: 'ongoing'
  },
  {
    id: 'anime-3',
    title: 'Your Name',
    poster: '/posters/your-name.jpg',
    year: 2016,
    rating: 8.4,
    description: 'Two teenagers share a profound, magical connection.',
    episodes: [{
      id: 'movie-1',
      title: 'Your Name (Movie)',
      episode_number: 1,
      duration: 106 * 60, // 106 minutes
      thumbnail: '/thumbnails/your-name.jpg',
      url: '/movies/your-name'
    }],
    genre: ['Romance', 'Drama', 'Movie'],
    status: 'completed'
  },
  {
    id: 'anime-4',
    title: 'One Piece',
    poster: '/posters/one-piece.jpg',
    year: 1999,
    rating: 9.1,
    description: 'A pirate crew searches for the ultimate treasure.',
    episodes: createEpisodes(1000, 'One Piece'),
    genre: ['Adventure', 'Comedy', 'Shounen'],
    status: 'ongoing'
  },
  {
    id: 'anime-5',
    title: 'Spirited Away',
    poster: '/posters/spirited-away.jpg',
    year: 2001,
    rating: 9.3,
    description: 'A girl enters a world ruled by gods and witches.',
    episodes: [{
      id: 'movie-2',
      title: 'Spirited Away (Movie)',
      episode_number: 1,
      duration: 125 * 60, // 125 minutes
      thumbnail: '/thumbnails/spirited-away.jpg',
      url: '/movies/spirited-away'
    }],
    genre: ['Adventure', 'Family', 'Movie'],
    status: 'completed'
  },
  {
    id: 'anime-6',
    title: 'Naruto',
    poster: '/posters/naruto.jpg',
    year: 2002,
    rating: 8.3,
    description: 'A young ninja seeks recognition and dreams of becoming Hokage.',
    episodes: createEpisodes(720, 'Naruto'),
    genre: ['Action', 'Adventure', 'Shounen'],
    status: 'completed'
  }
];

// Trending anime (subset of sample data)
export const trendingAnime = sampleAnime.slice(0, 4);

// Recently added anime
export const recentAnime = sampleAnime.slice(1, 5);

// Featured anime for homepage
export const featuredAnime = sampleAnime[0];
