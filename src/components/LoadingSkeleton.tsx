"use client";

import { motion } from "framer-motion";

export function LoadingSkeleton() {
  return (
    <motion.div
      className="skeleton-wrap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="skeleton-hero">
        <div className="skeleton-poster shimmer" />
        <div className="skeleton-info">
          <div className="skeleton-line shimmer" style={{ width: "40%", height: "14px" }} />
          <div className="skeleton-line shimmer" style={{ width: "85%", height: "52px", marginTop: "12px" }} />
          <div className="skeleton-line shimmer" style={{ width: "60%", height: "20px", marginTop: "16px" }} />
          <div className="skeleton-line shimmer" style={{ width: "75%", height: "16px", marginTop: "12px" }} />
          <div className="skeleton-line shimmer" style={{ width: "80%", height: "16px", marginTop: "8px" }} />
          <div className="skeleton-line shimmer" style={{ width: "55%", height: "16px", marginTop: "8px" }} />
        </div>
      </div>
      <div className="skeleton-plot">
        <div className="skeleton-line shimmer" style={{ width: "30%", height: "12px" }} />
        <div className="skeleton-line shimmer" style={{ width: "100%", height: "16px", marginTop: "12px" }} />
        <div className="skeleton-line shimmer" style={{ width: "95%", height: "16px", marginTop: "8px" }} />
        <div className="skeleton-line shimmer" style={{ width: "80%", height: "16px", marginTop: "8px" }} />
      </div>
      <div className="skeleton-ai-card shimmer" />
    </motion.div>
  );
}
