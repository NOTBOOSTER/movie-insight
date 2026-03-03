import type { MovieMeta } from "@/types/movie";

const OMDB_BASE = "https://www.omdbapi.com";

export async function fetchMovieById(imdbId: string): Promise<MovieMeta> {
    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) throw new Error("OMDB_API_KEY is not configured");

    const url = `${OMDB_BASE}/?i=${encodeURIComponent(imdbId)}&apikey=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`OMDb fetch failed: ${res.status}`);

    const data = await res.json();
    if (data.Response === "False") throw new Error(data.Error || "Movie not found");

    return data as MovieMeta;
}

export async function fetchMovieByTitle(title: string): Promise<MovieMeta> {
    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) throw new Error("OMDB_API_KEY is not configured");

    const url = `${OMDB_BASE}/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`OMDb fetch failed: ${res.status}`);

    const data = await res.json();
    if (data.Response === "False") throw new Error(data.Error || `No results found for "${title}"`);

    return data as MovieMeta;
}
