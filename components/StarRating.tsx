"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
}

export default function StarRating({ rating, maxStars = 5 }: StarRatingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-1"
    >
      {Array.from({ length: maxStars }, (_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;

        return (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <Star
              size={20}
              className={
                filled
                  ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.4)]"
                  : half
                  ? "text-yellow-400 fill-yellow-400/50"
                  : "text-uc-gray-600"
              }
            />
          </motion.div>
        );
      })}
      <span className="ml-2 text-sm text-uc-gray-400 font-mono">{rating.toFixed(1)}</span>
    </motion.div>
  );
}
