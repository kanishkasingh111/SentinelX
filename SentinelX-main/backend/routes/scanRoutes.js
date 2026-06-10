const express = require("express");

const {
  saveScan,
  getScans,
  deleteScan,
  clearAllScans,
} = require("../controllers/scanController");

const router = express.Router();

router.post("/", saveScan);

router.get("/:userId", getScans);

router.delete("/:id", deleteScan);

router.delete("/clear/:userId",clearAllScans);

module.exports = router;