import express from "express";
import fs from "fs/promises";
import path from "path";

const app = express();
const PORT = 3000;

// Home Route
app.get("/", (req, res) => {
  res.json({
    message: "Bhagavad Gita API",
    endpoints: [
      "/api/chapters",
      "/api/chapter/1",
      "/api/chapter/2",
      "/api/chapter/18"
    ]
  });
});

// List all chapters
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

// Get chapter JSON
app.get("/api/chapter/:id", async (req, res) => {
  try {
    const chapterId = parseInt(req.params.id);

    if (
      Number.isNaN(chapterId) ||
      chapterId < 1 ||
      chapterId > 18
    ) {
      return res.status(400).json({
        error: "Chapter number must be between 1 and 18"
      });
    }

    const filePath = path.join(
      process.cwd(),
      "data",
      `chapter_${chapterId}_verses.json`
    );

    const fileContent = await fs.readFile(filePath, "utf8");

    // Return JSON file directly
    res.json(JSON.parse(fileContent));

  } catch (error) {
    console.error(error);

    res.status(404).json({
      error: "Chapter file not found"
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

app.get("/api/chapter/:chapterId/verse/:verseId", async (req, res) => {
  try {
    const { chapterId, verseId } = req.params;

    const filePath = path.join(
      process.cwd(),
      "data",
      `chapter_${chapterId}_verses.json`
    );

    const fileContent = await fs.readFile(filePath, "utf8");
    const verses = JSON.parse(fileContent);

    const verse = verses.find(
      v => Number(v.verse_number) === Number(verseId)
    );

    if (!verse) {
      return res.status(404).json({
        error: "Verse not found"
      });
    }

    res.json(verse);

  } catch (error) {
    res.status(404).json({
      error: "Chapter not found"
    });
  }
});