import { useEffect, useState } from "react";
import "../styles/Quiz.css";
import { Link } from "react-router-dom";
import { FaHome, FaBolt, FaQuestionCircle, FaFileAlt } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md"

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // 📡 Fetch questions
  useEffect(() => {
    fetch("http://localhost:5000/api/questions/random?type=aptitude")
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(err => console.log(err));
  }, []);

  if (questions.length === 0) return <h2 className="loading">Loading...</h2>;

  const q = questions[current];

  // 👉 Select option
  const handleSelect = (option) => {
    if (showAnswer) return;
    setSelected(option);
  };

  // 👉 Check answer
  const handleCheck = () => {
    if (!selected) return;

    setShowAnswer(true);

    if (selected === q.answer) {
      setScore(prev => prev + 1);
    }
  };

  // 👉 Next question
  const handleNext = () => {
    setSelected(null);
    setShowAnswer(false);

    if (current + 1 < questions.length) {
      setCurrent(prev => prev + 1);
    } else {
      setFinished(true);
    }
  };

  // 👉 Result page
  if (finished) {
    return (
      <>
        <div className="quiz-result">
          <h1> Quiz Completed</h1>
          <h2>{score} / {questions.length}</h2>

          <button
            className="quiz-btn"
            onClick={() => window.location.reload()}
          >
            Restart
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="logo">e-Book</div>

        <ul className="nav-links">
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/pulse">Pulse</Link></li>
          <li><Link to="/pyqs">PYQs</Link></li>
          <li><Link to="/quiz">Quiz</Link></li>
          <li><Link to='/profile'><FaUserCircle size={24} /></Link></li>
          <li className="profile-icon">
            <Link to="/admin/upload"><MdAdminPanelSettings size={24} /></Link>
          </li>
        </ul>
      </nav>
      <div className="quiz-container">
        <h2>Question {current + 1} / {questions.length}</h2>

        <p className="quiz-question">{q.question}</p>

        {q.options.map((opt, i) => {
          let className = "quiz-option";

          // 👉 Before answer reveal (selected highlight)
          if (!showAnswer && selected === opt) {
            className += " selected";
          }

          // 👉 After answer reveal
          if (showAnswer) {
            if (opt === q.answer) className += " correct";
            else if (opt === selected) className += " wrong";
          }

          return (
            <div
              key={i}
              className={className}
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </div>
          );
        })}

        {/* 🔘 Buttons */}
        {!showAnswer ? (
          <button
            className="quiz-btn"
            onClick={handleCheck}
            disabled={!selected}
          >
            Check Answer
          </button>
        ) : (
          <button
            className="quiz-btn"
            onClick={handleNext}
          >
            Next
          </button>
        )}
      </div>
       <div className="bottom-nav">
        <div><Link to="/home"><FaHome size={24}/></Link></div>
        <div><Link to="/pulse"><FaBolt size={24} /></Link></div>
        <div><Link to="/pyqs"><FaFileAlt size={24} /> </Link></div>
        <div><Link to="/quiz"><FaQuestionCircle size={24} /></Link></div>
        <div><Link to='/profile'><FaUserCircle size={24} /></Link></div>
      </div>
    </>
  );
}

export default Quiz;