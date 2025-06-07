import express from 'express';
import { CreateComment ,GetPostComment,LikeComment ,EditeComment,DeleteComment , getAllComment} from '../controller/CreateComment.controller.js';
import {verifyUser} from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create-comment',verifyUser,CreateComment);
router.get('/getpostcomment/:postId',GetPostComment);
router.put('/like-post/:commentId',verifyUser,LikeComment);
router.put('/update-comment/:commentId',verifyUser,EditeComment);
router.delete('/delete-comment/:commentId',verifyUser,DeleteComment);
router.get('/getallcomment',verifyUser,getAllComment);





export default router;