import { Component } from 'react';
import { Link } from 'react-router-dom';

class RegisterPage extends Component {
	state = {
		fullname: '',
		email: '',
		mobile: '',
		password: '',
		confirmPassword: '',
		errorMsg: '',
		showSubmitError: false,
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
		} else if (password !== confirmPassword) {
			this.setState({
				showSubmitError: true,
				errorMsg: 'Passwords do not match.',
			});
		} else {
			const response = await fetch('http://localhost:5000/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ fullname, email, mobile, password }),
			});

			const data = await response.json();
			alert(data.message || data.error_msg);
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
							className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						>
							Register
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
