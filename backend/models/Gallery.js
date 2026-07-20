const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
    },

    imageUrl: {
        type: String, // Yahan direct Base64 string save hogi (AddRoom ki tarah)
        required: [true, "Image Base64 Data zaroori hai!"],
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Gallery', GallerySchema);