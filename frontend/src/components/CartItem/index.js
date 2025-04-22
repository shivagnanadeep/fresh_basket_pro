import { Component } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import CartContext from '../../context/CartContext';
import Cookies from 'js-cookie';
import Popup from 'reactjs-popup';
import { ThreeDots } from 'react-loader-spinner';
const API = 'https://fresh-basket-pro-agrofix.onrender.com';

const API_STATUS_CONSTANTS = {
	initial: 'INITIAL',
	loading: 'LOADING',
	success: 'SUCCESS',
	failure: 'FAILURE',
};

class CartItem extends Component {
	state = { api_status: API_STATUS_CONSTANTS.initial };

	handleCartItemDelete = async () => {
		this.setState({ api_status: API_STATUS_CONSTANTS.loading });

		const { cartItem } = this.props;
		const { product } = cartItem;
		const { _id } = product;
		const URL = `${API}/api/products/deleteCartItem/${_id}`;
		const options = {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${Cookies.get('jwt_token')}`,
			},
		};

		try {
			const response = await fetch(URL, options);
			if (response.ok) {
				this.setState({ api_status: API_STATUS_CONSTANTS.success });
			} else {
				this.setState({ api_status: API_STATUS_CONSTANTS.failure });
			}
		} catch (error) {
			console.error('Delete Error:', error);
			this.setState({ api_status: API_STATUS_CONSTANTS.failure });
		}
	};

	renderInitialView = (deleteCartItem) => {
		const { cartItem } = this.props;
		const { product } = cartItem;

		return (
			<div className="p-6 bg-white rounded-xl shadow-xl w-full max-w-md text-center space-y-4">
				<h3 className="text-lg font-semibold text-gray-800">
					Remove from Cart
				</h3>
				<p className="text-gray-600">
					Do you sure you want to remove{' '}
					<span className="font-bold text-red-600">{product.name}</span> from
					your cart?
				</p>
				<button
					type="button"
					onClick={(e) => {
						this.handleCartItemDelete(deleteCartItem);
					}}
					className="mt-4 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
				>
					Confirm
				</button>
			</div>
		);
	};

	renderLoadingView = () => (
		<div className="p-6 bg-white rounded-xl shadow-xl w-full max-w-md text-center space-y-4">
			<h3 className="text-lg font-semibold text-gray-800">Deleting Item...</h3>
			<p className="text-gray-600">
				Please wait while we remove the item from your cart.
			</p>
			<div className="flex justify-center items-center mt-4">
				<ThreeDots
					height="60"
					width="60"
					color="#4F46E5"
					ariaLabel="three-dots-loading"
				/>
			</div>
		</div>
	);

	renderSuccessView = (deleteCartItem, close, _id) => (
		<div className="p-6 bg-white rounded-xl shadow-xl w-full max-w-md text-center space-y-4">
			<h3 className="text-lg font-semibold text-green-600">Item Removed</h3>
			<p className="text-gray-600">
				The item was successfully removed from your cart.
			</p>
			<button
				type="button"
				onClick={() => {
					deleteCartItem(_id);
					close();
				}}
				className="mt-4 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
			>
				Done
			</button>
		</div>
	);

	renderFailureView = (close) => (
		<div className="p-6 bg-white rounded-xl shadow-xl w-full max-w-md text-center space-y-4">
			<h3 className="text-lg font-semibold text-red-600">Failed to Remove</h3>
			<p className="text-gray-600">
				Something went wrong. Please try again later.
			</p>
			<button
				type="button"
				onClick={close}
				className="mt-4 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
			>
				Close
			</button>
		</div>
	);
	renderModalContent = (deleteCartItem, close, _id) => {
		const { api_status } = this.state;

		switch (api_status) {
			case API_STATUS_CONSTANTS.initial:
				return this.renderInitialView();
			case API_STATUS_CONSTANTS.loading:
				return this.renderLoadingView();
			case API_STATUS_CONSTANTS.success:
				return this.renderSuccessView(deleteCartItem, close, _id);
			case API_STATUS_CONSTANTS.failure:
				return this.renderFailureView(close);
			default:
				return null;
		}
	};

	render() {
		const { cartItem } = this.props;
		const { product, quantity } = cartItem;
		const {
			_id,
			name,
			pricePerUnit,
			imageUrl,
			unitQuantity,
			minQuantity,
			category,
		} = product;
		const totalPrice = minQuantity * pricePerUnit;

		return (
			<CartContext.Consumer>
				{({ deleteCartItem, increaseQuantity, decreaseQuantity }) => (
					<li className="flex flex-col lg:flex-row items-center justify-between gap-6 p-6 border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition duration-300 mb-6 bg-white">
						<div className="w-full lg:w-32 h-32 flex-shrink-0">
							<img
								src={imageUrl}
								alt={name}
								className="w-full h-full object-cover rounded-xl"
							/>
						</div>

						<div className="flex flex-col lg:flex-row justify-between items-start w-[75%] gap-6 lg:gap-8 ml-[40px]">
							<div className="flex flex-col flex-grow gap-3">
								<h2 className="text-xl font-semibold text-gray-800">{name}</h2>
								<span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium w-fit">
									{category}
								</span>
								<p className="text-sm text-gray-600">
									Price: <span className="font-medium">₹{pricePerUnit}</span> /{' '}
									{unitQuantity}
								</p>
							</div>

							<div className="flex flex-col justify-between items-start lg:items-center gap-4 lg:gap-6 min-w-[150px]">
								<div className="flex items-center space-x-2">
									<button
										onClick={() => {
											decreaseQuantity(_id);
										}}
										className="bg-red-100 hover:bg-red-200 text-red-600 font-bold px-3 py-1 rounded-full text-lg shadow-sm transition-all"
									>
										−
									</button>
									<span className="text-base font-semibold text-gray-800">
										{quantity}
									</span>
									<button
										onClick={() => {
											increaseQuantity(_id);
										}}
										className="bg-green-100 hover:bg-green-200 text-green-600 font-bold px-3 py-1 rounded-full text-lg shadow-sm transition-all"
									>
										+
									</button>
								</div>
								<p className="text-sm text-gray-500">
									Total:{' '}
									<span className="font-semibold text-gray-800 text-base">
										₹{totalPrice}
									</span>
								</p>
							</div>
						</div>

						{/* Render delete button and popup modal */}
						<Popup
							key={_id}
							trigger={
								<button className="flex-shrink-0 bg-transparent hover:bg-gray-100 text-gray-700 font-bold rounded-full p-3 lg:ml-6 transition-all duration-300 ease-in-out transform hover:scale-105">
									<AiOutlineClose size={24} />
								</button>
							}
							modal
							contentStyle={{
								width: '50vw',
								height: '50vh',
								background: 'transparent',
								padding: '0',
								borderRadius: '0px',
								overflow: 'hidden',
							}}
							overlayStyle={{
								background: 'rgba(0, 0, 0, 0.5)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
							onClose={() =>
								this.setState({ api_status: API_STATUS_CONSTANTS.initial })
							} // Reset to initial state when modal closes
						>
							{(close) => (
								<div className="animate-fadeInPop w-full h-full flex items-center justify-center">
									<div className="w-full h-full bg-white rounded-xl shadow-2xl p-6 relative flex flex-col items-center justify-center animate-fadeInPop">
										<button
											onClick={close}
											className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-black transition-colors"
											aria-label="Close"
										>
											&times;
										</button>

										{/* {this.renderModalContent(deleteCartItem, close)} */}
										{this.renderModalContent(deleteCartItem, close, _id)}
									</div>
								</div>
							)}
						</Popup>
					</li>
				)}
			</CartContext.Consumer>
		);
	}
}

export default CartItem;
