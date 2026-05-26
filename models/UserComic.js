const mongoose = require("mongoose");

const UserComicSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    comic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comic",
      required: true,
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },

    condition: {
      type: String,
      enum: ["mint", "good", "used"],
      default: "good",
    },

    acquiredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

UserComicSchema.index(
  { user: 1, comic: 1 },
  { unique: true },
);

const UserComic = mongoose.model("UserComic", UserComicSchema);

module.exports = UserComic;