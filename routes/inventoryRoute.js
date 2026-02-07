//Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const Util = require("../utilities/")
//Router to build inventory classification view
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", Util.handleErrors(invController.buildByInventoryId));
router.get("/", Util.handleErrors(invController.buildManagement));
router.get("/add-classification", Util.handleErrors(invController.buildAddClassification));
router.post("/add-classification", Util.handleErrors(invController.addClassification));
router.get("/add-inventory", Util.handleErrors(invController.buildAddInventory));
router.post("/add-inventory", Util.handleErrors(invController.addInventory));
router.get("/intentional-500", (req, res, next) =>{err.status =500;})

module.exports = router;
