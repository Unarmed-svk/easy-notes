const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const brandController = require("../controllers/brand.controller");

router.post("/new", auth("createAny", "brand"), brandController.addBrand);
router.get("/all", brandController.getBrands);

module.exports = router;
