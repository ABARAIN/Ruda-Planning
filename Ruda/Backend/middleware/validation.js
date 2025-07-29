// Validation middleware for request data
const validateRecordData = (req, res, next) => {
  const { name, layer, map_name } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      error: 'Name is required and must be a non-empty string'
    });
  }

  if (!layer || typeof layer !== 'string' || layer.trim().length === 0) {
    return res.status(400).json({
      error: 'Layer is required and must be a non-empty string'
    });
  }

  if (!map_name || typeof map_name !== 'string' || map_name.trim().length === 0) {
    return res.status(400).json({
      error: 'Map name is required and must be a non-empty string'
    });
  }

  // Sanitize the data
  req.body.name = name.trim();
  req.body.layer = layer.trim();
  req.body.map_name = map_name.trim();

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