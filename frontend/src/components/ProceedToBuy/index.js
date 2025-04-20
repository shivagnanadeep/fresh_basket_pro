import React, { Component } from 'react';
import Popup from 'reactjs-popup';
import { FaArrowRight, FaTimes } from 'react-icons/fa';
import CartContext from '../../context/CartContext';
import 'reactjs-popup/dist/index.css';

class ProceedToBuy extends Component {
	state = {
		orderPlaced: null, // Track the order status (null = no action, true = success, false = failure)
		loading: false, // Track loading state
	};

	renderInvoiceInitialContent = (
		close,
		cartList,
		emptyCart,
		userDetails,
		handleConfirmOrder
	) => {
		const totalAmount = cartList.reduce(
			(acc, item) => acc + item.quantity * item.product.pricePerUnit,
			0
		);

		if (this.state.orderPlaced === null) {
			return (
				<div
					className="animate-fadeInPop relative p-8 w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-300 transform transition duration-300 scale-100 animate__animated animate__fadeIn"
					style={{ maxHeight: '90vh', overflowY: 'auto' }}
				>
					<button
						type="button"
						className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
						onClick={close}
					>
						<FaTimes />
					</button>

					<h2 className="text-3xl font-extrabold mb-6 text-gray-800 border-b pb-3">
						🧾 Invoice Summary
					</h2>

					{/* Modal Layout */}
					<div className="flex gap-8">
						{/* Left Section: Delivery Information */}
						<div className="w-1/2 space-y-2 mb-6 border-r pr-8">
							<h3 className="font-semibold text-lg text-blue-700">
								Delivery Information
							</h3>
							<p>
								<span className="font-medium">Name:</span> {userDetails.name}
							</p>
							<p>
								<span className="font-medium">Address:</span>{' '}
								{userDetails.address}
							</p>
							<p>
								<span className="font-medium">City:</span> {userDetails.city}
							</p>
							<p>
								<span className="font-medium">District:</span>{' '}
								{userDetails.district}
							</p>
							<p>
								<span className="font-medium">State:</span> {userDetails.state}
							</p>
							<p>
								<span className="font-medium">Pincode:</span>{' '}
								{userDetails.pincode}
							</p>
							<p>
								<span className="font-medium">Phone:</span> {userDetails.phone}
							</p>

							<h3 className="font-semibold text-lg text-blue-700 mt-4">
								Payment Information
							</h3>
							<p>
								<span className="font-medium">Payment Type:</span>{' '}
								{userDetails.paymentType}
							</p>
							{userDetails.paymentType === 'credit_card' && (
								<>
									<p>
										<span className="font-medium">Card Number:</span>{' '}
										{userDetails.cardNumber}
									</p>
									<p>
										<span className="font-medium">Expiry:</span>{' '}
										{userDetails.expiry}
									</p>
								</>
							)}
						</div>

						{/* Right Section: Cart Items */}
						<div className="w-1/2 space-y-2 mb-6 pl-8">
							<h3 className="font-semibold text-lg text-blue-700">
								Cart Items
							</h3>
							<div className=" mb-6">
								<table className="min-w-full table-auto border-collapse">
									<thead>
										<tr>
											<th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
												Product
											</th>
											<th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
												Quantity
											</th>
											<th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
												Unit Price
											</th>
											<th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
												Total
											</th>
										</tr>
									</thead>
									<tbody>
										{cartList.map((item) => (
											<tr
												key={item.product._id}
												className="border-b"
											>
												<td className="px-4 py-2 text-sm text-gray-600">
													{item.product.name}
												</td>
												<td className="px-4 py-2 text-sm text-gray-600">
													{item.quantity} {item.product.unitQuantity}
												</td>
												<td className="px-4 py-2 text-sm text-gray-600">
													₹{item.product.pricePerUnit}
												</td>
												<td className="px-4 py-2 text-sm text-gray-600 font-semibold">
													₹{item.quantity * item.product.pricePerUnit}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>

					{/* Total and Confirm Button */}
					<div className="border-t pt-4 mt-6 text-right">
						<p className="text-xl font-bold">Total: ₹{totalAmount}</p>
					</div>

					{/* Confirm Button */}
					<div className="mt-8 flex justify-center">
						<button
							type="button"
							onClick={async () => {
								this.setState({ loading: true }); // Show loading spinner
								try {
									// Handle the order confirmation logic here
									await handleConfirmOrder(cartList, emptyCart);
									this.setState({ orderPlaced: true }); // Mark order as successful
								} catch (error) {
									this.setState({ orderPlaced: false }); // Mark order as failed
								} finally {
									this.setState({ loading: false }); // Hide loading spinner
								}
							}}
							className="text-center w-full py-3 bg-green-600 text-white rounded-xl font-semibold text-lg hover:bg-green-700 transition duration-200"
						>
							{this.state.loading ? (
								<div className="flex justify-center space-x-2">
									<div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></div>
									<div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce200"></div>
									<div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce400"></div>
								</div>
							) : (
								'Confirm & Place Order'
							)}
						</button>
					</div>
				</div>
			);
		}

		// Success View
		if (this.state.orderPlaced === true) {
			return (
				<div
					className="p-8 w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-300 transform transition duration-300 scale-100 animate__animated animate__fadeIn"
					style={{ maxHeight: '90vh', overflowY: 'auto' }}
				>
					<button
						type="button"
						className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
						onClick={close}
					>
						<FaTimes />
					</button>

					<h2 className="text-3xl font-extrabold mb-6 text-gray-800 border-b pb-3">
						✅ Order Successful!
					</h2>
					<p className="text-lg text-gray-600 mb-6">
						Your order has been successfully placed. Thank you for shopping with
						us!
					</p>

					<div className="mt-8 flex justify-center">
						<button
							type="button"
							onClick={() => (window.location.href = '/products')} // Redirect to products page
							className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition duration-200"
						>
							Done
						</button>
					</div>
				</div>
			);
		}

		// Failure View
		if (this.state.orderPlaced === false) {
			return (
				<div
					className="p-8 w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-300 transform transition duration-300 scale-100 animate__animated animate__fadeIn"
					style={{ maxHeight: '90vh', overflowY: 'auto' }}
				>
					<button
						type="button"
						className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
						onClick={close}
					>
						<FaTimes />
					</button>

					<h2 className="text-3xl font-extrabold mb-6 text-gray-800 border-b pb-3">
						❌ Order Failed
					</h2>
					<p className="text-lg text-gray-600 mb-6">
						Something went wrong. Please try placing the order again.
					</p>

					<div className="mt-8 flex justify-center">
						<button
							type="button"
							onClick={close} // Close the modal to retry
							className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold text-lg hover:bg-red-700 transition duration-200"
						>
							Retry
						</button>
					</div>
				</div>
			);
		}
	};

	render() {
		const { isFormComplete, userDetails, handleConfirmOrder } = this.props;

		return (
			<CartContext.Consumer>
				{({ cartList, emptyCart }) => (
					<Popup
						modal
						contentStyle={{
							background: 'transparent',
							border: 'none',
							padding: 0,
							maxHeight: '95vh',
							width: 'auto',
							overflowY: 'auto', // Ensures the modal is scrollable if content exceeds height
						}}
						overlayStyle={{
							background: 'rgba(0, 0, 0, 0.3)',
						}}
						trigger={({ open }) => (
							<button
								type="button"
								onClick={open}
								disabled={!isFormComplete} // Disable button if form is incomplete
								className={`w-full py-4 text-lg font-semibold bg-blue-600 text-white rounded-3xl flex justify-center items-center gap-4 hover:bg-blue-700 transition duration-300 ${
									!isFormComplete ? 'opacity-50 cursor-not-allowed' : ''
								}`}
							>
								Proceed to Buy
								<FaArrowRight />
							</button>
						)}
					>
						{(close) =>
							this.renderInvoiceInitialContent(
								close,
								cartList,
								emptyCart,
								userDetails,
								handleConfirmOrder
							)
						}
					</Popup>
				)}
			</CartContext.Consumer>
		);
	}
}

export default ProceedToBuy;
