import React, { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaHome,
  FaBolt,
  FaQuestionCircle,
  FaFileAlt,
} from "react-icons/fa";

import { MdAdminPanelSettings } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

import "../styles/pyqs.css";
import BASE_URL from "../config/config";

function Pyqs() {
  const [pyqs, setPyqs] = useState([]);
  const navigate = useNavigate();

  // =====================================================
  // GET ALL PYQS
  // =====================================================

  useEffect(() => {
    fetch(`${BASE_URL}/api/upload/pyqs`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch PYQs");
        }

        return res.json();
      })
      .then((data) => {
        console.log("PYQS:", data);

        setPyqs(data);
      })
      .catch((err) => {
        console.log("PYQ FETCH ERROR:", err);
      });
  }, []);

  // =====================================================
  // OPEN PDF
  // =====================================================

  const openPdf = (item) => {
    if (!item.fileUrl) {
      console.log("PDF URL missing");
      return;
    }

    // New Cloudinary URL
    // Old local URL support
    const finalPdfUrl = item.fileUrl.startsWith("http")
      ? item.fileUrl
      : `${BASE_URL}${item.fileUrl}`;

    console.log("OPENING PYQ:", finalPdfUrl);

    navigate("/view-pdf", {
      state: {
        url: finalPdfUrl,
      },
    });
  };

  return (
    <>
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="navbar">
        <div className="logo">e-Book</div>

        <ul className="nav-links">
          <li>
            <Link to="/home">Home</Link>
          </li>

          <li>
            <Link to="/pulse">Pulse</Link>
          </li>

          <li>
            <Link to="/pyqs">PYQs</Link>
          </li>

          <li>
            <Link to="/quiz">Quiz</Link>
          </li>

          <li>
            <Link to="/profile">
              <FaUserCircle size={24} />
            </Link>
          </li>

          <li>
            <Link to="/admin/upload">
              <MdAdminPanelSettings size={24} />
            </Link>
          </li>
        </ul>
      </nav>

      {/* =====================================================
          PYQ CONTENT
      ===================================================== */}

      <div className="pyq-container">
        <h2>Previous Year Question Papers</h2>

        {pyqs.length === 0 ? (
          <p>No question papers available.</p>
        ) : (
          pyqs.map((item) => (
            <div key={item._id} className="pyq-card">
              <p>
                <b>Class:</b> {item.classId}

                {" | "}

                <b>Subject:</b> {item.subject}
              </p>

              <button
                className="pyq-btn"
                onClick={() => openPdf(item)}
              >
                Open PDF
              </button>
            </div>
          ))
        )}
      </div>

      {/* =====================================================
          BOTTOM NAVIGATION
      ===================================================== */}

      <div className="bottom-nav">
        <Link to="/home">
          <FaHome size={24} />
        </Link>

        <Link to="/pulse">
          <FaBolt size={24} />
        </Link>

        <Link to="/pyqs">
          <FaFileAlt size={24} />
        </Link>

        <Link to="/quiz">
          <FaQuestionCircle size={24} />
        </Link>

        <Link to="/profile">
          <FaUserCircle size={24} />
        </Link>
      </div>
    </>
  );
}

export default Pyqs;