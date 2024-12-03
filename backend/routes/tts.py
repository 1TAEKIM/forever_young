from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, HTMLResponse
from gtts import gTTS
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.llms import OpenAI
import os

router = APIRouter()

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

        openai_api_key = os.getenv("OPENAI_API_KEY")
        if not openai_api_key:
            return JSONResponse(content={"error": "API 키가 설정되지 않았습니다."}, status_code=500)

        llm = OpenAI(temperature=0.7, openai_api_key=openai_api_key)

        prompt_template = PromptTemplate(
            input_variables=["job_description"],
            template="""
            다음 채용공고를 기반으로 구직자의 역량을 평가할 수 있는 면접 질문 3개를 한국어로 생성하세요:
            
            채용공고:
            {job_description}

            면접 질문:
            """
        )

        chain = LLMChain(llm=llm, prompt=prompt_template)
        questions = chain.run({"job_description": job_description}).split("\n")

        # 전역 리스트에 저장
        generated_questions = [q.strip("- ") for q in questions if q.strip()]

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



from fastapi.responses import FileResponse

@router.get("/static/{file_name}")
async def serve_file(file_name: str):
    file_path = f"static/{file_name}"
    if not os.path.exists(file_path):
        return JSONResponse(content={"error": "File not found"}, status_code=404)
    return FileResponse(file_path, media_type="audio/mpeg")
