from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import spacy

server = FastAPI()
nlp = spacy.load("en_core_web_md")

class LemmatizeRequest(BaseModel):
    sentence: str

@server.exception_handler(RequestValidationError)
async def validation_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": "Sentence must be string!"},
    )

@server.post("/")
def lemmatize(payload: LemmatizeRequest):
    sentence = payload.sentence.strip()

    if not sentence:
        raise HTTPException(status_code=400, detail="Sentence is required!")

    try:
        doc = nlp(sentence)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Text could not be processed: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Unexpected error!")

    return {"data": [{"text": t.text, "lemma": t.lemma_, "pos": t.pos_} for t in doc]}