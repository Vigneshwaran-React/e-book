import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BASE_URL from "../config/config";

function SubjectPage() {
  const { classId, subject } = useParams();
  const [pdfLink, setPdfLink] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/api/book?classId=${classId}&subject=${subject}`)
      .then(res => res.json())
      .then(data => {
        setPdfLink(data?.pdfUrl);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, [classId, subject]);

  // 🔥 loading
  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading... ⏳</h2>;
  }

  // 🚨 no pdf
  if (!pdfLink) {
    return <h2 style={{ textAlign: "center" }}>No PDF found ❌</h2>;
  }

  return (
    <>
      <div>
        <Link to="/home" className="back-btn">← Back</Link>
      </div>

      <div style={{ height: "100vh" }}>
        <iframe
          src={`${pdfLink}#toolbar=0&navpanes=0&scrollbar=0`} // ✅ FIXED
          title="Book Viewer"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        />
      </div>
    </>
  );
}

export default SubjectPage;