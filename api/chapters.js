export default function handler(req, res) {
  const chapters = [];

  for (let i = 1; i <= 18; i++) {
    chapters.push({
      chapter: i,
      api: `/api/chapter/${i}`
    });
  }

  res.status(200).json(chapters);
}