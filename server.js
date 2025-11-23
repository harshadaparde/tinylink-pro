// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// const pool = require("./db");

// app.use(cors());
// app.use(express.json());
// app.use(express.static("public"));

// // ✅ Health check
// app.get("/healthz", (req, res) => {
//   res.status(200).json({ ok: true, version: "1.0" });
// });

// // ✅ Stats page route (MUST BE BEFORE /:code)
// app.get("/code/:code", async (req, res) => {
//   const code = req.params.code;

//   try {
//     const result = await pool.query(
//       "SELECT * FROM links WHERE code=$1",
//       [code]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).send("Not Found");
//     }

//     res.json(result.rows[0]);
//   } catch (err) {
//     res.status(500).send("Server Error");
//   }
// });

// // ✅ API routes
// const linkRoutes = require("./routes/links");
// app.use("/api/links", linkRoutes);

// // ✅ Redirect route (MUST BE LAST)
// app.get("/:code", async (req, res) => {
//   const code = req.params.code;

//   try {
//     const result = await pool.query(
//       "SELECT * FROM links WHERE code=$1",
//       [code]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).send("Not Found");
//     }

//     await pool.query(
//       "UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code=$1",
//       [code]
//     );

//     res.redirect(302, result.rows[0].url);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

// // ✅ Start server
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();   // ✅ THIS LINE WAS MISSING

const pool = require("./db");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Health check
app.get("/healthz", (req, res) => {
  res.json({ ok: true, version: "1.0" });
});

// Redirect logic
app.get("/:code", async (req, res) => {
  const code = req.params.code;

  try {
    const result = await pool.query(
      "SELECT * FROM links WHERE code=$1",
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Not Found");
    }

    await pool.query(
      "UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code=$1",
      [code]
    );

    res.redirect(302, result.rows[0].url);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// API Routes
const linkRoutes = require("./routes/links");
app.use("/api/links", linkRoutes);

// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
