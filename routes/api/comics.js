const express = require('express');
const router = express.Router();
const authorization = require("../../middleware/authorization")
const createUpload = require("../../middleware/upload");
const upload = createUpload("comics");
const {getAllComics, 
    getComicById, 
    createComic, 
    updateComic, 
    deleteComic}
 = require("../../controllers/comicController");



 router.get("/getAllComics", getAllComics);
 router.get("/getComic/:id", getComicById);
 router.post("/createComic", authorization(["admin","moderator"]), upload.single("cover"), createComic);
 router.put("/updateComic/:id",authorization(["admin","moderator"]),updateComic);
 router.delete("/deleteComic/:id",authorization(["admin","moderator"]), deleteComic);

 module.exports = router;