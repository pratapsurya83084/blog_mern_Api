import express, { Router } from 'express';
import {DeleteUser, singnup,updateUser} from '../controller/user.controller.js';
import { verifyUser } from '../utils/verifyUser.js';



const router = express.Router();


router.get("/signup",singnup);
router.put("/update/:userId",verifyUser,updateUser);
router.delete("/deleteUser-account/:userId",verifyUser,DeleteUser);




export default router;