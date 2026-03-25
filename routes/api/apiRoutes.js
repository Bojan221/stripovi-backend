const express = require("express");
const router = express.Router();

router.use("/users", require("./users"));
router.use("/publishers", require("./publishers"));
router.use("/heroes", require("./heroes"));
router.use("/editions", require("./editions"));
module.exports = router;
