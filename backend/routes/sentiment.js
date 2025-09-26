import express from "express";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../data/twitter_sentiment_analysis.csv");

router.get("/", (req, res) => {
  const counts = {
    Positive: 0,
    Negative: 0,
    Neutral: 0,
  };

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      const label = row.Label; // match CSV column
      if (counts[label] !== undefined) {
        counts[label] += 1;
      }
    })
    .on("end", () => {
      res.json(counts);
    });
});

export default router;
