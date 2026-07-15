const Room = require("../models/Room");

// Create Room
exports.createRoom = async(req, res) => {
    try {
        const room = await Room.create(req.body);

        res.status(201).json({
            success: true,
            room,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get All Rooms
exports.getRooms = async(req, res) => {
    try {
        const rooms = await Room.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            rooms,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};