const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}
/* *************************************
 * Construct the nav HTML unordered list
 * *************************************/
Util.getNav = async function (req, res,next) {
    let data = await invModel.getClassifications()
    //console.log(data)
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach(row => {
        list +="<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name + 
            "</a>"
        list += "</li>"    
    });
    list += "</ul>"
    return list
}

Util.buildClassificationList = async function (classification_id= null) {
  let data = await invModel.getClassifications()
  let classificationList = '<select name= "classification_id" id= "classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) =>{
    classificationList += '<option value="' + row.classification_id + '"'
    if(
      classification_id != null &&
      row.classification_id == classification_id
    ){
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}
/* *******************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 * *******************************/
Util.handleErrors = fn => (req, res, next) =>Promise.resolve(fn(req, res, next)).catch(next)


/* ***********************************
 * Build the classification view HTML
 * ***********************************/
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li> '
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
            + '" title=View ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + 'details"><img src="' + vehicle.inv_thumbnail
            + '" alt=Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model+' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$' 
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
        }else { 
            grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
        }
        return grid
    }


Util.buildInventoryGrid = async function(vehicle, isLoggedIn, isFavorite) {
  //Add a heart button for the wishlist
  let wishlistButton = ''
  if (isLoggedIn) {
    if (isFavorite){
      wishlistButton = `
        <div class="already-favorite">
          <span class="heart-icon">❤</span> Already in your wishlist
          <p><a href="/account/" class="go-wishlist">View Wishlist</a></p>
        </div>
      `;
    }else{
       wishlistButton = `
      <form action="/account/wishlist/add" method="post" class="wishlist-form">
        <input type="hidden" name="inv_id" value="${vehicle.inv_id}">
        <button type="submit" class="btn-favorite">❤ Add to Favorites</button>
      </form>
    `;
    }
   
  } else {
    wishlistButton = `
      <p class="login-notice"><a href="/account/login">Log in</a> to add to favorites.</p>
    `;
  }
  return `
    <section class="car-detail-wrapper">
      <div class="car-image">
        <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model} image">
      </div>
      <div class= "car-info-container">
        <div class="car-info">
          <h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>
          <p class="price"><strong>Price: $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</strong></p>
          <p class="description"><strong>Description:</strong> ${vehicle.inv_description}</p>
          <p class="specs"><strong>Color:</strong> ${vehicle.inv_color}</p>
          <p class="specs"><strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}</p>
        </div>
        <div class="wishlist-container">
            ${wishlistButton}  
        </div>
      </div>  
    </section>
    
  `;
};

Util.checkJWTToken= (req, res, next) => {
  if(req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData){
        if(err) {
          req.flash("Please log in")
          res.clearCokie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    next()
  }
}

Util.checkLogin = (req, res, next) => {
  if(res.locals.loggedin){
    next()
  }else{
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 * Check Account Type (Employee or Admin)
 * **************************************** */
Util.checkAccountType = (req, res, next) => {
  if (res.locals.loggedin) {
    const accountType = res.locals.accountData.account_type

    if (accountType === "Employee" || accountType === "Admin") {
      return next()
    }
    req.flash("notice", "Access denied. You do not have the required permissions.")
    return res.redirect("/account/login")
  }
  req.flash("notice", "Please log in to access this area.")
  return res.redirect("/account/login")
}

module.exports = Util