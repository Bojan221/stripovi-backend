const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

router.use("/auth", require("./auth/authRoutes"));
router.use("/api", verifyToken, require("./api/apiRoutes"));

module.exports = router;
