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

/**
 * Build management view
 */

invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/management",{
        title: "Vehicle Management",
        nav,
        errors: null,
    })
}
/**
 * Build add classification view
 */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
    })
}

invCont.addClassification = async function (req, res) {
    const {classification_name} = req.body
    const result = await invModel.addClassification(classification_name)

    if(result){
        let nav = await utilities.getNav()
        req.flash("notice", `The ${classification_name} classification was successfully added.`)
        res.status(201).render("inventory/management", {
            title: "Vehicle Management",
            nav,
        })
    }else{
        req.flash("notice", "Provide a valid classification name")
        res.status(501).render("/inventory/add-classification", {
            title: "Add New Classification",
            nav: await utilities.getNav(),
        })
    }
}

invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("inventory/add-inventory", {
        title: "Add Vehicle",
        nav,
        classificationSelect,
    }) 
}

invCont.addInventory = async function (req, res) {
    const {inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id} = req.body
    const result = await invModel.addInventory(
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    )

    if (result) {
        req.flash("notice", `The ${inv_make} was successfully added.`)
        res.status(201).redirect("/inv/")
    } else {
         classificationSelect = await utilities.buildClassificationList(classification_id)
        req.flash("notice", "Error adding vehicle.")
        res.status(501).render("inventory/add-inventory", {
        title: "Add Vehicle",
        nav,
        classificationSelect,
        inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
    })
  }
}

module.exports = invCont