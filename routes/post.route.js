import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import { CreatePost } from "../controller/createPost.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

// image
router.post(
  "/create-post",
  verifyUser,
  upload.fields([
    {
      name: "image", //same frontend data name required
    maxCount:1
    },
  ]),
  CreatePost
);

export default router;
