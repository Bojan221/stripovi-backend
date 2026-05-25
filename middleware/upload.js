const multer = require("multer");
const supabase = require("../supabase");

const BUCKET = "Stripovi";

const FOLDERS = {
  comics: "comics",
  users: "users",
};

const uploadToSupabase = async (file, folderPath, type) => {
  const filename =
    type === "comic"
      ? `strip-${Date.now()}-${file.originalname}`
      : `${Date.now()}-${file.originalname}`;

  const folder = FOLDERS[folderPath] || folderPath;
  const path = `${folder}/${filename}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file.buffer, { contentType: file.mimetype, upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return data.publicUrl;
};

const createUpload = (folderPath, type) => {
  const multerUpload = multer({ storage: multer.memoryStorage() });

  return {
    single: (fieldName) => {
      const multerMiddleware = multerUpload.single(fieldName);
      return (req, res, next) => {
        multerMiddleware(req, res, async (err) => {
          if (err) return next(err);
          if (!req.file) return next();
          try {
            req.file.driveUrl = await uploadToSupabase(
              req.file,
              folderPath,
              type
            );
            next();
          } catch (e) {
            next(e);
          }
        });
      };
    },
  };
};

module.exports = createUpload;
