const express = require("express");
const router = express.Router();
const authorization = require("../../middleware/authorization");
const {
  createHero,
  getAllHeroes,
  getHeroById,
  deleteHero,
  updateHero,
} = require("../../controllers/heroController");

router.get("/getAllHeroes", getAllHeroes);
router.get("/getHeroById/:id", getHeroById);
router.post("/createHero", authorization(["admin", "moderator"]), createHero);
router.put(
  "/updateHero/:id",
  authorization(["admin", "moderator"]),
  updateHero,
);
router.delete(
  "/deleteHero/:id",
  authorization(["admin", "moderator"]),
  deleteHero,
);

module.exports = router;
