// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const path = require("path");
// const adminRoutes = require("./routes/adminRoutes");
// const roomRoutes = require("./routes/roomRoutes");
// const bookingRoutes = require("./routes/bookingRoutes");
// const galleryRoutes = require("./routes/galleryRoutes");
// const connectDB = require("./config/db");

// dotenv.config();

// connectDB();

// const app = express();

// app.use(cors());
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));
// app.use(cookieParser());


// app.use('/uploads/gallery', express.static(path.join(__dirname, 'uploads/gallery')));



// app.use("/api/rooms", roomRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/bookings", bookingRoutes);
// app.use("/api/gallery", galleryRoutes);

// app.get("/", (req, res) => {
//     res.send("Happy Haven Backend Running...");
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     console.log(`🚀 Server Running on ${PORT}`);
// });

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const http = require("http"); // Imported for socket wrapping
const { Server } = require("socket.io"); // Imported socket server engine

const adminRoutes = require("./routes/adminRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app); // Server initialization using HTTP proxy

// Configured Socket Server along with Cross-Origin resource permissions
const io = new Server(server, {
    cors: {
        origin: "*", // Production me yahan specific origins array pass kar sakte ho
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// App level attachment for controllers visibility
app.set("socketio", io);

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use('/uploads/gallery', express.static(path.join(__dirname, 'uploads/gallery')));

app.use("/api/rooms", roomRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/gallery", galleryRoutes);

app.get("/", (req, res) => {
    res.send("Happy Haven Backend Running...");
});

// Real-time network pipeline listener
io.on("connection", (socket) => {
    console.log(`⚡ Admin/User terminal connected to web-sockets pool: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`🔌 Channel connection dropped down safely.`);
    });
});

const PORT = process.env.PORT || 5000;

// Shift runtime trigger from app to server instance
server.listen(PORT, () => {
    console.log(`🚀 Server Running on ${PORT}`);
});