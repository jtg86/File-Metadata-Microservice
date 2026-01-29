# File Metadata Microservice (Node.js / Express)

A small microservice that accepts a file upload and returns basic metadata:
**original filename**, **MIME type**, and **size**.

This project is intentionally lightweight, but includes production-minded details:
request validation, file size limits, consistent error responses, and temp-file cleanup.

## API

### `POST /api/fileanalyse`
Upload a file using form field name: `upfile`

**Response**
```json
{
  "name": "document.pdf",
  "type": "application/pdf",
  "size": 248129
}
