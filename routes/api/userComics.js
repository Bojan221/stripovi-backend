const express = require("express");
const {addToCollection} = require("../../controllers/userComicController")
const router = express.Router();

router.post("/addToCollection", addToCollection);

module.exports = router;
