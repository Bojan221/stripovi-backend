const express = require("express");
const authorization = require("../../middleware/authorization");
const router = express.Router();
const {
  createPublisher,
  getAllPublishers,
  getPublisherById,
  deletePublisher,
  updatePublisher,
} = require("../../controllers/publisherController");

router.post("/createPublisher", authorization(["admin", "moderator"]), createPublisher);
router.get("/getAllPublishers", getAllPublishers);
router.get("/getPublisherById/:id", getPublisherById);
router.delete("/deletePublisher/:id", authorization(["admin", "moderator"]), deletePublisher);
router.post("/updatePublisher/:id", authorization(["admin", "moderator"]), updatePublisher);

module.exports = router;
