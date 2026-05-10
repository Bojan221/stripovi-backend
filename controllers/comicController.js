const Comic = require("../models/Comic");

const getAllComics = async (req, res) => {
  try {
    const { page, limit, hero, edition } = req.query;
    let currentPage = parseInt(page) || 1;
    const filter = {};
    //  if (hero) filter.heroes = hero;
    if (edition) filter.edition = edition;
    const total = await Comic.countDocuments(filter);
    const totalPages = Math.ceil(total / 10);
    const comics = await Comic.find(filter)
      .select("-__v")
      .populate("createdBy", "firstName lastName email profilePicture")
      .populate({
        path: "edition",
        select: "name publisher",
        populate: { path: "publisher", select: "name" },
      })
      .populate("hero", "name alias")
      .limit(10)
      .skip((currentPage - 1) * 10)
      .exec();

    if (comics) {
      return res.status(200).json({ comics, totalComics: total, totalPages });
    } else {
      return res.status(500).json({ message: "Došlo je do greške" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
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
      coverImage: req.file.filename,
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
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const deleteComic = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports = {
  getAllComics,
  getComicById,
  createComic,
  updateComic,
  deleteComic,
};
