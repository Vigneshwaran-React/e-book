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
  const videoRefs = useRef([]);
  const [, setRefresh] = useState(false);


  // =====================================================
  // GET VIDEOS
  // =====================================================

  useEffect(() => {
    fetch(`${BASE_URL}/api/upload/videos`)
      .then((res) => res.json())
      .then((data) => {
        console.log("VIDEOS:", data);
        setVideos(data);
      })
      .catch((err) => {
        console.log("VIDEO FETCH ERROR:", err);
      });
  }, []);


  // =====================================================
  // AUTO PLAY BASED ON SCROLL
  // =====================================================

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;

          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Browser may block autoplay with sound.
            });
          } else {
            video.pause();
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
  }, [videos]);


  // =====================================================
  // PLAY / PAUSE
  // =====================================================

  const togglePlay = (video) => {
    if (!video) return;

    if (video.paused) {
      video.play().catch((err) => {
        console.log("PLAY ERROR:", err);
      });
    } else {
      video.pause();
    }

    setRefresh((prev) => !prev);
  };


  // =====================================================
  // MUTE / UNMUTE
  // =====================================================

  const toggleMute = (video) => {
    if (!video) return;

    video.muted = !video.muted;

    setRefresh((prev) => !prev);
  };


  return (
    <>
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


      <div className="reels-container">
        {videos.map((v, i) => {

          // Cloudinary URL or old local URL support
          const finalVideoUrl = v.fileUrl?.startsWith("http")
            ? v.fileUrl
            : `${BASE_URL}${v.fileUrl}`;


          return (
            <div className="reel" key={v._id}>

              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                src={finalVideoUrl}
                loop
                playsInline
                muted
                preload="metadata"
                className="video"
                onClick={(e) => togglePlay(e.currentTarget)}
              />


              <div className="controls">

                <button
                  onClick={() =>
                    togglePlay(videoRefs.current[i])
                  }
                >
                  {videoRefs.current[i]?.paused
                    ? <FaPlay />
                    : <FaPause />
                  }
                </button>


                <button
                  onClick={() =>
                    toggleMute(videoRefs.current[i])
                  }
                >
                  {videoRefs.current[i]?.muted
                    ? <FaVolumeMute />
                    : <FaVolumeUp />
                  }
                </button>

              </div>

            </div>
          );
        })}
      </div>


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