import "../styles/home.css";
import { FaUserCircle } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md"
import { Link } from "react-router-dom";
import bgVideo from "../assets/bg.mp4";
import { FaHome, FaBolt, FaQuestionCircle, FaFileAlt } from "react-icons/fa";

function Home() {
  // const navigate = useNavigate
  return (
    <div className="home-container">

      {/* NAVBAR */}
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

      {/* HERO */}
      <div className="hero">

        {/* VIDEO BACKGROUND */}
        <video autoPlay loop muted className="bg-video">
          <source src={bgVideo} type="video/mp4" />
        </video>

        {/* CONTENT */}
        <div className="hero-content">
          <h1>Select Your Class</h1>

          <div className="card-container">
            <div className="book-card">
              <Link to="/class/7">7</Link>
            </div>
            <div className="book-card">
              <Link to="/class/8">8</Link>
            </div>
            <div className="book-card">
              <Link to="/class/9">9</Link>
            </div>
            <div className="book-card">
              <Link to="/class/10">10</Link>
            </div>
            <div className="book-card">
              <Link to="/class/11">11</Link>
            </div>
            <div className="book-card">
              <Link to="/class/12">12</Link>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM NAV (mobile) */}
      <div className="bottom-nav">
        <div><Link to="/home"><FaHome size={24}/></Link></div>
        <div><Link to="/pulse"><FaBolt size={24} /></Link></div>
        <div><Link to="/pyqs"><FaFileAlt size={24} /> </Link></div>
        <div><Link to="/quiz"><FaQuestionCircle size={24} /></Link></div>
        <div><Link to='/profile'><FaUserCircle size={24} /></Link></div>
      </div>

    </div>
  );
}

export default Home;