//filepath: //backend/routes/purchase_routes.js
const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');

//Create a new purchase
router.post('/create', async (req, res) => {
    // Try to create a new purchase
    try {
        // Get purchases details from request body
        const { user, purchase_date, purchase_package } = req.body;
        // Create a new purchase
        const new_purchase = new Purchase({
            user, purchase_date, purchase_package
        });

        await new_purchase.save(); // Save the new purchase

        // Send a success response to the client
        res.status(200).json({
            message: 'Purchase created successfully',
            Purchase: new_purchase,
        });
        // If an error occurs, send an error response to the client
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all purchases
router.get('/', async (req, res) => {
    try {
        const purchases = await Purchase.find();
        res.json(purchases);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

