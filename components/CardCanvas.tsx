"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { Download, Sparkles, Dna } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardCanvasProps {
  athleteName: string;
  metrics: { label: string; value: string }[];
  rating: number;
  qbClass: string;
  verified: boolean;
  theme?: "dark" | "holographic" | "dna";
  genomeScore?: number;
}

/* ── Mini DNA Helix SVG for card export ── */
function CardDNAHelix() {
  return (
    <svg viewBox="0 0 30 200" className="absolute right-3 top-6 bottom-6 h-[calc(100%-48px)] w-[30px] opacity-15">
      {Array.from({ length: 12 }, (_, i) => {
        const y = 10 + i * 16;
        const phase = i * 0.5;
        const x1 = 15 + Math.sin(phase) * 10;
        const x2 = 15 - Math.sin(phase) * 10;
        return (
          <g key={i}>
            <circle cx={x1} cy={y} r="2" fill="#00C2FF" />
            <circle cx={x2} cy={y} r="2" fill="#00FF88" />
            <line x1={x1} y1={y} x2={x2} y2={y} stroke="#00C2FF" strokeWidth="0.5" opacity="0.4" />
          </g>
        );
      })}
    </svg>
  );
}

export default function CardCanvas({
  athleteName,
  metrics,
  rating,
  qbClass,
  verified,
  theme = "dark",
  genomeScore,
}: CardCanvasProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        backgroundColor: "#0A0A0A",
      });
      const link = document.createElement("a");
      link.download = `${athleteName.replace(/\s/g, "-").toLowerCase()}-${theme}-card.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Card export failed:", err);
    }
    setDownloading(false);
  };

  const isDNA = theme === "dna";

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Card */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className={cn(
          "relative w-[400px] rounded-2xl overflow-hidden p-8",
          theme === "dark" &&
            "bg-gradient-to-br from-[#111111] via-[#0A0A0A] to-[#111111] border border-white/5",
          theme === "holographic" &&
            "bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] border border-cyan-400/20",
          isDNA &&
            "bg-gradient-to-br from-[#0A0F0A] via-[#0A0A14] to-[#0F0A1A] border border-uc-green/20"
        )}
      >
        {/* Holographic Shimmer */}
        {theme === "holographic" && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent animate-pulse pointer-events-none" />
        )}

        {/* DNA theme overlays */}
        {isDNA && (
          <>
            <div className="absolute inset-0 dna-bg-pattern opacity-30 pointer-events-none" />
            <div className="absolute inset-0 genome-scan pointer-events-none" />
            <CardDNAHelix />
          </>
        )}

        {/* Top Section */}
        <div className="flex items-start justify-between mb-8 relative">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              {isDNA && <Dna size={10} className="text-uc-green" />}
              <p className={cn(
                "text-[10px] tracking-[0.3em] uppercase",
                isDNA ? "text-uc-green" : "text-uc-gray-400"
              )}>
                {isDNA ? "Genome Decoded" : "Under Center"}
              </p>
            </div>
            <h2 className={cn(
              "text-2xl font-bold tracking-tight",
              isDNA ? "gradient-text-dna" : "gradient-text"
            )}>
              {athleteName}
            </h2>
            <p className="text-xs text-uc-gray-400 mt-1">{qbClass}</p>
          </div>

          {verified && (
            <div className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase",
              isDNA
                ? "bg-uc-green/15 text-uc-green border border-uc-green/30"
                : "bg-uc-cyan/15 text-uc-cyan border border-uc-cyan/30 animate-pulse-glow"
            )}>
              {isDNA ? "Decoded" : "Verified"}
            </div>
          )}
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-6 relative">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={cn(
                "w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold",
                i < Math.floor(rating)
                  ? isDNA
                    ? "bg-uc-green/20 text-uc-green"
                    : "bg-yellow-400/20 text-yellow-400"
                  : "bg-white/5 text-uc-gray-600"
              )}
            >
              ★
            </div>
          ))}
        </div>

        {/* Genome Score (DNA theme only) */}
        {isDNA && genomeScore !== undefined && (
          <div className="relative mb-6 p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[8px] tracking-[0.25em] uppercase text-uc-gray-500">Composite Genome Score</span>
              <span className="text-xl font-black font-mono gradient-text-dna">{genomeScore.toFixed(1)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-uc-cyan via-uc-green to-purple-400"
                style={{ width: `${genomeScore}%` }}
              />
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="flex flex-col gap-3 mb-8 relative">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={cn(
                "flex items-center justify-between py-2 border-b",
                isDNA ? "border-uc-green/10" : "border-white/5"
              )}
            >
              <span className="text-xs tracking-[0.15em] uppercase text-uc-gray-400 flex items-center gap-1.5">
                {isDNA && (
                  <span className="text-[7px] font-mono text-uc-green/60">
                    {["VEL-α", "REL-β", "SPR-γ", "MECH-δ", "ACC-ε", "DEC-ζ"][i] || `G-${i}`}
                  </span>
                )}
                {m.label}
              </span>
              <span className={cn(
                "text-sm font-bold font-mono",
                isDNA ? "text-uc-green" : "text-uc-white"
              )}>
                {m.value}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom: QR + Branding */}
        <div className="flex items-end justify-between relative">
          <div>
            <p className="text-[8px] tracking-[0.2em] uppercase text-uc-gray-600 mb-1">
              {isDNA ? "Scan to decode" : "Scan to verify"}
            </p>
            <QRCodeSVG
              value={`https://undercenter.com/athlete/${athleteName.replace(/\s/g, "-").toLowerCase()}`}
              size={64}
              bgColor="transparent"
              fgColor={isDNA ? "#00FF88" : "#00C2FF"}
              level="L"
            />
          </div>

          <div className="text-right">
            {isDNA ? (
              <Dna size={16} className="text-uc-green ml-auto mb-1" />
            ) : (
              <Sparkles size={16} className="text-uc-cyan ml-auto mb-1" />
            )}
            <p className={cn(
              "text-[8px] tracking-[0.3em] uppercase",
              isDNA ? "text-uc-green/50" : "text-uc-gray-600"
            )}>
              {isDNA ? "QBDNA Decoded" : "The Draft Pipeline"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Download Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleDownload}
        disabled={downloading}
        className={cn(
          "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm tracking-wider uppercase disabled:opacity-50 transition-all duration-250",
          isDNA
            ? "bg-uc-green/10 text-uc-green border border-uc-green/20 hover:bg-uc-green/20 hover:shadow-[0_0_20px_rgba(0,255,136,0.2)]"
            : "bg-uc-cyan/10 text-uc-cyan border border-uc-cyan/20 hover:bg-uc-cyan/20 hover:shadow-[0_0_20px_rgba(0,194,255,0.2)]"
        )}
      >
        <Download size={16} />
        {downloading ? "Rendering..." : "Download Card"}
      </motion.button>
    </div>
  );
}
