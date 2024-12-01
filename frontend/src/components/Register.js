import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate(); // 리다이렉션에 사용
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    name: "",
    age: "",
    contact: "",
    experience: "",
    education: "",
    certifications: "",
    skills: "",
    desired_position: "",
    desired_location: "",
    resume_pdf: null,
    resume_word: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        form.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(
        "http://localhost:8000/auth/register",
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert(response.data.message);
      navigate("/login"); // 회원가입 성공 시 로그인 페이지로 이동
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        alert(error.response.data.detail); // 서버에서 받은 에러 메시지 표시
      } else {
        alert("회원가입 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="ID"
              name="id"
              fullWidth
              required
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              required
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              required
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Age"
              name="age"
              type="number"
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Contact"
              name="contact"
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Experience"
              name="experience"
              fullWidth
              multiline
              rows={3}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Education"
              name="education"
              fullWidth
              multiline
              rows={3}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Certifications"
              name="certifications"
              fullWidth
              multiline
              rows={3}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Skills"
              name="skills"
              fullWidth
              multiline
              rows={3}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Desired Position"
              name="desired_position"
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Desired Location"
              name="desired_location"
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography>Resume (PDF)</Typography>
            <input
              type="file"
              name="resume_pdf"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography>Resume (Word)</Typography>
            <input
              type="file"
              name="resume_word"
              accept=".doc,.docx"
              onChange={handleFileChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Register
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Register;
