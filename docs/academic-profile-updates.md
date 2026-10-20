# Updating Michael's academic profile

The reusable Hermes skill is [academic-profile-maintenance](skills/academic-profile-maintenance/SKILL.md). A copy is installed in Michael's active Hermes profile; this repository keeps a version-controlled backup with its verification script and tests. Keep installed and committed copies synchronized when improving the workflow.

## Example requests

> My new journal paper is published: [DOI or publisher link]. Add it to website news and publications and both CVs. Keep the short CV at two pages, then commit, push, and verify the live site and PDFs.

> Update my WHOOP experience in both CVs using these details: [...]. Show me the changes before publishing.

> Change the website publications layout to [...]. Do not change the CVs.

The skill verifies facts, checks for duplicate/preprint entries, preserves author order, updates the appropriate sources, builds, checks PDFs, and follows all affected Actions. A review-only request must not trigger production publishing. Provide acceptance status or contribution details when these are not publicly retrievable; the agent must not invent them.

## Sources and deployment

| Content | Source | Published location |
|---|---|---|
| Publications | `src/data/publications.json` | [/publications/](https://michaelcho.info/publications/) |
| News | `src/data/news.json` | [/news/](https://michaelcho.info/news/) and homepage excerpts |
| Short CV | [curriculum-vitae-2p](https://github.com/michael-j-cho/curriculum-vitae-2p), `cv.tex` + `mycitations.bib` | [/files/cv.pdf](https://michaelcho.info/files/cv.pdf) |
| Full CV | [curriculum-vitae](https://github.com/michael-j-cho/curriculum-vitae), `cv.tex` + `mycitations.bib` | [/files/cv-full.pdf](https://michaelcho.info/files/cv-full.pdf) |

```text
CV source push → LaTeX build → PDF artifact
                                  ↓ main only
                         commit PDF into website
                                  ↓
Website source push ───→ Astro build → GitHub Pages
```

The existing `.github/workflows/deploy.yml` handles website deployment. Each CV's `.github/workflows/build.yml` compiles every pushed branch, but only publishes `main`. Their existing `SITE_DEPLOY_KEY` secrets authorize website pushes and trigger its deploy Action. The generated PDFs are committed in `public/files/`; built Astro output is deployed as a Pages artifact, not committed into the source tree.

Do not create duplicate publishing Actions or replace working deploy credentials. CV publishers already retry pull/rebase/push to handle simultaneous writes to the website. There is no atomic transaction across repositories: failures must be reported per repository and repaired without rewriting history.

## Verification commands

With sibling clones of all three repositories under one workspace:

```sh
# Run from the website repository.
python3 -m unittest discover -s docs/skills/academic-profile-maintenance/scripts -p 'test_*.py' -v
python3 docs/skills/academic-profile-maintenance/scripts/verify_profile.py --workspace /path/to/workspace
# Refresh website main after both CV publishers finish, then compare deployed PDFs.
python3 docs/skills/academic-profile-maintenance/scripts/verify_profile.py --workspace /path/to/workspace --live
npm ci
npm run build
```

The script requires Python 3.9+ and Poppler's `pdfinfo`. It is read-only: it checks basic JSON structure, duplicate publication titles/DOI/arXiv identifiers, matching CV citation-key/DOI inventories, repository PDF page counts, and optionally live PDF byte equality and page availability. It deliberately does not parse full BibTeX metadata or prove author/venue consistency. The agent still reviews the requested facts, compiles changed CV sources, checks extracted PDF text and layout, and verifies the new content on live pages.

A source build succeeding is not the end: identify runs by exact source SHA, confirm the CV bots committed the expected PDFs, verify a successful website deployment containing all intended commits, and retrieve the actual live pages/PDFs.
