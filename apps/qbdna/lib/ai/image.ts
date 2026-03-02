/**
 * AI Image Generation Service
 * Multi-provider: OpenAI (DALL-E 3), Replicate (Flux), Stability AI, Hugging Face (Free/Open Source)
 *
 * Usage:
 *   const result = await generateImage({ prompt: "...", provider: "huggingface" });
 */

import OpenAI from "openai";

// ─── Types ─────────────────────────────────────────

export type ImageProvider = "openai" | "replicate" | "stability" | "huggingface";
export type ImageStyle =
  | "cinematic"
  | "holographic"
  | "neon"
  | "minimal"
  | "editorial"
  | "stadium"
  | "dark-premium";
export type ImageSize = "1024x1024" | "1024x1792" | "1792x1024";

export interface ImageGenerateRequest {
  prompt: string;
  provider?: ImageProvider;
  style?: ImageStyle;
  size?: ImageSize;
  quality?: "standard" | "hd";
  /** Prepends athlete-specific context to the prompt */
  athleteContext?: {
    name: string;
    school: string;
    position: string;
    metrics?: Record<string, string | number>;
  };
}

export interface ImageResult {
  imageUrl: string;
  revisedPrompt?: string;
  provider: ImageProvider;
  model: string;
  status: "generated" | "pending" | "failed";
  error?: string;
  generatedAt: string;
}

// ─── Style Prompt Prefixes ─────────────────────────

const STYLE_PREFIXES: Record<ImageStyle, string> = {
  cinematic:
    "Hyper-realistic cinematic sports photography, dramatic stadium lighting, shallow depth of field, anamorphic lens flare, dark moody atmosphere, ",
  holographic:
    "Holographic iridescent card design, chrome reflections, prismatic light effects, futuristic sports aesthetic, dark background, ",
  neon:
    "Neon-lit urban sports aesthetic, glowing cyan and green accents, dark background, electric atmosphere, ",
  minimal:
    "Clean minimal design, dark matte background, precise typography-safe composition, editorial sports photography, ",
  editorial:
    "High-fashion editorial sports portrait, studio lighting, dramatic shadows, magazine cover quality, ",
  stadium:
    "Live game atmosphere, packed stadium, Friday night lights, fog machines, cinematic broadcast quality, ",
  "dark-premium":
    "Ultra-premium dark design, matte black background, subtle gold and cyan accents, luxury sports brand aesthetic, ",
};

// ─── OpenAI / DALL-E 3 ────────────────────────────

async function generateWithOpenAI(
  prompt: string,
  size: ImageSize,
  quality: "standard" | "hd"
): Promise<ImageResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      imageUrl: "",
      provider: "openai",
      model: "dall-e-3",
      status: "failed",
      error: "OPENAI_API_KEY not configured",
      generatedAt: new Date().toISOString(),
    };
  }

  const openai = new OpenAI({ apiKey });

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size,
      quality,
      response_format: "url",
    });

    return {
      imageUrl: response.data?.[0]?.url || "",
      revisedPrompt: response.data?.[0]?.revised_prompt,
      provider: "openai",
      model: "dall-e-3",
      status: "generated",
      generatedAt: new Date().toISOString(),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      imageUrl: "",
      provider: "openai",
      model: "dall-e-3",
      status: "failed",
      error: message,
      generatedAt: new Date().toISOString(),
    };
  }
}

// ─── Replicate (Flux Pro / SDXL) ──────────────────

async function generateWithReplicate(
  prompt: string,
  size: ImageSize
): Promise<ImageResult> {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    return {
      imageUrl: "",
      provider: "replicate",
      model: "flux-1.1-pro",
      status: "failed",
      error: "REPLICATE_API_TOKEN not configured",
      generatedAt: new Date().toISOString(),
    };
  }

  const Replicate = (await import("replicate")).default;
  const replicate = new Replicate({ auth: token });

  const [w, h] = size.split("x").map(Number);

  try {
    const output = await replicate.run("black-forest-labs/flux-1.1-pro", {
      input: {
        prompt,
        width: w,
        height: h,
        num_outputs: 1,
        output_format: "webp",
        output_quality: 90,
      },
    });

    const url = Array.isArray(output) ? output[0] : output;

    return {
      imageUrl: typeof url === "string" ? url : String(url),
      provider: "replicate",
      model: "flux-1.1-pro",
      status: "generated",
      generatedAt: new Date().toISOString(),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      imageUrl: "",
      provider: "replicate",
      model: "flux-1.1-pro",
      status: "failed",
      error: message,
      generatedAt: new Date().toISOString(),
    };
  }
}

// ─── Stability AI (SDXL) ─────────────────────────

async function generateWithStability(
  prompt: string,
  size: ImageSize
): Promise<ImageResult> {
  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey) {
    return {
      imageUrl: "",
      provider: "stability",
      model: "stable-diffusion-xl",
      status: "failed",
      error: "STABILITY_API_KEY not configured",
      generatedAt: new Date().toISOString(),
    };
  }

  const [w, h] = size.split("x").map(Number);

  try {
    const resp = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt, weight: 1 }],
          cfg_scale: 7,
          width: Math.min(w, 1024),
          height: Math.min(h, 1024),
          steps: 30,
          samples: 1,
        }),
      }
    );

    if (!resp.ok) {
      throw new Error(`Stability API ${resp.status}: ${await resp.text()}`);
    }

    const data = await resp.json();
    const base64 = data.artifacts?.[0]?.base64;

    return {
      imageUrl: base64 ? `data:image/png;base64,${base64}` : "",
      provider: "stability",
      model: "stable-diffusion-xl",
      status: base64 ? "generated" : "failed",
      generatedAt: new Date().toISOString(),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      imageUrl: "",
      provider: "stability",
      model: "stable-diffusion-xl",
      status: "failed",
      error: message,
      generatedAt: new Date().toISOString(),
    };
  }
}

// ─── Hugging Face (Free / Open Source) ────────────

async function generateWithHuggingFace(
  prompt: string,
  size: ImageSize
): Promise<ImageResult> {
  const token = process.env.HUGGINGFACE_API_TOKEN;
  // HF Inference API works without a token (rate-limited) or with a free token
  const model = "black-forest-labs/FLUX.1-schnell";

  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const resp = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            width: parseInt(size.split("x")[0]),
            height: parseInt(size.split("x")[1]),
          },
        }),
      }
    );

    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`HuggingFace API ${resp.status}: ${errText}`);
    }

    // HF returns raw image bytes
    const buffer = await resp.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const mimeType = resp.headers.get("content-type") || "image/png";

    return {
      imageUrl: `data:${mimeType};base64,${base64}`,
      provider: "huggingface",
      model: "FLUX.1-schnell",
      status: "generated",
      generatedAt: new Date().toISOString(),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      imageUrl: "",
      provider: "huggingface",
      model: "FLUX.1-schnell",
      status: "failed",
      error: message,
      generatedAt: new Date().toISOString(),
    };
  }
}

// ─── Main Generate Function ───────────────────────

export async function generateImage(
  request: ImageGenerateRequest
): Promise<ImageResult> {
  const {
    prompt: rawPrompt,
    provider = "huggingface",
    style = "cinematic",
    size = "1024x1024",
    quality = "hd",
    athleteContext,
  } = request;

  // Build the full prompt
  let fullPrompt = STYLE_PREFIXES[style] || "";

  if (athleteContext) {
    fullPrompt += `featuring ${athleteContext.name}, ${athleteContext.position} from ${athleteContext.school}. `;
    if (athleteContext.metrics) {
      const metricStr = Object.entries(athleteContext.metrics)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      fullPrompt += `Stats overlay showing: ${metricStr}. `;
    }
  }

  fullPrompt += rawPrompt;

  // No text, faces, or logos (improves quality)
  fullPrompt +=
    " Do not include any text, words, letters, numbers, watermarks, or logos in the image.";

  switch (provider) {
    case "huggingface":
      return generateWithHuggingFace(fullPrompt, size);
    case "openai":
      return generateWithOpenAI(fullPrompt, size, quality);
    case "replicate":
      return generateWithReplicate(fullPrompt, size);
    case "stability":
      return generateWithStability(fullPrompt, size);
    default:
      return {
        imageUrl: "",
        provider,
        model: "unknown",
        status: "failed",
        error: `Unknown provider: ${provider}`,
        generatedAt: new Date().toISOString(),
      };
  }
}

// ─── Convenience Functions ────────────────────────

export async function stylizeAvatar(
  photoUrl: string,
  options: { style?: ImageStyle; provider?: ImageProvider } = {}
): Promise<ImageResult> {
  return generateImage({
    prompt: `Transform this athlete portrait into a premium sports card style avatar. Reference source: ${photoUrl}`,
    style: options.style || "dark-premium",
    provider: options.provider || "openai",
    size: "1024x1024",
  });
}

export async function generateCardBackground(
  theme: "dark" | "holographic" | "neon" = "dark",
  provider: ImageProvider = "openai"
): Promise<ImageResult> {
  const themePrompts: Record<string, string> = {
    dark: "Abstract dark matte background with subtle geometric patterns, faint grid lines, perfect for an athlete trading card",
    holographic:
      "Iridescent holographic foil texture, rainbow chrome reflections, prismatic light patterns, trading card background",
    neon: "Dark background with neon glow edges, electric blue and green light trails, futuristic athlete card design",
  };

  return generateImage({
    prompt: themePrompts[theme] || themePrompts.dark,
    style:
      theme === "holographic"
        ? "holographic"
        : theme === "neon"
          ? "neon"
          : "dark-premium",
    provider,
    size: "1024x1792",
  });
}

export async function generateSocialThumbnail(
  athleteName: string,
  metrics: Record<string, string | number>,
  provider: ImageProvider = "openai"
): Promise<ImageResult> {
  return generateImage({
    prompt:
      "Social media thumbnail graphic for a verified quarterback prospect. Dark premium sports design, dramatic lighting, suitable for Instagram story or Twitter post.",
    style: "dark-premium",
    provider,
    size: "1024x1792",
    athleteContext: {
      name: athleteName,
      school: "",
      position: "QB",
      metrics,
    },
  });
}
