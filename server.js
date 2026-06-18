import express from "express";
import fs from "fs/promises";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Home Route
 */
app.get("/", (req, res) => {
  res.json({
    name: "Bhagavad Gita API",
    version: "1.0.0",
    endpoints: {
      allChapters: "/api/chapters",
      chapter1: "/api/chapter/1",
      chapter2: "/api/chapter/2",
      chapter18: "/api/chapter/18"
    }
  });
});

/**
 * List all chapters
 */
app.get("/api/chapters", (req, res) => {
  const chapters = [];

  for (let i = 1; i <= 18; i++) {
    chapters.push({
      chapter: i,
      endpoint: `/api/chapter/${i}`
    });
  }

  res.json(chapters);
});

/**
 * Get Chapter JSON
 */
app.get("/api/chapter/:id", async (req, res) => {
  try {
    const chapterId = parseInt(req.params.id);

    if (
      Number.isNaN(chapterId) ||
      chapterId < 1 ||
      chapterId > 18
    ) {
      return res.status(400).json({
        success: false,
        error: "Chapter number must be between 1 and 18"
      });
    }

    const filePath = path.join(
      process.cwd(),
      "data",
      `chapter_${chapterId}_optimized.json`
    );

    console.log(`Reading file: ${filePath}`);

    const fileContent = await fs.readFile(filePath, "utf8");

    const chapterData = JSON.parse(fileContent);

    return res.status(200).json(chapterData);

  } catch (error) {
    console.error("ERROR:", error);

    return res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Debug Route
 * Shows files available inside data folder
 */
app.get("/debug", async (req, res) => {
  try {
    const files = await fs.readdir(
      path.join(process.cwd(), "data")
    );

    res.json({
      totalFiles: files.length,
      files
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * Start Server
 */
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});