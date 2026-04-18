import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useEffect, useState } from "react";
import "../styles/pdf.css";

function PdfViewer() {
  const location = useLocation();
  const navigate = useNavigate();

  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    if (location.state?.url) {
      setPdfUrl(location.state.url);
      localStorage.setItem("pdfUrl", location.state.url);
    } else {
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

  // 🔥 IMPORTANT FIX
  const viewUrl = pdfUrl.replace(
    "/upload/",
    "/upload/fl_attachment:false/"
  );

  return (
    <div className="pdf-container">
      <div className="pdf-back" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </div>

      <iframe
        src={viewUrl}   // ✅ use modified URL
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