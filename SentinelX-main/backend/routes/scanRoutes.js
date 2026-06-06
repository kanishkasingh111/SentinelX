const express = require("express");

const {
  saveScan,
  getScans,
} = require("../controllers/scanController");

const router = express.Router();

router.post("/", saveScan);

router.get("/:userId", getScans);

module.exports = router;