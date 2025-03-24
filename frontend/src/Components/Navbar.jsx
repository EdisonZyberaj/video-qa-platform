import React, { useState } from "react";
import { Menu, X, PlusCircle, Bell, User } from "lucide-react";
import { Link } from "react-router-dom";
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
					<Link to="/questions">Questions</Link>
					<Link to="/record">Record</Link>
					<Link to="/upload">Upload</Link>
				</div>
				<div className="hidden md:flex items-center space-x-4 ml-6">
					<Link to="/" className="hover:text-gray-400">
						<Bell size={20} />
					</Link>
					<Link to="/" className="hover:text-gray-400">
						<User size={20} />
					</Link>
					<Link
						to="/ask"
						className="bg-mediumBlue hover:bg-hoverBlue px-4 py-2 rounded-md flex items-center transition">
						<PlusCircle size={18} className="mr-1" />
						<span>Ask Question</span>
					</Link>
				</div>
				<button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
					{isOpen ? <X size={24} /> : <Menu size={24} />}
				</button>
			</div>
			{isOpen &&
				<div className="md:hidden flex flex-col items-center space-y-4 mt-4">
					<Link to="/questions">Questions</Link>
					<Link to="/record" className="hover:text-gray-400">
						Record
					</Link>
					<Link to="/upload" className="hover:text-gray-400">
						Upload
					</Link>
					<Link to="/" className="hover:text-gray-400">
						Notifications
					</Link>
					<Link to="/" className="hover:text-gray-400">
						Profile
					</Link>
					<Link
						to="/ask"
						className="bg-mediumBlue hover:bg-hoverBlue px-4 py-2 rounded-md w-full text-center transition">
						Ask Question
					</Link>
				</div>}
		</nav>
	);
}

export default Navbar;
