import nodemailer from 'nodemailer';
import { render } from '@react-email/components';
import type { ReactElement } from 'react';

interface SendEmailOptions {
  subject: string;
  send_to: string;
  sent_from: string;
  reply_to?: string;
  template: ReactElement;
}

const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  const { subject, send_to, sent_from, reply_to, template } = options;

  // Create Email Transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.EMAIL_HOST!,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  // Render React Email template to HTML
  const html = await render(template);

  // Render plain text version
  const text = await render(template, { plainText: true });

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
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Email not sent, please try again');
  }
};

export default sendEmail;

