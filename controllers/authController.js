const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Korisnik sa ovim emailom ne postoji!" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: `"Stripovi" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset lozinke — Stripovi",
      html: `
<!DOCTYPE html>
<html lang="bs">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#0f0f0f;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <span style="font-size:28px;font-weight:900;letter-spacing:2px;color:#facc15;text-transform:uppercase;font-style:italic;">
                &#9733; Stripovi
              </span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a;overflow:hidden;">

              <!-- Yellow top bar -->
              <div style="height:5px;background:linear-gradient(90deg,#facc15,#f59e0b);"></div>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:40px 40px 32px;">

                    <!-- Icon -->
                    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                      <tr>
                        <td style="background-color:#facc15;border-radius:50%;width:56px;height:56px;text-align:center;vertical-align:middle;">
                          <span style="font-size:26px;line-height:56px;">&#128274;</span>
                        </td>
                      </tr>
                    </table>

                    <!-- Title -->
                    <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:0.5px;">
                      Reset lozinke
                    </h1>
                    <p style="margin:0 0 24px;font-size:14px;color:#9ca3af;line-height:1.6;">
                      Primili smo zahtjev za resetovanje lozinke za tvoj nalog na <strong style="color:#facc15;">Stripovi</strong> platformi.
                    </p>

                    <!-- Info box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                      <tr>
                        <td style="background-color:#111111;border-left:3px solid #facc15;border-radius:0 6px 6px 0;padding:14px 16px;">
                          <p style="margin:0;font-size:13px;color:#d1d5db;line-height:1.5;">
                            &#128336;&nbsp; Link je aktivan <strong style="color:#facc15;">1 sat</strong> od trenutka slanja.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA Button -->
                    <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                      <tr>
                        <td style="background:linear-gradient(135deg,#facc15,#f59e0b);border-radius:8px;">
                          <a href="${resetUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#0f0f0f;text-decoration:none;letter-spacing:0.5px;">
                            Resetuj lozinku &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Fallback link -->
                    <p style="margin:0 0 4px;font-size:12px;color:#6b7280;">
                      Ako dugme ne radi, kopiraj ovaj link u pretraživač:
                    </p>
                    <p style="margin:0;font-size:12px;word-break:break-all;">
                      <a href="${resetUrl}" style="color:#facc15;text-decoration:none;">${resetUrl}</a>
                    </p>

                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:0 40px;">
                    <div style="height:1px;background-color:#2a2a2a;"></div>
                  </td>
                </tr>

                <!-- Footer note -->
                <tr>
                  <td style="padding:20px 40px 32px;">
                    <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.6;">
                      Ako nisi tražio/la reset lozinke, možeš ignorisati ovaj mejl — tvoj nalog je siguran.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#4b5563;">
                &copy; 2026 Stripovi &bull; Sva prava zadržana
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    return res.status(200).json({ message: "Email za reset lozinke je poslan!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Greska na serveru" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token je neispravan ili je istekao" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({ message: "Lozinka je uspjesno promijenjena!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Greska na serveru" });
  }
};

module.exports = { registerUser, loginUser, refreshAuth, forgotPassword, resetPassword };
