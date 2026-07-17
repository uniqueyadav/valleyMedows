const fs = require('fs');
const path = require('path');
// Mongoose Model (Optional: Agar aap DB use kar rahe ho, warna bypass kar sakte ho)
const Media = require('../models/Gallery'); // Agar aap Gallery aur Rooms ko alag models me rakh rahe ho to yahan adjust karna padega

// 1. Upload Media (Gallery or Rooms)
exports.uploadMedia = async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Bhai image file attach karna bhool gaye!" });
        }

        const category = req.body.category === 'rooms' ? 'rooms' : 'gallery';
        // Frontend ke liye relative path store karenge
        const fileUrl = `/uploads/${category}/${req.file.filename}`;

        // DB entry save karein
        const newMedia = new Media({
            title: req.body.title || 'Untitled',
            category: category,
            imageUrl: fileUrl,
            fileName: req.file.filename
        });

        await newMedia.save();

        res.status(201).json({
            success: true,
            message: `${category === 'rooms' ? 'Room' : 'Gallery'} image uploaded successfully!`,
            data: newMedia
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Fetch Media By Category (All, Gallery, or Rooms)
exports.getMedia = async(req, res) => {
    try {
        const { category } = req.query; // query me ?category=rooms ya ?category=gallery bhej sakte ho
        const filter = category && category !== 'All' ? { category } : {};

        const items = await Media.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Delete Media (Removes from both DB and Storage Folder)
exports.deleteMedia = async(req, res) => {
    try {
        const { id } = req.params;
        const mediaItem = await Media.findById(id);

        if (!mediaItem) {
            return res.status(404).json({ success: false, message: "Media file nahi mili." });
        }

        // Physical File path on disk
        const targetPath = path.join(__dirname, `../uploads/${mediaItem.category}/${mediaItem.fileName}`);

        // 1. Disk se physically image delete karo
        if (fs.existsSync(targetPath)) {
            fs.unlinkSync(targetPath);
        }

        // 2. Database se record clear karo
        await Media.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Bhai file storage aur database dono se permanent remove ho gayi hai!"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};