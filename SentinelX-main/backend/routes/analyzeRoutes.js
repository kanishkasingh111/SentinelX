const express = require("express");

const {
  analyzeThreat,
} = require(
  "../controllers/analyzeController"
);

const router = express.Router();

router.post(
  "/analyze",
  analyzeThreat
);

module.exports = router;