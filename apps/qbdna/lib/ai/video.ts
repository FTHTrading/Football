/**
 * AI Video Generation Service
 * Multi-provider support: Replicate (Minimax, LumaAI, Kling), OpenAI (future Sora)
 *
 * Usage:
 *   const result = await generateVideo({ prompt: "...", provider: "replicate" });
 */

// ─── Types ─────────────────────────────────────────

export type VideoProvider = "replicate" | "openai";
export type VideoModel =
  | "minimax-video"
  | "luma-dream-machine"
  | "kling-v1"
  | "stable-video";
export type VideoAspect = "16:9" | "9:16" | "1:1";

export interface VideoGenerateRequest {
  prompt: string;
  provider?: VideoProvider;
  model?: VideoModel;
  aspect?: VideoAspect;
  duration?: 3 | 5 | 10;
  /** Optional image URL to use as first frame (image-to-video) */
  imageUrl?: string;
  /** Prepends athlete-specific context */
  athleteContext?: {
    name: string;
    school: string;
    position: string;
    metrics?: Record<string, string | number>;
  };
}

export interface VideoResult {
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  provider: VideoProvider;
  model: string;
  status: "generated" | "processing" | "failed";
  error?: string;
  generatedAt: string;
}

// ─── Motion Prompt Presets ────────────────────────

const MOTION_PRESETS = {
  highlightIntro:
    "Smooth cinematic camera push-in through stadium tunnel, lights turning on, fog rolling, dramatic slow motion, NFL broadcast quality.",
  athleteShowcase:
    "Camera slowly orbits around a quarterback in throwing stance, dramatic stadium lighting, shallow depth of field, cinematic slow motion.",
  statReveal:
    "Dark background, holographic data points materializing in 3D space, glowing cyan metrics emerging with particle effects, futuristic sports analytics visualization.",
  gameDay:
    "Aerial drone shot of a football stadium at sunset, crowd filing in, lights flickering on, electric atmosphere, time-lapse into night game.",
  draftDay:
    "Slow-motion confetti falling, spotlight illuminating a podium, dark background, premium sports event atmosphere, gold accent lighting.",
  socialClip:
    "Quick-cut dynamic sports montage, bold movements, neon accents, vertical format optimized for TikTok/Instagram Reels.",
};

export type MotionPreset = keyof typeof MOTION_PRESETS;

// ─── Replicate Video Models ───────────────────────

async function generateWithReplicate(
  prompt: string,
  model: VideoModel,
  aspect: VideoAspect,
  imageUrl?: string
): Promise<VideoResult> {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    return {
      videoUrl: "",
      thumbnailUrl: "",
      duration: 0,
      provider: "replicate",
      model,
      status: "failed",
      error: "REPLICATE_API_TOKEN not configured",
      generatedAt: new Date().toISOString(),
    };
  }

  const Replicate = (await import("replicate")).default;
  const replicate = new Replicate({ auth: token });

  // Model identifiers on Replicate
  const MODEL_MAP: Record<VideoModel, `${string}/${string}`> = {
    "minimax-video": "minimax/video-01-live",
    "luma-dream-machine": "luma/dream-machine",
    "kling-v1": "kling-ai/kling-v1",
    "stable-video": "stability-ai/stable-video-diffusion",
  };

  const modelId = MODEL_MAP[model] || MODEL_MAP["minimax-video"];

  try {
    const input: Record<string, unknown> = {
      prompt,
      aspect_ratio: aspect,
    };

    if (imageUrl) {
      input.image = imageUrl;
    }

    const output = await replicate.run(modelId as `${string}/${string}`, {
      input,
    });

    const url = Array.isArray(output) ? output[0] : output;
    const videoUrl = typeof url === "string" ? url : String(url);

    return {
      videoUrl,
      thumbnailUrl: "",
      duration: 5,
      provider: "replicate",
      model,
      status: "generated",
      generatedAt: new Date().toISOString(),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      videoUrl: "",
      thumbnailUrl: "",
      duration: 0,
      provider: "replicate",
      model,
      status: "failed",
      error: message,
      generatedAt: new Date().toISOString(),
    };
  }
}

// ─── Main Generate Function ───────────────────────

export async function generateVideo(
  request: VideoGenerateRequest
): Promise<VideoResult> {
  const {
    prompt: rawPrompt,
    provider = "replicate",
    model = "minimax-video",
    aspect = "16:9",
    imageUrl,
    athleteContext,
  } = request;

  let fullPrompt = "";

  if (athleteContext) {
    fullPrompt += `Featuring ${athleteContext.name}, ${athleteContext.position} from ${athleteContext.school}. `;
  }

  fullPrompt += rawPrompt;

  switch (provider) {
    case "replicate":
      return generateWithReplicate(fullPrompt, model, aspect, imageUrl);
    default:
      return {
        videoUrl: "",
        thumbnailUrl: "",
        duration: 0,
        provider,
        model,
        status: "failed",
        error: `Provider '${provider}' not yet supported for video generation`,
        generatedAt: new Date().toISOString(),
      };
  }
}

// ─── Convenience Functions ────────────────────────

export async function enhanceHighlight(
  videoUrl: string,
  options: {
    overlayMetrics?: boolean;
    resolution?: "720p" | "1080p" | "4K";
  } = {}
): Promise<VideoResult> {
  return generateVideo({
    prompt: `Enhance and upscale this sports highlight clip to ${options.resolution || "1080p"} broadcast quality with color grading and stabilization.`,
    provider: "replicate",
    model: "minimax-video",
    imageUrl: videoUrl,
  });
}

export async function generateHighlightReel(
  clips: string[],
  athleteName: string
): Promise<VideoResult> {
  return generateVideo({
    prompt: `Create a cinematic highlight reel montage. Dynamic transitions between ${clips.length} clips, dramatic music-sync cuts, slow motion on key plays, premium broadcast package feel.`,
    provider: "replicate",
    model: "minimax-video",
    athleteContext: {
      name: athleteName,
      school: "",
      position: "QB",
    },
    imageUrl: clips[0],
  });
}

export async function overlayStats(
  videoUrl: string,
  metrics: Record<string, string | number>
): Promise<VideoResult> {
  const metricStr = Object.entries(metrics)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");

  return generateVideo({
    prompt: `Sports analytics overlay animation. Holographic data visualization with the following stats appearing: ${metricStr}. Futuristic HUD style, glowing cyan accents on dark background.`,
    provider: "replicate",
    model: "minimax-video",
    imageUrl: videoUrl,
  });
}

/**
 * Generate a video from a pre-built motion preset
 */
export async function generateFromPreset(
  preset: MotionPreset,
  options: {
    athleteContext?: VideoGenerateRequest["athleteContext"];
    model?: VideoModel;
    aspect?: VideoAspect;
    imageUrl?: string;
  } = {}
): Promise<VideoResult> {
  return generateVideo({
    prompt: MOTION_PRESETS[preset],
    provider: "replicate",
    model: options.model || "minimax-video",
    aspect: options.aspect || "16:9",
    imageUrl: options.imageUrl,
    athleteContext: options.athleteContext,
  });
}

export { MOTION_PRESETS };
