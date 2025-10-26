"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
// Public routes
router.post('/register', userController_1.registerUser);
router.post('/login', userController_1.loginUser);
router.post('/refresh', userController_1.refreshAccessToken);
router.get('/logout', userController_1.logout);
router.get('/loggedin', userController_1.loginStatus);
router.post('/forgotpassword', userController_1.forgotPassword);
router.put('/resetpassword/:resetToken', userController_1.resetPassword);
// Protected routes
router.get('/getuser', authMiddleware_1.default, userController_1.getUser);
router.patch('/updateuser', authMiddleware_1.default, userController_1.updateUser);
router.patch('/changepassword', authMiddleware_1.default, userController_1.changePassword);
exports.default = router;
