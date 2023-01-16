const nodemailer = require('nodemailer');
const config = require('./config');
const logger = require('./logger');
const {verificationTemplate} = require('./emailTemplates/verificationTemplate')

const transport = nodemailer.createTransport(config.email.smtp);
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}


const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};


const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  const resetPasswordUrl = `${config.serverUrl}/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;

  await sendEmail(to, subject, text);
};


const sendVerificationEmail = async (to, token) => {
    const subject = 'Email Verification';
     const url = `${config.serverUrl}/verify-email?token=${token}`;
    const html = verificationTemplate(url, token)
    await sendEmail(to, subject, html);
};

const sendWelcomeEmail = async (to) => {
  const subject = 'Welcome Email';
  text=`This is Welcome Email Send From Nodejs BolierPlate Developed By @alamjamal`
  await sendEmail(to, subject, text);
};


module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendWelcomeEmail
};
