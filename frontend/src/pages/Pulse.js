import { useEffect, useRef, useState } from "react";
import "../styles/Pulse.css";

import { FaUserCircle } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { Link } from "react-router-dom";

import {
  FaHome,
  FaBolt,
  FaQuestionCircle,
  FaFileAlt,
  FaPlay,
  FaPause,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";

import BASE_URL from "../config/config";

function PulsePage() {
  const [videos, setVideos] = useState([]);

  // true = muted, false = sound ON
  const [isMuted, setIsMuted] = useState(true);

  // Currently playing video index
  const [playingIndex, setPlayingIndex] = useState(null);

  const videoRefs = useRef([]);

  // =====================================================
  // GET VIDEOS
  // =====================================================

  useEffect(() => {
    const getVideos = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/upload/videos`);

        if (!res.ok) {
          throw new Error("Failed to fetch videos");
        }

        const data = await res.json();

        console.log("VIDEOS:", data);

        setVideos(data);
      } catch (error) {
        console.log("VIDEO FETCH ERROR:", error);
      }
    };

    getVideos();
  }, []);

  // =====================================================
  // AUTO PLAY / PAUSE BASED ON SCROLL
  // =====================================================

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;

          const index = Number(video.dataset.index);

          if (entry.isIntersecting) {
            // Pause all other videos
            videoRefs.current.forEach((otherVideo, otherIndex) => {
              if (otherVideo && otherIndex !== index) {
                otherVideo.pause();
              }
            });

            // Apply current global sound preference
            video.muted = isMuted;

            // Play visible video
            video
              .play()
              .then(() => {
                setPlayingIndex(index);
              })
              .catch((error) => {
                console.log("AUTOPLAY BLOCKED:", error);

                // Browser blocked autoplay with sound.
                // Fallback to muted autoplay.

                video.muted = true;

                setIsMuted(true);

                video
                  .play()
                  .then(() => {
                    setPlayingIndex(index);
                  })
                  .catch((playError) => {
                    console.log("VIDEO PLAY ERROR:", playError);
                  });
              });
          } else {
            video.pause();

            setPlayingIndex((currentIndex) =>
              currentIndex === index ? null : currentIndex
            );
          }
        });
      },
      {
        threshold: 0.7,
      }
    );

    videoRefs.current.forEach((video) => {
      if (video) {
        observer.observe(video);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [videos, isMuted]);

  // =====================================================
  // PLAY / PAUSE
  // =====================================================

  const togglePlay = async (video, index) => {
    if (!video) return;

    try {
      if (video.paused) {
        // Pause all other videos
        videoRefs.current.forEach((otherVideo, otherIndex) => {
          if (otherVideo && otherIndex !== index) {
            otherVideo.pause();
          }
        });

        video.muted = isMuted;

        await video.play();

        setPlayingIndex(index);
      } else {
        video.pause();

        setPlayingIndex(null);
      }
    } catch (error) {
      console.log("PLAY ERROR:", error);
    }
  };

  // =====================================================
  // GLOBAL MUTE / UNMUTE
  // =====================================================

  const toggleMute = async () => {
    const newMutedState = !isMuted;

    setIsMuted(newMutedState);

    // Apply sound preference to all videos
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = newMutedState;
      }
    });

    // When user manually turns sound ON,
    // continue playing current visible video.

    if (!newMutedState && playingIndex !== null) {
      const currentVideo = videoRefs.current[playingIndex];

      if (currentVideo) {
        try {
          await currentVideo.play();
        } catch (error) {
          console.log("UNMUTE PLAY ERROR:", error);
        }
      }
    }
  };

  return (
    <>
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="navbar">
        <div className="logo">e-Book</div>

        <ul className="nav-links">
          <li>
            <Link to="/home">Home</Link>
          </li>

          <li>
            <Link to="/pulse">Pulse</Link>
          </li>

          <li>
            <Link to="/pyqs">PYQs</Link>
          </li>

          <li>
            <Link to="/quiz">Quiz</Link>
          </li>

          <li>
            <Link to="/profile">
              <FaUserCircle size={24} />
            </Link>
          </li>

          <li className="profile-icon">
            <Link to="/admin/upload">
              <MdAdminPanelSettings size={24} />
            </Link>
          </li>
        </ul>
      </nav>

      {/* =====================================================
          REELS
      ===================================================== */}

      <div className="reels-container">
        {videos.map((videoData, index) => {
          /*
            Supports BOTH:

            New Cloudinary URL:
            https://res.cloudinary.com/...

            Old local backend URL:
            /uploads/videos/video.mp4
          */

          const finalVideoUrl = videoData.fileUrl?.startsWith("http")
            ? videoData.fileUrl
            : `${BASE_URL}${videoData.fileUrl}`;

          return (
            <div className="reel" key={videoData._id}>
              <video
                ref={(element) => {
                  videoRefs.current[index] = element;
                }}
                data-index={index}
                src={finalVideoUrl}
                loop
                playsInline
                muted={isMuted}
                preload="metadata"
                className="video"
                onClick={(event) =>
                  togglePlay(event.currentTarget, index)
                }
              />

              {/* =================================================
                  VIDEO CONTROLS
              ================================================= */}

              <div className="controls">
                {/* PLAY / PAUSE */}

                <button
                  type="button"
                  onClick={() =>
                    togglePlay(videoRefs.current[index], index)
                  }
                >
                  {playingIndex === index ? (
                    <FaPause />
                  ) : (
                    <FaPlay />
                  )}
                </button>

                {/* MUTE / UNMUTE */}

                <button
                  type="button"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <FaVolumeMute />
                  ) : (
                    <FaVolumeUp />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* =====================================================
          MOBILE BOTTOM NAV
      ===================================================== */}

      <div className="bottom-nav">
        <div>
          <Link to="/home">
            <FaHome size={24} />
          </Link>
        </div>

        <div>
          <Link to="/pulse">
            <FaBolt size={24} />
          </Link>
        </div>

        <div>
          <Link to="/pyqs">
            <FaFileAlt size={24} />
          </Link>
        </div>

        <div>
          <Link to="/quiz">
            <FaQuestionCircle size={24} />
          </Link>
        </div>

        <div>
          <Link to="/profile">
            <FaUserCircle size={24} />
          </Link>
        </div>
      </div>
    </>
  );
}

export default PulsePage;