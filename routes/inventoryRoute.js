//Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const Util = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

//Router to build inventory classification view
router.get("/", Util.checkJWTToken, Util.checkAccountType, Util.handleErrors(invController.buildManagement));
router.get("/add-classification", Util.checkJWTToken, Util.checkAccountType, Util.handleErrors(invController.buildAddClassification))
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", Util.checkJWTToken, Util.handleErrors(invController.buildByInventoryId));
router.get("/add-classification", Util.handleErrors(invController.buildAddClassification));
router.post("/add-classification", Util.handleErrors(invController.addClassification));
router.get("/add-inventory", Util.handleErrors(invController.buildAddInventory));
router.post("/add-inventory", Util.handleErrors(invController.addInventory));
router.get("/intentional-500", (req, res, next) =>{err.status =500;})
;router.get("/getInventory/:classification_id", Util.handleErrors(invController.getInventoryJSON));
router.get("/edit/:invId", Util.handleErrors(invController.editInventoryView));
router.post("/update", invValidate.newInventoryRules(), invValidate.checkUpdateData, Util.handleErrors(invController.updateInventory));
router.get("/delete/:invId", Util.handleErrors(invController.buildDeleteConfirmation));
router.post("/delete", Util.handleErrors(invController.deleteItem));




module.exports = router;
