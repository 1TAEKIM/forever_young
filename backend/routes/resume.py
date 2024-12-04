from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from langchain_community.document_loaders import Docx2txtLoader, PyPDFLoader
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.prompts import PromptTemplate
import os
import tempfile
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import User
from typing import Optional
from .. import llm


router = APIRouter()


# prompt_template = (
#     "Summarize the following content in one sentence. "
#     "The summary must be in Korean.\n\n"
#     "{context}"
# )
prompt_template = (
    "다음 내용을 한 문장으로 요약하세요:\n\n"
    "{context}"
)
prompt = PromptTemplate.from_template(prompt_template)
chain = create_stuff_documents_chain(llm, prompt=prompt)


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
        contents = await file.read()
        tmp_file.write(contents)
        tmp_file_name = tmp_file.name

    loader = None
    if file.filename.endswith(".pdf"):
        loader = PyPDFLoader(tmp_file_name)
    elif file.filename.endswith(".docx"):
        loader = Docx2txtLoader(tmp_file_name)
    else:
        os.remove(tmp_file_name)
        return JSONResponse(content={"error": "Unsupported file type"}, status_code=400)

    documents = loader.load()
    os.remove(tmp_file_name)

    summary = chain.invoke({"context": documents}).removesuffix("<end_of_turn>").strip()

    return {"summary": summary}


########################################################################

# 이력서 작성 코드

@router.get("/resume/{user_id}")
async def get_resume(user_id: str):
    db: Session = SessionLocal()
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "age": user.age,
        "contact": user.contact,
        "experience": user.experience,
        "education": user.education,
        "certifications": user.certifications,
        "skills": user.skills,
        "desired_position": user.desired_position,
        "desired_location": user.desired_location,
    }

@router.post("/resume")
async def create_resume(
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
    # Save resume logic here...
    return {"message": "Resume created successfully"}

@router.put("/resume/{user_id}")
async def update_resume(
    user_id: str,
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
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update fields
    user.age = age
    user.contact = contact
    user.experience = experience
    user.education = education
    user.certifications = certifications
    user.skills = skills
    user.desired_position = desired_position
    user.desired_location = desired_location

    db.commit()
    return {"message": "Resume updated successfully"}


