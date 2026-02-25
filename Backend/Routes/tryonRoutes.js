import express from "express";
import multer from "multer";
import fs from "fs";
import { Client } from "@gradio/client";

const router = express.Router();

const upload = multer({
  dest: "uploads/temp/",
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Only JPEG/PNG/WEBP allowed"));
  },
});

const cleanup = (...files) =>
  files.forEach((f) => { try { if (f) fs.unlinkSync(f); } catch { } });

// ── Health check ───────────────────────────────────────────────────────────────
router.get("/health", (req, res) => {
  res.json({ success: true, message: "VTON route is running" });
});

// ── Main try-on endpoint ───────────────────────────────────────────────────────
router.post(
  "/try",
  upload.fields([
    { name: "person_image", maxCount: 1 },
    { name: "cloth_image", maxCount: 1 },
  ]),
  async (req, res) => {
    console.log("Request received")
    const personFile = req.files?.person_image?.[0];
    const clothFile = req.files?.cloth_image?.[0];

    if (!personFile || !clothFile) {
      cleanup(personFile?.path, clothFile?.path);
      return res.status(400).json({
        success: false,
        message: "Both person_image and cloth_image are required",
      });
    }

    try {
      const client = await Client.connect("levihsu/OOTDiffusion", {
        hf_token: process.env.HF_TOKEN
      });
      const personBlob = new Blob(
        [fs.readFileSync(personFile.path)],
        { type: personFile.mimetype }
      );
      const clothBlob = new Blob(
        [fs.readFileSync(clothFile.path)],
        { type: clothFile.mimetype }
      );

      const result = await client.predict("/process_hd", [
        personBlob,
        clothBlob,
        req.body.category || "Upper body",
        1,
        20,
        2.0, b
      ]);

      cleanup(personFile.path, clothFile.path);

      return res.json({
        success: true,
        result_url: result.data[0]?.url || null,
        message: "Virtual try-on completed!",
      });

    } catch (err) {
      cleanup(personFile?.path, clothFile?.path);
      console.error("[VTON] Error:", err.message);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

export default router;