// Background Video Component
import React from 'react';
import '../index.css';

const BackgroundVideo = ({ videoSrc = '/3d-background-video.mp4' }) => {
  return (
    <>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="background-video"
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="video-overlay"></div>
    </>
  );
};

export default BackgroundVideo;
