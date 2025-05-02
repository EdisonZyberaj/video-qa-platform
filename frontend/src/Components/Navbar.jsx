import React, { useState, useEffect } from "react";
import axios from "axios";
import { Menu, X, PlusCircle, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const token = sessionStorage.getItem("token");
				if (!token) {
					setUser(null);
					setLoading(false);
					return;
				}

				const response = await axios.get(
					"http://localhost:5000/api/user/profile",
					{
						headers: {
							Authorization: `Bearer ${token}`
						}
					}
				);
				setUser(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching user profile:", error);
				setUser(null);
				setLoading(false);
			}
		};

		fetchUserProfile();
	}, []);

	const handleLogout = () => {
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("user_id");
		setUser(null);
		navigate("/login");
	};

	return (
		<div className="bg-darkBlue text-white p-4 shadow-lg">
			<div className="container mx-auto flex justify-between items-center">
				<div className="text-xl font-bold">
					<Link to="/">
						<img className="h-14 w-14" src={logo} alt="Logo" />
					</Link>
				</div>

				{/* Desktop Navigation */}
				<div className="hidden md:flex space-x-6">
					{user &&
						user.role === "ASKER" &&
						<div className="flex space-x-6">
							<Link to="/surveys">My Surveys</Link>
							<Link to="/">Home</Link>
						</div>}

					{user &&
						user.role === "RESPONDER" &&
						<div>
							<Link to="/responder-surveys">Responder Surveys</Link>
						</div>}
				</div>

				<div className="hidden md:flex items-center space-x-4 ml-6">
					{user &&
						<div className="flex items-center space-x-4">
							{/* User Profile Link */}
							<div>
								<Link to="/userProfile" className="hover:text-gray-400">
									<User size={20} />
								</Link>
							</div>

							{/* Add Survey Button - only for askers */}
							{user.role === "ASKER" &&
								<div>
									<Link
										to="/add-survey"
										className="bg-mediumBlue hover:bg-hoverBlue px-4 py-2 rounded-md flex items-center transition">
										<PlusCircle size={18} className="mr-1" />
										<span>Add Survey</span>
									</Link>
								</div>}

							{/* Logout Button */}
							<div>
								<button
									onClick={handleLogout}
									className="bg-white border border-mediumBlue text-mediumBlue hover:bg-lightBlue px-4 py-2 rounded-md transition-colors duration-300">
									Logout
								</button>
							</div>
						</div>}

					{!user &&
						!loading &&
						<div>
							<Link
								to="/login"
								className="bg-mediumBlue hover:bg-hoverBlue px-4 py-2 rounded-md transition">
								Login
							</Link>
						</div>}
				</div>

				{/* Mobile Menu Button */}
				<div className="md:hidden">
					<button onClick={() => setIsOpen(!isOpen)}>
						{isOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>
			</div>

			{/* Mobile Navigation */}
			{isOpen &&
				<div className="md:hidden flex flex-col items-center space-y-4 mt-4">
					{user &&
						user.role === "ASKER" &&
						<div className="flex flex-col items-center space-y-4 w-full">
							<div>
								<Link to="/surveys" className="hover:text-gray-400">
									My Surveys
								</Link>
							</div>
							<div>
								<Link to="/" className="hover:text-gray-400">
									Home
								</Link>
							</div>
						</div>}

					{user &&
						user.role === "RESPONDER" &&
						<div className="w-full text-center">
							<Link to="/responder-surveys" className="hover:text-gray-400">
								Responder Surveys
							</Link>
						</div>}

					{user &&
						<div className="flex flex-col items-center space-y-4 w-full">
							<div className="w-full text-center">
								<Link to="/userProfile" className="hover:text-gray-400">
									<User size={20} className="inline-block" />{" "}
									<span className="ml-1">Profile</span>
								</Link>
							</div>

							{user.role === "ASKER" &&
								<div className="w-full">
									<Link
										to="/add-survey"
										className="bg-mediumBlue hover:bg-hoverBlue px-4 py-2 rounded-md w-full text-center transition flex items-center justify-center">
										<PlusCircle size={18} className="mr-1" />
										<span>Add Survey</span>
									</Link>
								</div>}

							<div className="w-full">
								<button
									onClick={handleLogout}
									className="bg-white border border-mediumBlue text-mediumBlue hover:bg-lightBlue px-4 py-2 rounded-md w-full transition-colors duration-300">
									Logout
								</button>
							</div>
						</div>}

					{!user &&
						!loading &&
						<div className="w-full">
							<Link
								to="/login"
								className="bg-mediumBlue hover:bg-hoverBlue px-4 py-2 rounded-md w-full text-center transition block">
								Login
							</Link>
						</div>}
				</div>}
		</div>
	);
}

export default Navbar;
