# HiAnime API Service

A fast and lightweight API service for AniDesk that provides anime data by scraping HiAnime.to. Built with Fastify and optimized for both Bun and Node.js runtimes.

## Features

- 🚀 High-performance Fastify server
- 🔄 Web scraping with Cheerio
- 🌐 CORS enabled for cross-origin requests
- ⚡ Optimized for Bun runtime (with Node.js fallback)
- 📡 RESTful API endpoints
- 🛡️ Error handling and graceful shutdown
- 📝 Comprehensive logging

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and timestamp.

### Trending Anime
```
GET /trending
```
Fetches the current trending anime from HiAnime.

### Search Anime
```
GET /search?q={query}&page={page}
```
Searches for anime by keyword with pagination support.

**Parameters:**
- `q` (required): Search query
- `page` (optional): Page number (default: 1)

### Anime Details
```
GET /anime/{id}
```
Fetches detailed information for a specific anime.

**Parameters:**
- `id` (required): Anime ID from HiAnime URL

### Recent Episodes
```
GET /recent-episodes
```
Returns recently updated episodes.

### Genres List
```
GET /genres
```
Fetches all available anime genres.

## Installation

### Prerequisites
- Bun >= 1.0.0 (recommended) OR Node.js >= 18.0.0
- npm/yarn/pnpm/bun package manager

### Setup

1. Install dependencies:
```bash
# Using Bun (recommended)
bun install

# Using npm
npm install

# Using yarn
yarn install
```

2. Environment Configuration:
```bash
# Optional: Create .env file
PORT=3001
HOST=0.0.0.0
```

## Usage

### Development Mode

**With Bun (recommended):**
```bash
bun run dev
```

**With Node.js:**
```bash
npm run node:dev
```

### Production Mode

**With Bun:**
```bash
bun start
```

**With Node.js:**
```bash
npm run node:start
```

### Building for Production
```bash
bun run build
```

## Configuration

The server can be configured using environment variables:

- `PORT`: Server port (default: 3001)
- `HOST`: Server host (default: 0.0.0.0)

## API Response Format

All API endpoints return JSON responses in the following format:

**Success Response:**
```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Example Usage

### JavaScript/TypeScript
```javascript
// Fetch trending anime
const response = await fetch('http://localhost:3001/trending');
const { data } = await response.json();
console.log(data);

// Search anime
const searchResponse = await fetch('http://localhost:3001/search?q=naruto&page=1');
const { data: searchData } = await searchResponse.json();
console.log(searchData.results);
```

### cURL
```bash
# Health check
curl http://localhost:3001/health

# Get trending anime
curl http://localhost:3001/trending

# Search anime
curl "http://localhost:3001/search?q=one%20piece&page=1"

# Get anime details
curl http://localhost:3001/anime/one-piece-100
```

## Workspace Integration

This API service is part of the AniDesk monorepo workspace. To run from the root:

```bash
# From workspace root
npm run api:dev
npm run api:start
```

## Development Notes

- The service uses web scraping, so it depends on HiAnime.to's HTML structure
- Rate limiting is handled gracefully with timeout configurations
- CORS is enabled for all origins in development
- The server includes graceful shutdown handling for SIGINT/SIGTERM

## License

MIT License - see the main repository license for details.

## Contributing

This is part of the AniDesk project. Please refer to the main repository for contribution guidelines.
