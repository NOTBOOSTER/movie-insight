import type { Review } from "@/types/movie";

const TMDB_BASE = "https://api.themoviedb.org/3";

interface TmdbFindResult {
    movie_results: { id: number }[];
    tv_results: { id: number }[];
}

interface TmdbReview {
    author: string;
    content: string;
    author_details: { rating: number | null };
}

interface TmdbReviewsResponse {
    results: TmdbReview[];
}

export async function fetchReviews(imdbId: string): Promise<Review[]> {
    const apiKey = process.env.TMDB_API_KEY;

    if (!apiKey) {
        throw new Error("TMDB_API_KEY is not configured");
    }

    const findUrl = `${TMDB_BASE}/find/${encodeURIComponent(imdbId)}?api_key=${apiKey}&external_source=imdb_id`;
    const findRes = await fetch(findUrl, { next: { revalidate: 3600 } });

    if (!findRes.ok) {
        throw new Error(`TMDB find failed: ${findRes.status}`);
    }

    const findData: TmdbFindResult = await findRes.json();

    let mediaType: "movie" | "tv" | null = null;
    let tmdbId: number | null = null;

    if (findData.movie_results && findData.movie_results.length > 0) {
        mediaType = "movie";
        tmdbId = findData.movie_results[0].id;
    } else if (findData.tv_results && findData.tv_results.length > 0) {
        mediaType = "tv";
        tmdbId = findData.tv_results[0].id;
    }

    if (!mediaType || !tmdbId) {
        return [];
    }

    const reviewsUrl = `${TMDB_BASE}/${mediaType}/${tmdbId}/reviews?api_key=${apiKey}`;
    const reviewsRes = await fetch(reviewsUrl, { next: { revalidate: 3600 } });

    if (!reviewsRes.ok) {
        throw new Error(`TMDB reviews fetch failed: ${reviewsRes.status}`);
    }

    const reviewsData: TmdbReviewsResponse = await reviewsRes.json();

    return reviewsData.results.slice(0, 10).map((r) => ({
        author: r.author,
        content: r.content.slice(0, 800),
        rating: r.author_details?.rating ?? null,
    }));
}
