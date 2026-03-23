const express = require("express");
const authorization = require("../../middleware/authorization");
const router = express.Router();
const createUpload = require("../../middleware/upload");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeProfilePicture, updateUserEmail, updateUserPassword, updateUserNames
} = require("../../controllers/userControler");

router.get("/getAllUsers", authorization(["admin", "moderator"]), getAllUsers);
router.get("/getUserById/:id", authorization(["admin", "moderator"]), getUserById);
router.post("/updateUser/:id", authorization(["admin", "moderator"]), updateUser);
router.delete("/deleteUser/:id", authorization(["admin", "moderator"]), deleteUser);
router.put("/changeProfilePicture", createUpload("users").single("profilePicture"), changeProfilePicture);
router.put("/updateUserEmail", updateUserEmail);
router.put("/updateUserPassword", updateUserPassword);
router.put("/updateUserNames",updateUserNames);  
module.exports = router;
