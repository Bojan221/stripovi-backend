const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (
      firstName.length < 4 ||
      firstName.length > 16 ||
      lastName.length < 4 ||
      lastName.length > 16
    ) {
      return res.status(400).json({ message: "Neispravni podaci" });
    }
    if (!regex.test(email)) {
      return res.status(400).json({ message: "Neispravan email" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Lozinke se ne podudaraju" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Korisnik sa ovim emailom vec postoji" });
    }

    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profilePicture: null,
    });
    return res.status(201).json({ message: "Registracija uspjesna!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Greska na serveru!" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Korisnik sa ovom email adresom ne postoji!" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Pogresna lozinka!" });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        accessToken,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          profilePicture: user.profilePicture,
        },
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Greska na serveru." });
  }
};

const refreshAuth = (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
      return res.status(401).json({ message: "Nema refresh tokena" });
    }
    const refreshToken = req.cookies.refreshToken;

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Invalid refresh token." });
        }

        const user = await User.findById(decoded.id);

        const newAccessToken = jwt.sign(
          {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: "15m" },
        );

        res.json({
          accessToken: newAccessToken,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          },
        });
      },
    );
  } catch (err) {
    return res.status(500).json({ message: "Greska na serveru." });
  }
};

const forgotPassword = async (req,res) => { 
  try { 
     const {email} = req.body;

     const existingUser = await User.findOne({email});

     if(!existingUser) { 
      return res.status(400).json({message:"Korisnik sa ovim emailom ne postoji!"})
     }

     res.status(200).json({message:"User postoji"})
  }catch{
    res.status(500).json({message:"Greska na serveru"})
  }
}

module.exports = { registerUser, loginUser, refreshAuth, forgotPassword };
