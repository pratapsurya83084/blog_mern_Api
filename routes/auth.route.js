import express, { Router } from 'express';
import {singnup} from '../controller/auth.controller.js';
const router = express.Router();


router.post("/signup",singnup);




export default router;