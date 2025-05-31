import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images"); //cloud url save in public fold
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname); // file save useruploaded original name
  },
});

export const upload = multer({
    storage
});