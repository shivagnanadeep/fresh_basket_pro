import { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';
const API = 'https://fresh-basket-pro-agrofix.onrender.com';

class LoginPage extends Component {
	state = {
		email: '',
		password: '',
		showError: false,
		errorMsg: '',
		isSubmitting: false,
	};

	handleInputChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	handleSubmit = async (e) => {
		e.preventDefault();
		this.setState({ isSubmitting: true });
		const { email, password } = this.state;

		try {
			const response = await fetch(`${API}/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});
			const data = await response.json();

			if (response.ok) {
				Cookies.set('jwt_token', data.jwt_token, { expires: 15 });
				const { history } = this.props;
				history.replace('/');
			} else {
				this.setState({ showError: true, errorMsg: data.error_msg });
			}
		} catch (e) {
			this.setState({ showError: true, errorMsg: 'Login failed. Try again.' });
			console.error(`ERROR: ${e}`);
		} finally {
			this.setState({ isSubmitting: false });
		}
	};

	render() {
		const { email, password, showError, errorMsg, isSubmitting } = this.state;

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

					<label className="text-sm font-medium">Email</label>
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
						disabled={isSubmitting}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex justify-center items-center"
					>
						{isSubmitting ? (
							<svg
								className="animate-spin h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
								></path>
							</svg>
						) : (
							'Login'
						)}
					</button>

					{showError && (
						<p className="text-red-500 text-sm mt-2 text-center">*{errorMsg}</p>
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
