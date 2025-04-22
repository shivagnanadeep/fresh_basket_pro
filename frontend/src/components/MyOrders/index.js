import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { ThreeDots } from 'react-loader-spinner';
const API = 'https://fresh-basket-pro-agrofix.onrender.com';

class MyOrders extends Component {
	state = {
		orders: [],
		selectedOrderIndex: null,
		loading: true,
		error: null,
	};

	componentDidMount() {
		this.fetchOrders();
	}

	fetchOrders = async () => {
		this.setState({ loading: true, error: null });
		try {
			const res = await fetch(`${API}/api/orders/getAllOrders/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${Cookies.get('jwt_token')}`,
				},
			});
			const data = await res.json();
			if (res.ok) {
				// Initialize order details structure
				const enrichedOrders = data.map((order) => ({
					...order,
					details: null,
					loadingDetails: false,
				}));
				this.setState({ orders: enrichedOrders, loading: false });
			} else {
				this.setState({
					error: data.error || 'Failed to fetch orders',
					loading: false,
				});
			}
		} catch (err) {
			this.setState({
				error: 'Unable to connect to the server.',
				loading: false,
			});
		}
	};

	toggleOrderDetails = async (index, orderId) => {
		const { selectedOrderIndex, orders } = this.state;

		if (selectedOrderIndex === index) {
			this.setState({ selectedOrderIndex: null });
			return;
		}

		if (!orders[index].details) {
			const updatedOrders = [...orders];
			updatedOrders[index].loadingDetails = true;
			this.setState({ orders: updatedOrders, selectedOrderIndex: index });

			try {
				const res = await fetch(`${API}/api/orders/${orderId}`, {
					headers: {
						Authorization: `Bearer ${Cookies.get('jwt_token')}`,
					},
				});
				const data = await res.json();

				updatedOrders[index].details = data;
				updatedOrders[index].loadingDetails = false;

				this.setState({ orders: updatedOrders });
			} catch (err) {
				updatedOrders[index].loadingDetails = false;
				this.setState({ orders: updatedOrders });
			}
		} else {
			this.setState({ selectedOrderIndex: index });
		}
	};

	render() {
		const { orders, selectedOrderIndex, loading, error } = this.state;

		if (loading) {
			return (
				<div className="flex flex-col items-center justify-center min-h-[40vh]">
					<ThreeDots
						height="80"
						width="80"
						color="#3b82f6"
						ariaLabel="loading"
					/>
					<p className="text-blue-600 mt-4 text-lg">Loading your orders...</p>
				</div>
			);
		}

		if (error) {
			return (
				<div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
					<img
						src="https://cdn-icons-png.flaticon.com/512/463/463612.png"
						alt="Error"
						className="w-16 h-16 opacity-70"
					/>
					<h2 className="text-xl font-semibold text-gray-800">
						Something went wrong
					</h2>
					<p className="text-gray-600">{error}</p>
					<button
						onClick={this.fetchOrders}
						className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
					>
						Try Again
					</button>
				</div>
			);
		}

		return (
			<div className="p-8 w-[50%] mx-auto">
				<h2 className="text-3xl font-semibold text-gray-800 mb-6">
					🧾 My Orders
				</h2>
				{orders.length === 0 ? (
					<p className="text-gray-500 text-center">No orders found.</p>
				) : (
					<div className="space-y-6">
						{orders.map((order, index) => (
							<div
								key={order._id}
								className="border border-gray-200 rounded-xl shadow-md p-6 bg-white hover:shadow-lg transition min-h-[80px]"
							>
								<div
									className="flex justify-between items-center cursor-pointer"
									onClick={() => this.toggleOrderDetails(index, order._id)}
								>
									<div>
										<p className="text-lg font-semibold text-gray-800">
											Order ID: {order._id}
										</p>
									</div>
									<span className="text-blue-600 font-medium hover:underline">
										{selectedOrderIndex === index ? 'Hide' : 'View'} Details
									</span>
								</div>

								{selectedOrderIndex === index && (
									<div className="mt-4 border-t pt-4 space-y-3">
										{order.loadingDetails ? (
											<p className="text-gray-500 text-sm">
												Loading details...
											</p>
										) : (
											<>
												<p className="text-sm text-gray-500">
													Status: {order.details.status}
												</p>
												{order.details &&
													order.details.products?.map((item, idx) => (
														<div
															key={idx}
															className="flex justify-between text-sm text-gray-700"
														>
															<div>
																<p className="font-medium">
																	{item.product.name}
																</p>
																<p className="text-xs text-gray-500">
																	Qty: {item.quantity} × ₹
																	{item.product.pricePerUnit}
																</p>
															</div>
															<p className="font-semibold">
																₹{item.quantity * item.product.pricePerUnit}
															</p>
														</div>
													))}
											</>
										)}
										{order.details && (
											<>
												<hr />
												<div className="flex justify-between font-semibold text-blue-700 pt-2">
													<span>Total:</span>
													<span>₹{order.details.totalAmount}</span>
												</div>
											</>
										)}
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		);
	}
}

export default MyOrders;
