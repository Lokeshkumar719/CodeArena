import { Video } from 'lucide-react';

import { s } from '../styles/problem/editorialStyles';

const Editorial = ({ youtubeUrl }) => {
  if (!youtubeUrl) {
    return (
      <div style={s.wrap}>
        <div style={s.emptyState}>
          <div style={s.emptyIconWrap}>
            <Video size={48} color="#6366f1" />
          </div>

          <h2 style={s.emptyTitle}>Video Solution Coming Soon</h2>

          <p style={s.emptyText}>
            The editorial video for this problem has not been uploaded yet. It will be available
            soon.
          </p>
        </div>
      </div>
    );
  }

  let videoId = '';

  try {
    const url = new URL(youtubeUrl);

    if (url.hostname.includes('youtu.be')) {
      videoId = url.pathname.slice(1);
    } else {
      videoId = url.searchParams.get('v') || '';
    }
  } catch {
    videoId = '';
  }

  return (
    <div style={s.wrap}>
      <div style={s.playerWrap}>
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title="Solution Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={s.iframe}
        />
      </div>
    </div>
  );
};

export default Editorial;
