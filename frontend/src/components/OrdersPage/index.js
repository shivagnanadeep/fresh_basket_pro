import Navbar from '../Navbar';
import MyOrders from '../MyOrders';
const OrdersPage = () => {
	return (
		<>
			<Navbar />
			<div className="flex flex-col">
				<MyOrders />
			</div>
		</>
	);
};
export default OrdersPage;
