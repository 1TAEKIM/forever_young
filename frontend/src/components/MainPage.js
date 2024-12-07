import React from "react";
import { Button, Typography, Container, Grid, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaSignInAlt, FaUpload, FaEdit } from "react-icons/fa";

const Main = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // 로컬 저장소에서 사용자 정보 제거
    setIsLoggedIn(false); // 로그인 상태 업데이트
    navigate("/"); // 메인 페이지로 리다이렉션
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
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        {isLoggedIn ? (
          <Button
            variant="contained"
            size="large"
            onClick={handleLogout}
            sx={{
              fontSize: "18px",
              fontWeight: "bold",
              padding: "10px 20px",
              backgroundColor: "#FF6F61",
              color: "#FFF",
              "&:hover": {
                backgroundColor: "#E64A45",
              },
            }}
          >
            로그아웃
          </Button>
        ) : (
          <Box sx={{ display: "flex", gap: "10px" }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/login")}
              sx={{
                fontSize: "18px",
                fontWeight: "bold",
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "#FFF",
                "&:hover": {
                  backgroundColor: "#45A049",
                },
              }}
              startIcon={<FaSignInAlt />}
            >
              로그인
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/register")}
              sx={{
                fontSize: "18px",
                fontWeight: "bold",
                padding: "10px 20px",
                backgroundColor: "#2196F3",
                color: "#FFF",
                "&:hover": {
                  backgroundColor: "#1976D2",
                },
              }}
              startIcon={<FaUserPlus />}
            >
              회원가입
            </Button>
          </Box>
        )}
      </Box>

      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          color: "#333",
          marginBottom: "20px",
          textShadow: "1px 1px 4px rgba(0, 0, 0, 0.3)",
        }}
      >
        👵👴 노인을 위한 일자리 플랫폼
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: "18px",
          color: "#666",
          marginBottom: "40px",
        }}
      >
        간편하게 이력서를 업로드하거나 작성하고, 맞춤형 일자리를 찾아보세요!
      </Typography>

      {/* Main Content */}
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={3}
            sx={{
              padding: "20px",
              borderRadius: "10px",
              backgroundColor: "#F3F7FA",
              textAlign: "center",
              "&:hover": {
                boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                fontSize: "18px",
                padding: "15px",
                fontWeight: "bold",
                backgroundColor: "#4CAF50",
                "&:hover": {
                  backgroundColor: "#45A049",
                },
              }}
              startIcon={<FaUpload />}
              onClick={() => navigate("/resume/upload")}
            >
              이력서 업로드
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={3}
            sx={{
              padding: "20px",
              borderRadius: "10px",
              backgroundColor: "#F3F7FA",
              textAlign: "center",
              "&:hover": {
                boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{
                fontSize: "18px",
                padding: "15px",
                fontWeight: "bold",
                backgroundColor: "#2196F3",
                "&:hover": {
                  backgroundColor: "#1976D2",
                },
              }}
              startIcon={<FaEdit />}
              onClick={() => navigate("/resume")}
            >
              이력서 작성
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* 일자리 섹션 */}
      <Box sx={{ marginTop: "50px", textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          일자리 정보
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ marginTop: "20px" }}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={3}
              sx={{
                padding: "20px",
                borderRadius: "10px",
                textAlign: "left",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                마트 계산원
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                근무지: 서울 강남구
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", marginBottom: "10px" }}>
                시급: 12,000원
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{ fontWeight: "bold" }}
                onClick={() => navigate("/job-details/1")}
              >
                자세히 보기
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={3}
              sx={{
                padding: "20px",
                borderRadius: "10px",
                textAlign: "left",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                도서관 사서 보조
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                근무지: 부산 해운대구
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", marginBottom: "10px" }}>
                시급: 13000원
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{ fontWeight: "bold" }}
                onClick={() => navigate("/job-details/2")}
              >
                자세히 보기
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={3}
              sx={{
                padding: "20px",
                borderRadius: "10px",
                textAlign: "left",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                기술 자문
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                근무지: 대전 중구
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", marginBottom: "10px" }}>
                시급: 협의 후 결정
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{ fontWeight: "bold" }}
                onClick={() => navigate("/job-details/2")}
              >
                자세히 보기
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* 커뮤니티 섹션 */}
      <Box sx={{ marginTop: "50px", textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          커뮤니티
        </Typography>
        <Typography
          variant="body1"
          sx={{ marginTop: "10px", color: "#666", marginBottom: "20px" }}
        >
          다른 사용자들과 정보를 나누고 경험을 공유해보세요!
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ padding: "20px", borderRadius: "10px" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Q. 이력서를 작성할 때 주의할 점은?
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", marginTop: "10px" }}>
                "사진은 필수인가요?" - 작성자: 김영희
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{ marginTop: "10px", fontWeight: "bold" }}
                onClick={() => navigate("/community/1")}
              >
                답변 보기
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ padding: "20px", borderRadius: "10px" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Q. 노인 친화적 일자리는 어디서 찾을 수 있나요?
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", marginTop: "10px" }}>
                "서울에서 노인 일자리가 많나요?" - 작성자: 이철수
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{ marginTop: "10px", fontWeight: "bold" }}
                onClick={() => navigate("/community/2")}
              >
                답변 보기
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ padding: "20px", borderRadius: "10px" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Q. 정부에서 지원하는 노인 일자리 정책은?
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", marginTop: "10px" }}>
                "어떤 지원을 받을 수 있나요?" - 작성자: 박민수
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{ marginTop: "10px", fontWeight: "bold" }}
                onClick={() => navigate("/community/3")}
              >
                답변 보기
              </Button>
            </Paper>
          </Grid>
        </Grid>
        <Button
          variant="outlined"
          sx={{
            marginTop: "30px",
            fontWeight: "bold",
            fontSize: "16px",
            padding: "10px 20px",
            borderColor: "#4CAF50",
            color: "#4CAF50",
            "&:hover": {
              backgroundColor: "#4CAF50",
              color: "#FFF",
            },
          }}
          onClick={() => navigate("/community")}
        >
          커뮤니티 더 보기
        </Button>
      </Box>



      {/* 플랫폼 이용 가이드 섹션 */}
      <Box sx={{ marginTop: "50px", textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          플랫폼 이용 가이드
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ marginTop: "20px" }}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={3} sx={{ padding: "20px", borderRadius: "10px" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Step 1
              </Typography>
              <Typography variant="body1" sx={{ color: "#666" }}>
                회원가입 후 로그인합니다.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={3} sx={{ padding: "20px", borderRadius: "10px" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Step 2
              </Typography>
              <Typography variant="body1" sx={{ color: "#666" }}>
                이력서를 작성하거나 업로드합니다.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: "20px", borderRadius: "10px" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Step 3
              </Typography>
              <Typography variant="body1" sx={{ color: "#666" }}>
                추천 일자리를 찾아 지원합니다.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* 뉴스 및 공지사항 섹션 */}
      <Box sx={{ marginTop: "50px", textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          뉴스 및 공지사항
        </Typography>
        <Grid container spacing={4} sx={{ marginTop: "20px" }}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: "20px", borderRadius: "10px" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                2024년 노인 일자리 박람회 개최 안내
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                2024년 12월 9일 서울 코엑스에서 노인을 위한 일자리 박람회가 개최됩니다.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Main;
