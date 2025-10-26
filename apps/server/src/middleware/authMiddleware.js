"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const protect = (0, express_async_handler_1.default)(async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401);
            throw new Error('Not authorized, please login');
        }
        // Verify Token
        const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Get user id from token
        const user = await userModel_1.default.findById(verified.id).select('-password');
        if (!user) {
            res.status(401);
            throw new Error('User not found');
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401);
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new Error('Token expired, please login again');
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new Error('Invalid token, please login again');
        }
        throw new Error('Not authorized, please login');
    }
});
exports.default = protect;
