const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Bhai image ka ek title zaroori hai!"],
        trim: true,
    },
    category: {
        type: String,
        required: true,
        enum: {
            values: ['gallery', 'rooms'],
            message: 'Bhai category sirf "gallery" ya "rooms" hi ho sakti hai!',
        },
    },
    imageUrl: {
        type: String,
        required: [true, "Image URL/Path zaroori hai!"],
    },
    fileName: {
        type: String,
        required: [true, "Physical file name tracking ke liye zaroori hai!"],
    },
}, {
    timestamps: true, // Isse createdAt aur updatedAt automatically ban jayega
});

module.exports = mongoose.model('Gallery', GallerySchema);