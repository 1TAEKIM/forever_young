from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.auth import router as auth_router
from backend.routes.resume import router as resume_router
from backend.routes.conf_analysis import router as analysis_router
from backend.routes.rag import router as rag_router
from backend.routes.tts import router as tts_router
from backend.routes.conf_analysis import router as conf_router

# FastAPI 앱 초기화
app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React 앱의 도메인
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 통합
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(resume_router, prefix="/resume", tags=["Resume"])
app.include_router(analysis_router, prefix="/analysis", tags=["Analysis"])
app.include_router(rag_router, prefix="/rag", tags=["RAG"])
app.include_router(tts_router, prefix="/tts", tags=["TTS"])
app.include_router(conf_router, prefix="/conf", tags=['CONF'])

# 기본 라우트
@app.get("/", tags=["Home"])
async def home():
    return {"message": "Welcome to the Senior Job Platform API"}

# 정적 파일 경로 설정
app.mount("/static", StaticFiles(directory="static"), name="static")