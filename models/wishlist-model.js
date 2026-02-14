const pool = require("../database/")

/* ************************
 * Add item to wishlist
 * ************************/

async function addFavorite(account_id, inv_id){
    try
    {
        const sql = "INSERT INTO wishlist (account_id, inv_id) VALUES ($1, $2) RETURNING *"
        return await pool.query(sql, [account_id, inv_id])
    } catch (error){
        return error.message
    }
}

/* ************************
 * Get wishlist with vehicle details
 * ************************/
async function getWishlistByAccountId(account_id) {
    try
    {
        const sql = `SELECT w.wishlist_id, i.inv_make, i.inv_model, i.inv_year, i.inv_thumbnail, i.inv_id FROM wishlist w JOIN inventory i ON w.inv_id = i.inv_id WHERE w.account_id =$1`
        const data = await pool.query(sql, [account_id])
        return data.rows
    } catch(error){
        return error.message
    }
}

/* ************************
 * Check if item is alredy on WL
 * ************************/

async function checkWishlist(account_id, inv_id) {
    try
    {
        const sql = "SELECT * FROM wishlist WHERE account_id = $1 AND inv_id = $2"
        const result = await pool.query(sql, [account_id, inv_id])
        return result.rowCount > 0
    } catch (error){
        return error.message
    }
}

/* ************************
 * Remove item from wishlist
 * ************************/
async function removeFavorite(wishlist_id) {
    try{
        const sql = "DELETE FROM wishlist WHERE wishlist_id = $1"
        return await pool.query(sql, [wishlist_id])
    }catch (error){
        return new Error("Delete Favorite Error")
    }
    
}

module.exports = {addFavorite, getWishlistByAccountId, checkWishlist, removeFavorite}