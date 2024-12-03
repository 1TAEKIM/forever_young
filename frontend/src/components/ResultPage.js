import React, { useState } from "react";
import {
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
} from "@mui/material";
import axios from "axios";

const ResultPage = ({ recommendations, summary }) => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleGenerateQuestions = async (jobDescription) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/tts/generate_questions_for_job",
        {
          job_description: jobDescription,
        }
      );
      setQuestions(response.data.questions);
      setSelectedJob(jobDescription);
      setOpen(true);
    } catch (error) {
      console.error("Failed to generate questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTTS = async (question, index) => {
    try {
      const response = await axios.get(`http://localhost:8000/tts/${index}`);
      const audioUrl = `http://localhost:8000${response.data.audio_file}`; // 절대 경로로 설정
  
      console.log("Audio URL:", audioUrl); // 확인용 로그
  
      // Play the audio
      const audio = new Audio(audioUrl);
      audio.play().catch((error) => {
        console.error("Audio play failed:", error);
        alert("오디오 재생에 실패했습니다. 브라우저 설정을 확인해주세요.");
      });
    } catch (error) {
      console.error("Failed to fetch TTS audio:", error);
      alert("오디오 파일을 가져오는 데 실패했습니다.");
    }
  };
  
  

  const handleClose = () => {
    setOpen(false);
    setQuestions([]);
    setSelectedJob(null);
  };

  return (
    <Container
      maxWidth="md"
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
          추천된 일자리 목록
        </Typography>
        {summary && (
          <Paper
            elevation={1}
            sx={{
              padding: "16px",
              marginBottom: "24px",
              textAlign: "left",
              backgroundColor: "#e0f7fa",
            }}
          >
            <Typography variant="h6" gutterBottom>
              이력서 요약:
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {summary}
            </Typography>
          </Paper>
        )}
        {recommendations.length > 0 ? (
          <List>
            {recommendations.map((job, index) => (
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <ListItemText primary={job.title} secondary={job.description} />
                </Box>
                <Box sx={{ flexShrink: 0 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleGenerateQuestions(job.description)}
                    disabled={loading}
                    sx={{
                      width: "140px",
                      height: "40px",
                      fontSize: "14px",
                    }}
                  >
                    {loading ? "처리 중..." : "면접 질문 생성"}
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" color="textSecondary">
            추천 결과가 없습니다.
          </Typography>
        )}
      </Paper>

      {/* 면접 질문 팝업 */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md" // 팝업 크기를 더 크게 설정
      >
        <DialogTitle>면접 질문</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            {selectedJob}
          </Typography>
          {questions.map((question, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <Typography variant="body1" sx={{ flex: 1 }}>
                {question}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleTTS(question, index)}
                sx={{
                  flexShrink: 0,
                  marginLeft: "16px",
                  width: "140px", // 버튼 크기 고정
                  height: "40px",
                  fontSize: "14px",
                }}
              >
                음성으로 듣기
              </Button>
            </Box>
          ))}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ResultPage;
