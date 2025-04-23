import './App.css';
import { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import CartContext from './context/CartContext';
import HomePage from './components/HomePage';
import AllProductsPage from './components/AllProductsPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Cart from './components/Cart';
import Cookies from 'js-cookie';
import DeliveringDetails from './components/DeliveringDetails';
import OrdersPage from './components/OrdersPage';

class App extends Component {
	state = {
		cartList: [],
	};
	setCartProducts = async () => {
		const { cartList } = this.state;
		const URL = 'http://localhost:5000/api/products/setCartProducts';

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${Cookies.get('jwt_token')}`,
			},
			body: JSON.stringify({
				cartItems: cartList,
			}),
		};

		try {
			const response = await fetch(URL, options);
			const result = await response.json();

			if (response.ok) {
				console.log('Cart updated successfully:', result);
			} else {
				console.error('Error updating cart:', result.message);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	getCartProducts = async () => {
		const URL = 'http://localhost:5000/api/products/getCartProducts';
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${Cookies.get('jwt_token')}`,
			},
		};
		try {
			const response = await fetch(URL, options);
			if (response.ok) {
				const products = await response.json();
				console.log(products);
				this.setState({ cartList: products });
			}
		} catch (e) {
			console.log(e);
		}
	};

	addCartItem = ({ product, quantity }) => {
		const { cartList } = this.state;
		const index = cartList.findIndex((each) => {
			return product._id === each.product._id;
		});
		if (index === -1) {
			this.setState((prevState) => ({
				cartList: [...prevState.cartList, { product, quantity }],
			}));
		} else {
			this.setState((prevState) => ({
				cartList: prevState.cartList.map((each) => {
					if (product._id === each.product._id) {
						return {
							...each,
							quantity: each.quantity + quantity,
						};
					}
					return each;
				}),
			}));
		}
	};

	increaseQuantity = (productId) => {
		this.setState(
			(prevState) => ({
				cartList: prevState.cartList.map((each) => {
					if (productId === each.product._id) {
						return {
							...each,
							quantity: each.quantity + 1,
						};
					}
					return each;
				}),
			}),
			() => {
				this.setCartProducts();
			}
		);
	};
	decreaseQuantity = (productId) => {
		this.setState(
			(prevState) => ({
				cartList: prevState.cartList.map((each) => {
					if (each.product._id === productId) {
						if (each.quantity > each.product.minQuantity) {
							return {
								...each,
								quantity: each.quantity - 1,
							};
						}
					}
					return each;
				}),
			}),
			() => {
				this.setCartProducts();
			}
		);
	};
	deleteCartItem = (productId) => {
		this.setState((prevState) => ({
			cartList: prevState.cartList.filter(
				(each) => each.product._id !== productId
			),
		}));
	};

	emptyCart = () => {
		this.setState({ cartList: [] }, () => {
			this.setCartProducts();
		});
	};

	componentDidMount() {
		this.getCartProducts();
	}
	render() {
		const { cartList } = this.state;

		return (
			<BrowserRouter>
				<CartContext.Provider
					value={{
						cartList,
						addCartItem: this.addCartItem,
						deleteCartItem: this.deleteCartItem,
						increaseQuantity: this.increaseQuantity,
						decreaseQuantity: this.decreaseQuantity,
						emptyCart: this.emptyCart,
					}}
				>
					<Switch>
						<Route
							exact
							path="/login"
							component={LoginPage}
						/>
						<Route
							exact
							path="/register"
							component={RegisterPage}
						/>
						<ProtectedRoute
							exact
							path="/"
							component={HomePage}
						/>
						<ProtectedRoute
							exact
							path="/products"
							component={AllProductsPage}
						/>
						<ProtectedRoute
							exact
							path="/cart"
							component={Cart}
						/>
						<ProtectedRoute
							exact
							path="/orders"
							component={OrdersPage}
						/>
						<ProtectedRoute
							exact
							path="/deliveringDetails"
							component={DeliveringDetails}
						/>
					</Switch>
				</CartContext.Provider>
			</BrowserRouter>
		);
	}
}
export default App;
