import { useEffect, useRef, useState } from "react";
import "../styles/Pulse.css";
import { FaUserCircle } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md"
import { Link } from "react-router-dom";
import { FaHome, FaBolt, FaQuestionCircle, FaFileAlt } from "react-icons/fa";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

function PulsePage() {
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef([]);
  const [, setRefresh] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/upload/videos")
      .then(res => res.json())
      .then(data => setVideos(data));
  }, []);

  // 🔥 Auto play based on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;

          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.7 } // 70% visible
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [videos]);

  // 🎮 play/pause toggle
 const togglePlay = (video) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  setRefresh(prev => !prev); // 🔥 force update
};

const toggleMute = (video) => {
  video.muted = !video.muted;
  setRefresh(prev => !prev); // 🔥 force update
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
          <li><Link to='/profile'><FaUserCircle size={24} /></Link></li>
          <li className="profile-icon">
            <Link to="/admin/upload"><MdAdminPanelSettings size={24} /></Link>
          </li>
        </ul>
      </nav>
    <div className="reels-container">
      {videos.map((v, i) => (
        <div className="reel" key={v._id}>
          
          <video
  ref={(el) => (videoRefs.current[i] = el)}
  src={`http://localhost:5000${v.fileUrl}`}
  loop
  playsInline
  className="video"
  onClick={(e) => togglePlay(e.target)}
/>

          {/* 🔥 Controls */}
          <div className="controls">

  {/* PLAY / PAUSE */}
  <button onClick={() => togglePlay(videoRefs.current[i])}>
    {videoRefs.current[i]?.paused ? <FaPlay /> : <FaPause />}
  </button>

  {/* MUTE / UNMUTE */}
  <button onClick={() => toggleMute(videoRefs.current[i])}>
    {videoRefs.current[i]?.muted ? <FaVolumeMute /> : <FaVolumeUp />}
  </button>

</div>

        </div>
      ))}
    </div>
    <div className="bottom-nav">
        <div><Link to="/home"><FaHome size={24}/></Link></div>
        <div><Link to="/pulse"><FaBolt size={24} /></Link></div>
        <div><Link to="/pyqs"><FaFileAlt size={24} /> </Link></div>
        <div><Link to="/quiz"><FaQuestionCircle size={24} /></Link></div>
        <div><Link to='/profile'><FaUserCircle size={24} /></Link></div>
      </div>
    </>
  );
}

export default PulsePage;