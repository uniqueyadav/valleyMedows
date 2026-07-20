import axios from "axios";

export const BACKEND_URL = "https://valleymedows.onrender.com";
// export const BACKEND_URL = "http://localhost:5000";

const API = axios.create({
    baseURL: `${BACKEND_URL}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

// AUTOMATIC TOKEN INJECTION INTERCEPTOR
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
export const adminLogin = async(credentials) => {
    return await API.post("/admin/login", credentials);
};

// ==========================================
// 🏨 ROOMS MANAGEMENT ENDPOINTS
// ==========================================
export const getAllRooms = async() => {
    return await API.get("/rooms");
};

export const getRoomById = async(id) => {
    return await API.get(`/rooms/${id}`);
};

export const createRoom = async(roomData) => {
    return await API.post("/rooms/add", roomData);
};

export const updateRoom = async(id, roomData) => {
    return await API.put(`/rooms/update/${id}`, roomData);
};

export const deleteRoom = async(id) => {
    return await API.delete(`/rooms/delete/${id}`);
};

// ==========================================
// 📅 BOOKINGS MANAGEMENT ENDPOINTS
// ==========================================
export const getAllBookings = async() => {
    return await API.get("/bookings");
};

export const updateBookingStatus = async(id, status) => {
    return await API.put(`/bookings/update/${id}`, { status });
};

export const deleteBooking = async(id) => {
    return await API.delete(`/bookings/delete/${id}`);
};

// ==========================================
// 🖼️ GALLERY / MEDIA ENDPOINTS
// ==========================================
export const getMedia = async(category = "All") => {
    return await API.get(`/gallery?category=${category}`);
};

export const uploadMedia = async(formData) => {
    return await API.post("/gallery/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const deleteMedia = async(id) => {
    return await API.delete(`/gallery/${id}`);
};
export const sendBookingEmail = async(emailData) => {
    // emailData = { to: "guest@email.com", subject: "Booking Confirmed", name: "Amit" }
    return await API.post("/bookings/send-email", emailData);
};
// Is line ko aapne api.js file ke bilkul bottom me add kar lena hai:
export const createBooking = async(bookingData) => {
    return await API.post("/bookings/add", bookingData);
};

export default API;