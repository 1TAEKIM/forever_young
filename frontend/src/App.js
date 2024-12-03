import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import MainPage from "./components/MainPage";
import ResumeForm from "./components/ResumeForm";
import ResumeUpload from "./components/ResumeUpload";
import ResultPage from "./components/ResultPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [recommendations, setRecommendations] = useState([]); // 추천 결과 상태
  const [summary, setSummary] = useState(""); // 이력서 요약 상태

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleResults = (recommendedJobs, summaryData) => {
    setRecommendations(recommendedJobs);
    setSummary(summaryData); // summary 상태 업데이트
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<MainPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/" replace /> : <Register />}
        />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" replace /> : <Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/resume"
          element={<ResumeForm isLoggedIn={isLoggedIn} onResult={handleResults} />} // onResult 전달
        />
        <Route
          path="/resume/upload"
          element={
            <ResumeUpload onResult={handleResults} /> // handleResults 전달
          }
        />
        <Route
          path="/results"
          element={<ResultPage recommendations={recommendations} summary={summary} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
