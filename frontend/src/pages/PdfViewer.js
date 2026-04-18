import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/pdf.css";

function PdfViewer() {
  const location = useLocation();
  const navigate = useNavigate();

  const pdfUrl = location.state?.url;

  return (
    <div className="pdf-container">

      {/* BACK BUTTON */}
      <div className="pdf-back" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </div>

      {/* PDF VIEW */}
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