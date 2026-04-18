import { useEffect, useRef, useState } from "react";
import "../styles/Pulse.css";
import { FaUserCircle, FaHome, FaBolt, FaQuestionCircle, FaFileAlt, FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { Link } from "react-router-dom";
import BASE_URL from "../config/config";

function PulsePage() {
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/upload/videos`)
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(err => console.log(err));
  }, []);

  // 🔥 Auto play
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;

          if (entry.isIntersecting) {
            video.play().catch(() => {}); // 🔥 avoid autoplay error
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.7 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [videos]);

  // 🎮 play/pause
  const togglePlay = (video) => {
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  // 🔊 mute toggle
  const toggleMute = (video) => {
    if (!video) return;
    video.muted = !video.muted;
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">e-Book</div>

        <ul className="nav-links">
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/pulse">Pulse</Link></li>
          <li><Link to="/pyqs">PYQs</Link></li>
          <li><Link to="/quiz">Quiz</Link></li>
          <li><Link to="/profile"><FaUserCircle size={24} /></Link></li>
          <li>
            <Link to="/admin/upload"><MdAdminPanelSettings size={24} /></Link>
          </li>
        </ul>
      </nav>

      <div className="reels-container">
        {videos.map((v, i) => (
          <div className="reel" key={v._id}>
            <video
              ref={(el) => (videoRefs.current[i] = el)}
              src={v.fileUrl} // ✅ FIXED
              loop
              muted // 🔥 autoplay work panna
              playsInline
              className="video"
              onClick={(e) => togglePlay(e.target)}
            />

            <div className="controls">
              <button onClick={() => togglePlay(videoRefs.current[i])}>
                {videoRefs.current[i]?.paused ? <FaPlay /> : <FaPause />}
              </button>

              <button onClick={() => toggleMute(videoRefs.current[i])}>
                {videoRefs.current[i]?.muted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bottom-nav">
        <Link to="/home"><FaHome size={24} /></Link>
        <Link to="/pulse"><FaBolt size={24} /></Link>
        <Link to="/pyqs"><FaFileAlt size={24} /></Link>
        <Link to="/quiz"><FaQuestionCircle size={24} /></Link>
        <Link to="/profile"><FaUserCircle size={24} /></Link>
      </div>
    </>
  );
}

export default PulsePage;