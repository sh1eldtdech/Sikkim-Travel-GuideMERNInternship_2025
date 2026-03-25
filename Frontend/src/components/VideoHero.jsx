import React, { useRef, useEffect } from 'react';

const VideoHero = ({ src, className }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only attempt to play if intersection is observed
        if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => {
                // Ignore autoplay restrictions issues explicitly
            });
        } else {
            videoRef.current?.pause();
        }
      },
      { threshold: 0.3 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <video ref={videoRef} className={className} muted loop playsInline preload="none">
      <source src={src} type="video/mp4" />
    </video>
  );
};

export default VideoHero;
