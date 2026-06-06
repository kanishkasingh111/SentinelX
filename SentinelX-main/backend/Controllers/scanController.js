const Scan = require("../models/Scan");

const saveScan = async (req, res) => {
  try {
    const scan = await Scan.create(req.body);

    res.status(201).json(scan);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getScans = async (req, res) => {
  try {
    const scans = await Scan.find({
      userId: req.params.userId,
    });

    res.json(scans);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  saveScan,
  getScans,
};