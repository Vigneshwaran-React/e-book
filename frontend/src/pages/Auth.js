import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config/config";
import "../styles/auth.css";

function Auth() {
  const [isSignup, setIsSignup] = useState(true);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  // 🔥 SEND OTP
  const sendOTP = async () => {
    if (!email || !username) {
      return alert("Enter email & username ⚠️");
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username }),
      });

      const data = await res.json();

      if (data.success) {
        setStep(2);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 VERIFY OTP
  const verifyOTP = async () => {
    if (!otp) return alert("Enter OTP ⚠️");

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (data.success) {
        setStep(3);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Error ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SET PASSWORD
  const setPass = async () => {
    if (!password) return alert("Enter password ⚠️");

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/auth/set-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Signup Success 🎉");
        setIsSignup(false);
        setStep(1);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Error ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 LOGIN
  const login = async () => {
    if (!email || !password) {
      return alert("Enter email & password ⚠️");
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
        navigate("/home");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="bg-animation"></div>

      <div className="card">
        <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>

        {loading && <p>Processing... ⏳</p>}

        {/* USERNAME */}
        {isSignup && step === 1 && (
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}

        {/* EMAIL */}
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* STEP 1 */}
        {isSignup && step === 1 && (
          <button onClick={sendOTP}>Send OTP</button>
        )}

        {/* STEP 2 */}
        {isSignup && step === 2 && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={verifyOTP}>Verify OTP</button>
          </>
        )}

        {/* STEP 3 */}
        {isSignup && step === 3 && (
          <>
            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Set Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <button onClick={setPass}>Complete Signup</button>
          </>
        )}

        {/* LOGIN */}
        {!isSignup && (
          <>
            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "👁️" : "🙈"}
              </span>
            </div>

            <button onClick={login}>Login</button>
          </>
        )}

        {/* TOGGLE */}
        <p>
          {isSignup ? "Already have account?" : "New user?"}
          <span
            onClick={() => {
              setIsSignup(!isSignup);
              setStep(1);
            }}
          >
            {isSignup ? " Login" : " Signup"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;