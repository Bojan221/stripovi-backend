const multer = require("multer");
const fs = require("fs");
const path = require("path");

const createUpload = (folderPath) => {
  const fullPath = path.join(__dirname, "..", "uploads", folderPath);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  return multer({ storage });
};

module.exports = createUpload;
