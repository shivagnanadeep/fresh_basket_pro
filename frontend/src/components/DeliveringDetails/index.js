import { Component } from 'react';
import ProceedToBuy from '../ProceedToBuy';
import Cookies from 'js-cookie';
require('dotenv').config();
const API = process.env.API;

class DeliveringDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			address: '',
			city: '',
			district: '',
			state: '',
			pincode: '',
			phone: '',
			paymentType: '',
			cardNumber: '',
			expiry: '',
			cvv: '',
			isFormComplete: false,
		};
	}

	handleInputChange = (e) => {
		const { name, value } = e.target;
		this.setState(
			(prevState) => {
				return { [name]: value };
			},
			() => {
				this.checkFormCompletion();
			}
		);
	};

	checkFormCompletion = () => {
		const {
			name,
			address,
			city,
			district,
			state,
			pincode,
			phone,
			paymentType,
			cardNumber,
			expiry,
			cvv,
		} = this.state;

		const isComplete =
			name &&
			address &&
			city &&
			district &&
			state &&
			pincode &&
			phone &&
			paymentType &&
			(paymentType !== 'credit_card' || (cardNumber && expiry && cvv));

		this.setState({ isFormComplete: isComplete });
	};

	render() {
		const {
			name,
			address,
			city,
			district,
			state,
			pincode,
			phone,
			paymentType,
			cardNumber,
			expiry,
			cvv,
			isFormComplete,
		} = this.state;

		const handleConfirmOrder = async (cartList, emptyCart) => {
			const contact = phone.toString();
			const address1 = {
				name,
				line1: address,
				city,
				district,
				state,
				pincode,
			};
			const products = cartList;
			const totalAmount = cartList.reduce(
				(acc, item) => acc + item.quantity * item.product.pricePerUnit,
				0
			);

			const order = {
				contact,
				address: address1,
				products,
				paymentMode: paymentType,
				totalAmount,
			};
			// console.log(order);

			const URL = `${API}/api/orders`;
			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${Cookies.get('jwt_token')}`,
				},
				body: JSON.stringify(order),
			};

			try {
				const response = await fetch(URL, options);
				const { message, error } = await response.json();
				if (response.ok) {
					emptyCart();
					console.log(message);
				} else {
					console.log(error);
				}
			} catch (e) {
				console.log(`SERVER ERROR : ${e}`);
			}
		};

		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-10 px-4 flex justify-center items-start">
				<div className="w-full max-w-6xl bg-white shadow-xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Left: Delivery Info */}
					<div className="p-10 bg-white border-r border-gray-200">
						<h2 className="text-3xl font-semibold text-blue-700 mb-8 border-b pb-2">
							🚚 Delivery Information
						</h2>
						<form>
							{[
								{
									label: 'Full Name',
									id: 'name',
									value: name,
									placeholder: 'John Doe',
								},
								{
									label: 'Address',
									id: 'address',
									value: address,
									placeholder: '123 Main Street',
								},
								{
									label: 'City',
									id: 'city',
									value: city,
									placeholder: 'New York',
								},
								{
									label: 'District',
									id: 'district',
									value: district,
									placeholder: 'Manhattan',
								},
								{
									label: 'State',
									id: 'state',
									value: state,
									placeholder: 'New York',
								},
								{
									label: 'Pincode / Zip Code',
									id: 'pincode',
									value: pincode,
									placeholder: '10001',
								},
								{
									label: 'Phone Number',
									id: 'phone',
									value: phone,
									placeholder: '(123) 456-7890',
									type: 'tel',
								},
							].map(({ label, id, value, placeholder, type = 'text' }) => (
								<div
									className="mb-5"
									key={id}
								>
									<label
										htmlFor={id}
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										{label}
									</label>
									<input
										type={type}
										id={id}
										name={id}
										value={value}
										onChange={this.handleInputChange}
										placeholder={placeholder}
										autoComplete="off"
										className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
									/>
								</div>
							))}
						</form>
					</div>

					{/* Right: Payment Info */}
					<div className="p-10 bg-white">
						<h2 className="text-3xl font-semibold text-blue-700 mb-8 border-b pb-2">
							💳 Payment Information
						</h2>
						<form onSubmit={this.handleSubmit}>
							<div className="mb-5">
								<label
									htmlFor="paymentType"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Payment Method
								</label>
								<select
									id="paymentType"
									name="paymentType"
									value={paymentType}
									onChange={this.handleInputChange}
									autoComplete="off"
									className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
								>
									<option value="">-- Select Payment Type --</option>
									<option value="credit_card">Credit Card</option>
									<option value="paypal">PayPal</option>
									<option value="cod">Cash on Delivery</option>
								</select>
							</div>
							{paymentType === 'credit_card' && (
								<>
									<div className="mb-5">
										<label
											htmlFor="cardNumber"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Card Number
										</label>
										<input
											type="text"
											id="cardNumber"
											name="cardNumber"
											value={cardNumber}
											onChange={this.handleInputChange}
											placeholder="1234 5678 9012 3456"
											autoComplete="off"
											className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
										/>
									</div>
									<div className="flex gap-4 mb-5">
										<div className="w-1/2">
											<label
												htmlFor="expiry"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												Expiry Date
											</label>
											<input
												type="text"
												id="expiry"
												name="expiry"
												value={expiry}
												onChange={this.handleInputChange}
												placeholder="MM/YY"
												autoComplete="off"
												className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
											/>
										</div>
										<div className="w-1/2">
											<label
												htmlFor="cvv"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												CVV
											</label>
											<input
												type="password"
												id="cvv"
												name="cvv"
												value={cvv}
												onChange={this.handleInputChange}
												placeholder="123"
												autoComplete="off"
												className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
											/>
										</div>
									</div>
								</>
							)}
							{/* Only enable Proceed button if form is complete */}
							<ProceedToBuy
								userDetails={{
									name,
									address,
									city,
									district,
									state,
									pincode,
									phone,
									paymentType,
									cardNumber,
									expiry,
									cvv,
								}}
								isFormComplete={isFormComplete}
								handleConfirmOrder={handleConfirmOrder}
							/>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default DeliveringDetails;
