const nodemailer = require("nodemailer");
require("dotenv").config();

console.log(
    "Checking Email Config -> USER:",
    process.env.EMAIL_USER,
    "| PASS Key Available:", !!process.env.EMAIL_PASS
);

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Port 465 ke liye SSL enable
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Google 16-digit App Password
    },
    // Cloud environment mein hanging rokne ke liye timeouts
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
});

transporter.verify((error) => {
    if (error) {
        console.error("❌ Nodemailer Setup Error:", error.message);
    } else {
        console.log("✅ Nodemailer ready to send emails!");
    }
});

module.exports = transporter;