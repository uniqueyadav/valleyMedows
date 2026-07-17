const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Storage Config
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Dynamic subfolder target check karega (gallery ya rooms)
        const subFolder = req.body.category === 'rooms' ? 'rooms' : 'gallery';
        const uploadPath = path.join(__dirname, `../uploads/${subFolder}`);

        // Agar folder nahi bana ho to automatically bana dega
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
        // Unique filename formatting
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File Filter (Sirf Images Allow karne ke liye)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Bhai, sirf image files (.jpg, .png, etc.) hi allowed hain!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB Max Limit
});

module.exports = upload;