import express from 'express';
import {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
} from '../controllers/userController';
import protect from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshAccessToken);
router.get('/logout', logout);
router.get('/loggedin', loginStatus);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

// Protected routes
router.get('/getuser', protect, getUser);
router.patch('/updateuser', protect, updateUser);
router.patch('/changepassword', protect, changePassword);

export default router;

