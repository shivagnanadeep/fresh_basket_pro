import { Link, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

const Navbar = (props) => {
	const onClickLogout = () => {
		const { history } = props;
		Cookies.remove('jwt_token');
		history.replace('/login');
	};
	return (
		<nav className="flex justify-between items-center border-b-2 border-gray-300 w-full h-[75px] px-6 md:px-12 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
			<h1 className="text-3xl md:text-4xl font-bold font-serif text-white hover:text-gray-200 transition duration-300">
				Fresh Basket Pro
			</h1>

			<div className="w-auto flex flex-row items-center gap-6 md:gap-12">
				<ul className="flex flex-row gap-5 md:gap-8 text-white font-medium">
					<li className="text-[18px] hover:text-[#4EC0D9] transition-all duration-300 cursor-pointer transform hover:scale-105">
						<Link to="/">Home</Link>
					</li>
					<li className="text-[18px] hover:text-[#4EC0D9] transition-all duration-300 cursor-pointer transform hover:scale-105">
						<Link to="/products">Products</Link>
					</li>
					<li className="text-[18px] hover:text-[#4EC0D9] transition-all duration-300 cursor-pointer transform hover:scale-105">
						<Link to="/cart">Cart</Link>
					</li>
					<li className="text-[18px] hover:text-[#4EC0D9] transition-all duration-300 cursor-pointer transform hover:scale-105">
						<Link to="/orders">Orders</Link>
					</li>
				</ul>

				<button
					type="button"
					onClick={onClickLogout}
					className=" text-white text-sm md:text-base bg-blue-500  px-6 py-2 text-gray-800 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold"
				>
					LogOut
				</button>
			</div>
		</nav>
	);
};

export default withRouter(Navbar);
