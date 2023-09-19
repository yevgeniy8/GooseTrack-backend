require('dotenv').config();
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    },
});

const sendEMail = message => {
    message.from = process.env.SENDER_EMAIL;

    transport.sendMail(message);
};

module.exports = sendEMail;
