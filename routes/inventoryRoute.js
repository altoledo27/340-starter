//Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
//Router to build inventory classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildByInventoryId);
router.get("/intentional-500", (req, res, next) =>{err.status =500;})

module.exports = router;
