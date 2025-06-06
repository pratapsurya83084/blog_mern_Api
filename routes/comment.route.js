import express from 'express';
import { CreateComment ,GetPostComment,LikeComment} from '../controller/CreateComment.controller.js';
import {verifyUser} from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create-comment',verifyUser,CreateComment);
router.get('/getpostcomment/:postId',GetPostComment);
router.put('/like-post/:commentId',verifyUser,LikeComment);





export default router;