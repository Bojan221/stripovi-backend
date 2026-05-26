const express = require("express");
const {addToCollection, getUserComics} = require("../../controllers/userComicController")
const router = express.Router();

router.post("/addToCollection", addToCollection);
router.get("/getUserComics", getUserComics)

module.exports = router;
