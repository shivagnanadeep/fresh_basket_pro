import './modal.css';
import Popup from 'reactjs-popup';
import { FaArrowRight } from 'react-icons/fa';
import { Component } from 'react';
import CartContext from '../../context/CartContext';
import Cookies from 'js-cookie';

class EachProduct extends Component {
	constructor(props) {
		super(props);
		const { product } = props;

		this.state = {
			product: product,
			errorVisible: false,
			buttonClicked: false,
			loading: false,
			actionResult: null,
			quantity: product.minQuantity,
		};
	}

	ModalContent = (close, addCartItem) => {
		const { product, errorVisible, buttonClicked, loading, actionResult } =
			this.state;
		const { name, pricePerUnit, unitQuantity, minQuantity } = product;

		const handleQuantityChange = (e) => {
			let currQuantity = Number(e.target.value);
			this.setState({
				quantity: currQuantity,
				errorVisible: currQuantity < minQuantity,
			});
		};

		const addToCartAction = async () => {
			const { _id } = product;
			const { quantity } = this.state;
			const productId = _id;
			const URL = 'http://localhost:5000/api/products/addToCart';
			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${Cookies.get('jwt_token')}`,
				},
				body: JSON.stringify({ productId, quantity }),
			};
			// console.log(product);

			try {
				this.setState({ loading: true, actionResult: null });

				const response = await fetch(URL, options);
				const data = await response.json();

				if (response.ok) {
					addCartItem({ product, quantity });
					this.setState({
						actionResult: (
							<div className="text-center w-full">
								<p className="text-xl text-green-600 font-semibold">
									{data.message}
								</p>
								<button
									onClick={() => {
										this.setState({
											errorVisible: false,
											buttonClicked: false,
											loading: false,
											actionResult: null,
										});
										close();
									}}
									className="mt-5 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-all duration-200"
								>
									Done ✅
								</button>
							</div>
						),
					});
				} else {
					this.setState({
						actionResult: (
							<div className="text-center w-full">
								<p className="text-xl text-red-600 font-semibold">
									{data.error}
								</p>
								<button
									onClick={() => {
										this.setState({
											errorVisible: false,
											buttonClicked: false,
											loading: false,
											actionResult: null,
										});
									}}
									className="mt-5 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-all duration-200"
								>
									Retry
								</button>
							</div>
						),
					});
				}
			} catch (error) {
				console.error(error);
				this.setState({
					actionResult: (
						<div className="text-center w-full">
							<p className="text-xl text-red-600 font-semibold">
								An error occurred.
							</p>
							<button
								onClick={() =>
									this.setState({
										errorVisible: false,
										buttonClicked: false,
										loading: false,
										actionResult: null,
									})
								}
								className="mt-5 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-all duration-200"
							>
								Retry
							</button>
						</div>
					),
				});
			} finally {
				this.setState({ loading: false });
			}
		};

		const handleConfirm = () => {
			this.setState({ buttonClicked: true });
			addToCartAction();
		};

		if (loading) {
			return (
				<div className="text-center w-full">
					<p>Loading...</p>
				</div>
			);
		}

		return buttonClicked && actionResult ? (
			actionResult
		) : (
			<div className="text-center w-full">
				<h2 className="text-2xl font-semibold mb-2">Add to Cart</h2>
				<p className="text-gray-600 mb-2">
					You're about to add <strong>{name}</strong> to your cart.
				</p>
				<p className="text-sm text-gray-500 mb-4">
					₹{pricePerUnit} / {unitQuantity}
				</p>

				<div className="flex flex-col items-center space-y-2">
					<label
						htmlFor="quantity"
						className="text-sm font-medium text-gray-700"
					>
						Quantity
					</label>
					<input
						id={`quantity-${name}`}
						type="number"
						min={minQuantity}
						defaultValue={minQuantity}
						onChange={handleQuantityChange}
						className="w-32 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-center"
					/>
					{errorVisible && (
						<p
							id={`error-${name}`}
							className="text-[red]"
						>
							*Minimum required: {minQuantity} {unitQuantity}
						</p>
					)}
				</div>

				<button
					id={`button-${name}`}
					onClick={handleConfirm}
					disabled={errorVisible}
					className="mt-5 px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
				>
					Confirm
				</button>
			</div>
		);
	};
	render() {
		const { product } = this.state;
		const { name, pricePerUnit, unitQuantity, category, imageUrl } = product;
		return (
			<CartContext.Consumer>
				{({ addCartItem }) => (
					<div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-transform duration-300">
						<img
							src={imageUrl}
							alt={name}
							className="w-[95%] h-40 object-cover rounded-lg mb-3"
						/>

						<h3 className="text-lg font-semibold text-center">{name}</h3>
						<p className="text-sm text-gray-500 capitalize">{category}</p>
						<p className="text-gray-800 font-medium mt-1">
							₹{pricePerUnit} / {unitQuantity}
						</p>

						<Popup
							key={product._id}
							trigger={
								<button className="mt-3 px-4 py-1 flex flex-row items-center gap-2 bg-gradient-to-r from-[#FF5F6D] to-[#FFC371] text-white font-semibold text-sm rounded-lg hover:shadow-md transition-all duration-300">
									<span>Buy It</span>
									<FaArrowRight className="text-[12px]" />
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

										{this.ModalContent(close, addCartItem)}
									</div>
								</div>
							)}
						</Popup>
					</div>
				)}
			</CartContext.Consumer>
		);
	}
}

export default EachProduct;
