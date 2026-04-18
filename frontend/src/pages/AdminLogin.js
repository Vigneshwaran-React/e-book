import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css"
import {Link} from "react-router-dom"

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin" && password === "1234") {
      localStorage.setItem("admin", "true");
      navigate("/admin/upload");
    } else {
      alert("Wrong credentials ");
    }
  };

  return (
    <>
    <div>
      <Link to="/home" className="back-btn">← Back</Link>
    </div>
     <div className="login-container">
    <div className="login-card">
      <h2 className="login-title">Admin Login </h2>

      <input
        className="login-input"
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="login-input"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="login-btn" onClick={handleLogin}>
        Login
      </button>
    </div>
  </div>
  </>
  );
}

export default AdminLogin;