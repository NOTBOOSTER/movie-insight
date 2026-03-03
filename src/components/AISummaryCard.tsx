"use client";

import { motion } from "framer-motion";
import type { AIInsight } from "@/types/movie";

interface AISummaryCardProps {
  insight: AIInsight;
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1.5L3 8H7L6 12.5L11 6H7L8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const sentimentConfig: Record<AIInsight["sentiment"], { cls: string; Icon: () => React.ReactElement }> = {
  Positive: { cls: "sentiment-positive", Icon: CheckIcon },
  Mixed: { cls: "sentiment-mixed", Icon: BoltIcon },
  Negative: { cls: "sentiment-negative", Icon: XIcon },
};

export function AISummaryCard({ insight }: AISummaryCardProps) {
  const { cls, Icon } = sentimentConfig[insight.sentiment];

  return (
    <motion.div
      className="ai-card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.35 }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
    >
      <div className="ai-card-header">
        <p className="section-eyebrow" style={{ marginBottom: 0 }}>AI INSIGHT</p>
        <motion.div
          className={`sentiment-badge ${cls}`}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
        >
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Icon />
          </motion.span>
          {insight.sentiment.toUpperCase()}
        </motion.div>
      </div>

      <motion.blockquote
        className="ai-summary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        &ldquo;{insight.summary}&rdquo;
      </motion.blockquote>
    </motion.div>
  );
}
