const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	fullname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		match: [/.+\@.+\..+/, 'Please enter a valid email'],
	},
	mobile: {
		type: String,
		required: true,
		match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number'],
	},
	password: {
		type: String,
		required: true,
	},
	orders: [
		{
			order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
		},
	],
	cart: [
		{
			product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
			quantity: Number,
		},
	],
});

module.exports = mongoose.model('User', userSchema);
