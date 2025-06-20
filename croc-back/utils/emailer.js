require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
});

module.exports = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: to,
            subject: subject,
            text: html
        });
        console.log('Email sent successfully');
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
};
