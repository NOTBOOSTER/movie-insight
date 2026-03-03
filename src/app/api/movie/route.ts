import { NextRequest, NextResponse } from "next/server";
import { fetchMovieById, fetchMovieByTitle } from "@/lib/fetchMovie";
import { fetchReviews } from "@/lib/fetchReviews";
import { analyzeSentiment } from "@/lib/sentimentChain";
import type { ApiResponse, Review } from "@/types/movie";

const IMDB_ID_PATTERN = /^tt\d{7,8}$/;

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse>> {
    const { searchParams } = new URL(req.url);
    const imdbId = searchParams.get("id");
    const title = searchParams.get("title");

    if (!imdbId && !title) {
        return NextResponse.json({ success: false, error: "IMDb ID or title is required" }, { status: 400 });
    }

    if (imdbId && !IMDB_ID_PATTERN.test(imdbId)) {
        return NextResponse.json(
            { success: false, error: "Invalid IMDb ID format. Expected: tt1234567" },
            { status: 400 }
        );
    }

    if (!process.env.OMDB_API_KEY || !process.env.TMDB_API_KEY || !process.env.GROQ_API_KEY) {
        return NextResponse.json({ success: false, error: "Server configuration error: missing API keys" }, { status: 500 });
    }

    try {
        const meta = imdbId
            ? await fetchMovieById(imdbId)
            : await fetchMovieByTitle(title!);

        let reviews: Review[] = [];
        try {
            reviews = await fetchReviews(meta.imdbID);
        } catch {
            reviews = [];
        }

        if (reviews.length === 0) {
            reviews = [
                {
                    author: "Editorial Synopsis",
                    content: `${meta.Title} (${meta.Year}) — ${meta.Genre}. IMDb Rating: ${meta.imdbRating}. Plot: ${meta.Plot}`,
                    rating: null,
                },
            ];
        }

        const insight = await analyzeSentiment(reviews);

        return NextResponse.json({ success: true, data: { meta, insight } });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred";

        if (message.toLowerCase().includes("not found") || message.toLowerCase().includes("no results")) {
            return NextResponse.json({ success: false, error: message }, { status: 404 });
        }

        if (message.includes("API_KEY") || message.includes("configured")) {
            return NextResponse.json({ success: false, error: message }, { status: 500 });
        }

        return NextResponse.json({ success: false, error: message }, { status: 502 });
    }
}
