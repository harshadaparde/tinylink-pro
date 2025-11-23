const express = require("express");
const router = express.Router();
const pool = require("../db");
const { nanoid } = require("nanoid");

// Create link
router.post("/", async (req, res) => {
  const { url, code } = req.body;
  const shortCode = code || nanoid(6);

  try {
    await pool.query(
      "INSERT INTO links(code, url) VALUES($1, $2)",
      [shortCode, url]
    );
    res.json({ code: shortCode });
  } catch {
    res.status(409).json({ error: "Code already exists" });
  }
});

// Get all links
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM links");
  res.json(result.rows);
});

// Get single link stats
router.get("/:code", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM links WHERE code=$1",
    [req.params.code]
  );
  res.json(result.rows[0]);
});

// Delete link
router.delete("/:code", async (req, res) => {
  await pool.query("DELETE FROM links WHERE code=$1", [req.params.code]);
  res.sendStatus(204);
});

module.exports = router;
