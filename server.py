import os
from pathlib import Path
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import re

# ──────────────────────────────────────────────────────────────
# Configuration & Paths
# ──────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent
PDF_PATH = BASE_DIR / "Data" / "CONST. INDIA.pdf"
CHROMA_DIR = BASE_DIR / "chroma_db"

GROQ_API_KEY = os.environ.get(
    "GROQ_API_KEY",
    "Enter Groq API key"
)

# ──────────────────────────────────────────────────────────────
# FastAPI App with CORS
# ──────────────────────────────────────────────────────────────
app = FastAPI(title="NyayaAI RAG Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AskRequest(BaseModel):
    question: str

class AskResponse(BaseModel):
    question: str
    answer: str
    sources: Optional[List[str]] = None

# Global RAG resources
collection = None
embedding_model = None
groq_client = None

def initialize_rag():
    global collection, embedding_model, groq_client

    if collection is not None:
        return

    print("Initializing NyayaAI RAG Engine...")

    # 1. Setup Groq Client
    from groq import Groq
    groq_client = Groq(api_key=GROQ_API_KEY)

    # 2. Setup Embedding Model
    from sentence_transformers import SentenceTransformer
    print("Loading embedding model (all-MiniLM-L6-v2)...")
    embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

    # 3. Setup Persistent ChromaDB
    import chromadb
    chroma_client = chromadb.PersistentClient(path=str(CHROMA_DIR))
    collection = chroma_client.get_or_create_collection(name="nyayaai_constitution")

    # If collection is already populated, skip PDF extraction
    if collection.count() > 0:
        print(f"Loaded existing index with {collection.count()} chunks from ChromaDB.")
        return

    # Otherwise extract and index Constitution PDF
    if not PDF_PATH.exists():
        print(f"Warning: PDF file not found at {PDF_PATH}. Server running without index.")
        return

    print(f"Extracting and indexing {PDF_PATH.name}...")
    import pymupdf
    from langchain_text_splitters import RecursiveCharacterTextSplitter

    doc = pymupdf.open(str(PDF_PATH))
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", ". ", " ", ""]
    )

    chunks = []
    for page_num, page in enumerate(doc, start=1):
        text = page.get_text("text").strip()
        if not text:
            continue
        page_chunks = splitter.split_text(text)
        for idx, chunk_text in enumerate(page_chunks):
            chunks.append({
                "text": chunk_text,
                "page": page_num,
                "chunk_index": idx
            })

    print(f"Extracted {len(chunks)} chunks from {len(doc)} pages. Generating embeddings...")
    texts = [c["text"] for c in chunks]
    embeddings = embedding_model.encode(
        texts,
        batch_size=32,
        show_progress_bar=True,
        normalize_embeddings=True
    )

    collection.upsert(
        ids=[f"constitution_{i}" for i in range(len(chunks))],
        documents=texts,
        embeddings=embeddings.tolist(),
        metadatas=[
            {
                "page": int(c["page"]),
                "chunk_index": int(c["chunk_index"]),
                "source": "Constitution of India"
            }
            for c in chunks
        ]
    )
    print(f"Successfully stored {collection.count()} chunks in ChromaDB!")

@app.on_event("startup")
def on_startup():
    try:
        initialize_rag()
    except Exception as e:
        print(f"Note: Full RAG initialization deferred or error: {e}")

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "NyayaAI RAG Backend",
        "endpoint": "POST /ask"
    }

def clean_answer(text: str) -> str:
    """Sanitizes LLM output to ensure clean Markdown without stray HTML/SVG or duplicates."""
    if not text:
        return ""
    # Normalize unicode whitespace and hyphens
    text = (
        text.replace("\u202f", " ")
        .replace("\u00a0", " ")
        .replace("\u2011", "-")
        .replace("\u200b", "")
        .replace("\ufeff", "")
    )

    # Convert <br> tags to newlines before stripping HTML
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.IGNORECASE)

    # Remove stray SVG blocks or tags
    text = re.sub(r"<svg[\s\S]*?</svg>", "", text, flags=re.IGNORECASE)
    text = re.sub(r"</?svg[^>]*>", "", text, flags=re.IGNORECASE)

    # Strip any remaining HTML tags
    text = re.sub(r"<[^>]+>", "", text)

    # Decode common HTML entities
    text = (
        text.replace("&nbsp;", " ")
        .replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&quot;", '"')
    )

    # Remove trailing duplicate source citations added by LLM
    text = re.sub(
        r"(?i)\n*(?:#{1,4}\s*)?(?:Sources?|References?|Source\s+Pages?):\s*(?:(?:Page\s*\d+|Constitution\s*of\s*India)[,\s\n-]*)+$",
        "",
        text,
    )

    # Ensure blank lines around markdown tables
    text = re.sub(r"([^\n])\n(\|.+\|)\n", r"\1\n\n\2\n", text)

    # Normalize excessive newlines
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


@app.post("/ask", response_model=AskResponse)
def ask_endpoint(payload: AskRequest):
    question = payload.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    global collection, embedding_model, groq_client
    if collection is None or groq_client is None:
        initialize_rag()

    # 1. Embed query
    query_embedding = embedding_model.encode(
        question,
        normalize_embeddings=True
    ).tolist()

    # 2. Retrieve top-k passages from ChromaDB
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=10
    )

    passages = results["documents"][0] if results.get("documents") else []
    metadata_list = results["metadatas"][0] if results.get("metadatas") else []

    context_parts = []
    source_pages = []

    for i, passage in enumerate(passages):
        page = metadata_list[i].get("page", "N/A")
        if page != "N/A" and f"Page {page}" not in source_pages:
            source_pages.append(f"Page {page}")
        context_parts.append(
            f"[Source: Constitution of India, PDF page {page}]\n{passage}"
        )

    context = "\n\n".join(context_parts)

    # 3. Call Groq LLM
    try:
        system_prompt = """You are NyayaAI, an Indian Constitution AI Assistant.
Your goal is to provide accurate, clear, and easy-to-understand legal information to Indian citizens.

FORMATTING RULES:
1. Format exclusively in standard Markdown using clean headings (### Heading) and paragraphs.
2. Use organized bullet points (- item) for lists, key principles, or provisions.
3. DO NOT output any raw HTML (no <br>, no <table>, no <svg>, no tags).
4. Do NOT create Markdown tables unless the user explicitly requested a table; use clear bullet points instead.
5. Do NOT include a "Sources:" or "References:" section at the end of your response, as the system already provides verified source citations separately.
6. Do NOT append repeated legal disclaimer boilerplate at the end of every paragraph.

CONTENT & ACCURACY RULES:
1. For questions about the Constitution, use the retrieved Constitution passages as your primary evidence.
2. Never invent, hallucinate, or fabricate Article numbers, clauses, quotes, or page numbers.
3. For questions asking historical facts beyond the Constitution text (such as "Who wrote/drafted the Constitution?", "Who was the Chairman of the Drafting Committee?", "When was the Constitution adopted/enacted?"):
   - Provide accurate historical facts (e.g., Dr. B.R. Ambedkar was Chairman of the Drafting Committee; adopted on 26 November 1949, came into force on 26 January 1950).
   - Do NOT pretend or invent that these historical facts are an Article number in the Constitution text.
4. If the retrieved Constitution passages do not contain enough information to answer a question, explicitly state the limitation (e.g., "The retrieved passages from the Constitution do not explicitly address...").
5. Clearly distinguish verified Constitutional provisions from general legal explanations.
"""
        response = groq_client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": f"Question: {question}\n\nConstitution passages retrieved:\n{context}"
                }
            ],
            temperature=0.1,
            max_tokens=1200
        )
        answer = clean_answer(response.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM Generation failed: {str(e)}")

    return AskResponse(
        question=question,
        answer=answer,
        # Deduplicate sources and remove empty entries
        sources=list(dict.fromkeys([src for src in (source_pages[:5] if source_pages else []) if src])) or None
    )

if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=False)
