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
        // 👇 Status ko standardized lowercase me rakha taaki validation fail na ho
        enum: ["pending", "confirmed", "checked-out", "cancelled"],
        default: "pending",
    },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);