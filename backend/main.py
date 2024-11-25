from fastapi import FastAPI
from backend.routes.user_routes import router as user_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(user_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React 앱의 도메인
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

