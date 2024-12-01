from fastapi import APIRouter, HTTPException, Form, File, UploadFile
from sqlalchemy.orm import Session
from ..database import SessionLocal, init_db
from ..models import User
from typing import Optional
from pydantic import BaseModel


router = APIRouter()

# Initialize the database
init_db()

@router.post("/register")
async def register_user(
    id: str = Form(...),
    password: str = Form(...),
    name: Optional[str] = Form(None),
    age: Optional[int] = Form(None),
    contact: Optional[str] = Form(None),
    experience: Optional[str] = Form(None),
    education: Optional[str] = Form(None),
    certifications: Optional[str] = Form(None),
    skills: Optional[str] = Form(None),
    desired_position: Optional[str] = Form(None),
    desired_location: Optional[str] = Form(None),
    resume_pdf: UploadFile = File(None),
    resume_word: UploadFile = File(None),
):
    db: Session = SessionLocal()
    try:
        # 중복 검사
        existing_user = db.query(User).filter((User.id == id) | (User.name == name)).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="ID 또는 NAME이 이미 사용 중입니다.")

        # 사용자 생성
        user = User(
            id=id,
            password=password,
            name=name,
            age=age,
            contact=contact,
            experience=experience,
            education=education,
            certifications=certifications,
            skills=skills,
            desired_position=desired_position,
            desired_location=desired_location,
            resume_pdf=await resume_pdf.read() if resume_pdf else None,
            resume_word=await resume_word.read() if resume_word else None,
        )
        db.add(user)
        db.commit()
        return {"message": "회원가입 성공"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        db.close()        
        
        
class LoginRequest(BaseModel):
    id: str
    password: str
        
        

@router.post("/login")
async def login_user(id: str = Form(...), password: str = Form(...)):
    db: Session = SessionLocal()
    print(f"Login attempt: ID={id}, Password={password}")
    user = db.query(User).filter(User.id == id, User.password == password).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid ID or password")

    return {"message": f"Welcome {user.name}"}
