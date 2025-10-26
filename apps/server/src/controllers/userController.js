"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.changePassword = exports.updateUser = exports.loginStatus = exports.getUser = exports.logout = exports.refreshAccessToken = exports.loginUser = exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const userModel_1 = __importDefault(require("../models/userModel"));
const tokenModel_1 = require("../models/tokenModel");
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const email_templates_1 = require("@noted/email-templates");
const react_1 = __importDefault(require("react"));
// Generate Access Token (15 minutes)
const generateAccessToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};
// Generate Refresh Token (7 days)
const generateRefreshToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};
// Set tokens as httpOnly cookies
const setTokenCookies = (res, accessToken, refreshToken) => {
    const isProduction = process.env.NODE_ENV === 'production';
    // Access token cookie (15 minutes)
    res.cookie('token', accessToken, {
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
    });
    // Refresh token cookie (7 days)
    res.cookie('refreshToken', refreshToken, {
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
    });
};
// Validate password strength
const validatePasswordStrength = (password) => {
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters' };
    }
    // Optional: Add more strength requirements
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
        return {
            valid: false,
            message: 'Password must contain uppercase, lowercase, and numbers'
        };
    }
    return { valid: true };
};
// Register User
exports.registerUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, email, password } = req.body;
    // Validation
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please fill in all required fields');
    }
    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
        res.status(400);
        throw new Error(passwordValidation.message);
    }
    // Check if user email already exists
    const userExists = await userModel_1.default.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('Email has already been registered');
    }
    // Create new user
    const user = await userModel_1.default.create({
        name,
        email,
        password,
    });
    if (!user) {
        res.status(400);
        throw new Error('Invalid user data');
    }
    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    // Hash and store refresh token
    const hashedRefreshToken = crypto_1.default
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');
    await tokenModel_1.RefreshToken.create({
        userId: user._id,
        token: hashedRefreshToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // Set cookies
    setTokenCookies(res, accessToken, refreshToken);
    // Send welcome email
    try {
        await (0, sendEmail_1.default)({
            subject: 'Welcome to Noted!',
            send_to: user.email,
            sent_from: process.env.EMAIL_USER,
            template: react_1.default.createElement(email_templates_1.WelcomeEmail, {
                userName: user.name,
                loginUrl: `${process.env.FRONTEND_URL}/login`,
            }),
        });
    }
    catch (emailError) {
        console.error('Welcome email failed:', emailError);
        // Don't fail registration if email fails
    }
    // Return user data (no tokens in response body)
    const { _id, name: userName, email: userEmail, photo, phone, bio } = user;
    res.status(201).json({
        _id,
        name: userName,
        email: userEmail,
        photo,
        phone,
        bio,
    });
});
// Login User
exports.loginUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    // Validate Request
    if (!email || !password) {
        res.status(400);
        throw new Error('Please add email and password');
    }
    // Check if user exists
    const user = await userModel_1.default.findOne({ email });
    if (!user) {
        res.status(400);
        throw new Error('User not found, please signup');
    }
    // User exists, check if password is correct
    const passwordIsCorrect = await bcryptjs_1.default.compare(password, user.password);
    if (!passwordIsCorrect) {
        res.status(400);
        throw new Error('Invalid email or password');
    }
    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    // Hash and store refresh token
    const hashedRefreshToken = crypto_1.default
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');
    // Delete old refresh tokens for this user
    await tokenModel_1.RefreshToken.deleteMany({ userId: user._id });
    // Store new refresh token
    await tokenModel_1.RefreshToken.create({
        userId: user._id,
        token: hashedRefreshToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // Set cookies
    setTokenCookies(res, accessToken, refreshToken);
    // Return user data
    const { _id, name, email: userEmail, photo, phone, bio } = user;
    res.status(200).json({
        _id,
        name,
        email: userEmail,
        photo,
        phone,
        bio,
    });
});
// Refresh Access Token
exports.refreshAccessToken = (0, express_async_handler_1.default)(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(401);
        throw new Error('Refresh token not found, please login');
    }
    try {
        // Verify refresh token
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        // Hash the token to compare with DB
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update(refreshToken)
            .digest('hex');
        // Check if refresh token exists in DB
        const tokenExists = await tokenModel_1.RefreshToken.findOne({
            userId: decoded.id,
            token: hashedToken,
            expiresAt: { $gt: Date.now() },
        });
        if (!tokenExists) {
            res.status(401);
            throw new Error('Invalid or expired refresh token');
        }
        // Generate new tokens
        const newAccessToken = generateAccessToken(decoded.id);
        const newRefreshToken = generateRefreshToken(decoded.id);
        // Hash and update refresh token in DB (token rotation)
        const newHashedRefreshToken = crypto_1.default
            .createHash('sha256')
            .update(newRefreshToken)
            .digest('hex');
        await tokenModel_1.RefreshToken.findByIdAndUpdate(tokenExists._id, {
            token: newHashedRefreshToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        });
        // Set new cookies
        setTokenCookies(res, newAccessToken, newRefreshToken);
        res.status(200).json({ message: 'Token refreshed successfully' });
    }
    catch (error) {
        res.status(401);
        throw new Error('Invalid refresh token, please login');
    }
});
// Logout User
exports.logout = (0, express_async_handler_1.default)(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    // Delete refresh token from DB if it exists
    if (refreshToken) {
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update(refreshToken)
            .digest('hex');
        await tokenModel_1.RefreshToken.deleteOne({ token: hashedToken });
    }
    // Clear cookies
    res.cookie('token', '', {
        path: '/',
        httpOnly: true,
        expires: new Date(0),
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
    });
    res.cookie('refreshToken', '', {
        path: '/',
        httpOnly: true,
        expires: new Date(0),
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).json({ message: 'Successfully Logged Out' });
});
// Get User Data
exports.getUser = (0, express_async_handler_1.default)(async (req, res) => {
    const user = await userModel_1.default.findById(req.user._id);
    if (!user) {
        res.status(400);
        throw new Error('User Not Found');
    }
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
        _id,
        name,
        email,
        photo,
        phone,
        bio,
    });
});
// Get Login Status
exports.loginStatus = (0, express_async_handler_1.default)(async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        res.json(false);
        return;
    }
    try {
        // Verify Token
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        res.json(true);
    }
    catch (error) {
        // Token is invalid or expired
        res.json(false);
    }
});
// Update User
exports.updateUser = (0, express_async_handler_1.default)(async (req, res) => {
    const user = await userModel_1.default.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    const { name, email, photo, phone, bio } = user;
    user.email = email; // Email cannot be changed
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo || photo;
    const updatedUser = await user.save();
    res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        photo: updatedUser.photo,
        phone: updatedUser.phone,
        bio: updatedUser.bio,
    });
});
// Change Password
exports.changePassword = (0, express_async_handler_1.default)(async (req, res) => {
    const user = await userModel_1.default.findById(req.user._id);
    const { oldPassword, password } = req.body;
    if (!user) {
        res.status(400);
        throw new Error('User not found, please signup');
    }
    // Validate
    if (!oldPassword || !password) {
        res.status(400);
        throw new Error('Please add old and new password');
    }
    // Validate new password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
        res.status(400);
        throw new Error(passwordValidation.message);
    }
    // Check if old password matches password in DB
    const passwordIsCorrect = await bcryptjs_1.default.compare(oldPassword, user.password);
    if (!passwordIsCorrect) {
        res.status(400);
        throw new Error('Old password is incorrect');
    }
    // Save new password
    user.password = password;
    await user.save();
    res.status(200).send('Password change successful');
});
// Forgot Password
exports.forgotPassword = (0, express_async_handler_1.default)(async (req, res) => {
    const { email } = req.body;
    const user = await userModel_1.default.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error('User does not exist');
    }
    // Delete existing token if it exists in DB
    await tokenModel_1.Token.deleteMany({ userId: user._id });
    // Create Reset Token
    const resetToken = crypto_1.default.randomBytes(32).toString('hex') + user._id.toString();
    // Hash token before saving to DB
    const hashedToken = crypto_1.default
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    // Save Token to DB
    await tokenModel_1.Token.create({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes
    });
    // Construct Reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
    // Send email with React Email template
    try {
        await (0, sendEmail_1.default)({
            subject: 'Password Reset Request',
            send_to: user.email,
            sent_from: process.env.EMAIL_USER,
            template: react_1.default.createElement(email_templates_1.PasswordResetEmail, {
                userName: user.name,
                resetUrl: resetUrl,
            }),
        });
        res.status(200).json({ success: true, message: 'Reset Email Sent' });
    }
    catch (error) {
        res.status(500);
        throw new Error('Email not sent, please try again');
    }
});
// Reset Password
exports.resetPassword = (0, express_async_handler_1.default)(async (req, res) => {
    const { password } = req.body;
    const { resetToken } = req.params;
    // Validate new password
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
        res.status(400);
        throw new Error(passwordValidation.message);
    }
    // Hash token, then compare to Token in DB
    const hashedToken = crypto_1.default
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    // Find token in DB
    const userToken = await tokenModel_1.Token.findOne({
        token: hashedToken,
        expiresAt: { $gt: Date.now() },
    });
    if (!userToken) {
        res.status(404);
        throw new Error('Invalid or Expired Token');
    }
    // Find user
    const user = await userModel_1.default.findById(userToken.userId);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    user.password = password;
    await user.save();
    // Delete the used token
    await tokenModel_1.Token.findByIdAndDelete(userToken._id);
    res.status(200).json({
        message: 'Password Reset Successful, Please Login',
    });
});
