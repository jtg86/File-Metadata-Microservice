const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs/promises");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Simple health endpoint (useful for monitoring / container checks)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Ensure upload dir exists
const UPLOAD_DIR = path.join(process.cwd(), "uploads");

// Multer config: limits + safe temp storage
const upload = multer({
  dest: UPLOAD_DIR,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  // Optional: allowlist (uncomment if you want to restrict)
//   fileFilter: (req, file, cb) => {
//     const allowed = new Set([
//       "image/png",
//       "image/jpeg",
//       "application/pdf",
//       "text/plain",
//     ]);
//     if (!allowed.has(file.mimetype)) {
//       return cb(new Error("Unsupported file type"));
//     }
//     cb(null, true);
//   },
});

// POST endpoint: upload + return metadata + cleanup
app.post("/api/fileanalyse", upload.single("upfile"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      error: {
        code: "NO_FILE",
        message: "No file uploaded. Use form field name: upfile",
      },
    });
  }

  try {
    return res.json({
      name: file.originalname,
      type: file.mimetype,
      size: file.size,
    });
  } finally {
    // cleanup temp file to avoid filling disk
    if (file.path) {
      try {
        await fs.unlink(file.path);
      } catch {
        // ignore cleanup errors
      }
    }
  }
});

// Central error handler (covers multer errors too)
app.use((err, req, res, next) => {
  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      error: { code: "FILE_TOO_LARGE", message: "Max file size is 5MB." },
    });
  }

  return res.status(400).json({
    error: {
      code: "BAD_REQUEST",
      message: err?.message || "Request failed",
    },
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("File Metadata Microservice listening on port " + port);
});
