# AI Movie Insight Builder

Enter an IMDb ID or search by title to get movie details and an AI-generated sentiment analysis.

## Features

- Search by IMDb ID or movie title with live suggestions
- Pulls metadata from OMDB: poster, cast, rating, genre, runtime
- Displays ratings from IMDb, Rotten Tomatoes, and Metacritic as progress bars
- Sends audience reviews to Groq AI and returns a sentiment classification (Positive, Mixed, Negative) with a short editorial summary
- Falls back to plot synopsis when no reviews are available
- Works for both movies and TV series

## Getting Started

```bash
git clone https://github.com/NOTBOOSTER/movie-insight.git
cd movie-insight
npm install
cp example.env .env.local
# fill in the three API keys in .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

```
OMDB_API_KEY=your_omdb_key
TMDB_API_KEY=your_tmdb_key
GROQ_API_KEY=your_groq_key
```

Get keys from:
- OMDB: https://www.omdbapi.com/apikey.aspx
- TMDB: https://www.themoviedb.org/settings/api
- Groq: https://console.groq.com

## How It Works

The app fetches movie metadata from OMDB using the IMDb ID, then queries TMDB for user reviews. Those reviews are sent to a Groq language model via LangChain with a structured output prompt, which returns a JSON object with a sentiment label and a 2-3 sentence critical summary. If no reviews exist on TMDB, the OMDB plot description is used as the input instead.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- LangChain + Groq
- OMDB API, TMDB API
