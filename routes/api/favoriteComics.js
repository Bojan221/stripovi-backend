const express = require("express");
const {addToFavorites, getFavoriteComic, deleteComic} = require("../../controllers/favoriteComicController")
const router = express.Router();

router.post("/addToFavorites", addToFavorites);
router.get("/getFavoriteComics", getFavoriteComic)
router.delete("/deleteComic", deleteComic)
module.exports = router;
