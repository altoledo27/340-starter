const express = require("express")
const router = new express.Router()
const Util = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

router.get("/", Util.checkLogin, Util.handleErrors(accountController.buildManagement))
router.get("/login", Util.handleErrors(accountController.buildLogin))
router.post("/login", regValidate.loginRules(), regValidate.checkLoginData,Util.handleErrors(accountController.accountLogin))
router.get("/register", Util.handleErrors(accountController.buildRegister))
router.post('/register', Util.handleErrors(accountController.registerAccount))
router.post("/register", regValidate.registationRules(), regValidate.checkRegData, Util.handleErrors(accountController.registerAccount))
router.get("/update/:accountId", Util.checkLogin, Util.handleErrors(accountController.buildAccountUpdateView))
router.post("/update-info", regValidate.updateAccountRules(), regValidate.checkUpdateData, Util.handleErrors(accountController.updateAccount))
router.post("/update-password", regValidate.passwordRules(), regValidate.checkUpdateData, Util.handleErrors(accountController.updatePassword))
router.get("/logout", Util.handleErrors(accountController.accountLogout))


module.exports = router;