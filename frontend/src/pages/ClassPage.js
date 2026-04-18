import { useParams, Link } from "react-router-dom";
import "../styles/class.css";

function ClassPage() {
  const { classId } = useParams();

  const subjects = ["tamil", "english", "maths", "science", "social"];

  return (
    <div className="class-container">

      <h1 className="class-title">{classId}th Subjects</h1>

      <div className="subject-grid">
        {subjects.map((sub) => (
          <Link key={sub} to={`/class/${classId}/${sub}`} className="subject-link">
            <div className="subject-card">
              {sub.toUpperCase()}
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}

export default ClassPage;