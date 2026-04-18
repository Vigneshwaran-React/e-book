import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BASE_URL from "../config/config";

function SubjectPage() {
  const { classId, subject } = useParams();
  const [pdfLink, setPdfLink] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/api/book?classId=${classId}&subject=${subject}`)
      .then(res => res.json())
      .then(data => {
        console.log("DATA:", data);
        setPdfLink(data?.pdfUrl);
      })
      .catch(err => console.log(err));
  }, [classId, subject]);

  if (!pdfLink) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <div>
        <Link to="/home" className="back-btn">← Back</Link>
      </div>

      <div style={{ height: "100vh" }}>
        <iframe
          src={`${BASE_URL}${pdfLink}#toolbar=0&navpanes=0&scrollbar=0`}
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