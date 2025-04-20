import Navbar from '../Navbar';
import CartListView from '../CartListView';

const Cart = () => {
	return (
		<>
			<Navbar />
			<div className="flex flex-col">
				<CartListView />
			</div>
		</>
	);
};
export default Cart;
