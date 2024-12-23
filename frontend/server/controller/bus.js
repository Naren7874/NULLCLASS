const Bus = require("../models/bus"); // Adjust the path as necessary

exports.rateBus = async (req, res) => {
  try {
    const { busId, rating } = req.body;

    if (!busId || typeof rating !== "number") {
      return res
        .status(400)
        .json({ message: "Valid Bus ID and numeric rating are required." });
    }

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found." });
    }

    // Add the new rating
    bus.ratings.push(rating);
    // Update the average rating
    await bus.updateAverageRating();

    res.status(200).json({ message: "Rating added successfully.", bus });
  } catch (error) {
    console.error("Error rating bus:", error);
    res.status(500).json({ message: "An error occurred.", error });
  }
};
