import os
from dotenv import load_dotenv
from langchain_community.llms.mlx_pipeline import MLXPipeline
from langchain_community.chat_models import ChatMLX
from langchain_openai import ChatOpenAI


load_dotenv()

provider = os.getenv("LLM_PROVIDER")

if provider == "mlx":
    llm = ChatMLX(
        llm=MLXPipeline.from_model_id(
            "mlx-community/gemma-2-2b-it-4bit",
            pipeline_kwargs={"max_tokens": 8192, "temp": 0.2},
        )
    )
elif provider == "openai":
    llm = ChatOpenAI(name="gpt-4o-mini", temperature=0.2, api_key=os.getenv("OPENAI_API_KEY"))
else:
    raise RuntimeError("No LLM provider.")
