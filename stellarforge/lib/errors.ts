export function userFacingError(err: unknown, fallback: string): string {
  const message = err instanceof Error ? err.message : String(err);
  if (/OPENAI_API_KEY is not set/i.test(message)) {
    return "API key is not configured. Add OPENAI_API_KEY to .env.local and restart the server.";
  }
  if (/401|incorrect api key|invalid api key/i.test(message)) {
    return "The OpenAI API key was rejected. Check OPENAI_API_KEY in .env.local.";
  }
  if (/429|rate limit/i.test(message)) {
    return "Too many requests. Wait a moment and try again.";
  }
  return fallback;
}
