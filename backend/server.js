// import User from './models/User';
const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'MY_SECRET_KEY';

const clientOptions = {
	serverApi: {
		version: '1',
		strict: true,
		deprecationErrors: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
};

async function run() {
	try {
		const uri = process.env.MONGO_URI;
		// Create a Mongoose client with a MongoClientOptions object to set the Stable API version
		await mongoose.connect(uri, clientOptions);
		await mongoose.connection.db.admin().command({ ping: 1 });
		console.log(
			'Pinged your deployment. You successfully connected to MongoDB!'
		);
		const PORT = process.env.PORT || 5000;
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (e) {
		console.log(`DATABASE DISCONNECTED : ${e}`);
		await mongoose.disconnect();
		process.exit(1);
	}
}
run().catch(console.dir);

app.use('/api/products', require('./routes/productRoutes'));

app.use('/api/orders', require('./routes/orderRoutes'));

app.post('/register', async (req, res) => {
	const { fullname, password, email, mobile } = req.body;
	if (password.length < 6)
		return res.status(400).json({ error_msg: 'Password is too short' });

	const userExists = await User.findOne({ email });
	if (userExists)
		return res.status(400).json({ error_msg: 'User already exists' });

	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({
			fullname,
			email,
			mobile,
			password: hashedPassword,
		});
		await newUser.save();
		res.status(200).json({ message: 'User created successfully' });
	} catch (e) {
		res.status(500).json({ error_msg: 'Failed to create user' });
	}
});
app.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		const dbUser = await User.findOne({ email });
		if (!dbUser) return res.status(400).json({ error_msg: 'Invalid user' });

		const isMatched = await bcrypt.compare(password, dbUser.password);
		if (!isMatched)
			return res.status(400).json({ error_msg: 'Invalid password' });

		const payload = {
			userId: dbUser._id,
			user: dbUser,
		};
		const jwtToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '16d' });

		res.status(200).json({ jwt_token: jwtToken });
	} catch (e) {
		res.status(500).json({ error_msg: `Login failed: ${e.message}` });
	}
});

module.exports = app;
