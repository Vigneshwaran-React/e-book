import { useEffect, useState } from "react";
import "../styles/Profile.css";
import { RiUser3Fill } from "react-icons/ri";
import {Link} from 'react-router-dom'
import BASE_URL from "../config/config";

function Profile() {
  const [user, setUser] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
  const email = localStorage.getItem("email");

  if (!email) {
    console.log("No email found ");
    return;
  }

  fetch(`${BASE_URL}/api/auth/me/${email}`)
    .then(res => res.json())
    .then(data => {
      console.log("USER:", data);
      setUser(data);
    })
    .catch(err => console.log(err));

  let start = Number(localStorage.getItem("startTime"));

  if (!start) {
    start = Date.now();
    localStorage.setItem("startTime", start);
  }

  const interval = setInterval(() => {
    const now = Date.now();
    const diff = Math.floor((now - start) / 1000);
    setTimeSpent(diff);
  }, 1000);

  return () => clearInterval(interval);
}, []);

  // ⏱️ format time
  const formatTime = (sec) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;

    return `${hrs}h ${mins}m ${secs}s`;
  };

  if (!user) return <h2 style={{ color: "white" }}>Loading...</h2>;

  return (
    <>
    <div>
      <Link to="/home" className="back-btn">← Back</Link>
    </div>
    <div className="profile-container">
      <h1> <RiUser3Fill/> Profile</h1>

      <div className="profile-card">
        <p><b>Username:</b> {user.username}</p>
        <p><b>Email:</b> {user.email}</p>

        <hr />

        <p><b>Time Spent:</b> ⏱ {formatTime(timeSpent)}</p>
      </div>

      <button
        className="logout-btn"
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
      >
        Logout
      </button>
    </div>
    </>
  );
}

export default Profile;