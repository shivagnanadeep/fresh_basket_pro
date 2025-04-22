import { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';
require('dotenv').config();
const API = process.env.API;

class LoginPage extends Component {
	state = {
		email: '',
		password: '',
		showError: false,
		errorMsg: '',
	};

	handleInputChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	handleSubmit = async (e) => {
		e.preventDefault();
		const { email, password } = this.state;
		const response = await fetch(`${API}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		});
		try {
			const data = await response.json();
			if (response.ok) {
				Cookies.set('jwt_token', data.jwt_token, { expires: 15 });
				const { history } = this.props;
				history.replace('/');
			} else {
				this.setState({ showError: true, errorMsg: data.error_msg });
			}
		} catch (e) {
			console.log(`ERROR : ${e}`);
		}
	};

	render() {
		const { email, password, showError, errorMsg } = this.state;
		if (Cookies.get('jwt_token')) {
			return <Redirect to="/" />;
		}

		return (
			<div className="flex flex-col md:flex-row h-screen items-center justify-center gap-x-[20px]">
				<img
					src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
					className="w-64 md:w-1/2 mb-6 md:mb-0"
					alt="login"
				/>
				<form
					className="w-full max-w-sm bg-white shadow-xl rounded-lg p-8"
					onSubmit={this.handleSubmit}
				>
					<h2 className="text-xl font-semibold mb-6 text-center">Login</h2>

					<label className="text-sm font-medium">Username</label>
					<input
						type="text"
						name="email"
						value={email}
						onChange={this.handleInputChange}
						className="w-full mt-1 mb-4 p-2 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>

					<label className="text-sm font-medium">Password</label>
					<input
						type="password"
						name="password"
						value={password}
						onChange={this.handleInputChange}
						className="w-full mt-1 mb-4 p-2 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>

					<button
						type="submit"
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
					>
						Login
					</button>

					{showError && (
						<p className="text-red-500 text-sm mt-2">*{errorMsg}</p>
					)}

					<p className="text-sm mt-4 text-center">
						New user?{' '}
						<Link
							to="/register"
							className="text-blue-600 hover:underline"
						>
							Register here
						</Link>
					</p>
				</form>
			</div>
		);
	}
}

export default LoginPage;
