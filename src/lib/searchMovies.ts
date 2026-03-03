import type { MovieSuggestion } from "@/types/movie";

const OMDB_BASE = "https://www.omdbapi.com";

interface OmdbSearchItem {
    imdbID: string;
    Title: string;
    Year: string;
    Poster: string;
    Type: string;
}

interface OmdbSearchResponse {
    Search: OmdbSearchItem[];
    Response: string;
    Error?: string;
}

export async function searchMovies(query: string): Promise<MovieSuggestion[]> {
    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) throw new Error("OMDB_API_KEY is not configured");

    const url = `${OMDB_BASE}/?s=${encodeURIComponent(query)}&apikey=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];

    const data: OmdbSearchResponse = await res.json();
    if (data.Response === "False" || !data.Search) return [];

    return data.Search.slice(0, 6).map((item) => ({
        imdbID: item.imdbID,
        Title: item.Title,
        Year: item.Year,
        Poster: item.Poster,
        Type: item.Type,
    }));
}
