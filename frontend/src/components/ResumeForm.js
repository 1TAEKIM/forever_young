import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Backdrop,
  CircularProgress,
} from "@mui/material";

const ResumeForm = ({ isLoggedIn, onResult }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: "",
    contact: "",
    experience: "",
    education: "",
    certifications: "",
    skills: "",
    desired_position: "",
    desired_location: "",
  });
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // 로딩 시작
    try {
      // 폼 데이터를 RAG 입력값으로 변환
      const ragInput = `
        나이: ${formData.age}
        연락처: ${formData.contact}
        경력: ${formData.experience}
        학력: ${formData.education}
        자격증: ${formData.certifications}
        기술: ${formData.skills}
        희망 직무: ${formData.desired_position}
        희망 지역: ${formData.desired_location}
      `;

      // RAG API 호출
      const recommendResponse = await axios.post("http://localhost:8000/rag/recommend", {
        profile: ragInput,
      });
      const recommendedJobs = recommendResponse.data.recommendations;

      if (!Array.isArray(recommendedJobs)) {
        throw new Error("Invalid recommendations format.");
      }

      // 결과 페이지로 데이터 전달
      onResult(recommendedJobs, ragInput); // 요약 대신 입력 데이터를 전달
      navigate("/results");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "An error occurred.");
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        maxWidth: 800,
        margin: "auto",
        backgroundColor: "#f7f6f2",
        borderRadius: "15px",
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

      {/* 제목 */}
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
        이력서 작성
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="나이"
              name="age"
              type="number"
              fullWidth
              onChange={handleChange}
              value={formData.age}
              InputLabelProps={{ style: { fontSize: "18px" } }}
              inputProps={{ style: { fontSize: "16px" } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="연락처"
              name="contact"
              fullWidth
              onChange={handleChange}
              value={formData.contact}
              InputLabelProps={{ style: { fontSize: "18px" } }}
              inputProps={{ style: { fontSize: "16px" } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="경력"
              name="experience"
              fullWidth
              multiline
              rows={3}
              onChange={handleChange}
              value={formData.experience}
              InputLabelProps={{ style: { fontSize: "18px" } }}
              inputProps={{ style: { fontSize: "16px" } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="학력"
              name="education"
              fullWidth
              multiline
              rows={3}
              onChange={handleChange}
              value={formData.education}
              InputLabelProps={{ style: { fontSize: "18px" } }}
              inputProps={{ style: { fontSize: "16px" } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="자격증"
              name="certifications"
              fullWidth
              multiline
              rows={3}
              onChange={handleChange}
              value={formData.certifications}
              InputLabelProps={{ style: { fontSize: "18px" } }}
              inputProps={{ style: { fontSize: "16px" } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="기술"
              name="skills"
              fullWidth
              multiline
              rows={3}
              onChange={handleChange}
              value={formData.skills}
              InputLabelProps={{ style: { fontSize: "18px" } }}
              inputProps={{ style: { fontSize: "16px" } }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="희망 직무"
              name="desired_position"
              fullWidth
              onChange={handleChange}
              value={formData.desired_position}
              InputLabelProps={{ style: { fontSize: "18px" } }}
              inputProps={{ style: { fontSize: "16px" } }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="희망 지역"
              name="desired_location"
              fullWidth
              onChange={handleChange}
              value={formData.desired_location}
              InputLabelProps={{ style: { fontSize: "18px" } }}
              inputProps={{ style: { fontSize: "16px" } }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                fontWeight: "bold",
                fontSize: "18px",
                backgroundColor: "#4CAF50",
                "&:hover": { backgroundColor: "#45A049" },
              }}
            >
              이력서 제출
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* 에러 메시지 */}
      {error && (
        <Typography color="error" variant="body1" sx={{ marginTop: 2, textAlign: "center" }}>
          {error}
        </Typography>
      )}
    </Paper>
  );
};

export default ResumeForm;
