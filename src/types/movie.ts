export type Sentiment = "Positive" | "Mixed" | "Negative";

export interface OmdbRating {
  Source: string;
  Value: string;
}

export interface MovieMeta {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Actors: string;
  Plot: string;
  Poster: string;
  imdbRating: string;
  Language: string;
  Country: string;
  Ratings: OmdbRating[];
  Awards: string;
  BoxOffice: string;
  Type: string;
}

export interface MovieSuggestion {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

export interface Review {
  author: string;
  content: string;
  rating: number | null;
}

export interface AIInsight {
  summary: string;
  sentiment: Sentiment;
}

export interface MovieResult {
  meta: MovieMeta;
  insight: AIInsight;
}

export interface ApiSuccessResponse {
  success: true;
  data: MovieResult;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

export interface SuggestionsSuccessResponse {
  success: true;
  results: MovieSuggestion[];
}

export interface SuggestionsErrorResponse {
  success: false;
  error: string;
}

export type SuggestionsResponse = SuggestionsSuccessResponse | SuggestionsErrorResponse;
