const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const authenticateJwtToken = require('../middleware/authenticateJwtToken');

// Create order
router.post('/', authenticateJwtToken, async (req, res) => {
	try {
		const userId = req.user._id;

		const { contact, address, products, totalAmount, paymentMode } = req.body;

		if (!products || products.length === 0) {
			return res
				.status(400)
				.json({ error: 'Order must include at least one item.' });
		}

		// 1. Create and save the new order
		const newOrder = new Order({
			buyer: userId,
			contact,
			address,
			products,
			totalAmount,
			paymentMode,
		});

		await newOrder.save();

		// 2. Fetch user and manually update orders array
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		user.orders.push(newOrder._id);
		await user.save();

		res.status(201).json({
			message: 'Order placed and added to user successfully',
			order: newOrder,
		});
	} catch (err) {
		console.error('Order creation error:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});
// Get all products of an orders
router.get('/', async (req, res) => {
	const orders = await Order.find().populate('products.product');
	res.send(orders);
});

router.post('/getAllOrders/', authenticateJwtToken, async (req, res) => {
	const { email } = req.user;

	if (!email) {
		return res.status(400).json({ error: 'Email is missing in the request' });
	}

	try {
		const user = await User.findOne({ email }).populate('orders.order');
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		res.status(200).json(user.orders);
	} catch (err) {
		console.error('Error fetching orders:', err);
		res.status(500).json({ error: 'Server error' });
	}
});

router.get('/:id', authenticateJwtToken, async (req, res) => {
	const { id } = req.params;
	const order = await Order.findById(id).populate('products.product');
	if (!id) {
		res.status(404).send('Order Not Found');
	} else {
		res.status(200).send(order);
	}
});

// Update order status
router.put('/:id', async (req, res) => {
	const { status } = req.body;
	const updated = await Order.findByIdAndUpdate(
		req.params.id,
		{ status },
		{ new: true }
	);
	res.send(updated);
});

router.delete('/:id', authenticateJwtToken, async (req, res) => {
	const { id } = req.params;
	try {
		const deletedOrder = await Order.findByIdAndDelete(id);
		if (!deletedOrder) {
			res.status(404).send(`Order Not Found`);
		}
		res.status(200).send('Order Deleted Successfully');
	} catch (e) {
		res.status(500).send(`SERVER ERROR : ${e}`);
	}
});

module.exports = router;
