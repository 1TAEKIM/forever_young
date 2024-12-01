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
  const [recommendations, setRecommendations] = useState([]); // 추천 결과 상태 추가

  // 로그인 상태 확인
  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user); // 유저 데이터가 존재하면 로그인 상태로 설정
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<MainPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/register"
          element={
            isLoggedIn ? <Navigate to="/" replace /> : <Register />
          }
        />
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/" replace /> : <Login setIsLoggedIn={setIsLoggedIn} />
          }
        />
        <Route
          path="/resume"
          element={<ResumeForm isLoggedIn={isLoggedIn} />}
        />
        <Route
          path="/resume/upload"
          element={
            <ResumeUpload
              onResult={setRecommendations} // 결과를 업데이트하는 콜백 전달
            />
          }
        />
        <Route 
          path="/results" 
          element={<ResultPage recommendations={recommendations} />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
