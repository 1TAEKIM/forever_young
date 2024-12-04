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
} from "@mui/material";
import axios from "axios";

const ResultPage = ({ recommendations, summary }) => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [openQuestions, setOpenQuestions] = useState(false);
  const [openLoadingPopup, setOpenLoadingPopup] = useState(false); // 로딩 팝업 상태
  const [selectedJob, setSelectedJob] = useState(null);
  const [connected, setConnected] = useState(false); // 사용되지 않는 result 제거
  const videoRef = useRef(null);
  const wsRef = useRef(null);
  const streamRef = useRef(null);

  // 면접 질문 생성 핸들러
  const handleGenerateQuestions = async (jobDescription) => {
    setOpenLoadingPopup(true); // 로딩 팝업 열기
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
      alert("질문을 생성하는 데 실패했습니다.");
    } finally {
      setLoading(false);
      setOpenLoadingPopup(false); // 로딩 팝업 닫기
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
      }

      const ws = new WebSocket("ws://localhost:8000/conf/ws/analyze");
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("분석 결과:", data.label); // 콘솔에 출력
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
      tracks.forEach((track) => track.stop()); // 스트림 트랙 정리
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null; // 비디오 요소 초기화
    }
    setConnected(false);
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
  }, [connected]);

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
                  width: "140px",
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

      {/* 로딩 팝업 */}
      <Dialog open={openLoadingPopup} fullWidth maxWidth="sm">
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "200px",
          }}
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ marginTop: "16px" }}>
            질문을 생성 중입니다. 잠시만 기다려주세요...
          </Typography>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ResultPage;
