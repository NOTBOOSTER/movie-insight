"use client";

import { motion } from "framer-motion";
import type { MovieMeta } from "@/types/movie";

interface PlotSectionProps {
  meta: MovieMeta;
}

function TrophyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5 10C9.985 10 12 7.985 12 5.5V1.5H3V5.5C3 7.985 5.015 10 7.5 10Z" stroke="#c9a84c" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M5 13.5H10M7.5 10V13.5" stroke="#c9a84c" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M3 3.5H1.5C1.5 3.5 1.5 6.5 4 6.5M12 3.5H13.5C13.5 3.5 13.5 6.5 11 6.5" stroke="#c9a84c" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function CashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="3.5" width="12" height="8" rx="1" stroke="#c9a84c" strokeWidth="1.3" />
      <circle cx="7.5" cy="7.5" r="1.5" stroke="#c9a84c" strokeWidth="1.3" />
      <path d="M4 5.5V9.5M11 5.5V9.5" stroke="#c9a84c" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function PlotSection({ meta }: PlotSectionProps) {
  const hasAwards = meta.Awards && meta.Awards !== "N/A";
  const hasBoxOffice = meta.BoxOffice && meta.BoxOffice !== "N/A";

  return (
    <motion.section
      className="plot-section"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      <p className="section-eyebrow">SYNOPSIS</p>
      <p className="plot-text">{meta.Plot}</p>

      {(hasAwards || hasBoxOffice) && (
        <motion.div
          className="extra-meta-row"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {hasAwards && (
            <div className="extra-meta-item">
              <TrophyIcon />
              <span className="extra-meta-label">AWARDS</span>
              <span className="extra-meta-value">{meta.Awards}</span>
            </div>
          )}
          {hasBoxOffice && (
            <div className="extra-meta-item">
              <CashIcon />
              <span className="extra-meta-label">BOX OFFICE</span>
              <span className="extra-meta-value">{meta.BoxOffice}</span>
            </div>
          )}
        </motion.div>
      )}
    </motion.section>
  );
}
