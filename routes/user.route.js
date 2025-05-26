import express, { Router } from 'express';
import {singnup} from '../controller/user.controller.js';
const router = express.Router();


router.get("/signup",singnup);




export default router;