import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {Link} from 'react-router-dom'
function SubjectPage() {
  const { classId, subject } = useParams();
  const [pdfLink, setPdfLink] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/book?classId=${classId}&subject=${subject}`)
      .then(res => res.json())
      .then(data => {
        console.log("DATA:", data); // 🔥 check
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
  {pdfLink ? (
    <iframe
      src={`http://localhost:5000${pdfLink}#toolbar=0&navpanes=0&scrollbar=0`}
      title="Book Viewer"
      width="100%"
      height="100%"
      style={{ border: "none" }}
    />
  ) : (
    <p>Loading PDF...</p>
  )}
</div>
</>
  );
}

export default SubjectPage;