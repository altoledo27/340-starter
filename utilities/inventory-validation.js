const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}


validate.newInventoryRules = () => {
  return [
    body("inv_make")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Please provide a make."),

    body("inv_model")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Please provide a model."),

    body("inv_description")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a description."),

    body("inv_price")
    .trim()
    .escape()
    .notEmpty()
    .isDecimal()
    .withMessage("Price must be a decimal or integer."),

    body("inv_year")
    .trim()
    .escape()
    .notEmpty()
    .isNumeric()
    .isLength({ min: 4, max: 4 })
    .withMessage("Year must be a 4-digit number."),

    body("inv_miles")
    .trim()
    .escape()
    .notEmpty()
    .isNumeric()
    .withMessage("Miles must be a number."),

    body("inv_color")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a color."),

    body("classification_id")
    .trim()
    .escape()
    .notEmpty()
    .isNumeric()
    .withMessage("Please select a classification."),
  ]
}

/* ******************************
 * Check data and return errors to ADD view
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classificationSelect,
      inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id,
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors to EDIT view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      inv_id, 
      inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id,
    })
    return
  }
  next()
}

module.exports = validate