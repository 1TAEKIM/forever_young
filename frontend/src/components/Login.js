import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
} from "@mui/material";

const Login = ({ setIsLoggedIn, setUserId }) => {
  const navigate = useNavigate(); // 리다이렉션에 사용
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // 에러 메시지 상태

  const handleSubmit = async (e) => {
    e.preventDefault();

    // FormData 생성
    const formData = new FormData();
    formData.append("id", id);
    formData.append("password", password);

    try {
      const response = await axios.post("http://localhost:8000/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      // 로그인 성공
      alert(response.data.message);

      // 사용자 정보 로컬 저장소에 저장
      const userData = { id };
      localStorage.setItem("user", JSON.stringify(userData));

      // 상위 컴포넌트 상태 업데이트
      setIsLoggedIn(true);
      setUserId(id);

      // 메인 페이지로 리다이렉션
      navigate("/");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        setError(error.response.data.detail); // 서버 에러 메시지 표시
      } else {
        setError("An error occurred. Please try again."); // 일반 에러 메시지
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {error && (
        <Typography variant="body2" color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="ID"
              name="id"
              fullWidth
              required
              onChange={(e) => setId(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Login;
