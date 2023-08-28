import express from 'express';
import userController from '../controllers/userController.js';
import verification from '../services/EmailVerificationService.js';
import sendOtpToEmailAndSave from '../services/forgotPasswordService.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const userRouter = express.Router();

userRouter.get('/allUser/:id', adminMiddleware, userController.getAllUsers);
userRouter.get('/profile/:id', userController.getUserById);
userRouter.post('/auth/register', userController.registerUser, verification);
userRouter.post('/auth/login', userController.loginUser);
userRouter.get('/auth/verify/:email', userController.verifyEmail);
userRouter.put('/auth/changePassword', userController.changePassword);
userRouter.get('/auth/forgotPassword', sendOtpToEmailAndSave);
userRouter.put('/auth/resetPassword', userController.resetPassword);

export default userRouter;
