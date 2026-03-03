"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SearchBar } from "@/components/SearchBar";
import { MovieHero } from "@/components/MovieHero";
import { PlotSection } from "@/components/PlotSection";
import { AISummaryCard } from "@/components/AISummaryCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import type { MovieResult, ApiResponse } from "@/types/movie";

type SearchMode = "id" | "title";

export default function Home() {
  const [result, setResult] = useState<MovieResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string, mode: SearchMode) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setLastQuery(query);

    try {
      const param = mode === "id" ? `id=${encodeURIComponent(query)}` : `title=${encodeURIComponent(query)}`;
      const res = await fetch(`/api/movie?${param}`);
      const data: ApiResponse = await res.json();

      if (!data.success) {
        setError(data.error);
      } else {
        setResult(data.data);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-root">
      <div className="grain-overlay" />

      <section className="hero-section">
        <motion.div
          className="brand-lockup"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="brand-eyebrow">AI POWERED</p>
          <h1 className="brand-title">
            Movie<span className="brand-accent">Insight</span>
          </h1>
          <p className="brand-tagline">Cinematic intelligence. Distilled.</p>
        </motion.div>

        <SearchBar onSearch={handleSearch} isLoading={loading} />

        <AnimatePresence>
          {error && (
            <motion.p
              className="error-inline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              No results found for &ldquo;<em>{lastQuery}</em>&rdquo; — try a different title or IMDb ID.
            </motion.p>
          )}
        </AnimatePresence>
      </section>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="results-section">
            <LoadingSkeleton />
          </motion.div>
        )}

        {result && !loading && (
          <motion.div key="results" className="results-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <MovieHero meta={result.meta} />
            <PlotSection meta={result.meta} />
            <AISummaryCard insight={result.insight} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
