import React, { useState } from "react";
import Logo from "../assets/logo1.png";
import { FcGoogle } from "react-icons/fc";
import FirstLogo from "../assets/firstLogo.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleLogin = async e => {
		e.preventDefault();
		setError("");

		const trimmedEmail = email.trim();
		const trimmedPassword = password.trim();

		if (!trimmedEmail || !trimmedPassword) {
			setError("All fields are required.");
			return;
		}

		if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
			setError("Invalid email format.");
			return;
		}

		if (trimmedPassword.length < 6) {
			setError("Password must be at least 6 characters.");
			return;
		}

		try {
			const response = await axios.post(
				"http://localhost:5000/api/auth/login",
				{
					email: trimmedEmail,
					password: trimmedPassword
				}
			);

			const data = response.data;
			if (response.ok) {
				navigate("/");
			} else if (response.status === 404) {
				setError("User does not exist. Please check your email.");
			} else if (response.status === 401) {
				setError("Incorrect password. Please try again.");
			} else {
				setError(data.message || "Login failed.");
			}
		} catch (err) {
			setError("An error occurred. Please try again.");
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-lightBlue px-4">
			<div className="flex bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
				<div className="w-1/2 p-8">
					<div className="flex flex-col items-center mb-6">
						<img
							src={FirstLogo}
							alt="Platform Logo"
							className="size-16 mb-4 rounded"
						/>
						<h1 className="text-2xl font-serif italic text-mediumBlue">
							Login to Platform
						</h1>
					</div>

					<form onSubmit={handleLogin} className="space-y-4">
						<div>
							<label htmlFor="email" className="block text-gray-700">
								Email
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={e => setEmail(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mediumBlue"
							/>
						</div>
						<div>
							<label htmlFor="password" className="block text-gray-700">
								Password
							</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={e => setPassword(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mediumBlue"
							/>
						</div>
						{error &&
							<p className="text-red-500 text-sm">
								{error}
							</p>}
						<button
							type="submit"
							className="w-full bg-mediumBlue text-white py-2 rounded-lg hover:bg-hoverBlue">
							Login
						</button>
					</form>

					<p className="text-center text-gray-500 mt-4">or</p>

					<button className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg hover:bg-gray-100">
						<FcGoogle className="mr-2 text-lg" />
						Login with Google
					</button>

					<p className="text-center text-gray-600 mt-4">
						Don't have an account?{" "}
						<Link to="/register" className="text-mediumBlue font-semibold">
							Sign up
						</Link>
					</p>
				</div>
				<div className="w-1/2 bg-lightBlue flex flex-col items-center justify-center p-6">
					<img src={Logo} alt="Logo" className="w-32 mb-4 rounded" />
					<p className="text-center text-gray-700 font-medium">
						Join our platform and get expert answers to your video-based
						questions.
					</p>
				</div>
			</div>
		</div>
	);
}

export default Login;
