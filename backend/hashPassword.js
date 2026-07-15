const bcrypt = require("bcryptjs");

async function hashPassword() {
    const hash = await bcrypt.hash("Admin@123", 10);
    console.log(hash);
}

hashPassword();