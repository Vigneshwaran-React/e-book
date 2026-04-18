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

  const [step, setStep] = useState(1); // 1-email, 2-otp, 3-password

  const navigate = useNavigate();

  // 🔥 SEND OTP
  const sendOTP = async () => {
    
    const res = await fetch(`${BASE_URL}/api/auth/send-otp`, {
      
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username }),
      
    }
  );

    const data = await res.json();

    if (data.success) {
      setStep(2);
    } else alert(data.message);
    console.log("EMAIL:", process.env.EMAIL_USER);
console.log("PASS:", process.env.EMAIL_PASS ? "EXISTS" : "MISSING");
  };

  // 🔥 VERIFY OTP
  const verifyOTP = async () => {
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
    } else alert(data.message);
  };

  // 🔥 SET PASSWORD
  const setPass = async () => {
    const res = await fetch(`${BASE_URL}/api/auth/set-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Signup Success...");
      setIsSignup(false);
      setStep(1);
    } else alert(data.message);
  };

  // 🔥 LOGIN
  const login = async () => {
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
    } else alert(data.message);
  };

  return (
    <div className="container">
      <div className="bg-animation"></div>

      <div className="card">
        <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>


        {/* USERNAME */}
        {isSignup && step === 1 && (
          <input
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        {/* EMAIL */}
        <input
          placeholder="Email"
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