File Metadata Microservice

A small, production-minded Node.js / Express microservice that accepts a file upload and returns basic metadata about the file.

The service is intentionally simple, but includes several real-world considerations such as request validation, file size limits, consistent error handling, and temporary file cleanup.

Purpose

This project demonstrates how to build a clean, minimal microservice using Express that:

handles multipart file uploads safely

exposes a clear HTTP API

returns structured JSON responses

avoids common pitfalls such as unbounded uploads and leftover temp files

It is designed as a technical demonstration, not a full production system.

API
POST /api/fileanalyse

Upload a file using the form field name upfile.

Successful response
{
  "name": "document.pdf",
  "type": "application/pdf",
  "size": 248129
}

Error responses

No file uploaded

{
  "error": {
    "code": "NO_FILE",
    "message": "No file uploaded. Use form field name: upfile"
  }
}


File too large

{
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "Max file size is 5MB."
  }
}

GET /health

Simple health-check endpoint, useful for monitoring and container orchestration.

Response
{
  "status": "ok"
}

File Handling Details

Maximum upload size: 5 MB

Files are stored temporarily during request processing

Uploaded files are deleted immediately after the response is sent

No file contents are persisted

This avoids unnecessary disk usage and reduces security risk.

Run Locally
Requirements

Node.js 18+ (or compatible LTS)

npm

Install dependencies
npm install

Start the service
npm start


The service runs on:

http://localhost:3000


You can override the port using the PORT environment variable.

Example Request (curl)
curl -F "upfile=@./example.pdf" http://localhost:3000/api/fileanalyse

Environment Variables
Variable	Description	Default
PORT	HTTP server port	3000
Notes and Limitations

This service does not scan file contents

No authentication is implemented

MIME type is based on client-provided metadata

Intended as a demonstration of API design and safe file handling

Why This Project Exists

This repository exists to show:

clean Express API structure

defensive input handling

predictable JSON responses

basic operational thinking (limits, cleanup, health endpoint)

It is intentionally small, readable, and easy to reason about.

License

MIT License
