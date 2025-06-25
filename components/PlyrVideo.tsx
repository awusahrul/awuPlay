import React, { useEffect, useRef } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

interface Awusahrul_PropertiPlyrVideo {
  awusahrul_sumber_video: string;
  awusahrul_poster_url: string;
  awusahrul_saat_video_error: () => void; 
}

const PlyrVideo: React.FC<Awusahrul_PropertiPlyrVideo> = ({ 
  awusahrul_sumber_video, 
  awusahrul_poster_url,
  awusahrul_saat_video_error 
}) => {
  const awusahrul_ref_video = useRef<HTMLVideoElement>(null);
  const awusahrul_ref_pemutar = useRef<Plyr | null>(null);

  useEffect(() => {
    if (awusahrul_ref_video.current) {
      const awusahrul_pemutar_video = new Plyr(awusahrul_ref_video.current, {
        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
      });
      
      awusahrul_ref_pemutar.current = awusahrul_pemutar_video;
      awusahrul_pemutar_video.on('error', awusahrul_saat_video_error);
    }

    return () => {
      awusahrul_ref_pemutar.current?.destroy();
    };
  }, [awusahrul_saat_video_error]);

  useEffect(() => {
    const awusahrul_pemutar_video = awusahrul_ref_pemutar.current;

    if (awusahrul_pemutar_video && awusahrul_sumber_video) {
      awusahrul_pemutar_video.source = {
        type: 'video',
        title: 'Video Streaming',
        sources: [
          {
            src: awusahrul_sumber_video,
            type: 'video/mp4',
          },
        ],
        poster: awusahrul_poster_url,
      };
    }
  }, [awusahrul_sumber_video, awusahrul_poster_url]);

  return (
    <video
      ref={awusahrul_ref_video}
      playsInline
      crossOrigin="anonymous"
      poster={awusahrul_poster_url}
    >
        Browser Anda tidak mendukung tag video.
    </video>
  );
};

export default PlyrVideo;
