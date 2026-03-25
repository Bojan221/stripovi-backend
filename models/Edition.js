const mongoose = require("mongoose");

const EditionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    publisher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publisher",
      required: true,
    },
    heroes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hero",
        required: true,
      },
    ],
  },
  { timestamps: true },
);

const Edition = mongoose.model("Edition", EditionSchema);

module.exports = Edition;
