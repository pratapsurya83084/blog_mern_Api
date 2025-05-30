import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import { CreatePost ,GetAllPost} from "../controller/createPost.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

// image
router.post("/create-post", verifyUser, upload.single("image"), CreatePost);
router.get('/getall-post',GetAllPost);



export default router;
