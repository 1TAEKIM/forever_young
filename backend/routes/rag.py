from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
import os

router = APIRouter()

# **파일 경로 설정**
faiss_index_directory = "/Users/1tae/Desktop/bp/backend/faiss_index"
faiss_index_path = os.path.join(faiss_index_directory, "index.faiss")
metadata_path = os.path.join(faiss_index_directory, "index.pkl")

# **파일 확인**
if not os.path.exists(faiss_index_path):
    raise RuntimeError(f"FAISS index file not found at {faiss_index_path}")

if not os.path.exists(metadata_path):
    raise RuntimeError(f"Metadata file not found at {metadata_path}")

# **RAG 모델 초기화**
try:
    print("Initializing RAG model...")
    embeddings = HuggingFaceEmbeddings(
        model_name="dragonkue/bge-m3-ko",
        model_kwargs={"model_kwargs": {"torch_dtype": "float16"}},
    )
    print("Embeddings initialized successfully.")
except Exception as e:
    print(f"Error initializing embeddings: {str(e)}")
    raise RuntimeError(f"Error initializing embeddings: {str(e)}")

# **FAISS 인덱스 로드**
try:
    print(f"Loading FAISS index from {faiss_index_directory}...")
    vector_store = FAISS.load_local(
        faiss_index_directory, embeddings, allow_dangerous_deserialization=True
    )
    print(f"FAISS index loaded successfully. Total vectors: {vector_store.index.ntotal}")
except Exception as e:
    print(f"Error loading FAISS index: {str(e)}")
    raise RuntimeError(f"Failed to load FAISS index: {str(e)}")

# **요청 데이터 모델**
class RecommendationRequest(BaseModel):
    profile: str
    area: str = ""
    date: str = datetime.now().strftime("%Y%m%d")

@router.post("/recommend")
async def recommend_jobs(request: RecommendationRequest):
    try:
        print("Request received:", request)

        # 검색기 생성
        retriever = vector_store.as_retriever(
            search_kwargs={
                "k": 5,
                "fetch_k": 50,
            }
        )
        print("Retriever created successfully.")

        # 검색 결과 확인
        print("Attempting to retrieve relevant documents...")
        docs = retriever.get_relevant_documents(request.profile)  # 동기 호출로 수정
        if not docs:
            print("No documents retrieved.")
            return {"recommendations": []}
        print(f"Retrieved {len(docs)} documents.")
        print("Document contents:", docs)

        # 결과 변환
        formatted_recommendations = []
        for doc in docs:
            metadata = doc.metadata
            content = doc.page_content
            content_lines = content.splitlines(keepends=True)
            
            if content_lines[0].startswith("채용제목"):
                title = content_lines[0].removeprefix("채용제목: ").strip()
                description = "".join(content_lines[1:])
            else:
                title = "제목 없음"
                description = content

            # 제목과 설명으로 변환
            recommendation = {
                "title": title,
                "description": description,
                "url": metadata.get("url")
            }
            formatted_recommendations.append(recommendation)

        print("Formatted recommendations:", formatted_recommendations)

        return {"recommendations": formatted_recommendations}
    except Exception as e:
        print("Error during document retrieval:", str(e))
        raise HTTPException(status_code=500, detail=f"RAG processing failed: {str(e)}")
