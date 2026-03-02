import { NextRequest, NextResponse } from "next/server";
import {
  generateImage,
  type ImageGenerateRequest,
  type ImageProvider,
  type ImageStyle,
  type ImageSize,
} from "@/lib/ai/image";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      prompt,
      provider = "openai",
      style = "cinematic",
      size = "1024x1024",
      quality = "hd",
      athleteContext,
    } = body as ImageGenerateRequest;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (prompt.length > 2000) {
      return NextResponse.json(
        { error: "Prompt must be under 2000 characters" },
        { status: 400 }
      );
    }

    const validProviders: ImageProvider[] = [
      "openai",
      "replicate",
      "stability",
    ];
    if (!validProviders.includes(provider as ImageProvider)) {
      return NextResponse.json(
        { error: `Invalid provider. Use: ${validProviders.join(", ")}` },
        { status: 400 }
      );
    }

    const validStyles: ImageStyle[] = [
      "cinematic",
      "holographic",
      "neon",
      "minimal",
      "editorial",
      "stadium",
      "dark-premium",
    ];
    if (!validStyles.includes(style as ImageStyle)) {
      return NextResponse.json(
        { error: `Invalid style. Use: ${validStyles.join(", ")}` },
        { status: 400 }
      );
    }

    const validSizes: ImageSize[] = ["1024x1024", "1024x1792", "1792x1024"];
    if (!validSizes.includes(size as ImageSize)) {
      return NextResponse.json(
        { error: `Invalid size. Use: ${validSizes.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await generateImage({
      prompt: prompt.trim(),
      provider: provider as ImageProvider,
      style: style as ImageStyle,
      size: size as ImageSize,
      quality: quality as "standard" | "hd",
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
    console.error("[API] Image generation error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
