import express, { Router } from 'express';
import {singnup,signin} from '../controller/auth.controller.js';
const router = express.Router();


router.post("/signup",singnup);
router.post("/signin",signin);




export default router;