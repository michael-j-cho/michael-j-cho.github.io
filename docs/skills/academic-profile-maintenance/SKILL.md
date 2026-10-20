---
name: academic-profile-maintenance
description: Use when updating Michael's website or CVs.
version: 0.1.0
author: Michael Cho (michael-j-cho), Hermes Agent
license: MIT
platforms: [linux, macos]
metadata:
  hermes:
    tags: [website, CV, publications, academic, GitHub]
---

# Michael's website and CV maintenance

Coordinate truthful, consistent edits across Michael's Astro website, two-page CV, and full academic CV. Support publications, news, awards, employment, biographies, skills, and design changes. Preserve the distinct short/full formats; do not regenerate either CV from the website.

## When to use

- Michael asks to update his website, CV, resume, publications, news, or academic profile.
- A new journal paper, conference paper, acceptance, preprint, award, or role needs propagation.
- Michael requests committing/pushing these changes or diagnosing their publishing Actions.
- Not for unrelated GitHub projects or job-specific resume tailoring unless explicitly requested.

## Prerequisites and repository map

Use `terminal` with authenticated `gh` and `git`. Never request tokens in chat. Use Node/npm for Astro; `latexmk` with Biber/TeX Live for local CV builds, or existing GitHub Actions for preview compilation. PDF verification needs `pdfinfo` and `pdftotext` (Poppler).

Repositories (owner `michael-j-cho`, default branch currently `main`):

| Repository | Editable source | Published result |
|---|---|---|
| `michael-j-cho.github.io` | `src/data/publications.json`, `src/data/news.json`; Astro under `src/` | `https://michaelcho.info/` |
| `curriculum-vitae-2p` | `cv.tex`, `mycitations.bib` | `https://michaelcho.info/files/cv.pdf` |
| `curriculum-vitae` | `cv.tex`, `mycitations.bib` | `https://michaelcho.info/files/cv-full.pdf` |

Working clones normally live under `~/Hermes/academic-profile/<repository>`. Verify paths and remotes; do not access the user's personal Syncthing store separately. Clone missing repositories with `terminal(command="gh repo clone michael-j-cho/<repository> <workspace>/<repository>")`.

## Procedure

### 1. Establish scope and clean state

1. Read the user's exact request; decide which repositories and sections are affected. A new paper normally touches website publications, website news, and both bibliographies. Editing only styling need not touch the CVs.
2. Check `gh auth status`, `git remote -v`, `git status --short`, current branch, and `git fetch origin` in each affected clone using `terminal`. Read any repository agent instructions before editing.
3. If clean, update the base with `git pull --ff-only`. Never discard/stash user work automatically, force push, reset published history, or commit unrelated changes. Use an isolated worktree when necessary.
4. Inspect current sources and `.github/workflows/` with `read_file`/`search_files`; do not assume this map never changes.
5. Build an explicit checklist of destinations and facts. Ask only for material missing facts that cannot be retrieved. Do not invent a paper to demonstrate the workflow.

### 2. Ground the update

- Treat user-supplied corrections and original documents as evidence. Retrieve publisher/DOI, proceedings, or arXiv metadata where available; preserve title, ordered authors, diacritics, venue, DOI, dates, and acceptance/publication status.
- Do not turn a submitted manuscript into an accepted or peer-reviewed paper. Keep preprint links distinct from final publisher links. If an existing preprint is now published, update the existing entry rather than duplicate it.
- Dates can differ legitimately: news announcement month, online publication date, proceedings year, and conference date are not interchangeable. State unresolved discrepancies rather than silently normalizing them.
- Never infer research contributions, employment titles, performance metrics, or causal claims from coauthorship. Ask for missing private contribution details.
- Match by DOI/arXiv identifier first, then normalized title; check duplicates before insertion. Existing data is not proof of correctness; fix only relevant discrepancies or flag others separately.

### 3. Apply consistent edits

Use `patch` for targeted edits and `write_file` for new files; read existing files before replacements.

**Website:**
- `src/data/publications.json` is an array. Each entry has `title`, ordered `authors` array, `venue`, integer `year`, `type` (`journal` or `conference`), `highlight`, and `links` array of `{text, url}`. Read the current rendering/types before representing a new publication status or adding schema fields.
- `src/data/news.json` uses `date` in `YYYY.MM`, `title`, `description`, and optional `links` with `{text, url}`. Keep newest first; a separate news item is appropriate for a genuinely new milestone, not every metadata correction.
- Write a brief, evidence-supported description, not unsupported promotional claims. Use stable DOI URLs for final publications. Public local assets belong in `public/files/`, linked as `/files/<name>`.
- Read `src/pages/index.astro`, `news.astro`, and `publications.astro` to understand homepage excerpts, ordering, and structured data. Do not duplicate content manually into generated HTML.
- Biography edits may affect `src/content/about.md`, `src/content/authors/michael.md`, `src/consts.ts`, and page components; discover actual occurrences rather than blanket replacements.

**CVs:**
- Update `mycitations.bib` in BOTH CV repositories; retain complete ordered authors in the source even when the short PDF truncates display. Use unique stable citation keys, `@article`/`@inproceedings` as appropriate, biblatex fields, and protect acronym capitalization. Do not edit `mycitations_backup.bib` as if it were the source.
- Both CVs currently use `\\nocite{*}` and automatically include bibliography entries. A paper normally needs no new manual citation in `cv.tex`.
- Match each template's existing date/sorting convention; verify rendered chronology. Keep DOI/author/title/venue consistent across the three repos, allowing legitimate conference/proceedings-year differences.
- Short CV: currently `\\toggletrue{cvtruncate}`, bold Cho, initials, truncate after Michael's position; preserve two-author lists. Require exactly two pages unless Michael explicitly changes that constraint. Prefer concise prose and whitespace adjustments over unreadably small text or silently dropping publications/experience. Ask before material content cuts.
- Full CV: preserve full author display (`cvtruncate` off) and detailed sections; do not impose a two-page cap.
- Update relevant experience/research prose only when supported by the user's contribution statement; a new coauthored paper does not automatically justify a new accomplishment claim.

### 4. Validate before publishing

1. Run the bundled read-only audit with `terminal(command="python3 <skill-dir>/scripts/verify_profile.py --workspace <workspace>")`. It checks basic JSON structure, duplicate titles/identifiers, matching bibliography key/DOI inventories, and existing repository PDF page counts. This is not a BibTeX parser, author-consistency proof, visual review, or replacement for compilation.
2. Website: `terminal(command="npm ci && npm run build", workdir="<website-clone>", timeout=180)`. Build includes `astro check`. Inspect `dist/news/index.html` and `dist/publications/index.html` for the requested change. Flag pre-existing dependency audit findings separately; do not run `npm audit fix --force` as part of content maintenance.
3. CVs: if TeX is installed, compile in a disposable copy/worktree via `latexmk -pdf -interaction=nonstopmode -halt-on-error cv.tex`; inspect Biber/LaTeX warnings, unresolved references, overfull boxes, and extracted text. Do not mistake the already-published website PDF for a build of new CV source.
4. If TeX is unavailable, push a descriptive preview branch in each CV repo (only when pushing is authorized); Actions build every branch but publish only `main`. Resolve the exact source-SHA run, wait with `gh run watch <id> --exit-status -R <owner/repo>`, and download its `cv` artifact with `gh run download <id> -n cv -D <scratch-dir> -R <owner/repo>`.
5. Run `pdfinfo` on each newly compiled artifact (short exactly two pages); use `pdftotext -layout` to verify the new citation, author position, links, and completeness. When visual tools are available, render/review page breaks and clipping; disclose if only textual checks were possible.
6. Review `git diff --check`, `git diff --stat`, and full diff for every affected repository. Account for every requested destination and every modified file. Never stage generated `dist/`, `node_modules/`, TeX intermediates, or local secrets.

### 5. Commit, push, and follow the entire deployment chain

- A request to edit/update is not blanket permission for all future public pushes. If the current request says commit/push/publish, execute after validation without redundant confirmation. Otherwise present a diff/preview and ask before publishing. Honor dry-run or review-first requests.
- For authorized routine publication/content edits, direct `main` pushes are acceptable if repository policy permits. For major design/workflow changes prefer PRs. Never bypass protections or alter deploy credentials without explicit scope.
- Stage exact paths and create focused conventional commits in each changed repository. Record each source SHA. Multi-repository publication is not atomic: report partial results precisely and do not hide a failed repository.
- Publish website source changes first; then CV source changes. CV Actions also write to website `main`, so refresh/rebase a CLEAN website clone before any later push. Never overwrite the bots' PDFs with stale local files.
- For each source SHA: use `gh run list -R <owner/repo> --commit <sha> --json databaseId,headSha,status,conclusion,url` and watch the matching run, not simply the latest run. On failure read `gh run view <id> --log-failed` and repair the root cause.
- After both CV publishes finish, fetch website `main`. Read its PDF-update commits and confirm each message identifies the expected CV source SHA. Ensure a successful website deploy includes BOTH PDF commits and the website content change (it may be a descendant commit).
- Read back the exact remote branch SHAs with `gh api repos/<owner/repo>/commits/<branch>`; allow later website bot commits rather than requiring website HEAD to remain the original human commit.
- Run the audit with `--live` after refreshing the website clone. It compares deployed PDF bytes against repository PDFs. Also retrieve live `/news/`, `/publications/`, and any affected page and verify the actual requested content. Retry boundedly for Pages/CDN propagation; do not claim deployed success from a green build alone.
- Finish with changed sections, commit/run links, live URLs, short/full page counts, and any unresolved issue. If only a preview branch was requested, do not merge or claim production updated.

## Existing GitHub Actions contract

- CV repos: `.github/workflows/build.yml`, `xu-cheng/latex-action@v3`, root `cv.tex`, `cv` artifact. Every pushed branch builds; only `refs/heads/main` publishes.
- Short copies to website `public/files/cv.pdf`; full copies to `public/files/cv-full.pdf`.
- Each CV repo uses existing `SITE_DEPLOY_KEY` to push to website. Do not expose/rotate it. The website's ordinary `GITHUB_TOKEN` cannot replace cross-repo push authorization, and bot pushes using `GITHUB_TOKEN` generally do not trigger downstream push workflows.
- Both publishers use pull/rebase/push retries because they can race writing different PDFs to the same repository. Concurrency groups are repository-scoped, not cross-repo locks.
- Website `.github/workflows/deploy.yml` builds Astro and deploys with GitHub Pages (`pages: write`, `id-token: write`). Keep working Actions rather than recreating duplicate deployments.
- To change automation, read current upstream action docs, use least privilege, preserve preview-vs-production boundaries, handle concurrent/out-of-order publishes, and test the actual source-SHA-to-live chain. A source commit succeeding does not prove the generated PDF was published.

## Pitfalls

- CV READMEs inherited from autoCV may describe an obsolete `build` branch; workflow YAML and actual live verification take precedence.
- BibTeX can contain local Zotero `file` fields and large abstracts. Do not add new machine-specific paths or publish private attachments; do not rewrite unrelated legacy metadata.
- Bibliographic spelling and publication-year inconsistencies may predate the requested edit. Flag separately; do not auto-correct authors based on guesses.
- A PDF's `\\today` footer can change on a rebuild without source-content changes. Do not expect reproducible hashes across separate TeX compilations; compare the deployed bytes with the exact published repository artifact.
- CI can finish out of order. Match source SHAs and inspect final PDF content, not only green badges.

## Verification

Done means all requested destinations edited, new-source builds checked, short CV two pages, exact commits remotely readable, matching Actions successful, and production pages/PDFs verified when publication was requested. A local skill installation alone does not publish website changes.
