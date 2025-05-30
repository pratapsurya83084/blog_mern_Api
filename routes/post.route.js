import express from 'express';
import { verifyUser } from '../utils/verifyUser.js';
import { CreatePost } from '../controller/createPost.controller.js';


const router = express.Router();


router.post("/create-post",verifyUser,CreatePost)

export default router;