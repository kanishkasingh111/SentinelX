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

const deleteScan = async (req, res) => {
  try {
    await Scan.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Scan deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const clearAllScans = async (req, res) => {
  try {
    await Scan.deleteMany({
      userId: req.params.userId,
    });

    res.json({
      message: "All scans deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  saveScan,
  getScans,
  deleteScan,
  clearAllScans,
};