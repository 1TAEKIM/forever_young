import React from "react";
import { Button, Typography, Container, Grid, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Main = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // 로컬 저장소에서 사용자 정보 제거
    setIsLoggedIn(false); // 로그인 상태 업데이트
    navigate("/"); // 메인 페이지로 리다이렉션
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        textAlign: "center",
        padding: "50px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        marginTop: "30px",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "50px",
        }}
      >
        {isLoggedIn ? (
          <Button
            variant="outlined"
            size="large"
            onClick={handleLogout}
            sx={{ fontSize: "18px", fontWeight: "bold" }}
          >
            로그아웃
          </Button>
        ) : (
          <>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/login")}
              sx={{ fontSize: "18px", fontWeight: "bold" }}
            >
              로그인
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/register")}
              sx={{ fontSize: "18px", fontWeight: "bold" }}
            >
              회원가입
            </Button>
          </>
        )}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            flexGrow: 1,
            color: "#333",
          }}
        >
          노인을 위한 일자리 플랫폼
        </Typography>
      </Box>

      {/* Main Content */}
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ fontSize: "20px", padding: "20px" }}
            onClick={() => navigate("/resume/upload")}
          >
            이력서 업로드
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ fontSize: "20px", padding: "20px" }}
            onClick={() => navigate("/resume")}
          >
            이력서 작성
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Main;
