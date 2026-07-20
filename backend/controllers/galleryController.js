const Media = require('../models/Gallery');

// 1. Upload Media (Gallery or Rooms using Base64)
exports.uploadMedia = async(req, res) => {
    try {
        const { title, category, imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: "Bhai image select karna bhool gaye ya Base64 convert nahi hui!"
            });
        }

        const targetCategory = category === 'rooms' ? 'rooms' : 'gallery';

        // Direct req.body se data uthakar database me entry save karenge
        const newMedia = new Media({
            title: title || 'Untitled',
            category: targetCategory,
            imageUrl: imageUrl, // Base64 string yahan save ho rahi hai
        });

        await newMedia.save();

        res.status(201).json({
            success: true,
            message: `${targetCategory === 'rooms' ? 'Room' : 'Gallery'} image saved permanently 🎉`,
            data: newMedia
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Fetch Media By Category (Same rahega, bas find karega)
exports.getMedia = async(req, res) => {
    try {
        const { category } = req.query;
        const filter = category && category !== 'All' ? { category } : {};

        const items = await Media.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Delete Media (Ab disk se delete nahi karna, sirf DB se udaana hai)
exports.deleteMedia = async(req, res) => {
    try {
        const { id } = req.params;
        const mediaItem = await Media.findById(id);

        if (!mediaItem) {
            return res.status(404).json({ success: false, message: "Media file nahi mili." });
        }

        // Sirf Database se remove karna hai kyunki physical file hai hi nahi!
        await Media.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Bhai database se photo permanent remove ho gayi hai!"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};