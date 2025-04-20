import Navbar from '../Navbar';
import { Component } from 'react';
import { FiSearch } from 'react-icons/fi';
import Filters from '../Filters';
import EachProduct from '../EachProduct';
import Cookies from 'js-cookie';

class AllProductsPage extends Component {
	state = {
		searchInput: '',
		productsList: [
			// {
			// 	_id: '68023388c38ef42b778bf202',
			// 	id: 1,
			// 	name: 'Tomato',
			// 	pricePerUnit: 25,
			// 	category: 'vegetable',
			// 	unitQuantity: 'KG',
			// 	imageUrl:
			// 		'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg',
			// 	minQuantity: 10,
			// },
			// {
			// 	_id: '68023388c38ef42b778bf203',
			// 	id: 2,
			// 	name: 'Potato',
			// 	pricePerUnit: 20,
			// 	category: 'vegetable',
			// 	unitQuantity: 'KG',
			// 	imageUrl:
			// 		'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-144248.jpeg',
			// 	minQuantity: 10,
			// },
			// {
			// 	_id: '68023388c38ef42b778bf204',
			// 	id: 3,
			// 	name: 'Onion',
			// 	pricePerUnit: 30,
			// 	category: 'vegetable',
			// 	unitQuantity: 'KG',
			// 	imageUrl:
			// 		'https://images.pexels.com/photos/4197444/pexels-photo-4197444.jpeg',
			// 	minQuantity: 10,
			// },
		],
	};
	componentDidMount() {
		this.getProducts();
	}

	getProducts = async () => {
		const URL = 'http://localhost:5000/api/products/';
		const options = {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${Cookies.get('jwt_token')}`,
			},
		};
		try {
			const response = await fetch(URL, options);
			if (response.ok) {
				const fetchedData = await response.json();
				this.setState({ productsList: fetchedData });
			}
		} catch (e) {
			console.log(`ERROR : ${e}`);
		}
	};

	updateSearchInput = (e) => {
		this.setState({ searchInput: e.target.value });
	};

	renderSearchInput = () => {
		return (
			<div className="mb-6">
				<div className="h-[40px] w-[16rem] flex items-center gap-x-2 px-2 bg-white shadow-md rounded-lg transition duration-300">
					<input
						type="search"
						placeholder="Search..."
						onChange={this.updateSearchInput}
						className="w-[80%] px-3 py-1 bg-transparent outline-none text-gray-800 placeholder-gray-600 font-medium"
					/>
					<div className="w-[20%] flex justify-center items-center cursor-pointer hover:scale-105 transition-transform duration-300">
						<FiSearch className="text-[20px] text-gray-700 hover:text-gray-900" />
					</div>
				</div>
			</div>
		);
	};

	render() {
		const { searchInput, productsList } = this.state;

		const filteredProducts = productsList.filter((product) =>
			product.name.toLowerCase().includes(searchInput.toLowerCase())
		);

		return (
			<>
				<Navbar />
				<div className="flex w-[100vw] min-h-[100vh] bg-gradient-to-br from-[#e0f7fa] via-[#80deea] to-[#ffffff]">
					{/* Sidebar */}
					<div className="w-[25%] bg-red-100 p-4">
						<Filters />
					</div>

					{/* Main Content */}
					<div className="w-[75%] pt-[25px] pl-[40px] pr-[20px]">
						{/* Search Bar */}
						{this.renderSearchInput()}
						{/* Product Grid */}
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6">
							{filteredProducts.map((product, index) => (
								<EachProduct
									key={index}
									product={product}
								/>
							))}
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default AllProductsPage;
