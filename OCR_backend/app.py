# main.py
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
from answer_marking import answer_marking
from OCR import OCR
from fastapi.responses import ORJSONResponse



app = FastAPI()
ocr = OCR()

# Optional: Allow CORS for frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/ocr")
async def perform_ocr(file: UploadFile = File(...),teacher_answer:str=Form(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File is not an image")

    # Read image bytes
    contents = await file.read()
    # try:
    #     image = Image.open(io.BytesIO(contents))
    # except Exception as e:
    #     raise HTTPException(status_code=400, detail="Invalid image file")

    # Perform OCR using your class
    # teacher_answer = "Byzantine General Problem and Consensus in Blockchain:\n\nThe Byzantine General Problem is a scenario in distributed systems where multiple parties (nodes) must agree on a single course of action, but some participants may act maliciously or send conflicting information.\n\nThis problem highlights difficulty in reaching a consensus when some nodes may be faulty or compromised.\nThe challenge is to ensure that honest nodes agree on same data or decision, even if some nodes try to deceive others.\n\nIn context of blockchain, the need for consensus is crucial because the network relies on multiple, decentralized nodes to validate transactions.\nWithout a proper consensus mechanism, it is impossible to ensure integrity and reliability of data on blockchain.\n\nConsensus Mechanism in Blockchain:\n\n- Proof of Work (PoW): This is used in blockchain like Bitcoin, where nodes (miners) solve complex mathematical problems to validate transactions and create new blocks.\nIt is energy intensive but helps prevent malicious behavior."

    text = ocr.start(contents)
    if isinstance(text, list):
    # Check if it's a list of strings
        if all(isinstance(word, str) for word in text):
            text = " ".join(text).strip()
        else:
            raise HTTPException(status_code=500, detail="OCR returned a non-string list element.")
    else:
        text = str(text).strip()
    print(text)
    marking=answer_marking(text,teacher_answer)
    score = marking.grading()
    return {"extracted_text": text,'score':score}
