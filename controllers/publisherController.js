const Publisher = require("../models/Publisher");

const createPublisher = async (req, res) => {
  try {
    const { name, country } = req.body;
    const { id } = req.user;
    const existingPublisher = await Publisher.findOne({ name });

    if (existingPublisher) {
      return res.status(400).json({ message: "Izdavač već postoji" });
    }

    const publisher = await Publisher.create({
      name,
      country,
      createdBy: id,
    });

    if (publisher) {
      return res.status(200).json({ message: "Izdavač je uspješno kreiran" });
    } else {
      return res
        .status(400)
        .json({ message: "Greška prilikom kreiranja izdavača" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Greska na serveru" });
  }
};

const getAllPublishers = async (req, res) => {
  try {
    const publishers = await Publisher.find()
      .select("-__v")
      .populate("createdBy", "firstName lastName email role");
    if (publishers) {
      return res.status(200).json(publishers);
    } else {
      return res
        .status(400)
        .json({ message: "Greška prilikom dohvata izdavača" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Greška na serveru" });
  }
};

const getPublisherById = async (req, res) => {
  try {
    const { id } = req.params;

    const publisher = await Publisher.findById(id).select("-__v");

    if (publisher) {
      return res.status(200).json(publisher);
    } else {
      return res
        .status(400)
        .json({ message: "Greška prilikom dohvata izdavača" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Greška na serveru" });
  }
};

const deletePublisher = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const publisher = await Publisher.findByIdAndDelete(id);

    if (publisher) {
      return res.status(200).json({ message: "Izdavač je uspješno obrisan" });
    } else {
      return res
        .status(400)
        .json({ message: "Greška prilikom brisanja izdavača" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Greška na serveru" });
  }
};

const updatePublisher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, country } = req.body;

    const publisher = await Publisher.findByIdAndUpdate(
      id,
      { name, country },
      { new: true },
    );

    if (publisher) {
      return res.status(200).json({ message: "Izdavač je uspješno ažuriran" });
    } else {
      return res
        .status(400)
        .json({ message: "Greška prilikom ažuriranja izdavača" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Greška na serveru" });
  }
};

module.exports = {
  createPublisher,
  getAllPublishers,
  getPublisherById,
  deletePublisher,
  updatePublisher,
};
