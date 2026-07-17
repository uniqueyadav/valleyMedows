const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const galleryController = require('../controllers/galleryController');

// Routes trigger endpoints
router.post('/upload', upload.single('image'), galleryController.uploadMedia);
router.get('/', galleryController.getMedia);
router.delete('/:id', galleryController.deleteMedia);

module.exports = router;