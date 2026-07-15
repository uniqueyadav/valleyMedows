const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");

mongoose.connect(process.env.MONGO_URL);

const createAdmin = async() => {
    try {
        const hash = await bcrypt.hash("admin123", 10);

        await Admin.create({
            name: "Super Admin",
            email: "admin@gmail.com",
            password: hash,
        });

        console.log("✅ Admin Created");

        process.exit();
    } catch (err) {
        console.log(err);
        process.exit();
    }
};

createAdmin();