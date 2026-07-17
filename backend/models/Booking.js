const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        default: "",
    },
    check_in: {
        type: Date,
        required: false,
    },
    check_out: {
        type: Date,
        required: false,
    },
    guests: {
        type: Number,
        required: true,
        default: 1,
    },
    room_preference: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        trim: true,
        default: "",
    },
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Cancelled"],
        default: "Pending",
    },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);