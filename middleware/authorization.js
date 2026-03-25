const authorization = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Niste autentifikovani." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Nemate dozvolu za pristup ovom resursu." });
    }

    next();
  };
};

module.exports = authorization;
