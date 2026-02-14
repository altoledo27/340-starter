const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const wishModel = require("../models/wishlist-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* *********************
 * Deliver login view
 * *********************/

async function buildLogin(req, res, next){
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
    })
}

/* **************************
 * Deliver registration view
 * *************************/

async function buildRegister (req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null
    })
    
}

/* **********************
 * Process Registration
 * **********************/

async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const {account_firstname, account_lastname, account_email, account_password} = req.body
    let hashedPassword
    try{
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch(error){
        req.flash("notice", 'Sorry, there was an error processing the registration')
        res.status(500).render("account/register",{
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )
    if (regResult.rowCount > 0){
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })       
    }else{
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
        })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    const isMatch = await bcrypt.compare(account_password, accountData.account_password)
    if (isMatch){
      if (await bcrypt.compare(account_password, accountData.account_password)) {
        delete accountData.account_password
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        if(process.env.NODE_ENV === 'development') {
          res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
          res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }
        return res.redirect("/account/")
      }
    }else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()

  const account_id = res.locals.accountData.account_id
  const wishlistData = await wishModel.getWishlistByAccountId(account_id)
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    wishlist: wishlistData,
  })
  
}

async function buildAccountUpdateView(req, res, next) {
  const account_id = parseInt(req.params.accountId)
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)
  res.render("account/update", {
    title: "Edit Account",
    nav,
    errors: null,
    accountData, 
  })
}

async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  const updateResult = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id)

  if (updateResult) {
    const accountData = await accountModel.getAccountById(account_id)
    req.flash("notice", "Account updated successfully.")
    res.status(200).render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      accountData,
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      account_firstname, account_lastname, account_email, account_id
    })
  }
}

async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body
  const hashedPassword = await bcrypt.hash(account_password, 10)
  const updateResult = await accountModel.updatePassword(hashedPassword, account_id)

  const accountData = await accountModel.getAccountById(account_id)
  if (updateResult) {
    req.flash("notice", "Password updated successfully.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    res.status(501).render("account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      accountData,
    })
  }
}
/* ****************************************
* Process Logout
* *************************************** */
async function accountLogout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.") 
  return res.redirect("/")
}



module.exports = {buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, buildAccountUpdateView, updateAccount, updatePassword, accountLogout }