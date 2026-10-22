import { formatRetrievedContext, type RetrievedTerm } from "@/lib/retrieve";

export function getEnhancementSystemPrompt(): string {
  return "You are StellarForge, an AI trained to help writers create scientifically plausible science fiction. Use real NASA terminology when applicable. Flag impossible physics. Suggest grounded alternatives. Preserve the author's voice and story intent.";
}

export function getEnhancementUserPrompt(
  scene: string,
  retrieved: RetrievedTerm[] = []
): string {
  const glossary = formatRetrievedContext(retrieved);
  const glossaryBlock = glossary
    ? `## Relevant NASA terminology (use these where they fit naturally)
${glossary}

`
    : "";

  return `Enhance the following scene for scientific realism.

${glossaryBlock}## Scene
${scene}

## Tasks
1. Improve realism (adjust descriptions and events to be physically plausible where possible).
2. Add correct scientific terminology (NASA/spaceflight terms where they fit).
3. Flag impossible physics (list any violations with brief explanations).
4. Suggest plausible alternatives for any flagged elements.
5. Provide a rewritten version of the scene that incorporates the improvements.

Respond with these markdown headings, in this order:
## Realism notes
## Terminology
## Impossible physics
## Plausible alternatives
## Rewritten Scene`;
}

export function getRealismSystemPrompt(): string {
  return "You are a NASA mission science advisor. Analyze the text for scientific plausibility. Respond with a JSON object only, no markdown, with two keys: 'analysis' (string, 2–4 paragraphs of feedback) and 'plausibilityScore' (number 1–10, integer).";
}

export function getRealismUserPrompt(
  scene: string,
  retrieved: RetrievedTerm[] = []
): string {
  const glossary = formatRetrievedContext(retrieved);
  const glossaryBlock = glossary
    ? `Consider these NASA terms if relevant:\n${glossary}\n\n`
    : "";
  return `${glossaryBlock}Analyze this text for scientific plausibility:\n\n${scene}`;
}
