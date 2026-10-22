import { nasaTerms, type NasaTerm } from "@/lib/nasaTerms";

export interface RetrievedTerm extends NasaTerm {
  score: number;
}

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9]+/i)
      .filter((w) => w.length > 2)
  );
}

function termTokens(term: NasaTerm): Set<string> {
  return tokenize(`${term.term} ${term.definition}`);
}

/** Keyword overlap retrieval over the local NASA term glossary. */
export function retrieveRelevantTerms(
  query: string,
  k = 6
): RetrievedTerm[] {
  const qTokens = tokenize(query);
  if (qTokens.size === 0) return nasaTerms.slice(0, k).map((t) => ({ ...t, score: 0 }));

  const scored: RetrievedTerm[] = nasaTerms.map((term) => {
    const tokens = termTokens(term);
    let overlap = 0;
    tokens.forEach((t) => {
      if (qTokens.has(t)) overlap += 1;
    });
    const name = term.term.toLowerCase();
    const queryLower = query.toLowerCase();
    if (queryLower.includes(name)) overlap += 4;
    const nameParts = name.split(/[^a-z0-9]+/).filter((w) => w.length > 2);
    for (const p of nameParts) {
      if (qTokens.has(p)) overlap += 2;
    }
    return { ...term, score: overlap };
  });

  scored.sort((a, b) => b.score - a.score);
  const withHits = scored.filter((t) => t.score > 0);
  const picked = (withHits.length > 0 ? withHits : scored).slice(0, k);
  return picked;
}

export function formatRetrievedContext(terms: RetrievedTerm[]): string {
  if (terms.length === 0) return "";
  return terms
    .map((t) => `- **${t.term}**: ${t.definition}`)
    .join("\n");
}
