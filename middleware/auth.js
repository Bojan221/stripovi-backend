const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Nema Tokena" });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Sesija je istekla" });

      req.user = decoded;

      next();
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = verifyToken;
