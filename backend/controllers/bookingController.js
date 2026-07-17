const Booking = require("../models/Booking");

// 1. CREATE BOOKING REQUEST
const createBooking = async(req, res) => {
    try {
        const { name, phone, email, check_in, check_out, guests, room_preference, message } = req.body;
        if (!name || !phone || !room_preference) {
            return res.status(400).json({ success: false, message: "Required fields missing" });
        }
        const newBooking = await Booking.create({ name, phone, email, check_in, check_out, guests, room_preference, message });
        return res.status(201).json({ success: true, message: "Booking saved successfully!", data: newBooking });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// 2. GET ALL BOOKINGS (Sorted by newest first)
const getAllBookings = async(req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 3. UPDATE BOOKING STATUS (Confirm/Cancel Action logic)
const updateBookingStatus = async(req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updated = await Booking.findByIdAndUpdate(id, { status }, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: "Booking not found" });

        return res.status(200).json({ success: true, message: `Booking marked as ${status}!`, data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 4. DELETE BOOKING RECORD
const deleteBooking = async(req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Booking.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: "Booking not found" });

        return res.status(200).json({ success: true, message: "Booking deleted successfully from records." });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { createBooking, getAllBookings, updateBookingStatus, deleteBooking };