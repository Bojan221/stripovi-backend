const User = require("../models/User");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
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
      return res.status(400).json({ message: "Nije odabrana slika!" });
    }

    const newFilePath = path.join("uploads", "users", req.file.filename);

    const user = await User.findById(req.user.id);

    if (user.profilePicture) {
      const oldImagePath = path.join(__dirname, "..", user.profilePicture);

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    user.profilePicture = newFilePath;
    await user.save();

    res.status(200).json({
      message: "Profilna slika je uspješno promijenjena!",
      profilePicture: newFilePath,
      user: user,
    });

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
    const id = req.user.id;
    const { email } = req.body;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
      return res.status(400).json({ message: "Neispravan email!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Korisnik sa ovim emailom već postoji!" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { email },
      { returnDocument: "after", runValidators: true },
    );
    res.status(200).json({ message: "Email je uspješno promijenjen!", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const id = req.user.id;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Lozinke se ne podudaraju!" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Korisnik nije pronađen!" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Trenutna lozinka nije ispravna!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Lozinka je uspješno promijenjena!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUserNames = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    if (!firstName.trim() || !lastName.trim()) {
      return res
        .status(400)
        .json({ message: "Ime i prezime ne smiju biti prazni!" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        firstName,
        lastName,
      },
      { returnDocument: "after", runValidators: true },
    ).select("-password");

    res
      .status(200)
      .json({ message: "Ime i prezime su uspješno ažurirani!", user });
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
