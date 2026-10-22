# StellarForge Knowledge Base

This directory indexes external canonical references for space, science, and science-fiction terminology that StellarForge can use for worldbuilding, validation, and in-app reference.

## Indexed Sources

- **NASA Systems Engineering Handbook – Appendix B: Glossary**
  - **ID**: `nasa_appendix_b_glossary`
  - **URL**: https://nasa.gov/reference/appendix-b-glossary
  - **Notes**: Authoritative NASA glossary of systems engineering terms (spaceflight, mission design, aerospace engineering). Use for realistic terminology and definitions.

- **An SF Glossary (Eric S. Raymond)**
  - **ID**: `esr_sf_glossory`
  - **URL**: http://www.catb.org/~esr/sf-words/glossary.html
  - **Notes**: Detailed glossary of SF jargon and coined terms (e.g. `ansible`, `antigrav`, `ringworld`) with etymology and usage context. Use as a primary SF-terms reference.

- **The Encyclopedia of Science Fiction – Terminology**
  - **ID**: `sf_encyclopedia_terminology`
  - **URL**: https://sf-encyclopedia.com/entry/terminology
  - **Notes**: Hub entry into the SFE’s terminology and theme articles (e.g. `Cyberpunk`, `Space Opera`, `Dyson Sphere`). Use for higher-level genre/thematic concepts.

- **Historical Dictionary of Science Fiction**
  - **ID**: `historical_dictionary_sf`
  - **URL**: https://sfdictionary.com/
  - **Notes**: Historical dictionary for SF vocabulary with first citations and usage evolution. Use when you need historically grounded usage of SF terms.

## Integration Notes

- The machine-readable index for these sources lives in `sources.json` in this directory.
- Each entry has a stable `id`, `name`, `type`, `url`, `description`, and `tags` so app code can:
  - Discover available reference sources
  - Route lookups or web views to the appropriate external reference
  - Later attach local caches or embeddings keyed by the same IDs

