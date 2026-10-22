# StellarForge Knowledge Base Embeddings

This directory is the on-disk store for vector embeddings derived from the external reference sources indexed in `../sources.json`. These files are intended for use in semantic similarity search (e.g. retrieving the most relevant glossary entries for a query).

## Storage format

Each source gets its own JSON file named:

- `nasa_appendix_b_glossary.embeddings.json`
- `esr_sf_glossary.embeddings.json`
- `sf_encyclopedia_terminology.embeddings.json`
- `historical_dictionary_sf.embeddings.json`

### File schema

```json
{
  "sourceId": "nasa_appendix_b_glossary",
  "model": "openai/text-embedding-3-large",
  "dimension": 3072,
  "chunks": [
    {
      "chunkId": "nasa_appendix_b_glossary#a_acceptable_risk",
      "text": "Acceptable Risk: The risk that is understood and agreed to...",
      "embedding": [0.0123, -0.0044, ...]
    }
  ]
}
```

- **sourceId**: Must match an `id` from `sources.json`.
- **model** / **dimension**: Identify the embedding model used so you can regenerate or migrate later.
- **chunks**: Arbitrary-size text chunks from the source (terms, paragraphs, sections) with their numeric vector **embedding**.

## Generation pipeline (conceptual)

At build- or tooling-time, run a script or small tool that:

1. Reads `sources.json` to discover all reference sources.
2. Fetches and chunks each document (e.g. 512–1024 characters per chunk, respecting paragraph/term boundaries).
3. Sends each chunk to your embedding provider (e.g. OpenAI, local model) to get a vector.
4. Writes or updates the corresponding `*.embeddings.json` file in this directory.

Your runtime similarity search should:

- Load the appropriate `*.embeddings.json` file,
- Embed the user’s query with the same model,
- Compute cosine similarity against all chunk vectors,
- Return the top-k chunks as candidates for display or further processing.

