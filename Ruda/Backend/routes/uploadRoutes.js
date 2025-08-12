const express = require('express');
const router = express.Router();
const UploadController = require('../controllers/uploadController');

// Upload single image
router.post('/image', UploadController.uploadSingle, UploadController.uploadImage);

// Delete image by filename
router.delete('/image/:filename', UploadController.deleteImage);

// Get list of all uploaded images
router.get('/images', UploadController.listImages);

module.exports = router;
