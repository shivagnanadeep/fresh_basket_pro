const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	pricePerUnit: {
		type: Number,
		required: true,
	},
	category: {
		type: String,
		enum: ['vegetable', 'fruit'],
		default: 'vegetable',
	},
	unitQuantity: {
		type: String,
		enum: ['KG', 'DOZEN', 'PIECE'],
		default: 'KG',
	},
	imageUrl: {
		type: String,
		required: true,
	},
	minQuantity: {
		type: Number,
		required: true,
	},
});

module.exports = mongoose.model('Product', productSchema);
