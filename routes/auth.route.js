import express, { Router } from 'express';
import {singnup,signin,google,SignoutUser} from '../controller/auth.controller.js';

const router = express.Router();


router.post("/signup",singnup);
router.post("/signin",signin);
router.post("/google",google);
router.post("/signout",SignoutUser)



export default router;