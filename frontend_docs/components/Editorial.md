# `frontend/src/components/Editorial.jsx`

**Source:** `frontend/src/components/Editorial.jsx`  
**Doc path:** `frontend_docs/components/Editorial.md`

# File Purpose

Video editorial player for a problem: custom controls, progress scrubber, or empty state when no video URL exists.

# Responsibilities

- Render placeholder when `secureUrl` is missing.
- HTML5 `<video>` with poster, play/pause, time display, range seek.
- Track `currentTime` via `timeupdate` listener.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `Editorial` | default export | Player UI |
| Props | `secureUrl`, `thumbnailUrl`, `duration` | From problem document (Cloudinary) |
| `formatTime` | helper | Seconds → `M:SS` |
| `togglePlayPause` | handler | Play/pause + `isPlaying` state |

# Internal Logic

- If `!secureUrl`: centered empty state with `Video` icon from `lucide-react`.
- Otherwise: video `onClick` toggles play; bottom overlay shows on hover or when paused (`isHovering || !isPlaying`).
- Range `max={duration || 0}`; onChange sets `videoRef.current.currentTime`.

# Inputs and Outputs

| Prop | Usage |
|------|--------|
| `secureUrl` | `video` src |
| `thumbnailUrl` | `poster` |
| `duration` | Total time for scrubber and label |

# Dependencies

`react` (`useState`, `useRef`, `useEffect`), `lucide-react` (`Pause`, `Play`, `Video`).

# Used By

- [`../pages/ProblemPage.md`](../pages/ProblemPage.md) — left tab `editorial`, props from `problem.secureUrl`, `thumbnailUrl`, `duration`

# API Connections

None directly; URLs produced by backend/Cloudinary via [`AdminUpload.md`](./AdminUpload.md).

# Database Connections

None.

# State/Context Dependencies

Local: `isPlaying`, `currentTime`, `isHovering`; ref `videoRef`.

# Related Files

- [`AdminUpload.md`](./AdminUpload.md)
- [`../pages/ProblemPage.md`](../pages/ProblemPage.md)

# Next Files To Read

1. Backend solution video model
2. [`AdminUpload.md`](./AdminUpload.md)

# Common Risks / Notes

- `togglePlayPause` sets `isPlaying` optimistically; may desync if browser blocks autoplay.
- No keyboard accessibility for seek bar beyond native range input.

# Last Reviewed: 2026-05-18
