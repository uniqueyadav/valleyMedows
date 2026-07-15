const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        unique: true,
    },

    roomType: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    capacity: {
        type: Number,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    amenities: {
        type: [String],
        default: [],
    },

    images: {
        type: [String],
        default: [],
    },

    status: {
        type: String,
        enum: ["Available", "Booked", "Maintenance"],
        default: "Available",
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Room", roomSchema);