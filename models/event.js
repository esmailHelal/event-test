const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true
    },

    title: {
      type: String,
      require: true,
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Admain"
    }
  },
  {
    timestamps: true
  }
);

const event = mongoose.model("event", eventSchema);
module.exports = event;
