"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const components_1 = require("@react-email/components");
const sendEmail = async (options) => {
    const { subject, send_to, sent_from, reply_to, template } = options;
    // Create Email Transporter
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        host: process.env.EMAIL_HOST,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    // Render React Email template to HTML
    const html = await (0, components_1.render)(template);
    // Render plain text version
    const text = await (0, components_1.render)(template, { plainText: true });
    // Email options
    const mailOptions = {
        from: sent_from,
        to: send_to,
        replyTo: reply_to,
        subject: subject,
        html: html,
        text: text,
    };
    // Send email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
    }
    catch (error) {
        console.error('Email sending failed:', error);
        throw new Error('Email not sent, please try again');
    }
};
exports.default = sendEmail;
