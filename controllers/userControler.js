const User = require("../models/User");
const getAllUsers = async (req, res) => {
  try {
    const user = req.user;
    if (user.role === "admin" || user.role === "moderator") {
      const users = await User.find().select("-password");
      res.status(200).json(users);
    } else {
      res.status(401).json({ message: "Neautorizovani pristup" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;
    if (
      currentUser.id !== id &&
      currentUser.role !== "admin" &&
      currentUser.role !== "moderator"
    ) {
      return res
        .status(403)
        .json({ message: "Nemate dozvolu za pristup podacima." });
    }
    const user = await User.findById(id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;
    if (
      currentUser.id !== id &&
      currentUser.role !== "admin" &&
      currentUser.role !== "moderator"
    ) {
      return res
        .status(403)
        .json({ message: "Nemate dozvolu za ažuriranje ovih podataka." });
    }
    const data = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ message: "Korisnik je uspješno ažuriran!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;
    if (
      currentUser.id !== id &&
      currentUser.role !== "admin" &&
      currentUser.role !== "moderator"
    ) {
      return res
        .status(403)
        .json({ message: "Nemate dozvolu za brisanje ovog korisnika." });
    }
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Korisnik nije pronađen." });
    }
    res.status(200).json({ message: "Korisnik je uspješno obrisan!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
