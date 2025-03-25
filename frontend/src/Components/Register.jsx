import React from "react";
import Logo from "../assets/logo1.png";
import { FcGoogle } from "react-icons/fc";
import FirstLogo from "../assets/firstLogo.png";
import { Link } from "react-router-dom";

function Register() {
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

					<div className="space-y-4">
						<div>
							<label htmlFor="name" className="block text-gray-700">
								Full Name
							</label>
							<input
								id="name"
								type="text"
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
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mediumBlue"
							/>
						</div>

						<button className="w-full bg-mediumBlue text-white py-2 rounded-lg hover:bg-hoverBlue">
							Register
						</button>

						<p className="text-center text-gray-500">or</p>

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
