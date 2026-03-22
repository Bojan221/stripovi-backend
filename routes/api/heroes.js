const express = require("express");
const router = express.Router();
const {
  createHero,
  getAllHeroes,
  getHeroById,
  deleteHero,
  updateHero,
} = require("../../controllers/heroController");

router.get("/getAllHeroes", getAllHeroes);
router.get("/getHeroById/:id", getHeroById);
router.post("/createHero", createHero);
router.post("/updateHero/:id", updateHero);
router.delete("/deleteHero/:id", deleteHero);

module.exports = router;
