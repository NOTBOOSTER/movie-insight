"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { MovieMeta, OmdbRating } from "@/types/movie";

interface MovieHeroProps {
  meta: MovieMeta;
}

function parseRatingPercent(rating: OmdbRating): number {
  const v = rating.Value;
  if (v.includes("/10")) return (parseFloat(v) / 10) * 100;
  if (v.includes("%")) return parseFloat(v);
  if (v.includes("/100")) return parseFloat(v);
  return 0;
}

const ratingConfig: Record<string, { label: string; color: string }> = {
  "Internet Movie Database": { label: "IMDb", color: "#c9a84c" },
  "Rotten Tomatoes": { label: "Rotten Tomatoes", color: "#e84c4c" },
  "Metacritic": { label: "Metacritic", color: "#4cad4c" },
};

function RatingsRow({ ratings }: { ratings: OmdbRating[] }) {
  const known = ratings.filter((r) => ratingConfig[r.Source]);
  if (!known.length) return null;

  return (
    <div className="ratings-row">
      {known.map((r) => {
        const cfg = ratingConfig[r.Source];
        const pct = parseRatingPercent(r);
        return (
          <div key={r.Source} className="rating-item">
            <div className="rating-top">
              <span className="rating-label" style={{ color: cfg.color }}>{cfg.label}</span>
              <span className="rating-value">{r.Value}</span>
            </div>
            <div className="rating-bar-track">
              <motion.div
                className="rating-bar-fill"
                style={{ background: cfg.color }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function MovieHero({ meta }: MovieHeroProps) {
  const hasPoster = meta.Poster && meta.Poster !== "N/A";
  const isSeries = meta.Type === "series";
  const showDirector = meta.Director && meta.Director !== "N/A";
  const directorValue = isSeries && meta.Director === "N/A" ? "Multiple Directors" : meta.Director;

  return (
    <motion.div className="hero-layout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <motion.div
        className="hero-poster"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {hasPoster ? (
          <Image src={meta.Poster} alt={meta.Title} width={400} height={580} className="poster-img" priority />
        ) : (
          <div className="poster-placeholder"><span>NO POSTER</span></div>
        )}
      </motion.div>

      <motion.div
        className="hero-info"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
      >
        <motion.p className="meta-chip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          {meta.Rated !== "N/A" ? meta.Rated : "UNRATED"} &nbsp;·&nbsp; {meta.Country}
          {isSeries && <>&nbsp;·&nbsp; SERIES</>}
        </motion.p>

        <motion.h1 className="movie-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }}>
          {meta.Title}
        </motion.h1>

        <motion.div className="meta-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
          <span className="meta-item">{meta.Year}</span>
          <span className="meta-divider" />
          <span className="meta-item">{meta.Runtime}</span>
          {meta.imdbRating !== "N/A" && (
            <>
              <span className="meta-divider" />
              <span className="meta-item imdb-badge">★ {meta.imdbRating}</span>
            </>
          )}
        </motion.div>

        {meta.Ratings && meta.Ratings.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <RatingsRow ratings={meta.Ratings} />
          </motion.div>
        )}

        <motion.div className="genre-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
          {meta.Genre.split(", ").map((g) => (
            <span key={g} className="genre-tag">{g}</span>
          ))}
        </motion.div>

        <motion.div className="crew-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          {(showDirector || isSeries) && (
            <div className="crew-item">
              <span className="crew-label">DIRECTOR</span>
              <span className="crew-value">{directorValue}</span>
            </div>
          )}
          <div className="crew-item">
            <span className="crew-label">CAST</span>
            <span className="crew-value">{meta.Actors}</span>
          </div>
          <div className="crew-item">
            <span className="crew-label">LANGUAGE</span>
            <span className="crew-value">{meta.Language}</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
