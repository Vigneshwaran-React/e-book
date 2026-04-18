import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClassPage from "./pages/ClassPage";
import SubjectPage from "./pages/SubjectPage";
import Home from "./pages/Home";
import AdminUpload from "./pages/AdminUpload";
import Auth from "./pages/Auth";
import Pulse from "./pages/Pulse";
import Pyqs from "./pages/Pyqs";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import AdminLogin from "./pages/AdminLogin";
import PdfViewer from "./pages/PdfViewer";

function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Auth/>} />
        <Route path="/home" element={<Home/>} />

        {/* Class */}
        <Route path="/class/:classId" element={<ClassPage />} />

        {/* Subject */}
        <Route path="/class/:classId/:subject" element={<SubjectPage/>} />
        <Route path="/admin/upload" element={<AdminUpload />} />
        <Route path="/pulse" element={<Pulse />} />
        <Route path="/pyqs" element={<Pyqs />} />
        <Route path="/quiz" element={<Quiz/>} />
        <Route path="*" element={<h2>404 Not Found</h2>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/view-pdf" element={<PdfViewer />} />
{/* <Route path="/admin/upload" element={<AdminUpload />} /> */}
      </Routes>
    </Router>
  );
}

export default App;