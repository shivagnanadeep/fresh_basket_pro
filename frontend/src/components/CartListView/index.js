import CartContext from '../../context/CartContext';
import CartItem from '../CartItem';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { FaArrowRight } from 'react-icons/fa';
import { withRouter } from 'react-router-dom';
const CartListView = ({ history }) => {
	return (
		<CartContext.Consumer>
			{(value) => {
				const { cartList } = value;

				return (
					<section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[80vh] flex flex-col">
						<h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
							My Cart ({cartList.length})
						</h1>

						{cartList.length > 0 ? (
							<div>
								<ul className="space-y-6">
									{cartList.map((each) => (
										<CartItem
											key={each._id}
											cartItem={each}
										/>
									))}
								</ul>
								<button
									type="button"
									onClick={() => history.push('/deliveringDetails')}
									className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium text-lg hover:bg-gray-800 transition"
								>
									Proceed To Buy <FaArrowRight />
								</button>
							</div>
						) : (
							<div className="flex flex-1 flex-col items-center justify-center text-center mt-12">
								<AiOutlineShoppingCart
									size={90}
									className="mb-5 text-gray-700"
								/>
								<p className="text-3xl font-bold text-gray-800">
									Your cart is empty
								</p>
								<p className="text-lg text-gray-700 mt-2 font-medium">
									Start adding your favorite items 🛍️
								</p>
								<button
									type="button"
									onClick={() => history.push('/products')}
									className="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow"
								>
									Continue Shopping
								</button>
							</div>
						)}
					</section>
				);
			}}
		</CartContext.Consumer>
	);
};

export default withRouter(CartListView);
