import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
} from "@mui/material";

const ResumeForm = ({ isLoggedIn, userId }) => {
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
    resume_pdf: null,
    resume_word: null,
  });

  // Fetch existing data for logged-in users
  useEffect(() => {
    if (isLoggedIn && userId) {
      axios
        .get(`http://localhost:8000/resume/${userId}`)
        .then((response) => {
          setFormData(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch resume data:", error);
        });
    }
  }, [isLoggedIn, userId]);

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
      if (isLoggedIn && userId) {
        // Update resume for logged-in user
        await axios.put(`http://localhost:8000/resume/${userId}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Resume updated successfully!");
      } else {
        // Save new resume
        await axios.post("http://localhost:8000/resume", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Resume submitted successfully!");
      }
      navigate("/");
    } catch (error) {
      console.error("Failed to submit resume:", error);
      alert("Failed to submit resume. Please try again.");
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Resume Form
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Age"
              name="age"
              type="number"
              fullWidth
              onChange={handleChange}
              value={formData.age}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Contact"
              name="contact"
              fullWidth
              onChange={handleChange}
              value={formData.contact}
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
              value={formData.experience}
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
              value={formData.education}
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
              value={formData.certifications}
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
              value={formData.skills}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Desired Position"
              name="desired_position"
              fullWidth
              onChange={handleChange}
              value={formData.desired_position}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Desired Location"
              name="desired_location"
              fullWidth
              onChange={handleChange}
              value={formData.desired_location}
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
              Submit Resume
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ResumeForm;
