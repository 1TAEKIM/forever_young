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
} from "@mui/material";
import axios from "axios";

const ResultPage = ({ recommendations, summary }) => {
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
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
      setLoading(false);
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
      streamRef.current = stream; // 스트림 저장
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play(); // 비디오 재생
      } else {
        console.error("videoRef.current가 존재하지 않습니다.");
      }

      const ws = new WebSocket("ws://localhost:8000/conf/ws/analyze");
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setResult(data.label); // 서버에서 받은 분석 결과 업데이트
      };

      ws.onclose = () => {
        if (streamRef.current) {
          const tracks = streamRef.current.getTracks();
          tracks.forEach((track) => track.stop()); // 스트림 트랙 정리
          streamRef.current = null;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null; // 비디오 요소 초기화
        }
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
    }, 100); // 100ms 간격으로 전송

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
                    onClick={() => handleGenerateQuestions(`채용제목: ${job.title}\n${job.description}`)}
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
      <Dialog open={openQuestions} onClose={handleCloseQuestions} fullWidth maxWidth="md">
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
                {index + 1}. {question}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleTTS(question, index)}
                sx={{
                  flexShrink: 0,
                  marginLeft: "16px",
                  width: "140px",
                  height: "40px",
                  fontSize: "14px",
                }}
              >
                음성으로 듣기
              </Button>
            </Box>
          ))}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "16px",
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
              }}
            ></video>
            {connected ? (
              <>
                <Typography variant="h6">
                  분석 결과: {result || "분석 중..."}
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleStopAnalysis}
                  sx={{ marginTop: "16px" }}
                >
                  나가기
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleStartAnalysis}
                sx={{ marginTop: "16px" }}
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
