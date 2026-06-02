const Comic = require("../models/Comic");
const UserComic = require("../models/UserComic");
const FavoriteComic = require("../models/FavoriteComic");
const mongoose = require("mongoose");

const getAllComics = async (req, res) => {
  try {
    const { page, limit, hero, edition, publisher, search } = req.query;

    let currentPage = parseInt(page) || 1;
    let perPage = parseInt(limit) || 12;

    const filter = {};

    if (hero && mongoose.Types.ObjectId.isValid(hero)) {
      filter.hero = hero;
    }

    if (edition && mongoose.Types.ObjectId.isValid(edition)) {
      filter.edition = edition;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (publisher && mongoose.Types.ObjectId.isValid(publisher)) {
      const editions = await mongoose
        .model("Edition")
        .find({ publisher })
        .select("_id");

      const editionIds = editions.map((e) => e._id);

      filter.edition = { $in: editionIds.length ? editionIds : [null] };
    }

    const total = await Comic.countDocuments(filter);
    const totalPages = Math.ceil(total / perPage);

    const comics = await Comic.find(filter)
      .select("-__v")
      .populate("createdBy", "firstName lastName email profilePicture")
      .populate({
        path: "edition",
        select: "name publisher",
        populate: { path: "publisher", select: "name" },
      })
      .populate("hero", "name alias")
      .limit(perPage)
      .skip((currentPage - 1) * perPage)
      .sort({ issueNumber: 1 })
      .exec();

    let ownedComicIds = new Set();
    let favoriteComicIds = new Set();

    if (req.user?.id) {
      const comicIds = comics.map((c) => c._id);

      const userComics = await UserComic.find({
        user: req.user.id,
        comic: { $in: comicIds },
      }).select("comic");

      ownedComicIds = new Set(
        userComics.map((uc) => uc.comic.toString())
      );

      const favoriteComics = await FavoriteComic.find({
        user: req.user.id,
        comic: { $in: comicIds },
      }).select("comic");

      favoriteComicIds = new Set(
        favoriteComics.map((fc) => fc.comic.toString())
      );
    }

    const comicsWithOwnership = comics.map((comic) => ({
      ...comic.toObject(),
      isOwned: ownedComicIds.has(comic._id.toString()),
      isFavorite: favoriteComicIds.has(comic._id.toString()),
    }));

    return res.status(200).json({
      comics: comicsWithOwnership,
      totalComics: total,
      totalPages,
      currentPage,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const getComicById = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const createComic = async (req, res) => {
  try {
    const { title, issueNumber, heroId, editionId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Cover slika je obavezna!" });
    }

    const comic = new Comic({
      title,
      issueNumber,
      hero: heroId,
      edition: editionId,
      coverImage: req.file.driveUrl,
      createdBy: req.user.id,
    });

    await comic.save();

    res.status(201).json({ message: "Strip kreiran!", data: comic });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateComic = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, issueNumber, heroId, editionId } = req.body;

    const updates = { title, issueNumber, hero: heroId, edition: editionId };
    if (req.file) updates.coverImage = req.file.driveUrl;

    const updated = await Comic.findByIdAndUpdate(id, updates, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Strip nije pronađen!" });
    }

    res
      .status(200)
      .json({ message: "Strip je uspješno ažuriran!", data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteComic = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Comic.findByIdAndDelete(id);
    if (deleted) {
      res.status(200).json({ message: "Strip je uspješno obrisan" });
    } else {
      res.status(500).json({ message: "Došlo je do greške" });
    }
  } catch {
    res.status(500).json({ message: "Došlo je do greške na serveru" });
  }
};

module.exports = {
  getAllComics,
  getComicById,
  createComic,
  updateComic,
  deleteComic,
};
