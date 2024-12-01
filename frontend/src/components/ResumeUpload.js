import React, { useState } from "react";
import {
  Button,
  Typography,
  Container,
  Grid,
  Box,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResumeUpload = ({ onResult }) => {
  const navigate = useNavigate(); // 결과 페이지 이동에 사용
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      // 1. 파일 업로드 및 요약
      const uploadResponse = await axios.post("http://localhost:8000/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const summaryData = uploadResponse.data.summary; // 요약 내용
      setSummary(summaryData);

      // 2. 추천 요청
      const recommendResponse = await axios.post("http://localhost:8000/rag/recommend", {
        profile: summaryData,
      });

      const recommendedJobs = recommendResponse.data.recommendations;

      // 3. 결과 페이지로 이동
      onResult(recommendedJobs); // 상위 컴포넌트로 결과 전달
      navigate("/results");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during file upload.");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        marginTop: "30px",
      }}
    >
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          이력서 업로드 및 추천받기
        </Typography>
        {error && (
          <Typography color="error" variant="body1" gutterBottom>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ fontSize: "16px", fontWeight: "bold" }}
              >
                파일 선택
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              {file && (
                <Typography variant="body1" sx={{ marginTop: 1 }}>
                  선택된 파일: {file.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ fontSize: "18px", padding: "10px" }}
              >
                업로드 및 추천받기
              </Button>
            </Grid>
          </Grid>
        </Box>
        {summary && (
          <Box sx={{ marginTop: 3 }}>
            <Typography variant="h6" gutterBottom>
              요약 결과:
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {summary}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ResumeUpload;
