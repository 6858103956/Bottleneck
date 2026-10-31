# Local Qwen Chat with document search

A Flask chat app that runs locally with Ollama. The browser keeps conversation history in memory. Add PDF, DOCX, TXT, or Markdown files to the Document Collection and ask questions grounded in their contents. Uploaded files and the Chroma vector index stay in the local `data/` directory; no cloud AI service is used.

## Requirements

- Python 3.9 or newer
- [Ollama](https://ollama.com/) installed and running locally

Download the chat and embedding models once:

```bash
ollama pull qwen3:1.7b
ollama pull nomic-embed-text
```

## Setup and run

From this directory, create and activate a virtual environment, install dependencies, then start the app:

```bash
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Open <http://127.0.0.1:5000>. Flask binds to `127.0.0.1`; Ollama must be reachable at `http://localhost:11434`.

## Upload and ask questions

1. Start Ollama and the Flask app, then open the app in your browser.
2. In **Document Collection**, choose **Add documents** and select one or more PDF, DOCX, TXT, or Markdown files. Each file is extracted, split into overlapping text chunks, embedded with the local `nomic-embed-text` model, and saved to the local collection.
3. Wait for the “added” status and confirm the filename and size appear in the list.
4. Ask a specific question about the document in the chat, such as “What were the study's main findings?” The app retrieves relevant chunks and passes them to `qwen3:1.7b` as context. If relevant evidence is not found, the assistant is instructed to say so.
5. Use **Delete** beside a file to remove its original and indexed chunks.

The app accepts files up to 20 MB each. Scanned PDFs that contain only page images need OCR before their text can be searched. The first upload can take a little while because each chunk is embedded locally.

## Local data

- `data/uploads/` — uploaded originals
- `data/chroma/` — persistent local vector collection

To store these elsewhere, set `DOCUMENT_DATA_DIR` before starting Flask.

## Project files

- `app.py` — Flask routes, Ollama calls, document extraction, chunking, and retrieval.
- `templates/index.html` — chat page and document collection.
- `static/style.css` — interface styling.
- `static/app.js` — browser conversation and document collection behavior.
- `requirements.txt` — Flask, ChromaDB, PDF, and DOCX libraries.
