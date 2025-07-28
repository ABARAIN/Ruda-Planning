const HealthController = {
  healthCheck(req, res) {
    res.send('🌐 RUDA API running — supports GeoJSON + CRUD on "all" table');
  }
};

module.exports = HealthController;
