// Validation middleware for request data
const validateRecordData = (req, res, next) => {
  const { name, category } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      error: 'Name is required and must be a non-empty string'
    });
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    return res.status(400).json({
      error: 'Category is required and must be a non-empty string'
    });
  }

  // Sanitize the data
  req.body.name = name.trim();
  req.body.category = category.trim();

  next();
};

const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      error: 'Valid ID is required'
    });
  }

  next();
};

module.exports = {
  validateRecordData,
  validateId
}; 