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
      setError("업로드할 파일을 선택해주세요.");
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
      setError(err.response?.data?.error || "파일 업로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        textAlign: "center",
        padding: "40px",
        backgroundColor: "#f7f6f2",
        borderRadius: "15px",
        marginTop: "50px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* 로딩 화면 */}
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

      {/* 업로드 폼 */}
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#333",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          이력서 업로드 및 추천받기
        </Typography>
        {error && (
          <Typography
            color="error"
            variant="body1"
            sx={{
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            {error}
          </Typography>
        )}

        {/* 업로드 가능 파일 형식 설명 */}
        <Typography
          variant="body2"
          sx={{
            color: "#666",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          업로드 가능 파일 확장자: <strong>PDF, HWP, DOCX</strong>
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  borderColor: "#4CAF50",
                  color: "#4CAF50",
                  "&:hover": {
                    backgroundColor: "#4CAF50",
                    color: "#FFF",
                  },
                }}
              >
                파일 선택
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              {file && (
                <Typography
                  variant="body1"
                  sx={{
                    marginTop: 1,
                    fontSize: "14px",
                    color: "#666",
                    textAlign: "center",
                  }}
                >
                  선택된 파일: {file.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  padding: "10px",
                  backgroundColor: "#4CAF50",
                  "&:hover": {
                    backgroundColor: "#45A049",
                  },
                }}
              >
                업로드 및 추천받기
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* 가이드 섹션 */}
      <Box sx={{ marginTop: "40px", textAlign: "center" }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#333",
            marginBottom: "20px",
          }}
        >
          이력서 업로드 가이드
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ textAlign: "center", color: "#666" }}>
              1. 업로드 가능한 파일 형식: PDF, HWP, DOCX
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ textAlign: "center", color: "#666" }}>
              2. 파일 크기는 최대 5MB까지 가능합니다.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ textAlign: "center", color: "#666" }}>
              3. 올바른 연락처와 경력 정보를 포함해 이력서를 작성하세요.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ResumeUpload;
