const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const busSchema = new Schema({
  operatorName: {
    type: String,
    required: true,
  },
  busType: {
    type: String,
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
  // Store an array of individual ratings as numbers
  ratings: {
    type: [Number],
    required: true,
    default: [], // Initialize as an empty array
  },
  // Optionally, calculate and store the average rating
  averageRating: {
    type: Number,
    default: 0, // Start with no rating
  },
  totalSeats: {
    type: Number,
    required: false,
  },
  routes: {
    type: Schema.Types.ObjectId,
    ref: "Routes",
    required: true,
  },
  images: {
    type: String,
    required: true,
  },
  liveTracking: {
    type: Number,
    required: true,
  },
  reschedulable: {
    type: Number,
    required: true,
  },
  virtualTour: [String],
});

// Method to calculate and update the average rating
busSchema.methods.updateAverageRating = function () {
  if (this.ratings.length > 0) {
    this.averageRating =
      this.ratings.reduce((sum, rating) => sum + rating, 0) / this.ratings.length;
  } else {
    this.averageRating = 0; // Reset to 0 if no ratings
  }
  return this.save();
};

module.exports = mongoose.model("Buses", busSchema);