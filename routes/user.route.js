import express, { Router } from 'express';
import {DeleteUser, singnup,updateUser,GetUsers,DeleteUserByAdmin,getUser} from '../controller/user.controller.js';
import { verifyUser } from '../utils/verifyUser.js';



const router = express.Router();


router.get("/signup",singnup);
router.put("/update/:userId",verifyUser,updateUser);
router.delete("/deleteUser-account/:userId",verifyUser,DeleteUser);
router.get("/getusers",verifyUser,GetUsers);
router.delete("/deleteuserbyadmin/:userId",verifyUser,DeleteUserByAdmin);

router.get('/:userId',getUser);


export default router;