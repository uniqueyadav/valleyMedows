const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path"); // 1. Path module import kiya uploads route ke liye
const adminRoutes = require("./routes/adminRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const galleryRoutes = require("./routes/galleryRoutes"); // 2. Gallery route import kiya 🔥
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());


// 1. Gallery folder ki images access karne ke liye
app.use('/uploads/gallery', express.static(path.join(__dirname, 'uploads/gallery')));

// 2. Rooms folder ki images access karne ke liye (Jo missing tha!)
app.use('/uploads/rooms', express.static(path.join(__dirname, 'uploads/rooms')));

app.use("/api/rooms", roomRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/gallery", galleryRoutes); // 4. Gallery endpoint register kiya 🔥

app.get("/", (req, res) => {
    res.send("Happy Haven Backend Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server Running on ${PORT}`);
});