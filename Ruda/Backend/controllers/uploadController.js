const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const fileName = file.fieldname + '-' + uniqueSuffix + fileExtension;
    cb(null, fileName);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

class UploadController {
  // Middleware for single image upload
  static uploadSingle = upload.single('image');

  // Handle image upload
  static async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded',
          message: 'Please select an image file to upload'
        });
      }

      // Generate the file URL path
      const fileUrl = `/uploads/${req.file.filename}`;
      
      res.status(200).json({
        message: 'Image uploaded successfully',
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          path: fileUrl,
          fullPath: req.file.path
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        error: 'Upload failed',
        message: error.message
      });
    }
  }

  // Delete uploaded image
  static async deleteImage(req, res) {
    try {
      const { filename } = req.params;
      const filePath = path.join(uploadsDir, filename);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          error: 'File not found',
          message: 'The specified image file does not exist'
        });
      }

      // Delete the file
      fs.unlinkSync(filePath);

      res.status(200).json({
        message: 'Image deleted successfully',
        filename: filename
      });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({
        error: 'Delete failed',
        message: error.message
      });
    }
  }

  // Get list of uploaded images
  static async listImages(req, res) {
    try {
      const files = fs.readdirSync(uploadsDir);
      const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      });

      const fileList = imageFiles.map(file => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          path: `/uploads/${file}`,
          size: stats.size,
          uploadDate: stats.birthtime
        };
      });

      res.status(200).json({
        message: 'Images retrieved successfully',
        count: fileList.length,
        images: fileList
      });
    } catch (error) {
      console.error('List images error:', error);
      res.status(500).json({
        error: 'Failed to retrieve images',
        message: error.message
      });
    }
  }
}

module.exports = UploadController;
