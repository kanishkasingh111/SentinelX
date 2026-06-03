const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SentinelX Backend Running");
});

app.post("/analyze", (req, res) => {
  const { text } = req.body;

  let result = "";
  let riskLevel = "";
  let keywords = [];

  if (text.toLowerCase().includes("win")) {
    result = "Possible Scam Detected";
    riskLevel = "High";
    keywords = ["win", "reward", "money"];
  } 
  else if (text.toLowerCase().includes("bank")) {
    result = "Suspicious Banking Message";
    riskLevel = "Medium";
    keywords = ["bank", "account", "verification"];
  } 
  else {
    result = "Content Looks Safe";
    riskLevel = "Low";
    keywords = ["safe", "normal"];
  }

  res.json({
    result,
    riskLevel,
    keywords,
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});