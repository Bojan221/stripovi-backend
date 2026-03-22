const express = require("express");
const router = express.Router();
const {
  createPublisher,
  getAllPublishers,
  getPublisherById,
  deletePublisher,
  updatePublisher,
} = require("../../controllers/publisherController");

router.post("/createPublisher", createPublisher);
router.get("/getAllPublishers", getAllPublishers);
router.get("/getPublisherById/:id", getPublisherById);
router.delete("/deletePublisher/:id", deletePublisher);
router.post("/updatePublisher/:id", updatePublisher);

module.exports = router;
