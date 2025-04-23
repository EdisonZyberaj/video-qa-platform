import React, { useState, useEffect } from "react";
import Logo from "../assets/logo1.png";
import { FcGoogle } from "react-icons/fc";
import FirstLogo from "../assets/firstLogo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
	const [name, setName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("ASKER");
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\b(email|example|yourusername)\b).{6,}$/;

	useEffect(
		() => {
			const token = sessionStorage.getItem("token");
			if (token) {
				toast.info(`You are already logged in.`, {
					position: "top-center",
					autoClose: 3000
				});
				navigate("/");
			}
		},
		[navigate]
	);

	const handleRegister = async e => {
		e.preventDefault();
		setError("");

		const trimmedName = name.trim();
		const trimmedLastName = lastName.trim();
		const trimmedEmail = email.trim();
		const trimmedPassword = password.trim();

		if (!trimmedName || !trimmedLastName || !trimmedEmail || !trimmedPassword) {
			toast.error("All fields are required.", {
				position: "top-center",
				autoClose: 3000
			});
			return;
		}

		if (!emailPattern.test(trimmedEmail)) {
			toast.error("Please enter a valid email address.", {
				position: "top-center",
				autoClose: 3000
			});
			return;
		}

		if (trimmedPassword.length < 6) {
			toast.error("Password must be at least 6 characters.", {
				position: "top-center",
				autoClose: 3000
			});
			return;
		}

		if (!passwordPattern.test(trimmedPassword)) {
			toast.error(
				"Password must contain at least one uppercase letter, one lowercase letter, one number, and cannot contain your email name.",
				{
					position: "top-center",
					autoClose: 3000
				}
			);
			return;
		}

		try {
			const response = await axios.post(
				"http://localhost:5000/api/auth/register",
				{
					name: trimmedName,
					lastName: trimmedLastName,
					email: trimmedEmail,
					password: trimmedPassword,
					role
				}
			);
			if (response.status === 201) {
				toast.success("You have registered successfully!", {
					position: "top-center",
					autoClose: 3000
				});

				setTimeout(() => {
					navigate("/login");
				}, 3000);
			}
		} catch (err) {
			toast.error("An error occurred. Please try again.", {
				position: "top-center",
				autoClose: 3000
			});
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
								First Name
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
							<label htmlFor="lastName" className="block text-gray-700">
								Last Name
							</label>
							<input
								id="lastName"
								type="text"
								value={lastName}
								onChange={e => setLastName(e.target.value)}
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

						<div>
							<label htmlFor="role" className="block text-gray-700">
								Role
							</label>
							<select
								id="role"
								value={role}
								onChange={e => setRole(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mediumBlue">
								<option value="ASKER">Asker</option>
								<option value="RESPONDER">Responder</option>
							</select>
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
