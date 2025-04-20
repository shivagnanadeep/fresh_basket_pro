import Navbar from '../Navbar';
import { Link } from 'react-router-dom';

const HomePage = () => {
	return (
		<>
			<Navbar />
			<div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#A2E4F2] via-[#80deea] to-[#A2E4F2] p-6">
				{/* Heading with Modern Typography */}
				<h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 text-center font-serif tracking-wider">
					Welcome to Fresh Basket Pro 🥦🍎
				</h1>

				{/* Description Section */}
				<p className="text-lg md:text-xl text-gray-700 text-center max-w-2xl mb-10 leading-relaxed">
					Your one-stop shop for the freshest vegetables and fruits delivered
					right to your doorstep! Explore a wide variety of products and enjoy
					fast delivery.
				</p>
				<Link to="/products">
					<button className="bg-gradient-to-r from-[#FF5F6D] to-[#FFC371] text-white px-10 py-4 rounded-lg text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
						Shop Now
					</button>
				</Link>
			</div>
		</>
	);
};

export default HomePage;
