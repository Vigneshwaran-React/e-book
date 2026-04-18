import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useEffect, useState } from "react";
import "../styles/pdf.css";

function PdfViewer() {
  const location = useLocation();
  const navigate = useNavigate();

  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    // try from state
    if (location.state?.url) {
      setPdfUrl(location.state.url);
      localStorage.setItem("pdfUrl", location.state.url); // backup
    } else {
      // fallback from localStorage
      const saved = localStorage.getItem("pdfUrl");
      if (saved) setPdfUrl(saved);
    }
  }, [location.state]);

  if (!pdfUrl) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>PDF not found ❌</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="pdf-container">
      <div className="pdf-back" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </div>

      <iframe
        src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
        title="PDF Viewer"
        className="pdf-frame"
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
    </div>
  );
}

export default PdfViewer;