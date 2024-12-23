const express = require("express");
const router = express.Router();
const busController = require("../controller/bus"); // Adjust the path as needed

// Route to store a rating for a bus
router.post("/rate", busController.rateBus);

module.exports = router;
