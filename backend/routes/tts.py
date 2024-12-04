from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from gtts import gTTS
from langchain.prompts import PromptTemplate
import os
from .. import llm
import re

router = APIRouter()


# prompt_template = (
#     "Use the following pieces of a job description to make a list of three possible job interview questions. "
#     "Each question must be in one sentence without any remarks. "
#     "Your response must be in Korean.\n\n"
#     "{job_description}"
# )
prompt_template = (
    "다음 채용공고를 기반으로 구직자의 역량을 평가할 수 있는 면접 질문 3개를 한국어로 생성하세요:\n\n"
    "{job_description}"
)
prompt = PromptTemplate.from_template(prompt_template)

# 면접 질문 저장
generated_questions = []
@router.post("/generate_questions_for_job")
async def generate_questions_for_job(request: Request):
    """
    특정 일자리 데이터를 기반으로 면접 질문 생성
    """
    global generated_questions  # 전역 리스트 참조
    try:
        body = await request.json()
        job_description = body.get("job_description")

        if not job_description:
            return JSONResponse(content={"error": "Job description is required."}, status_code=400)

        provider = os.getenv("LLM_PROVIDER")
        
        if provider == 'mlx':
            bind_kwargs = {"pipeline_kwargs": {"max_tokens": 8192, "temp": 0.7}}
        elif provider == 'openai':
            bind_kwargs = {"temperature": 0.7}
        else:
            raise RuntimeError("No LLM provider.")
        
        questions = llm.bind(**bind_kwargs).invoke(prompt.invoke({"job_description": job_description})).content.replace("**", "")

        # 전역 리스트에 저장
        generated_questions = [q.strip() for q in re.findall(r"^(?:-|\d\.) (.*)$", questions, flags=re.MULTILINE)]

        return {"questions": generated_questions}

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@router.get("/{question_index}")
async def tts_page(question_index: int):
    """
    특정 질문의 텍스트를 음성 파일로 변환하고 파일 URL을 반환
    """
    global generated_questions
    try:
        if not generated_questions:
            return JSONResponse(
                content={"error": "No questions have been generated yet."}, status_code=400
            )

        if question_index < 0 or question_index >= len(generated_questions):
            return JSONResponse(
                content={
                    "error": f"Invalid question index. Received: {question_index}, but list length is {len(generated_questions)}."
                },
                status_code=400,
            )

        question_text = generated_questions[question_index]

        # TTS 음성 생성
        tts = gTTS(text=question_text, lang="ko")
        static_dir = "static"
        if not os.path.exists(static_dir):
            os.makedirs(static_dir)

        tts_file = f"{static_dir}/question_{question_index}.mp3"
        tts.save(tts_file)

        # 파일 URL 반환
        return JSONResponse(
            content={
                "question_text": question_text,
                "audio_file": f"/static/question_{question_index}.mp3",
            },
            status_code=200,
        )

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
