"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Image as ImageIcon,
  Video,
  Download,
  Wand2,
  Zap,
  Palette,
  Film,
  ChevronDown,
  Loader2,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";

// ─── Types ─────────────────────────────────────────

type TabType = "image" | "video";
type ImageStyle =
  | "cinematic"
  | "holographic"
  | "neon"
  | "minimal"
  | "editorial"
  | "stadium"
  | "dark-premium";
type ImageSize = "1024x1024" | "1024x1792" | "1792x1024";
type ImageProvider = "openai" | "replicate" | "stability";
type VideoModel =
  | "minimax-video"
  | "luma-dream-machine"
  | "kling-v1"
  | "stable-video";
type VideoAspect = "16:9" | "9:16" | "1:1";

interface GeneratedAsset {
  id: string;
  type: "image" | "video";
  url: string;
  prompt: string;
  style?: string;
  model?: string;
  provider: string;
  generatedAt: string;
}

// ─── Templates ─────────────────────────────────────

const IMAGE_TEMPLATES = [
  {
    label: "Verified Card",
    icon: "🏈",
    prompt:
      "Premium quarterback prospect card design. Dark matte background, holographic foil accents, professional headshot framing with dramatic stadium lighting.",
    style: "dark-premium" as ImageStyle,
  },
  {
    label: "Game Day Graphic",
    icon: "🏟️",
    prompt:
      "Friday night lights game day announcement graphic. Stadium lights, fog effects, electric atmosphere, bold dramatic composition.",
    style: "stadium" as ImageStyle,
  },
  {
    label: "Instagram Story",
    icon: "📱",
    prompt:
      "Vertical social media story graphic for a quarterback showcase. Dynamic action pose, neon accent lighting, modern sports design.",
    style: "neon" as ImageStyle,
  },
  {
    label: "Highlight Thumb",
    icon: "🎬",
    prompt:
      "YouTube thumbnail for a quarterback highlight reel. Cinematic composition, dramatic shadows, action silhouette, premium sports broadcast feel.",
    style: "cinematic" as ImageStyle,
  },
  {
    label: "Draft Prospect",
    icon: "⭐",
    prompt:
      "NFL draft prospect profile graphic. Clean editorial design, subtle data visualization elements, professional scouting report aesthetic.",
    style: "editorial" as ImageStyle,
  },
  {
    label: "Stat Showcase",
    icon: "📊",
    prompt:
      "Holographic data visualization card showing quarterback metrics. Futuristic HUD elements, glowing analytics, dark background with cyan accents.",
    style: "holographic" as ImageStyle,
  },
];

const VIDEO_PRESETS = [
  {
    label: "Highlight Intro",
    preset: "highlightIntro",
    icon: "🎥",
    description: "Cinematic tunnel walk-out with stadium lights",
  },
  {
    label: "Athlete Showcase",
    preset: "athleteShowcase",
    icon: "🏈",
    description: "Orbiting camera around QB in throwing stance",
  },
  {
    label: "Stat Reveal",
    preset: "statReveal",
    icon: "📊",
    description: "Holographic data points materializing in 3D",
  },
  {
    label: "Game Day Hype",
    preset: "gameDay",
    icon: "🏟️",
    description: "Aerial stadium shot at sunset, lights flickering on",
  },
  {
    label: "Draft Day",
    preset: "draftDay",
    icon: "⭐",
    description: "Confetti, spotlight, premium event atmosphere",
  },
  {
    label: "Social Clip",
    preset: "socialClip",
    icon: "📱",
    description: "Quick-cut dynamic montage for TikTok/Reels",
  },
];

const STYLE_OPTIONS: { value: ImageStyle; label: string; color: string }[] = [
  { value: "cinematic", label: "Cinematic", color: "text-amber-400" },
  { value: "holographic", label: "Holographic", color: "text-fuchsia-400" },
  { value: "neon", label: "Neon", color: "text-uc-green" },
  { value: "minimal", label: "Minimal", color: "text-uc-gray-400" },
  { value: "editorial", label: "Editorial", color: "text-blue-400" },
  { value: "stadium", label: "Stadium", color: "text-orange-400" },
  { value: "dark-premium", label: "Dark Premium", color: "text-uc-cyan" },
];

const SIZE_OPTIONS: { value: ImageSize; label: string; desc: string }[] = [
  { value: "1024x1024", label: "Square", desc: "1:1 · Profile, Card" },
  { value: "1024x1792", label: "Portrait", desc: "9:16 · Story, Reel" },
  { value: "1792x1024", label: "Landscape", desc: "16:9 · Thumbnail" },
];

// ─── Main Component ───────────────────────────────

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<TabType>("image");
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<ImageStyle>("cinematic");
  const [size, setSize] = useState<ImageSize>("1024x1024");
  const [provider, setProvider] = useState<ImageProvider>("openai");
  const [videoModel, setVideoModel] = useState<VideoModel>("minimax-video");
  const [videoAspect, setVideoAspect] = useState<VideoAspect>("16:9");
  const [selectedAthlete, setSelectedAthlete] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GeneratedAsset[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentAthlete = PLACEHOLDER_ATHLETES.find(
    (a) => a.id === selectedAthlete
  );

  // ─── Generate Image ─────────────────────────────

  const generateImage = useCallback(async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      const body: Record<string, unknown> = {
        prompt: prompt.trim(),
        provider,
        style,
        size,
        quality: "hd",
      };

      if (currentAthlete) {
        body.athleteContext = {
          name: currentAthlete.name,
          school: currentAthlete.school,
          position: currentAthlete.position,
          metrics: {
            "Throw Velocity": `${currentAthlete.metrics.velocity} mph`,
            "Release Time": `${currentAthlete.metrics.releaseTime}s`,
            Accuracy: `${currentAthlete.metrics.accuracy}%`,
            GAI: `${currentAthlete.metrics.mechanics}/100`,
          },
        };
      }

      const res = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      const asset: GeneratedAsset = {
        id: crypto.randomUUID(),
        type: "image",
        url: data.imageUrl,
        prompt: prompt.trim(),
        style,
        provider: data.provider,
        model: data.model,
        generatedAt: data.generatedAt,
      };

      setGallery((prev) => [asset, ...prev]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate image"
      );
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, provider, style, size, currentAthlete]);

  // ─── Generate Video ─────────────────────────────

  const generateVideoFromPrompt = useCallback(async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      const body: Record<string, unknown> = {
        prompt: prompt.trim(),
        provider: "replicate",
        model: videoModel,
        aspect: videoAspect,
      };

      if (currentAthlete) {
        body.athleteContext = {
          name: currentAthlete.name,
          school: currentAthlete.school,
          position: currentAthlete.position,
        };
      }

      const res = await fetch("/api/generate/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      const asset: GeneratedAsset = {
        id: crypto.randomUUID(),
        type: "video",
        url: data.videoUrl,
        prompt: prompt.trim(),
        provider: data.provider,
        model: data.model,
        generatedAt: data.generatedAt,
      };

      setGallery((prev) => [asset, ...prev]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate video"
      );
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, videoModel, videoAspect, currentAthlete]);

  // ─── Generate from Preset ───────────────────────

  const generateFromPreset = useCallback(
    async (preset: string) => {
      setIsGenerating(true);
      setError(null);

      try {
        const body: Record<string, unknown> = {
          preset,
          provider: "replicate",
          model: videoModel,
          aspect: videoAspect,
        };

        if (currentAthlete) {
          body.athleteContext = {
            name: currentAthlete.name,
            school: currentAthlete.school,
            position: currentAthlete.position,
          };
        }

        const res = await fetch("/api/generate/video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Generation failed");
        }

        const asset: GeneratedAsset = {
          id: crypto.randomUUID(),
          type: "video",
          url: data.videoUrl,
          prompt: `Preset: ${preset}`,
          provider: data.provider,
          model: data.model,
          generatedAt: data.generatedAt,
        };

        setGallery((prev) => [asset, ...prev]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to generate video"
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [videoModel, videoAspect, currentAthlete]
  );

  // ─── Apply Template ─────────────────────────────

  const applyTemplate = useCallback(
    (template: (typeof IMAGE_TEMPLATES)[number]) => {
      setPrompt(template.prompt);
      setStyle(template.style);
    },
    []
  );

  // ─── Copy URL ───────────────────────────────────

  const copyUrl = useCallback((id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  // ─── Render ─────────────────────────────────────

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-uc-cyan/20 text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-4">
            <Sparkles size={12} />
            AI Media Studio
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="gradient-text">Create. Generate. Deploy.</span>
          </h1>
          <p className="text-uc-gray-400 max-w-lg mx-auto">
            AI-powered content engine for athlete profiles, social media assets,
            highlight intros, and shareable cards. Text to image. Text to video.
          </p>
        </motion.div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-2 mb-10">
          {(
            [
              { key: "image" as TabType, icon: ImageIcon, label: "Image Gen" },
              { key: "video" as TabType, icon: Video, label: "Video Gen" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setError(null);
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold tracking-wider uppercase transition-all ${
                activeTab === tab.key
                  ? "bg-uc-cyan/15 text-uc-cyan border border-uc-cyan/30 glow"
                  : "glass text-uc-gray-400 hover:text-white hover:border-white/10"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ─── Left Panel: Controls ─────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-5"
          >
            {/* Athlete Selector */}
            <div className="glass rounded-xl p-5">
              <label className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 block mb-3">
                Athlete Context (Optional)
              </label>
              <div className="relative">
                <select
                  value={selectedAthlete}
                  onChange={(e) => setSelectedAthlete(e.target.value)}
                  className="w-full bg-uc-surface border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-uc-cyan/50 transition-colors appearance-none pr-8"
                >
                  <option value="">No athlete context</option>
                  {PLACEHOLDER_ATHLETES.filter((a) => a.verified).map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} · {a.school}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-uc-gray-400 pointer-events-none"
                />
              </div>
              {currentAthlete && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 rounded-lg bg-uc-surface/50 border border-white/5"
                >
                  <p className="text-xs text-uc-gray-400">
                    <span className="text-uc-cyan">{currentAthlete.name}</span>{" "}
                    · {currentAthlete.qbClass} ·{" "}
                    {currentAthlete.metrics.velocity} mph ·{" "}
                    {currentAthlete.metrics.accuracy}% acc
                  </p>
                </motion.div>
              )}
            </div>

            {/* Image-specific controls */}
            <AnimatePresence mode="wait">
              {activeTab === "image" && (
                <motion.div
                  key="image-controls"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-5"
                >
                  {/* Provider */}
                  <div className="glass rounded-xl p-5">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 block mb-3">
                      <Zap size={10} className="inline mr-1" />
                      Provider
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { key: "openai", label: "DALL-E 3" },
                          { key: "replicate", label: "Flux Pro" },
                          { key: "stability", label: "SDXL" },
                        ] as const
                      ).map((p) => (
                        <button
                          key={p.key}
                          onClick={() => setProvider(p.key)}
                          className={`py-2 rounded-lg text-[11px] font-semibold tracking-wider uppercase transition-all ${
                            provider === p.key
                              ? "bg-uc-cyan/15 text-uc-cyan border border-uc-cyan/30"
                              : "bg-uc-surface text-uc-gray-400 border border-white/5 hover:border-white/10"
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style */}
                  <div className="glass rounded-xl p-5">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 block mb-3">
                      <Palette size={10} className="inline mr-1" />
                      Visual Style
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {STYLE_OPTIONS.map((s) => (
                        <button
                          key={s.value}
                          onClick={() => setStyle(s.value)}
                          className={`py-2 px-3 rounded-lg text-[11px] font-medium tracking-wide transition-all text-left ${
                            style === s.value
                              ? "bg-uc-cyan/15 text-uc-cyan border border-uc-cyan/30"
                              : "bg-uc-surface text-uc-gray-400 border border-white/5 hover:border-white/10"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size */}
                  <div className="glass rounded-xl p-5">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 block mb-3">
                      Dimensions
                    </label>
                    <div className="flex flex-col gap-2">
                      {SIZE_OPTIONS.map((s) => (
                        <button
                          key={s.value}
                          onClick={() => setSize(s.value)}
                          className={`py-2.5 px-3 rounded-lg text-left transition-all ${
                            size === s.value
                              ? "bg-uc-cyan/15 border border-uc-cyan/30"
                              : "bg-uc-surface border border-white/5 hover:border-white/10"
                          }`}
                        >
                          <span
                            className={`text-xs font-semibold ${size === s.value ? "text-uc-cyan" : "text-white"}`}
                          >
                            {s.label}
                          </span>
                          <span className="text-[10px] text-uc-gray-400 ml-2">
                            {s.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Templates */}
                  <div className="glass rounded-xl p-5">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 block mb-3">
                      <Wand2 size={10} className="inline mr-1" />
                      Quick Templates
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {IMAGE_TEMPLATES.map((t) => (
                        <button
                          key={t.label}
                          onClick={() => applyTemplate(t)}
                          className="py-2.5 px-3 rounded-lg bg-uc-surface border border-white/5 hover:border-uc-cyan/30 hover:bg-uc-cyan/5 transition-all text-left group"
                        >
                          <span className="text-sm mr-1">{t.icon}</span>
                          <span className="text-[11px] text-uc-gray-400 group-hover:text-uc-cyan transition-colors">
                            {t.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "video" && (
                <motion.div
                  key="video-controls"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-5"
                >
                  {/* Model */}
                  <div className="glass rounded-xl p-5">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 block mb-3">
                      <Film size={10} className="inline mr-1" />
                      Video Model
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          { key: "minimax-video", label: "Minimax" },
                          { key: "luma-dream-machine", label: "Luma" },
                          { key: "kling-v1", label: "Kling" },
                          { key: "stable-video", label: "Stable" },
                        ] as const
                      ).map((m) => (
                        <button
                          key={m.key}
                          onClick={() => setVideoModel(m.key)}
                          className={`py-2 rounded-lg text-[11px] font-semibold tracking-wider uppercase transition-all ${
                            videoModel === m.key
                              ? "bg-uc-cyan/15 text-uc-cyan border border-uc-cyan/30"
                              : "bg-uc-surface text-uc-gray-400 border border-white/5 hover:border-white/10"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Aspect Ratio */}
                  <div className="glass rounded-xl p-5">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 block mb-3">
                      Aspect Ratio
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { key: "16:9", label: "16:9" },
                          { key: "9:16", label: "9:16" },
                          { key: "1:1", label: "1:1" },
                        ] as const
                      ).map((a) => (
                        <button
                          key={a.key}
                          onClick={() => setVideoAspect(a.key)}
                          className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                            videoAspect === a.key
                              ? "bg-uc-cyan/15 text-uc-cyan border border-uc-cyan/30"
                              : "bg-uc-surface text-uc-gray-400 border border-white/5 hover:border-white/10"
                          }`}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Video Presets */}
                  <div className="glass rounded-xl p-5">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 block mb-3">
                      <Wand2 size={10} className="inline mr-1" />
                      Motion Presets
                    </label>
                    <div className="flex flex-col gap-2">
                      {VIDEO_PRESETS.map((p) => (
                        <button
                          key={p.preset}
                          onClick={() => generateFromPreset(p.preset)}
                          disabled={isGenerating}
                          className="py-3 px-3 rounded-lg bg-uc-surface border border-white/5 hover:border-uc-cyan/30 hover:bg-uc-cyan/5 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{p.icon}</span>
                            <span className="text-xs font-semibold text-white group-hover:text-uc-cyan transition-colors">
                              {p.label}
                            </span>
                          </div>
                          <p className="text-[10px] text-uc-gray-400 mt-1 ml-6">
                            {p.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ─── Right Panel: Prompt + Gallery ────── */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Prompt Input */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6"
            >
              <label className="text-[10px] tracking-[0.2em] uppercase text-uc-gray-400 block mb-3">
                {activeTab === "image" ? "Image Prompt" : "Video Prompt"}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  activeTab === "image"
                    ? "Describe the image you want to generate... e.g., 'Premium quarterback prospect card with holographic foil, dark background, stadium lights'"
                    : "Describe the video scene... e.g., 'Cinematic camera push through stadium tunnel, dramatic fog, lights flickering on'"
                }
                rows={4}
                maxLength={2000}
                className="w-full bg-uc-surface border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-uc-gray-600 focus:outline-none focus:border-uc-cyan/50 transition-colors resize-none"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-uc-gray-600">
                  {prompt.length}/2000
                </span>
                <button
                  onClick={
                    activeTab === "image"
                      ? generateImage
                      : generateVideoFromPrompt
                  }
                  disabled={isGenerating || !prompt.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold tracking-wider uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-uc-cyan/15 text-uc-cyan border border-uc-cyan/30 hover:bg-uc-cyan/25 hover:shadow-[0_0_20px_rgba(0,194,255,0.2)]"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Generate{" "}
                      {activeTab === "image" ? "Image" : "Video"}
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-uc-red/10 border border-uc-red/20"
                >
                  <AlertCircle
                    size={16}
                    className="text-uc-red mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm text-uc-red font-medium">
                      Generation Failed
                    </p>
                    <p className="text-xs text-uc-gray-400 mt-1">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Gallery */}
            <div>
              <h2 className="text-[10px] tracking-[0.3em] uppercase text-uc-gray-400 mb-4">
                Generated Assets · {gallery.length}
              </h2>

              {gallery.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass rounded-xl p-16 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-uc-surface border border-white/5 flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={24} className="text-uc-gray-600" />
                  </div>
                  <p className="text-sm text-uc-gray-400 mb-1">
                    No assets generated yet
                  </p>
                  <p className="text-xs text-uc-gray-600">
                    Write a prompt above or use a template to get started
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {gallery.map((asset, i) => (
                      <motion.div
                        key={asset.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass rounded-xl overflow-hidden group"
                      >
                        {/* Preview */}
                        <div className="relative aspect-square bg-uc-surface">
                          {asset.type === "image" ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={asset.url}
                              alt={asset.prompt}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src={asset.url}
                              controls
                              className="w-full h-full object-cover"
                            />
                          )}

                          {/* Overlay Actions */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <div className="flex gap-2">
                              <a
                                href={asset.url}
                                download={`uc-${asset.type}-${Date.now()}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-white text-xs font-medium hover:bg-white/20 transition-colors"
                              >
                                <Download size={12} />
                                Download
                              </a>
                              <button
                                onClick={() => copyUrl(asset.id, asset.url)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-white text-xs font-medium hover:bg-white/20 transition-colors"
                              >
                                {copiedId === asset.id ? (
                                  <Check size={12} className="text-uc-green" />
                                ) : (
                                  <Copy size={12} />
                                )}
                                {copiedId === asset.id ? "Copied" : "Copy URL"}
                              </button>
                            </div>
                          </div>

                          {/* Type Badge */}
                          <div className="absolute top-3 right-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase ${
                                asset.type === "image"
                                  ? "bg-uc-cyan/20 text-uc-cyan"
                                  : "bg-purple-500/20 text-purple-400"
                              }`}
                            >
                              {asset.type}
                            </span>
                          </div>
                        </div>

                        {/* Meta */}
                        <div className="p-4">
                          <p className="text-xs text-white line-clamp-2 mb-2">
                            {asset.prompt}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] text-uc-gray-400">
                            <span className="uppercase tracking-wider">
                              {asset.provider}
                            </span>
                            {asset.model && (
                              <>
                                <span>·</span>
                                <span>{asset.model}</span>
                              </>
                            )}
                            {asset.style && (
                              <>
                                <span>·</span>
                                <span className="capitalize">
                                  {asset.style}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
