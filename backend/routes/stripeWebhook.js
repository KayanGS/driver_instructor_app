const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const bodyParser = require('body-parser');

router.post(
    '/webhook',
    bodyParser.raw({ type: 'application/json' }),
    async (req, res) => {
        const sig = req.headers['stripe-signature'];
        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // 🔔 Listen for successful payment
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            const url = new URL(session.success_url);
            const userId = url.searchParams.get('user');
            const packageType = url.searchParams.get('package');

            const tokenMap = {
                individual: 1,
                sixpack: 6,
                twelvepack: 12
            };

            try {
                const user = await User.findById(userId);
                if (user) {
                    user.user_tokens += tokenMap[packageType] || 0;
                    await user.save();
                    console.log(`✅ ${tokenMap[packageType]} token(s) added to ${user.user_email}`);
                }
            } catch (err) {
                console.error('Error updating user tokens:', err.message);
            }
        }

        res.json({ received: true });
    }
);

module.exports = router;
