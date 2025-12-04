// Create a new router
const express = require("express")
const router = express.Router()

// API route to get all books (with optional search, price range, and sorting)
router.get('/books', function (req, res, next) {
    
    // Get query parameters
    let searchTerm = req.query.search;
    let minPrice = req.query.minprice;
    let maxPrice = req.query.maxprice;
    let sortBy = req.query.sort;
    
    let sqlquery = "SELECT * FROM books";
    let conditions = [];
    let params = [];
    
    // Add search condition if search term exists
    if (searchTerm) {
        conditions.push("name LIKE ?");
        params.push('%' + searchTerm + '%');
    }
    
    // Add minimum price condition if minprice exists
    if (minPrice) {
        conditions.push("price >= ?");
        params.push(minPrice);
    }
    
    // Add maximum price condition if maxprice exists
    if (maxPrice) {
        conditions.push("price <= ?");
        params.push(maxPrice);
    }
    
    // If there are any conditions, add WHERE clause
    if (conditions.length > 0) {
        sqlquery += " WHERE " + conditions.join(" AND ");
    }
    
    // Add ORDER BY clause if sort parameter exists
    if (sortBy === 'name') {
        sqlquery += " ORDER BY name ASC";
    } else if (sortBy === 'price') {
        sqlquery += " ORDER BY price ASC";
    }
 
    // Execute the sql query
    db.query(sqlquery, params, (err, result) => {
        // Return results as a JSON object
        if (err) {
            res.json(err)
            next(err)
        }
        else {
            res.json(result)
        }
    })
})

// Export the router object so index.js can access it
module.exports = router
