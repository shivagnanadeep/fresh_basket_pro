const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
	buyer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	contact: {
		type: String,
		required: true,
	},
	address: {
		name: { type: String, required: true },
		line1: { type: String, required: true },
		city: { type: String, required: true },
		district: { type: String },
		state: { type: String, required: true },
		pincode: { type: String, required: true },
	},
	products: [
		{
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Product',
				required: true,
			},
			quantity: { type: Number, required: true },
		},
	],
	paymentMode: {
		type: String,
		required: true,
	},
	totalAmount: {
		type: Number,
		required: true,
	},
	status: {
		type: String,
		enum: ['pending', 'processing', 'delivered'],
		default: 'pending',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
