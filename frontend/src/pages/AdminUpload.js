import { useState, useEffect } from "react";
import "../styles/AdminUpload.css";
import { Link, useNavigate } from "react-router-dom";
import BASE_URL from "../config/config";

function AdminUpload() {
  const [classId, setClassId] = useState("7");
  const [subject, setSubject] = useState("tamil");
  const [type, setType] = useState("aptitude");
  const [category, setCategory] = useState("math");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // 🔐 PROTECT PAGE
  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");
    if (!isAdmin) navigate("/admin/login");
  }, [navigate]);

  // 📄 PDF Upload
  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("classId", classId);
    formData.append("subject", subject);

    try {
      const res = await fetch(`${BASE_URL}/api/upload/pdf`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      alert(data.message || "PDF Uploaded 🔥");
    } catch (err) {
      console.log(err);
      alert("Upload failed ❌");
    }
  };

  // 🎥 VIDEO Upload
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);
    formData.append("classId", classId);
    formData.append("subject", subject);

    try {
      const res = await fetch(`${BASE_URL}/api/upload/video`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      alert(data.message || "Video Uploaded 🎥🔥");
    } catch (err) {
      console.log(err);
      alert("Upload failed ❌");
    }
  };

  // 📚 PYQ Upload
  const handlePyqUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("classId", classId);
    formData.append("subject", subject);

    try {
      const res = await fetch(`${BASE_URL}/api/upload/pyq`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      alert(data.message || "PYQ Uploaded 📚🔥");
    } catch (err) {
      console.log(err);
      alert("Upload failed ❌");
    }
  };

  // ❓ QUESTION Upload
  const handleQuestionUpload = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/questions/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          category,
          question,
          options,
          answer,
        }),
      });

      const data = await res.json();
      alert(data.message || "Question Added");
    } catch (err) {
      console.log(err);
      alert("Failed ❌");
    }
  };

  return (
    <>
      <Link to="/home" className="back-btn">← Back</Link>

      <button
        onClick={() => {
          localStorage.removeItem("admin");
          navigate("/admin/login");
        }}
      >
        Logout
      </button>

      <div className="upload-container">
        <h1>Admin Upload</h1>

        <div className="top-controls">
          <select onChange={(e) => setClassId(e.target.value)}>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="pulse">pulse</option>
            <option value="pyqs">pyqs</option>
          </select>

          <select onChange={(e) => setSubject(e.target.value)}>
            <option value="tamil">Tamil</option>
            <option value="english">English</option>
            <option value="maths">Maths</option>
            <option value="science">Science</option>
            <option value="social">Social</option>
            <option value="computerscience">ComputerScience</option>
            <option value="pysics">Physics</option>
            <option value="chemistry">Chemistry</option>
            <option value="video">video</option>
            <option value="pyqs">pyqs</option>
          </select>
        </div>

        <div className="top-row">
          <div className="upload-box">
            <h3>Upload PDF</h3>
            <input type="file" onChange={handlePdfUpload} />
          </div>

          <div className="upload-box">
            <h3>Upload Video</h3>
            <input type="file" onChange={handleVideoUpload} />
          </div>

          <div className="upload-box">
            <h3>Upload PYQ</h3>
            <input type="file" onChange={handlePyqUpload} />
          </div>
        </div>

        <div className="upload-box full-width">
          <h3>Add Question ❓</h3>

          <select onChange={(e) => setType(e.target.value)}>
            <option value="aptitude">Aptitude</option>
            <option value="reasoning">Reasoning</option>
          </select>

          <input
            type="text"
            placeholder="Category"
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            type="text"
            placeholder="Question"
            onChange={(e) => setQuestion(e.target.value)}
          />

          <div className="options-grid">
            {options.map((opt, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Option ${i + 1}`}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[i] = e.target.value;
                  setOptions(newOptions);
                }}
              />
            ))}
          </div>

          <input
            type="text"
            placeholder="Correct Answer"
            onChange={(e) => setAnswer(e.target.value)}
          />

          <button onClick={handleQuestionUpload}>
            Add Question
          </button>
        </div>
      </div>
    </>
  );
}

export default AdminUpload;