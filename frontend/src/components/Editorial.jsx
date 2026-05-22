import { useState, useRef, useEffect } from "react";
import { Pause, Play, Video } from "lucide-react";

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    const handleTimeUpdate = () => { if (video) setCurrentTime(video.currentTime); };
    const handleEnded = () => setIsPlaying(false);
    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("ended", handleEnded);
      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("ended", handleEnded);
      };
    }
  }, [secureUrl]);

  // ── Empty State ──
  if (!secureUrl) {
    return (
      <div style={s.wrap}>
        <div style={s.emptyState}>
          <div style={s.emptyIconWrap}>
            <Video size={48} color="#6366f1" />
          </div>
          <h2 style={s.emptyTitle}>Video Solution Coming Soon</h2>
          <p style={s.emptyText}>
            The editorial video for this problem has not been uploaded yet. It will be available soon.
          </p>
        </div>
      </div>
    );
  }

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div style={s.wrap}>
      <div
        style={s.playerWrap}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Video */}
        <video
          ref={videoRef}
          src={secureUrl}
          poster={thumbnailUrl}
          onClick={togglePlayPause}
          style={s.video}
        />

        {/* Centre play overlay on pause */}
        {!isPlaying && (
          <div style={s.centrePlay} onClick={togglePlayPause}>
            <div style={s.centrePlayBtn}>
              <Play size={28} color="#fff" style={{ marginLeft: "3px" }} />
            </div>
          </div>
        )}

        {/* Bottom Controls */}
        <div style={{ ...s.controls, opacity: isHovering || !isPlaying ? 1 : 0 }}>
          {/* Progress bar */}
          <div style={s.progressTrack}>
            <div style={{ ...s.progressFill, width: `${progress}%` }} />
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={(e) => {
                if (videoRef.current) videoRef.current.currentTime = Number(e.target.value);
              }}
              style={s.rangeInput}
            />
          </div>

          {/* Controls row */}
          <div style={s.controlsRow}>
            <button onClick={togglePlayPause} style={s.playBtn}>
              {isPlaying
                ? <Pause size={16} color="#fff" />
                : <Play size={16} color="#fff" style={{ marginLeft: "2px" }} />}
            </button>
            <span style={s.timeText}>{formatTime(currentTime)}</span>
            <div style={{ flex: 1 }} />
            <span style={s.timeText}>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const s = {
  wrap: { width: "100%", maxWidth: "896px", margin: "0 auto", fontFamily: "'Sora', sans-serif" },

  // Empty state
  emptyState: { background: "#0c1018", border: "1px solid #1e2738", borderRadius: "16px", minHeight: "380px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "48px 32px" },
  emptyIconWrap: { background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "50%", width: "88px", height: "88px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" },
  emptyTitle: { fontSize: "22px", fontWeight: 700, color: "#f9fafb", marginBottom: "12px" },
  emptyText: { fontSize: "14px", color: "#6b7280", maxWidth: "420px", lineHeight: 1.7 },

  // Player
  playerWrap: { position: "relative", background: "#000", borderRadius: "16px", overflow: "hidden", border: "1px solid #1e2738", boxShadow: "0 24px 48px rgba(0,0,0,0.6)" },
  video: { width: "100%", aspectRatio: "16/9", display: "block", background: "#000", cursor: "pointer" },

  // Centre play button
  centrePlay: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  centrePlayBtn: { background: "rgba(99,102,241,0.85)", borderRadius: "50%", width: "64px", height: "64px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 8px rgba(99,102,241,0.2)", backdropFilter: "blur(4px)" },

  // Bottom overlay
  controls: { position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)", padding: "32px 16px 14px", transition: "opacity 0.25s ease" },
  progressTrack: { position: "relative", height: "4px", background: "#1e2738", borderRadius: "999px", marginBottom: "10px", cursor: "pointer" },
  progressFill: { height: "100%", background: "linear-gradient(90deg, #6366f1, #a5b4fc)", borderRadius: "999px", pointerEvents: "none" },
  rangeInput: { position: "absolute", inset: 0, width: "100%", opacity: 0, cursor: "pointer", height: "100%", margin: 0 },
  controlsRow: { display: "flex", alignItems: "center", gap: "10px" },
  playBtn: { background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.35)", borderRadius: "50%", width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 },
  timeText: { fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.75)", fontFamily: "monospace", minWidth: "38px" },
};

export default Editorial;