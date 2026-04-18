import React from 'react'
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "../styles/home.css";

function Footer() {
  return (
    <div className="bottom-nav">
            <div><Link to="/home">Home</Link></div>
            <div><Link to="/pulse">Pulse</Link></div>
            <div><Link to="/pyqs">PYQs</Link></div>
            <div><Link to="/quiz">Quiz</Link></div>
            <div><Link to='/profile'><FaUserCircle size={24} /></Link></div>
    </div>
  )
}

export default Footer