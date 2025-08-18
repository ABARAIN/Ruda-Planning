const express = require("express");
const router = express.Router();
const GanntCrudController = require("../controllers/ganntCrudController");

router.get("/", GanntCrudController.list);
router.get("/:id", GanntCrudController.getOne);
router.post("/", GanntCrudController.create);
router.put("/:id", GanntCrudController.update);
router.delete("/:id", GanntCrudController.remove);

module.exports = router;
