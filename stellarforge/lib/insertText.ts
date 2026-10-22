export function insertAtCursor(
  text: string,
  insertion: string,
  start: number,
  end: number
): { value: string; cursor: number } {
  const before = text.slice(0, start);
  const after = text.slice(end);
  const spaceBefore = before.length > 0 && !/\s$/.test(before) ? " " : "";
  const spaceAfter = after.length > 0 && !/^\s/.test(after) ? " " : "";
  const inserted = spaceBefore + insertion + spaceAfter;
  return {
    value: before + inserted + after,
    cursor: start + inserted.length,
  };
}

export function extractRewrittenScene(content: string): string | null {
  const match = content.match(
    /##\s*Rewritten Scene\s*\n([\s\S]*?)(?=\n##\s|$)/i
  );
  const scene = match?.[1]?.trim();
  return scene && scene.length > 0 ? scene : null;
}
