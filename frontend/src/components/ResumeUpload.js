import React, { useState } from "react";
import {
  Button,
  Typography,
  Container,
  Grid,
  Box,
  Paper,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResumeUpload = ({ onResult }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    try {
      const uploadResponse = await axios.post("http://localhost:8000/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const summaryData = uploadResponse.data.summary;

      const recommendResponse = await axios.post("http://localhost:8000/rag/recommend", {
        profile: summaryData,
      });

      const recommendedJobs = recommendResponse.data.recommendations;

      // summaryData와 recommendedJobs를 함께 전달
      onResult(recommendedJobs, summaryData);
      navigate("/results");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during file upload.");
    } finally {
      setLoading(false);
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
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Typography sx={{ marginLeft: 2 }}>처리 중입니다. 잠시만 기다려주세요...</Typography>
      </Backdrop>
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
      </Paper>
    </Container>
  );
};

export default ResumeUpload;
