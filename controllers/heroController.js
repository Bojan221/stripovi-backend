const Hero = require("../models/Hero");
const createHero = async (req, res) => {
  try {
    const { name, alias } = req.body;
    if (!name || !alias) {
      return res
        .status(400)
        .json({ message: "Ime junaka i alias su obavezni" });
    }

    const existingHero = await Hero.findOne({ name });

    if (existingHero) {
      return res
        .status(400)
        .json({ message: "Junak sa ovim imenom već postoji" });
    }

    const newHero = await Hero.create({
      name,
      alias,
      createdBy: req.user.id,
    });
    if (!newHero) {
      return res
        .status(400)
        .json({ message: "Došlo je do greške prilikom kreiranja junaka" });
    }
    res.status(201).json({ message: "Junak uspješno kreiran", hero: newHero });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Došlo je do greške prilikom kreiranja junaka" });
  }
};

const getAllHeroes = async (req, res) => {
  try {
    const heroes = await Hero.find().populate(
      "createdBy",
      "firstName lastName email role profilePicture",
    );
    res.status(200).json({ heroes });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Došlo je do greške prilikom dohvaćanja junaka" });
  }
};

const getHeroById = async (req, res) => {
  try {
    const { id } = req.params;
    const hero = await Hero.findById(id).populate(
      "createdBy",
      "firstName lastName email role profilePicture",
    );
    if (!hero) {
      return res.status(404).json({ message: "Junak nije pronađen" });
    }
    res.status(200).json({ hero });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Došlo je do greške prilikom dohvaćanja junaka" });
  }
};

const deleteHero = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedHero = await Hero.findByIdAndDelete(id);
    if (!deletedHero) {
      return res.status(404).json({ message: "Junak nije pronađen" });
    }
    res.status(200).json({ message: "Junak je uspješno obrisan" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Došlo je do greške prilikom brisanja junaka" });
  }
};

const updateHero = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, alias } = req.body;
    const updateHero = await Hero.findByIdAndUpdate(
      id,
      { name, alias },
      { returnDocument: "after", runValidators: true },
    );
    if (updateHero) {
      res.status(200).json({ message: "Junak uspješno ažuriran" });
    } else {
      return res.status(404).json({ message: "Junak nije pronađen!" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Došlo je do greške prilikom ažuriranja junaka" });
  }
};

module.exports = {
  createHero,
  getAllHeroes,
  getHeroById,
  deleteHero,
  updateHero,
};
