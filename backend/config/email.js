const nodemailer = require("nodemailer");
require("dotenv").config(); // 👈 Ye line yahan zaroor honi chahiye!

// Ek baar check karne ke liye console log lagate hain ki values aa bhi rahi hain ya nahi
console.log("Checking Email Config -> USER:", process.env.EMAIL_USER, "| PASS Key Available:", !!process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Transporter verify test
transporter.verify((error, success) => {
    if (error) {
        console.log("❌ Nodemailer Setup Failed:", error.message);
    } else {
        console.log("✅ Nodemailer ready to send emails!");
    }
});

module.exports = transporter;