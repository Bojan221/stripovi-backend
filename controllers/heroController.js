const Hero = require("../models/Hero");
const createHero = async (req, res) => {
  try {
    console.log(req.user);
    console.log(req.body);
    const{name,alias}= req.body
    if(!name || !alias){
      return res.status(400).json({message:"Ime junaka i alias su obavezni"})
    }

    const existingHero = await Hero.findOne({ name });

    if (existingHero) {
      return res.status(400).json({ message: "Junak sa ovim imenom već postoji" });
    }

    const newHero = await Hero.create({
      name,
      alias,
      createdBy: req.user.id
    })
    if(!newHero){
      return res.status(400).json({message:"Došlo je do greške prilikom kreiranja junaka"})
    }
    res.status(201).json({message:"Junak uspješno kreiran", hero: newHero})
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Došlo je do greške prilikom kreiranja junaka" });
  }
};

const getAllHeroes = async (req, res) => {
  try {
  } catch (err) {}
};

const getHeroById = async (req, res) => {
  try {
  } catch (err) {}
};

const deleteHero = async (req, res) => {
  try {
  } catch (err) {}
};

const updateHero = async (req, res) => {
  try {
  } catch (err) {}
};

module.exports = {
  createHero,
  getAllHeroes,
  getHeroById,
  deleteHero,
  updateHero,
};
