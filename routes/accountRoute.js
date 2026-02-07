const express = require("express")
const router = new express.Router()
const Util = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')
router.get("/account/login")

router.get("/login", Util.handleErrors(accountController.buildLogin))
router.get("/register", Util.handleErrors(accountController.buildRegister))
router.post('/register', Util.handleErrors(accountController.registerAccount))
router.post("/register", regValidate.registationRules(), regValidate.checkRegData, Util.handleErrors(accountController.registerAccount))


module.exports = router;