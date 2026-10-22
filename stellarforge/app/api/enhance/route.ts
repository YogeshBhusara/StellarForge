import { NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";
import {
  getEnhancementSystemPrompt,
  getEnhancementUserPrompt,
} from "@/lib/prompts";
import { retrieveRelevantTerms } from "@/lib/retrieve";
import { MAX_SCENE_LENGTH } from "@/lib/constants";
import { userFacingError } from "@/lib/errors";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const scene = typeof body.scene === "string" ? body.scene.trim() : "";
    if (!scene) {
      return NextResponse.json(
        { error: "Missing or empty scene" },
        { status: 400 }
      );
    }
    if (scene.length > MAX_SCENE_LENGTH) {
      return NextResponse.json(
        { error: `Scene is too long (max ${MAX_SCENE_LENGTH} characters).` },
        { status: 400 }
      );
    }

    const retrieved = retrieveRelevantTerms(scene);
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: getEnhancementSystemPrompt() },
        { role: "user", content: getEnhancementUserPrompt(scene, retrieved) },
      ],
    });

    const enhanced =
      completion.choices[0]?.message?.content?.trim() ?? "";

    return NextResponse.json({
      enhanced,
      usedTerms: retrieved.map((t) => t.term),
    });
  } catch (err) {
    console.error("Enhance API error:", err);
    return NextResponse.json(
      { error: userFacingError(err, "Enhancement failed") },
      { status: 500 }
    );
  }
}
