// src/api/api.js
import axios from "axios";

const API = axios.create({
    baseURL: "https://valleymedows.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// 💡 AUTOMATIC TOKEN INJECTION: Jab bhi aap login kar loge, ye interceptor har request ke sath 
// token ko backend par bhejega taaki auth failure na ho.
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// ==========================================
// 🔑 ADMIN / USER AUTHENTICATION ENDPOINTS
// ==========================================

// ADMIN LOGIN (Bhai ye missing tha, ab 404 nahi aayega!)
export const adminLogin = async(credentials) => {
    // Backend controllers ke mutabik agar route '/admin/login' hai ya '/auth/login' use verify karein.
    // Defaulting to '/admin/login' standard context.
    return await API.post("/admin/login", credentials);
};


// ==========================================
// 🏨 ROOMS MANAGEMENT ENDPOINTS
// ==========================================

// GET ALL ROOMS
export const getAllRooms = async() => {
    return await API.get("/rooms");
};

// GET SINGLE ROOM
export const getRoomById = async(id) => {
    return await API.get(`/rooms/${id}`);
};

// ADD ROOM
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


// ==========================================
// 📅 BOOKINGS MANAGEMENT ENDPOINTS
// ==========================================

// GET ALL BOOKINGS
export const getAllBookings = async() => {
    return await API.get("/bookings");
};

// UPDATE BOOKING STATUS (Confirm / Cancel / Checked Out)
export const updateBookingStatus = async(id, status) => {
    return await API.put(`/bookings/update/${id}`, { status });
};

// DELETE BOOKING
export const deleteBooking = async(id) => {
    return await API.delete(`/bookings/delete/${id}`);
};


// ==========================================
// 🖼️ GALLERY / MEDIA ENDPOINTS
// ==========================================

// GET ALL MEDIA
export const getMedia = async(category = "All") => {
    return await API.get(`/gallery?category=${category}`);
};

// UPLOAD NEW MEDIA
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