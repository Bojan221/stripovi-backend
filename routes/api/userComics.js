const express = require("express");
const {addToCollection, getUserComics, deleteComic} = require("../../controllers/userComicController")
const router = express.Router();

router.post("/addToCollection", addToCollection);
router.get("/getUserComics", getUserComics)
router.delete("/deleteComic", deleteComic)
module.exports = router;
