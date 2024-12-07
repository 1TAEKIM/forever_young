import React, { useState, useEffect, useRef } from "react";
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
  CircularProgress,
  Backdrop,
} from "@mui/material";
import axios from "axios";

const ResultPage = ({ recommendations, summary }) => {
  const [loadingQuestions, setLoadingQuestions] = useState(false); // 면접 질문 생성 로딩 상태
  const [questions, setQuestions] = useState([]);
  const [openQuestions, setOpenQuestions] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [result, setResult] = useState(null);
  const [connected, setConnected] = useState(false);
  const videoRef = useRef(null);
  const wsRef = useRef(null);
  const streamRef = useRef(null);

  // 면접 질문 생성 핸들러
  const handleGenerateQuestions = async (jobDescription) => {
    setLoadingQuestions(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/tts/generate_questions_for_job",
        { job_description: jobDescription }
      );
      setQuestions(response.data.questions);
      setSelectedJob(jobDescription);
      setOpenQuestions(true);
    } catch (error) {
      console.error("Failed to generate questions:", error);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // TTS 음성 재생 핸들러
  const handleTTS = async (question, index) => {
    try {
      const response = await axios.get(`http://localhost:8000/tts/${index}`);
      const audioUrl = `http://localhost:8000${response.data.audio_file}`;
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

  // 실시간 자신감 분석 WebSocket 연결
  const handleStartAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const ws = new WebSocket("ws://localhost:8000/conf/ws/analyze");
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setResult(data.label);
      };

      ws.onclose = () => {
        setConnected(false);
      };
    } catch (error) {
      console.error("Failed to access camera:", error);
      alert("카메라에 접근할 수 없습니다. 브라우저 설정을 확인해주세요.");
    }
  };

  const handleStopAnalysis = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setConnected(false);
    setResult(null);
  };

  useEffect(() => {
    if (!connected || !videoRef.current) return;

    const interval = setInterval(() => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const video = videoRef.current;

      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg").split(",")[1];
        wsRef.current?.send(imageData);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [connected, videoRef]);

  const handleCloseQuestions = () => {
    setOpenQuestions(false);
    setQuestions([]);
    setSelectedJob(null);
    handleStopAnalysis();
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        textAlign: "center",
        padding: "40px",
        backgroundColor: "#f7f6f2",
        borderRadius: "15px",
        marginTop: "50px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* 로딩 팝업 */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={loadingQuestions}
      >
        <CircularProgress color="inherit" />
        <Typography sx={{ marginLeft: 2 }}>면접 질문 생성 중...</Typography>
      </Backdrop>

      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#333",
            marginBottom: "20px",
          }}
        >
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
              borderRadius: "10px",
            }}
          >
            <Typography variant="h6" gutterBottom>
              이력서 요약:
            </Typography>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-wrap",
                fontSize: "16px",
                color: "#666",
              }}
            >
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
                  marginBottom: "16px",
                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
                  padding: "16px",
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <ListItemText
                    primary={job.title}
                    secondary={job.description}
                    primaryTypographyProps={{
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                    secondaryTypographyProps={{
                      fontSize: "14px",
                      color: "#666",
                    }}
                  />
                </Box>
                <Box sx={{ flexShrink: 0 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleGenerateQuestions(`채용제목: ${job.title}\n${job.description}`)}
                    disabled={loadingQuestions}
                    sx={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      backgroundColor: "#4CAF50",
                      "&:hover": { backgroundColor: "#45A049" },
                    }}
                  >
                    면접 질문 생성
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
      <Dialog open={openQuestions} onClose={handleCloseQuestions} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "20px", textAlign: "center" }}>
          면접 질문
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: "bold",
              marginBottom: "20px",
              color: "#333",
              textAlign: "center",
            }}
          >
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
                padding: "10px",
                backgroundColor: "#f9f9f9",
                borderRadius: "10px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography variant="body1" sx={{ flex: 1, fontSize: "16px", color: "#555" }}>
                {question}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleTTS(question, index)}
                sx={{
                  flexShrink: 0,
                  marginLeft: "16px",
                  fontSize: "14px",
                  backgroundColor: "#FF6F61",
                  "&:hover": { backgroundColor: "#E64A45" },
                }}
              >
                음성으로 듣기
              </Button>
            </Box>
          ))}

          {/* 실시간 분석 UI */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "16px",
              padding: "20px",
              backgroundColor: "#f7f7f7",
              borderRadius: "10px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: "100%",
                maxHeight: "400px",
                marginBottom: "16px",
                display: connected ? "block" : "none",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            ></video>
            {connected ? (
              <>
                <Typography variant="h6" sx={{ marginBottom: "16px" }}>
                  분석 결과: {result || "분석 중..."}
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleStopAnalysis}
                  sx={{
                    marginTop: "16px",
                    fontWeight: "bold",
                    borderColor: "#FF6F61",
                    color: "#FF6F61",
                    "&:hover": {
                      backgroundColor: "#FF6F61",
                      color: "#FFF",
                    },
                  }}
                >
                  나가기
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleStartAnalysis}
                sx={{
                  marginTop: "16px",
                  fontWeight: "bold",
                  backgroundColor: "#4CAF50",
                  "&:hover": { backgroundColor: "#45A049" },
                }}
              >
                모의 인터뷰 시작
              </Button>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ResultPage;
