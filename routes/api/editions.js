const express = require("express");
const router = express.Router();
const {
  createEdition,
  getAllEditions,
  updateEdition,
  deleteEdition
} = require("../../controllers/editionController");
const authorization = require("../../middleware/authorization");

router.post(
  "/createEdition",
  authorization(["admin", "moderator"]),
  createEdition,
);
router.get(
  "/getAllEditions",
  authorization(["user", "moderator", "admin"]),
  getAllEditions,
);
router.put(
  "/updateEdition/:id",
  authorization(["admin","moderator"]), 
  updateEdition
);
router.delete(
  "/deleteEdition/:id",
  authorization(["moderator","admin"]),
  deleteEdition
)

module.exports = router;
