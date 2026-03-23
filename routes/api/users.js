const express = require("express");
const authorization = require("../../middleware/authorization");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../../controllers/userControler");

router.get("/getAllUsers", authorization(["admin", "moderator"]), getAllUsers);
router.get("/getUserById/:id", authorization(["admin", "moderator"]), getUserById);
router.post("/updateUser/:id", authorization(["admin", "moderator"]), updateUser);
router.delete("/deleteUser/:id", authorization(["admin", "moderator"]), deleteUser);
module.exports = router;
