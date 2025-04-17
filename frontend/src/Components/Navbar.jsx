import React, { useState } from "react";
import { Menu, X, PlusCircle, Bell, User } from "lucide-react";
import { Link } from "react-router-dom";
import ProtectedLink from "./ProtectedLink";
import logo from "../assets/logo.png";

function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="bg-darkBlue text-white p-4 shadow-lg">
			<div className="container mx-auto flex justify-between items-center">
				<Link to="/" className="text-xl font-bold">
					<img className="h-14 w-14" src={logo} alt="Logo" />
				</Link>
				<div className="hidden md:flex space-x-6">
					<ProtectedLink to="/surveys">My Surveys</ProtectedLink>
					<ProtectedLink to="/responder-surveys">
						Responder Surveys
					</ProtectedLink>
					<ProtectedLink to="/record">Record</ProtectedLink>
					<Link to="/">Home</Link>
				</div>
				<div className="hidden md:flex items-center space-x-4 ml-6">
					<ProtectedLink to="/notifications" className="hover:text-gray-400">
						<Bell size={20} />
					</ProtectedLink>
					<ProtectedLink to="/userProfile" className="hover:text-gray-400">
						<User size={20} />
					</ProtectedLink>
					<ProtectedLink
						to="/ask"
						className="bg-mediumBlue hover:bg-hoverBlue px-4 py-2 rounded-md flex items-center transition">
						<PlusCircle size={18} className="mr-1" />
						<span>Ask Question</span>
					</ProtectedLink>
				</div>
				<button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
					{isOpen ? <X size={24} /> : <Menu size={24} />}
				</button>
			</div>
			{isOpen &&
				<div className="md:hidden flex flex-col items-center space-y-4 mt-4">
					<ProtectedLink to="/questions">Questions</ProtectedLink>
					<ProtectedLink to="/record" className="hover:text-gray-400">
						Record
					</ProtectedLink>
					<ProtectedLink to="/surveys" className="hover:text-gray-400">
						My Surveys
					</ProtectedLink>
					<Link to="/" className="hover:text-gray-400">
						Home
					</Link>
					<ProtectedLink to="/userProfile" className="hover:text-gray-400">
						Profile
					</ProtectedLink>
					<ProtectedLink
						to="/ask"
						className="bg-mediumBlue hover:bg-hoverBlue px-4 py-2 rounded-md w-full text-center transition">
						Ask Question
					</ProtectedLink>
				</div>}
		</nav>
	);
}

export default Navbar;
