const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
    const { userId, packageType } = req.body;

    const packageOptions = {
        individual: { price: 5000, quantity: 1 },       // €50.00
        sixpack: { price: 25000, quantity: 6 },
        twelvepack: { price: 50000, quantity: 12 }
    };

    const selected = packageOptions[packageType];
    if (!selected) {
        return res.status(400).json({ message: 'Invalid package selected' });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: `${packageType} lesson package`
                    },
                    unit_amount: selected.price,
                },
                quantity: 1
            }],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/booked-lessons?success=true&package=${packageType}&user=${userId}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase`,
        });

        res.status(200).json({ url: session.url });
    } catch (err) {
        console.error('Stripe error:', err);
        res.status(500).json({ message: 'Stripe payment error' });
    }
};
