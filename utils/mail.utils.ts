import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const transport = nodemailer.createTransport({
  host: process.env.SENDER_MAIL_HOST,
  port: process.env.SENDER_MAIL_PORT,
  // secure: process.env.NODE_ENV !== 'development',
  secure: false,
  auth: {
    user: process.env.SENDER_MAIL_USER,
    pass: process.env.SENDER_MAIL_PASSWORD
  }
} as SMTPTransport.Options);

type SendEmailDto = {
  sender: Mail.Address;
  receipients: Mail.Address[];
  subject: string;
  message: string;
  isHtml: boolean;
};

export const sendEmail = async (dto: SendEmailDto) => {
  const { sender, receipients, subject, message } = dto;

  return await transport.sendMail({
    from: sender,
    to: receipients,
    subject,
    html: message,
    text: message,
  });

};
