const express = require("express");
const { createBooking, getAllBookings, updateBookingStatus, deleteBooking } = require("../controllers/bookingController");

const router = express.Router();

router.post("/add", createBooking);
router.get("/", getAllBookings);
router.put("/update/:id", updateBookingStatus);
router.delete("/delete/:id", deleteBooking);

module.exports = router;