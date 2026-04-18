import { useEffect, useState } from "react";
import "../styles/Quiz.css";
import { Link } from "react-router-dom";
import { FaHome, FaBolt, FaQuestionCircle, FaFileAlt, FaUserCircle } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import BASE_URL from "../config/config";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔥 fetch function (reusable)
  const fetchQuestions = () => {
    setLoading(true);
    fetch(`${BASE_URL}/api/questions/random?type=aptitude`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  if (loading) return <h2 className="loading">Loading... ⏳</h2>;
  if (questions.length === 0) return <h2>No Questions 😢</h2>;

  const q = questions[current];

  // 👉 select
  const handleSelect = (option) => {
    if (showAnswer) return;
    setSelected(option);
  };

  // 👉 check
  const handleCheck = () => {
    if (!selected) return;

    setShowAnswer(true);

    if (selected === q.answer) {
      setScore(prev => prev + 1);
    }
  };

  // 👉 next
  const handleNext = () => {
    setSelected(null);
    setShowAnswer(false);

    if (current + 1 < questions.length) {
      setCurrent(prev => prev + 1);
    } else {
      setFinished(true);
    }
  };

  // 👉 restart (🔥 improved)
  const handleRestart = () => {
    fetchQuestions(); // 🔥 new questions
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
    setShowAnswer(false);
  };

  // 👉 result
  if (finished) {
    return (
      <div className="quiz-result">
        <h1>Quiz Completed 🎉</h1>
        <h2>{score} / {questions.length}</h2>

        <button className="quiz-btn" onClick={handleRestart}>
          Restart
        </button>
      </div>
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
          <li><Link to="/profile"><FaUserCircle size={24} /></Link></li>
          <li>
            <Link to="/admin/upload"><MdAdminPanelSettings size={24} /></Link>
          </li>
        </ul>
      </nav>

      <div className="quiz-container">
        <h2>Question {current + 1} / {questions.length}</h2>

        <p className="quiz-question">{q.question}</p>

        {q.options.map((opt, i) => {
          let className = "quiz-option";

          if (!showAnswer && selected === opt) {
            className += " selected";
          }

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

        {!showAnswer ? (
          <button
            className="quiz-btn"
            onClick={handleCheck}
            disabled={!selected}
          >
            Check Answer
          </button>
        ) : (
          <button className="quiz-btn" onClick={handleNext}>
            Next
          </button>
        )}
      </div>

      <div className="bottom-nav">
        <Link to="/home"><FaHome size={24} /></Link>
        <Link to="/pulse"><FaBolt size={24} /></Link>
        <Link to="/pyqs"><FaFileAlt size={24} /></Link>
        <Link to="/quiz"><FaQuestionCircle size={24} /></Link>
        <Link to="/profile"><FaUserCircle size={24} /></Link>
      </div>
    </>
  );
}

export default Quiz;