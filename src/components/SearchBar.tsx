"use client";

import { useState, useRef, useCallback, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MovieSuggestion, SuggestionsResponse } from "@/types/movie";

type SearchMode = "id" | "title";

interface SearchBarProps {
  onSearch: (query: string, mode: SearchMode) => void;
  isLoading: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [mode, setMode] = useState<SearchMode>("id");
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<MovieSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setSuggestions([]); return; }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data: SuggestionsResponse = await res.json();
      setSuggestions(data.success ? data.results : []);
    } catch {
      setSuggestions([]);
    }
  }, []);

  const handleChange = (v: string) => {
    setValue(v);
    if (mode === "title") {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchSuggestions(v), 350);
      setShowDropdown(true);
    }
  };

  const handleSearch = (overrideValue?: string, overrideMode?: SearchMode) => {
    const q = (overrideValue ?? value).trim();
    const m = overrideMode ?? mode;
    if (q) { onSearch(q, m); setShowDropdown(false); }
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") setShowDropdown(false);
  };

  const switchMode = (m: SearchMode) => {
    setMode(m);
    setValue("");
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  return (
    <motion.div
      className="search-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="search-mode-tabs">
        <button
          className={`mode-tab ${mode === "id" ? "active" : ""}`}
          onClick={() => switchMode("id")}
        >
          IMDb ID
        </button>
        <button
          className={`mode-tab ${mode === "title" ? "active" : ""}`}
          onClick={() => switchMode("title")}
        >
          Movie Title
        </button>
      </div>

      <motion.p className="search-label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        {mode === "id" ? "ENTER IMDB ID" : "SEARCH BY TITLE"}
      </motion.p>

      <div className="search-input-outer" style={{ position: "relative" }}>
        <div className={`search-input-wrap ${focused ? "focused" : ""}`}>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKey}
            onFocus={() => { setFocused(true); if (mode === "title" && suggestions.length > 0) setShowDropdown(true); }}
            onBlur={() => { setFocused(false); setTimeout(() => setShowDropdown(false), 150); }}
            placeholder={mode === "id" ? "tt0133093" : "The Matrix, Inception…"}
            className="search-input"
            disabled={isLoading}
          />
          <motion.button
            onClick={() => handleSearch()}
            disabled={isLoading || !value.trim()}
            className="search-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isLoading ? <span className="btn-spinner" /> : "ANALYZE"}
          </motion.button>
        </div>

        <AnimatePresence>
          {showDropdown && suggestions.length > 0 && (
            <motion.ul
              className="suggestions-dropdown"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {suggestions.map((s) => (
                <li
                  key={s.imdbID}
                  className="suggestion-item"
                  onMouseDown={() => { setValue(s.Title); handleSearch(s.imdbID, "id"); }}
                >
                  <span className="suggestion-title">{s.Title}</span>
                  <span className="suggestion-meta">{s.Year} · {s.Type}</span>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
