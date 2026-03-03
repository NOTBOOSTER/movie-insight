import { NextRequest, NextResponse } from "next/server";
import { searchMovies } from "@/lib/searchMovies";
import type { SuggestionsResponse } from "@/types/movie";

export async function GET(req: NextRequest): Promise<NextResponse<SuggestionsResponse>> {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
        return NextResponse.json({ success: false, error: "Query too short" }, { status: 400 });
    }

    if (!process.env.OMDB_API_KEY) {
        return NextResponse.json({ success: false, error: "OMDB_API_KEY is not configured" }, { status: 500 });
    }

    try {
        const results = await searchMovies(query.trim());
        return NextResponse.json({ success: true, results });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Search failed";
        return NextResponse.json({ success: false, error: message }, { status: 502 });
    }
}
