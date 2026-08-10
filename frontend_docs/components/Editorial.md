# `frontend/src/components/Editorial.jsx`

**Source:** `frontend/src/components/Editorial.jsx`  
**Doc path:** `frontend_docs/components/Editorial.md`

# File Purpose

Video editorial player for a problem, showing a YouTube iframe or an empty state when no video URL exists.

# Responsibilities

- Render placeholder when `youtubeUrl` is missing.
- Parse `youtubeUrl` to extract the `videoId` (supports both standard and `youtu.be` links).
- Render a privacy-enhanced YouTube iframe (`youtube-nocookie.com`).

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `Editorial` | default export | Player UI |
| Props | `youtubeUrl` | From problem document |

# Internal Logic

1. If `!youtubeUrl`: renders centered empty state with `Video` icon from `lucide-react`.
2. Tries to extract `videoId`:
   - If `youtu.be`, takes the pathname slice.
   - Else, uses `searchParams.get('v')`.
3. Returns an `<iframe>` configured for autoplay and fullscreen.

# Inputs and Outputs

| Prop | Usage |
|------|--------|
| `youtubeUrl` | parsed to `videoId` for iframe src |

# Dependencies

- `lucide-react`
- `../styles/problem/editorialStyles`

# Used By

- [`../pages/ProblemPage.md`](../pages/ProblemPage.md) — left tab `editorial`, props from `problem.secureUrl`, `thumbnailUrl`, `duration`

# Common Risks / Notes

- `togglePlayPause` sets `isPlaying` optimistically; may desync if browser blocks autoplay.
- No keyboard accessibility for seek bar beyond native range input.

# Last Reviewed: 2026-05-18
