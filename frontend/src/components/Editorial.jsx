import { useState, useRef, useEffect } from "react";
import { Pause, Play, Video } from "lucide-react";

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Empty State
  if (!secureUrl) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-base-200 border border-base-300 rounded-2xl h-[420px] flex flex-col items-center justify-center text-center shadow-xl">
          <div className="p-6 rounded-full bg-primary/10 mb-6">
            <Video size={60} className="text-primary" />
          </div>

          <h2 className="text-3xl font-bold mb-3">
            Video Solution Coming Soon
          </h2>

          <p className="text-base-content/70 max-w-lg text-lg leading-relaxed px-6">
            The editorial video for this problem has not been uploaded yet. It
            will be available soon.
          </p>
        </div>
      </div>
    );
  }

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) {
      return "0:00";
    }

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

  // Update current time
  useEffect(() => {
    const video = videoRef.current;

    const handleTimeUpdate = () => {
      if (video) {
        setCurrentTime(video.currentTime);
      }
    };

    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, []);

  return (
    <div
      className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-base-300 bg-black"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={secureUrl}
        poster={thumbnailUrl}
        onClick={togglePlayPause}
        className="w-full aspect-video bg-black cursor-pointer"
      />

      {/* Overlay Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-5 py-4 transition-opacity duration-300 ${
          isHovering || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Controls Row */}
        <div className="flex items-center gap-4">
          {/* Play Pause */}
          <button
            onClick={togglePlayPause}
            className="btn btn-circle btn-primary btn-sm"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          {/* Current Time */}
          <span className="text-sm text-white min-w-[45px]">
            {formatTime(currentTime)}
          </span>

          {/* Progress */}
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => {
              if (videoRef.current) {
                videoRef.current.currentTime = Number(e.target.value);
              }
            }}
            className="range range-primary range-sm flex-1"
          />

          {/* Duration */}
          <span className="text-sm text-white min-w-[45px] text-right">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Editorial;
