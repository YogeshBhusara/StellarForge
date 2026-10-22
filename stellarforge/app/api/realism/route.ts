import { NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";
import {
  getRealismSystemPrompt,
  getRealismUserPrompt,
} from "@/lib/prompts";
import { retrieveRelevantTerms } from "@/lib/retrieve";
import { MAX_SCENE_LENGTH } from "@/lib/constants";
import { userFacingError } from "@/lib/errors";

export const runtime = "edge";

function parseRealismResponse(raw: string): {
  analysis: string;
  plausibilityScore: number;
} {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced?.[1]?.trim() ?? raw;
  const objectMatch = candidate.match(/\{[\s\S]*\}/);
  const jsonText = objectMatch?.[0] ?? candidate;

  try {
    const parsed = JSON.parse(jsonText) as {
      analysis?: string;
      plausibilityScore?: number;
    };
    const analysis =
      typeof parsed.analysis === "string" ? parsed.analysis : raw;
    const n = Number(parsed.plausibilityScore);
    const plausibilityScore = Number.isFinite(n)
      ? Math.max(1, Math.min(10, Math.round(n)))
      : 5;
    return { analysis, plausibilityScore };
  } catch {
    return { analysis: raw, plausibilityScore: 5 };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = typeof body.scene === "string" ? body.scene.trim() : "";
    if (!text) {
      return NextResponse.json(
        { error: "Missing or empty scene" },
        { status: 400 }
      );
    }
    if (text.length > MAX_SCENE_LENGTH) {
      return NextResponse.json(
        { error: `Scene is too long (max ${MAX_SCENE_LENGTH} characters).` },
        { status: 400 }
      );
    }

    const retrieved = retrieveRelevantTerms(text);
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: getRealismSystemPrompt() },
        { role: "user", content: getRealismUserPrompt(text, retrieved) },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "";
    const { analysis, plausibilityScore } = parseRealismResponse(raw);

    return NextResponse.json({
      analysis,
      plausibilityScore,
      usedTerms: retrieved.map((t) => t.term),
    });
  } catch (err) {
    console.error("Realism API error:", err);
    return NextResponse.json(
      { error: userFacingError(err, "Analysis failed") },
      { status: 500 }
    );
  }
}
