import React, { useState } from "react";
import Logo from "../assets/logo1.png";
import { FcGoogle } from "react-icons/fc";
import FirstLogo from "../assets/firstLogo.png";
import { Link, useNavigate } from "react-router-dom";

function Register() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\b(email|example|yourusername)\b).{6,}$/;

	const handleRegister = async e => {
		e.preventDefault();
		setError("");

		const trimmedName = name.trim();
		const trimmedEmail = email.trim();
		const trimmedPassword = password.trim();

		if (!trimmedName || !trimmedEmail || !trimmedPassword) {
			setError("All fields are required.");
			return;
		}

		if (!emailPattern.test(trimmedEmail)) {
			setError("Please enter a valid email address.");
			return;
		}

		if (trimmedPassword.length < 6) {
			setError("Password must be at least 6 characters.");
			return;
		}

		if (!passwordPattern.test(trimmedPassword)) {
			setError(
				"Password must contain at least one uppercase letter, one lowercase letter, one number, and cannot contain your email name."
			);
			return;
		}

		try {
			const response = await fetch("http://localhost:5000/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					name: trimmedName,
					email: trimmedEmail,
					password: trimmedPassword
				})
			});

			const data = await response.json();

			if (response.ok) {
				navigate("/login");
			} else if (response.status === 400) {
				setError("User already exists.");
			} else {
				setError(data.message || "Registration failed.");
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
						<h1 className="text-2xl font-serif text-mediumBlue">
							Create an Account
						</h1>
					</div>

					<form onSubmit={handleRegister} className="space-y-4">
						<div>
							<label htmlFor="name" className="block text-gray-700">
								Full Name
							</label>
							<input
								id="name"
								type="text"
								value={name}
								onChange={e => setName(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mediumBlue"
							/>
						</div>

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
							Register
						</button>
					</form>

					<p className="text-center text-gray-500 mt-4">or</p>

					<button className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg hover:bg-gray-100">
						<FcGoogle className="mr-2 text-lg" />
						Register with Google
					</button>

					<p className="text-center text-gray-600 mt-4">
						Already have an account?{" "}
						<Link to="/login" className="text-mediumBlue font-semibold">
							Login
						</Link>
					</p>
				</div>

				<div className="w-1/2 bg-lightBlue flex flex-col items-center justify-center p-6">
					<img src={Logo} alt="Logo" className="w-32 mb-4" />
					<p className="text-center text-gray-700 font-medium">
						Join our platform and start engaging in video-based Q&A today!
					</p>
				</div>
			</div>
		</div>
	);
}

export default Register;
