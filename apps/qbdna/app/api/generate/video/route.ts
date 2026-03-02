import { NextRequest, NextResponse } from "next/server";
import {
  generateVideo,
  generateFromPreset,
  type VideoGenerateRequest,
  type VideoProvider,
  type VideoModel,
  type VideoAspect,
  type MotionPreset,
  MOTION_PRESETS,
} from "@/lib/ai/video";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      prompt,
      preset,
      provider = "replicate",
      model = "minimax-video",
      aspect = "16:9",
      imageUrl,
      athleteContext,
    } = body as VideoGenerateRequest & { preset?: MotionPreset };

    // Preset-based generation
    if (preset) {
      const validPresets = Object.keys(MOTION_PRESETS) as MotionPreset[];
      if (!validPresets.includes(preset)) {
        return NextResponse.json(
          { error: `Invalid preset. Use: ${validPresets.join(", ")}` },
          { status: 400 }
        );
      }

      const result = await generateFromPreset(preset, {
        athleteContext,
        model: model as VideoModel,
        aspect: aspect as VideoAspect,
        imageUrl,
      });

      if (result.status === "failed") {
        return NextResponse.json(
          { error: result.error, result },
          { status: 502 }
        );
      }

      return NextResponse.json(result);
    }

    // Prompt-based generation
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt or preset is required" },
        { status: 400 }
      );
    }

    if (prompt.length > 2000) {
      return NextResponse.json(
        { error: "Prompt must be under 2000 characters" },
        { status: 400 }
      );
    }

    const validProviders: VideoProvider[] = ["replicate"];
    if (!validProviders.includes(provider as VideoProvider)) {
      return NextResponse.json(
        { error: `Invalid provider. Use: ${validProviders.join(", ")}` },
        { status: 400 }
      );
    }

    const validModels: VideoModel[] = [
      "minimax-video",
      "luma-dream-machine",
      "kling-v1",
      "stable-video",
    ];
    if (!validModels.includes(model as VideoModel)) {
      return NextResponse.json(
        { error: `Invalid model. Use: ${validModels.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await generateVideo({
      prompt: prompt.trim(),
      provider: provider as VideoProvider,
      model: model as VideoModel,
      aspect: aspect as VideoAspect,
      imageUrl,
      athleteContext,
    });

    if (result.status === "failed") {
      return NextResponse.json(
        { error: result.error, result },
        { status: 502 }
      );
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[API] Video generation error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
