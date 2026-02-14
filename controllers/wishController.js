const wishModel = require("../models/wishlist-model")
const utilities = require("../utilities/")

const wishCont = {}

/* ***********************
 * Add item to wishlist
 * ***********************/

wishCont.addFavorite = async function (req, res) {
    const {inv_id} = req.body
    const account_id = res.locals.accountData.account_id

    const isFavorite = await wishModel.checkWishlist(account_id, inv_id)

    if(isFavorite){
        req.flash("notice", "This vehicle is alredy in your wishlist.")
        return res.redirect(`/inv/detail/${inv_id}`)
    }
    const result = await wishModel.addFavorite(account_id, inv_id)

    if(result){
        req.flash("notice", "Vehicle added to your favorites!")
        res.redirect("/account/")
    }else{
        req.flash("notice", "Sorry, there was an error adding the favorite")
        return res.redirect(`/inv/detail/${inv_id}`)
    }    
}

/* ***********************
 * Process Remove Favorite
 * ***********************/
wishCont.removeFavorite = async function (req, res) {
    const wishlist_id = parseInt(req.params.wishlistId)
    const result = await wishModel.removeFavorite(wishlist_id)

    if(result){
        req.flash("notice", "Vehicle removed from your wishlist")
        res.redirect("/account/")
    }else {
        req.flash("notice", "Sorry, our hamsters couldn't remove the vehicle.")
        res.redirect("/account/")
    }
    
}

module.exports = wishCont