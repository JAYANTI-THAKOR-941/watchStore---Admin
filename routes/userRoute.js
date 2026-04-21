import express from 'express';
import { getLogin, getRegister, register, verifyOtp } from '../controllers/userControllers.js';

const router = express.Router();

router.post('/register',register);
router.post('/verifyOtp',verifyOtp);
router.get('/register',getRegister);

router.get('/login',getLogin)

export default router;