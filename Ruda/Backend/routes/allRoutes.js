const express = require("express");
const AllController = require("../controller.js/allController");

const router = express.Router();

// ✅ CRUD for 'all' table (manage name/category fields)
router.get("/", AllController.getAll);
router.post("/", AllController.create);
router.put("/:id", AllController.update);
router.delete("/:id", AllController.delete);

module.exports = router;
