const Edition = require("../models/Edition");
const createEdition = async (req, res) => {
  try {
    const { name, publisher, heroes } = req.body;
    const id = req.user.id;
    if (!name.trim() || !publisher || heroes.length === 0) {
      return res.status(400).json({ message: "Uneseni podaci nisu ispravni!" });
    }
    const newEdition = await Edition.create({
      name,
      publisher: publisher,
      heroes: heroes,
      createdBy: id,
    });
    if (newEdition) {
      return res.status(200).json({ message: "Edicija je uspješno kreirana" });
    } else {
      return res
        .status(500)
        .json({ message: "Došlo je do greške prilikom kreiranja edicije" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Došlo je do greške prilikom kreiranja edicije" });
  }
};

const getAllEditions = async (req, res) => {
  try {
    const editions = await Edition.find()
      .select("-__v")
      .populate("createdBy", "firstName lastName email profilePicture")
      .populate("publisher", "name country")
      .populate("heroes", "name alias");

    if (editions) {
      return res.status(200).json({ editions });
    } else {
      return res.status(500).json({ message: "Došlo je do greške" });
    }
  } catch {
    res.status(500).json({ message: "Došlo je do greške" });
  }
};
module.exports = {
  createEdition,
  getAllEditions,
};
