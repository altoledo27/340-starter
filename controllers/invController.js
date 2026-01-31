const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/**
 * Build inventory by classification view
 */
invCont.buildByClassificationId = async function (req, res, next){
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

invCont.buildByInventoryId = async function (req, res, next){
    const inv_id = req.params.invId
    const data = await invModel.getInventoryByInventoryId(inv_id)

    if (!data || data.length === 0) {
    const err = new Error("Sorry, we couldn't find that specific vehicle.");
    err.status = 404;
    return next(err); 
  }
    const grid = await utilities.buildInventoryGrid(data)
    let nav = await utilities.getNav()
    const carMake = data[0].inv_make 
    const carModel = data[0].inv_model
    const carYear = data[0].inv_year
    res.render("./inventory/car-detail", {
        title: carYear + ' ' + carMake + ' ' + carModel,
        nav,
        grid,
    })
}

module.exports = invCont