import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    const chapterNumber = parseInt(id);

    if (
      Number.isNaN(chapterNumber) ||
      chapterNumber < 1 ||
      chapterNumber > 18
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid chapter number"
      });
    }

    const filePath = path.join(
      process.cwd(),
      "data",
      `chapter_${chapterNumber}_optimized.json`
    );

    const content = await fs.readFile(filePath, "utf8");

    return res.status(200).json({
      success: true,
      chapter: chapterNumber,
      verses: JSON.parse(content)
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Chapter not found"
    });
  }
}