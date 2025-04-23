import { Component } from 'react';
import { Link } from 'react-router-dom';
const API = 'https://fresh-basket-pro-agrofix.onrender.com';

class RegisterPage extends Component {
	state = {
		fullname: '',
		email: '',
		mobile: '',
		password: '',
		confirmPassword: '',
		errorMsg: '',
		showSubmitError: false,
		isSubmitting: false,
	};

	onChangeField = (field) => (event) => {
		this.setState({ [field]: event.target.value });
	};

	submitForm = async (event) => {
		event.preventDefault();
		const { fullname, email, mobile, password, confirmPassword } = this.state;

		if (!fullname || !email || !mobile || !password || !confirmPassword) {
			this.setState({
				showSubmitError: true,
				errorMsg: 'All fields are required.',
			});
			return;
		} else if (password !== confirmPassword) {
			this.setState({
				showSubmitError: true,
				errorMsg: 'Passwords do not match.',
			});
			return;
		}

		this.setState({ isSubmitting: true });

		try {
			const response = await fetch(`${API}/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ fullname, email, mobile, password }),
			});
			const data = await response.json();
			alert(data.message || data.error_msg);
		} catch (error) {
			alert('Something went wrong. Please try again later.');
		} finally {
			this.setState({ isSubmitting: false });
		}
	};

	render() {
		const {
			fullname,
			email,
			mobile,
			password,
			confirmPassword,
			errorMsg,
			showSubmitError,
			isSubmitting,
		} = this.state;

		return (
			<div className="flex flex-col md:flex-row h-screen items-center justify-center bg-gray-100">
				<div className="md:w-1/2 w-full max-w-md p-8 shadow-lg bg-white rounded-lg">
					<h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
						Create Account
					</h2>
					<form
						onSubmit={this.submitForm}
						className="space-y-4 h-[80%]"
					>
						<div>
							<label className="text-sm font-medium text-gray-600">Name</label>
							<input
								type="text"
								value={fullname}
								onChange={this.onChangeField('fullname')}
								className="w-full px-4 py-2 mt-1 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
							/>
						</div>

						<div>
							<label className="text-sm font-medium text-gray-600">Email</label>
							<input
								type="email"
								value={email}
								onChange={this.onChangeField('email')}
								className="w-full px-4 py-2 mt-1 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
							/>
						</div>

						<div>
							<label className="text-sm font-medium text-gray-600">
								Mobile Number
							</label>
							<input
								type="tel"
								value={mobile}
								onChange={this.onChangeField('mobile')}
								className="w-full px-4 py-2 mt-1 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
							/>
						</div>

						<div>
							<label className="text-sm font-medium text-gray-600">
								Password
							</label>
							<input
								type="password"
								value={password}
								onChange={this.onChangeField('password')}
								className="w-full px-4 py-2 mt-1 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
							/>
						</div>

						<div>
							<label className="text-sm font-medium text-gray-600">
								Confirm Password
							</label>
							<input
								type="password"
								value={confirmPassword}
								onChange={this.onChangeField('confirmPassword')}
								className="w-full px-4 py-2 mt-1 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
							/>
						</div>

						<button
							type="submit"
							className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center"
							disabled={isSubmitting}
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
								'Register'
							)}
						</button>

						{showSubmitError && (
							<p className="text-red-500 text-sm mt-2 text-center">
								*{errorMsg}
							</p>
						)}

						<p className="text-sm text-gray-600 text-center mt-4">
							Already have an account?{' '}
							<Link
								to="/login"
								className="text-blue-600 hover:underline font-medium"
							>
								Login here
							</Link>
						</p>
					</form>
				</div>

				{/* Right Side Image */}
				<div className="hidden md:block md:w-1/2">
					<img
						src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
						alt="register"
						className="w-full h-full object-cover"
					/>
				</div>
			</div>
		);
	}
}

export default RegisterPage;
