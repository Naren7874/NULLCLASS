const Bus=require("../models/bus");

async function addRating(busId, newRating) {
  try {
    const bus = await Bus.findById(busId);
    if (!bus) {
      throw new Error("Bus not found");
    }

    bus.ratings.push(newRating);
    await bus.updateAverageRating();

    console.log("Rating added and average updated:", bus);
  } catch (error) {
    console.error("Error adding rating:", error);
  }
}
