require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const authRoutes =
  require("./routes/authRoutes");

const scanRoutes =
  require("./routes/scanRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/scans", scanRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.json());
app.use(
  "/api/auth",
  authRoutes
);
app.use(
  "/api/scans",
  scanRoutes
);

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

app.get("/", (req, res) => {
  res.send("SentinelX Backend Running");
});

app.post("/analyze", async (req, res) => {
  try {
    const { text } = req.body;

    const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const prompt = `
You are a cybersecurity threat analyzer.

Analyze the following text and provide:

1. Threat Status
2. Risk Level (High, Medium, Low)
3. Suspicious Keywords

Text:
${text}

Respond in this format:

Threat Status: ...
Risk Level: ...
Keywords: keyword1, keyword2, keyword3
`;

    const result = await model.generateContent(prompt);

    const responseText =
      result.response.text();

    const riskMatch =
      responseText.match(/Risk Level:\s*(.*)/i);

    const keywordMatch =
      responseText.match(/Keywords:\s*(.*)/i);

    const threatMatch =
      responseText.match(/Threat Status:\s*(.*)/i);

    res.json({
      result: threatMatch
        ? threatMatch[1]
        : "Analysis Complete",

      riskLevel: riskMatch
        ? riskMatch[1]
        : "Unknown",

      keywords: keywordMatch
        ? keywordMatch[1]
            .split(",")
            .map((k) => k.trim())
        : [],
    });
  } catch (error) {
  console.log("FULL ERROR:", error);

  res.status(500).json({
    result: error.message,
    riskLevel: "Unknown",
    keywords: [],
  });
}
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
