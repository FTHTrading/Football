"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideoOverlayPlayerProps {
  url: string;
  metrics?: Record<string, string>;
}

export default function VideoOverlayPlayer({
  url,
  metrics = {},
}: VideoOverlayPlayerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-4xl rounded-2xl overflow-hidden glass"
    >
      {/* Video */}
      <div className="aspect-video">
        <ReactPlayer
          src={url}
          width="100%"
          height="100%"
          controls
          light
          playing={false}
        />
      </div>

      {/* HUD Overlay */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
        {Object.entries(metrics).map(([key, value]) => (
          <div
            key={key}
            className="glass px-3 py-1.5 rounded-md flex items-center gap-2"
          >
            <span className="text-[10px] tracking-[0.15em] uppercase text-uc-gray-400">
              {key}
            </span>
            <span className="text-xs font-bold text-uc-cyan font-mono animate-flicker">
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Status Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2 glass px-3 py-1.5 rounded-md pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-uc-red animate-pulse" />
        <span className="text-[10px] tracking-[0.15em] uppercase text-uc-gray-400">
          Film Review
        </span>
      </div>
    </motion.div>
  );
}
