// filepath: /backend/controllers/purchaseController.js

const Purchase = require('../models/Purchase');
const User = require('../models/User');

// Create a new purchase and update user's tokens
exports.createPurchase = async (req, res) => {
    try {
        const { user, purchase_date, purchase_package } = req.body;

        const userDoc = await User.findById(user);
        if (!userDoc) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Determine token quantity based on package
        let tokensToAdd = 0;
        if (purchase_package === 'individual') tokensToAdd = 1;
        else if (purchase_package === 'sixpack') tokensToAdd = 6;
        else if (purchase_package === 'twelvepack') tokensToAdd = 12;

        const newPurchase = new Purchase({
            user,
            purchase_date,
            purchase_package
        });

        await newPurchase.save();

        userDoc.user_tokens += tokensToAdd;
        await userDoc.save();

        res.status(201).json({
            message: 'Purchase successful and tokens updated',
            purchase: newPurchase
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating purchase', error: error.message });
    }
};

// Get all purchases
exports.getAllPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find().populate('user', 'user_name user_email');
        res.status(200).json(purchases);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching purchases', error: error.message });
    }
};

// Get purchase by ID
exports.getPurchaseById = async (req, res) => {
    try {
        const purchase = await Purchase.findById(req.params.id).populate('user', 'user_name user_email');
        if (!purchase) {
            return res.status(404).json({ message: 'Purchase not found' });
        }
        res.status(200).json(purchase);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching purchase', error: error.message });
    }
};

// Delete purchase
exports.deletePurchase = async (req, res) => {
    try {
        const purchase = await Purchase.findById(req.params.id);
        if (!purchase) {
            return res.status(404).json({ message: 'Purchase not found' });
        }
        await purchase.deleteOne();
        res.status(200).json({ message: 'Purchase deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting purchase', error: error.message });
    }
};