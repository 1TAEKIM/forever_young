from sqlalchemy import Column, String, Integer, LargeBinary
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, index=True, nullable=False)  # VARCHAR(50), 필수
    password = Column(String(100), nullable=False)  # VARCHAR(100), 필수
    name = Column(String(100), nullable=False)  # VARCHAR(100), 필수
    age = Column(Integer, nullable=True)  # 선택 입력
    contact = Column(String(15), nullable=True)  # VARCHAR(15), 선택 입력
    experience = Column(String(255), nullable=True)  # VARCHAR(255), 선택 입력
    education = Column(String(255), nullable=True)  # VARCHAR(255), 선택 입력
    certifications = Column(String(255), nullable=True)  # VARCHAR(255), 선택 입력
    skills = Column(String(255), nullable=True)  # VARCHAR(255), 선택 입력
    desired_position = Column(String(100), nullable=True)  # VARCHAR(100), 선택 입력
    desired_location = Column(String(100), nullable=True)  # VARCHAR(100), 선택 입력
    resume_pdf = Column(LargeBinary, nullable=True)  # 선택 입력
    resume_word = Column(LargeBinary, nullable=True)  # 선택 입력
