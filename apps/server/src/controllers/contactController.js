"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactUs = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userModel_1 = __importDefault(require("../models/userModel"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const email_templates_1 = require("@noted/email-templates");
const react_1 = __importDefault(require("react"));
exports.contactUs = (0, express_async_handler_1.default)(async (req, res) => {
    const { subject, message } = req.body;
    const user = await userModel_1.default.findById(req.user._id);
    if (!user) {
        res.status(400);
        throw new Error('User not found, please signup');
    }
    // Validation
    if (!subject || !message) {
        res.status(400);
        throw new Error('Please add subject and message');
    }
    const send_to = process.env.EMAIL_USER;
    const sent_from = process.env.EMAIL_USER;
    const reply_to = user.email;
    try {
        await (0, sendEmail_1.default)({
            subject: `Contact Form: ${subject}`,
            send_to,
            sent_from,
            reply_to,
            template: react_1.default.createElement(email_templates_1.ContactFormEmail, {
                userName: user.name,
                userEmail: user.email,
                subject,
                message,
            }),
        });
        res.status(200).json({ success: true, message: 'Email Sent' });
    }
    catch (error) {
        res.status(500);
        throw new Error('Email not sent, please try again');
    }
});
