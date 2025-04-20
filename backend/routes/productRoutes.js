const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const authenticateJwtToken = require('../middleware/authenticateJwtToken');

router.post('/', async (req, res) => {
	const { name, pricePerUnit, unitQuantity, category } = req.body;
	const oldProduct = await Product.findOne({ name: name });
	try {
		if (!oldProduct) {
			const newProduct = new Product({
				name,
				pricePerUnit,
				unitQuantity,
				category,
			});
			await newProduct.save();
			res.status(201).send(newProduct);
		} else {
			res.send('Item Already Exists');
		}
	} catch (e) {
		res.status(400).send(`Failed To Create Product : ${e}`);
	}
});

router.post('/addToCart', authenticateJwtToken, async (req, res) => {
	try {
		// console.log(req);
		const { productId, quantity } = req.body;
		const { email } = req.user;
		if (!productId || !quantity) {
			return res
				.status(400)
				.json({ error: 'Product Id and quantity are required' });
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ error: 'Product not found' });
		}

		const existingProductIndex = user.cart.findIndex(
			(item) => item.product.toString() === productId
		);

		if (existingProductIndex !== -1) {
			user.cart[existingProductIndex].quantity += quantity;
		} else {
			user.cart.push({ product: productId, quantity });
		}

		await user.save();
		res.status(200).json({
			message: 'Product added to cart successfully',
			cart: user.cart,
		});
	} catch (err) {
		res.status(500).json({ error: 'Internal server error' });
	}
});

router.get('/', authenticateJwtToken, async (req, res) => {
	const products = await Product.find();
	if (products.length != 0) {
		res.status(200).send(products);
	} else {
		res.send('Products List Is Empty');
	}
	// console.log(products);
});

router.post('/getCartProducts', authenticateJwtToken, async (req, res) => {
	const { email } = req.user;

	if (!email) {
		return res.status(400).json({ error: 'Email is missing in the request' });
	}

	try {
		const user = await User.findOne({ email }).populate('cart.product');
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		const cartProducts = user.cart.map((item) => ({
			product: item.product,
			quantity: item.quantity,
		}));

		res.status(200).json(cartProducts);
	} catch (err) {
		console.error('Error Fetching Cart Products:', err);
		res.status(500).json({ error: 'Server error' });
	}
});

router.delete(
	'/deleteCartItem/:productId',
	authenticateJwtToken,
	async (req, res) => {
		const { email } = req.user;
		const { productId } = req.params;

		try {
			const user = await User.findOne({ email });

			if (!user) return res.status(404).json({ error: 'User not found' });

			const originalLength = user.cart.length;

			// Filter out the product
			user.cart = user.cart.filter(
				(item) => item.product.toString() !== productId
			);

			// Check if anything changed
			if (user.cart.length === originalLength)
				return res.status(404).json({ error: 'Product not found in cart' });

			await user.save();
			res.status(200).json({ message: 'Item removed', cart: user.cart });
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: 'Server error' });
		}
	}
);

router.post('/setCartProducts', authenticateJwtToken, async (req, res) => {
	try {
		const email = req.user.email;
		const cartItems = req.body.cartItems;

		if (!Array.isArray(cartItems)) {
			return res.status(400).json({ message: 'cartItems should be an array' });
		}

		const user = await User.findOne({ email: email });
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		user.cart = cartItems;

		await user.save();

		return res
			.status(200)
			.json({ message: 'Cart updated successfully', cart: user.cart });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Internal server error' });
	}
});

module.exports = router;

// router.post('/getCartProducts', authenticateJwtToken, async (req, res) => {
// 	const { email } = req.user;

// 	if (!email) {
// 		return res.status(400).json({ error: 'Email is missing in the request' });
// 	}

// 	try {
// 		const user = await User.findOne({ email }).populate('cart.product');
// 		if (!user) {
// 			return res.status(404).json({ error: 'User not found' });
// 		}

// 		res.status(200).json(user.cart);
// 	} catch (err) {
// 		console.error('Error Fetching Cart Products:', err);
// 		res.status(500).json({ error: 'Server error' });
// 	}
// });
// router.post('/getAllProducts', authenticateJwtToken, async (req, res) => {
// 	try {
// 		const { productIds } = req.body;

// 		if (!Array.isArray(productIds) || productIds.length === 0) {
// 			return res
// 				.status(400)
// 				.json({ error: 'Product IDs must be a non-empty array' });
// 		}

// 		const products = await Product.find({
// 			_id: { $in: productIds },
// 		});

// 		res.status(200).json(products);
// 	} catch (error) {
// 		console.error('Error fetching products:', error);
// 		res.status(500).json({ error: 'Failed to fetch products' });
// 	}
// });

router.put('/:id', authenticateJwtToken, async (req, res) => {
	const { id } = req.params;
	const updatedData = req.body;
	try {
		const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
			new: true,
		});
		if (!updatedProduct) {
			res.status(404).send(`Product Not Found`);
		} else {
			res.status(200).send(updatedProduct);
		}
	} catch (e) {
		res.status(500).send(`SERVER ERROR : ${e}`);
	}
});

router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const deletedProduct = await Product.findByIdAndDelete(id);
		if (!deletedProduct) {
			res.status(404).send(`Product Not Found`);
		}
		res.status(200).send('Product Deleted Successfully');
	} catch (e) {
		res.status(500).send(`SERVER ERROR : ${e}`);
	}
});

module.exports = router;
