const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  refreshAuth,
  forgotPassword
} = require("../../controllers/authController");

router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);
router.get("/refreshAuth", refreshAuth);
router.post("/forgotPassword", forgotPassword)
router.post("/logoutUser", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
  res.status(200).json({ message: "Uspjesno ste odjavljeni" });
});

module.exports = router;
