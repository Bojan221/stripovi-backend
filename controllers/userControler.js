const User = require("../models/User");
const path = require("path");
const getAllUsers = async (req, res) => {
  try {
    const user = req.user;
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;

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

    if (id === currentUser.id) {
      return res
        .status(400)
        .json({ message: "Ne možete obrisati svoj nalog!" });
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

const changeProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Slika nije sačuvana!" });
    }
    const filePath = path.join("uploads", "users", req.file.filename);
    const userId = req.user.id;

    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: filePath },
      { new: true },
    );
    console.log(updateUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUserEmail = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUserPassword = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUserNames = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeProfilePicture,
  updateUserEmail,
  updateUserPassword,
  updateUserNames,
};
