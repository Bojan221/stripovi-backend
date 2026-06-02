const mongoose = require("mongoose");

const FavoriteComicSchema = new mongoose.Schema(
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

    acquiredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

FavoriteComicSchema.index(
  { user: 1, comic: 1 },
  { unique: true },
);

const FavoriteComic = mongoose.model("FavoriteComic", FavoriteComicSchema);

module.exports = FavoriteComic;