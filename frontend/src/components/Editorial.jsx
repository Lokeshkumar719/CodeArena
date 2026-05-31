import { useState, useRef, useEffect } from "react";
import { Pause, Play, Video } from "lucide-react";

import { s } from '../styles/problem/editorialStyles';

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



export default Editorial;