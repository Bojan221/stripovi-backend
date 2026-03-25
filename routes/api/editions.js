const express = require("express");
const router = express.Router();
const {
  createEdition,
  getAllEditions,
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

module.exports = router;
