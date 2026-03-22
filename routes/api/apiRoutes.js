const express = require("express");
const router = express.Router();

router.use("/users", require("./users"));
router.use("/publishers", require("./publishers"));

module.exports = router;
