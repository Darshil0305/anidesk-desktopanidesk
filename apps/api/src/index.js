import fastify from 'fastify';
import cors from '@fastify/cors';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Initialize Fastify instance
const server = fastify({
  logger: true
});

// Register CORS plugin
server.register(cors, {
  origin: true
});

// HiAnime API Configuration
const HIANIME_BASE_URL = 'https://hianime.to';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

// Helper function to make requests to HiAnime
const makeRequest = async (url, options = {}) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Referer': HIANIME_BASE_URL,
        ...options.headers
      },
      timeout: 10000,
      ...options
    });
    return response.data;
  } catch (error) {
    server.log.error(`Request failed: ${error.message}`);
    throw error;
  }
};

// Helper function to extract anime data from HTML
const extractAnimeData = ($, element) => {
  const $elem = $(element);
  return {
    id: $elem.find('a').attr('href')?.split('/')[2] || '',
    title: $elem.find('.film-name a').attr('title') || $elem.find('a').attr('title') || '',
    poster: $elem.find('.film-poster-img').attr('data-src') || $elem.find('img').attr('src') || '',
    type: $elem.find('.fdi-type').text().trim() || '',
    episodes: $elem.find('.fdi-episode').text().trim() || '',
    duration: $elem.find('.fdi-duration').text().trim() || '',
    rating: $elem.find('.film-rating').text().trim() || '',
    year: $elem.find('.fdi-year').text().trim() || ''
  };
};

// Routes

// Health check endpoint
server.get('/health', async (request, reply) => {
  return { status: 'OK', service: 'HiAnime API', timestamp: new Date().toISOString() };
});

// Get trending anime
server.get('/trending', async (request, reply) => {
  try {
    const html = await makeRequest(`${HIANIME_BASE_URL}/home`);
    const $ = cheerio.load(html);
    const trending = [];
    
    $('.film_list-wrap .flw-item').each((i, element) => {
      if (i < 12) { // Limit to first 12 trending anime
        trending.push(extractAnimeData($, element));
      }
    });
    
    return { success: true, data: trending };
  } catch (error) {
    reply.code(500);
    return { success: false, error: 'Failed to fetch trending anime' };
  }
});

// Search anime
server.get('/search', async (request, reply) => {
  const { q: query, page = 1 } = request.query;
  
  if (!query) {
    reply.code(400);
    return { success: false, error: 'Query parameter is required' };
  }
  
  try {
    const searchUrl = `${HIANIME_BASE_URL}/search?keyword=${encodeURIComponent(query)}&page=${page}`;
    const html = await makeRequest(searchUrl);
    const $ = cheerio.load(html);
    const results = [];
    
    $('.film_list-wrap .flw-item').each((i, element) => {
      results.push(extractAnimeData($, element));
    });
    
    // Extract pagination info
    const totalPages = parseInt($('.pagination .page-link').last().prev().text()) || 1;
    
    return {
      success: true,
      data: {
        results,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          hasNext: parseInt(page) < totalPages
        }
      }
    };
  } catch (error) {
    reply.code(500);
    return { success: false, error: 'Failed to search anime' };
  }
});

// Get anime details
server.get('/anime/:id', async (request, reply) => {
  const { id } = request.params;
  
  try {
    const html = await makeRequest(`${HIANIME_BASE_URL}/${id}`);
    const $ = cheerio.load(html);
    
    const animeDetails = {
      id,
      title: $('.film-name').text().trim(),
      poster: $('.film-poster-img').attr('src') || $('.film-poster-img').attr('data-src'),
      description: $('.film-description').text().trim(),
      type: $('.item:contains("Type:") .name').text().trim(),
      status: $('.item:contains("Status:") .name').text().trim(),
      releaseDate: $('.item:contains("Released:") .name').text().trim(),
      genres: [],
      episodes: $('.item:contains("Episodes:") .name').text().trim(),
      duration: $('.item:contains("Duration:") .name').text().trim(),
      rating: $('.film-rating').text().trim()
    };
    
    // Extract genres
    $('.item:contains("Genres:") .name a').each((i, element) => {
      animeDetails.genres.push($(element).text().trim());
    });
    
    return { success: true, data: animeDetails };
  } catch (error) {
    reply.code(500);
    return { success: false, error: 'Failed to fetch anime details' };
  }
});

// Get recent episodes
server.get('/recent-episodes', async (request, reply) => {
  try {
    const html = await makeRequest(`${HIANIME_BASE_URL}/home`);
    const $ = cheerio.load(html);
    const recentEpisodes = [];
    
    $('.film_list-wrap .flw-item').each((i, element) => {
      if (i < 20) { // Limit to first 20 recent episodes
        recentEpisodes.push(extractAnimeData($, element));
      }
    });
    
    return { success: true, data: recentEpisodes };
  } catch (error) {
    reply.code(500);
    return { success: false, error: 'Failed to fetch recent episodes' };
  }
});

// Get genres list
server.get('/genres', async (request, reply) => {
  try {
    const html = await makeRequest(`${HIANIME_BASE_URL}/genre`);
    const $ = cheerio.load(html);
    const genres = [];
    
    $('.genre-list a').each((i, element) => {
      const $elem = $(element);
      genres.push({
        id: $elem.attr('href')?.split('/').pop(),
        name: $elem.text().trim(),
        url: $elem.attr('href')
      });
    });
    
    return { success: true, data: genres };
  } catch (error) {
    reply.code(500);
    return { success: false, error: 'Failed to fetch genres' };
  }
});

// Error handler
server.setErrorHandler((error, request, reply) => {
  server.log.error(error);
  reply.code(500).send({
    success: false,
    error: 'Internal server error'
  });
});

// Server configuration
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Start server
const start = async () => {
  try {
    await server.listen({ port: PORT, host: HOST });
    console.log(`🚀 HiAnime API Server running on http://${HOST}:${PORT}`);
    console.log(`📖 Health check: http://${HOST}:${PORT}/health`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Gracefully shutting down server...');
  await server.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Gracefully shutting down server...');
  await server.close();
  process.exit(0);
});

start();

export default server;
