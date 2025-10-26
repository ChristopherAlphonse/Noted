import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel';
import sendEmail from '../utils/sendEmail';
import { ContactFormEmail } from '@noted/email-templates';
import type { AuthRequest } from '../middleware/authMiddleware';
import React from 'react';

export const contactUs = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { subject, message } = req.body;
  const user = await User.findById(req.user!._id);

  if (!user) {
    res.status(400);
    throw new Error('User not found, please signup');
  }

  // Validation
  if (!subject || !message) {
    res.status(400);
    throw new Error('Please add subject and message');
  }

  const send_to = process.env.EMAIL_USER!;
  const sent_from = process.env.EMAIL_USER!;
  const reply_to = user.email;

  try {
    await sendEmail({
      subject: `Contact Form: ${subject}`,
      send_to,
      sent_from,
      reply_to,
      template: React.createElement(ContactFormEmail, {
        userName: user.name,
        userEmail: user.email,
        subject,
        message,
      }),
    });

    res.status(200).json({ success: true, message: 'Email Sent' });
  } catch (error) {
    res.status(500);
    throw new Error('Email not sent, please try again');
  }
});

