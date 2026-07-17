// src/api/api.js
import axios from "axios";

const API = axios.create({
    baseURL: "https://valleymedows.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// GET ALL ROOMS
export const getAllRooms = async() => {
    return await API.get("/rooms");
};

// GET SINGLE ROOM
export const getRoomById = async(id) => {
    return await API.get(`/rooms/${id}`);
};

// ADD ROOM (RoomsAdmin handles 'createRoom' but api.js had 'addRoom')
export const createRoom = async(roomData) => {
    return await API.post("/rooms/add", roomData);
};

// UPDATE ROOM
export const updateRoom = async(id, roomData) => {
    return await API.put(`/rooms/update/${id}`, roomData);
};

// DELETE ROOM
export const deleteRoom = async(id) => {
    return await API.delete(`/rooms/delete/${id}`);
};
// GET ALL BOOKINGS (Admin Panel ke liye)
export const getAllBookings = async() => {
    return await API.get("/bookings");
};

// UPDATE BOOKING STATUS (Confirm / Cancel karne ke liye)
export const updateBookingStatus = async(id, status) => {
    return await API.put(`/bookings/update/${id}`, { status });
};

// DELETE BOOKING
export const deleteBooking = async(id) => {
    return await API.delete(`/bookings/delete/${id}`);
};

// GET ALL MEDIA (Filter by category: 'All', 'gallery', 'rooms')
export const getMedia = async(category = "All") => {
    return await API.get(`/gallery?category=${category}`);
};

// UPLOAD NEW MEDIA (Handles gallery/rooms dynamic destination on backend)
export const uploadMedia = async(formData) => {
    return await API.post("/gallery/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

// DELETE MEDIA FROM DB AND STORAGE
export const deleteMedia = async(id) => {
    return await API.delete(`/gallery/${id}`);
};

export default API;