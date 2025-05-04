import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
	LayoutDashboard,
	Users,
	FileQuestion,
	LogOut,
	Menu,
	X
} from "lucide-react";
import logo from "../assets/logo.png";

function AdminLayout({ children, title }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	const handleLogout = () => {
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("user_id");
		navigate("/login");
	};

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const navItems = [
		{ path: "/admin", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
		{ path: "/admin/users", icon: <Users size={20} />, label: "Users" },
		{
			path: "/admin/surveys",
			icon: <FileQuestion size={20} />,
			label: "Surveys"
		}
	];

	const isActive = path => {
		return location.pathname === path;
	};

	return (
		<div className="flex h-screen bg-gray-100">
			<button
				onClick={toggleSidebar}
				className="fixed z-50 bottom-4 right-4 p-2 rounded-full bg-mediumBlue text-white lg:hidden">
				{sidebarOpen ? <X size={24} /> : <Menu size={24} />}
			</button>

			{/* Sidebar */}
			<div
				className={`fixed inset-y-0 left-0 transform ${sidebarOpen
					? "translate-x-0"
					: "-translate-x-full"} lg:relative lg:translate-x-0 z-40 transition duration-200 ease-in-out lg:flex flex-col w-64 bg-darkBlue text-white`}>
				{/* Sidebar header */}
				<div className="p-4 border-b border-gray-700">
					<div className="flex items-center">
						<img src={logo} alt="Logo" className="h-10 w-10" />
						<h1 className="ml-2 text-xl font-bold">Admin Panel</h1>
					</div>
				</div>

				{/* Sidebar navigation */}
				<nav className="flex-1 overflow-y-auto py-4">
					<ul className="space-y-2 px-2">
						{navItems.map(item =>
							<li key={item.path}>
								<Link
									to={item.path}
									className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive(
										item.path
									)
										? "bg-mediumBlue"
										: "hover:bg-mediumBlue/20"}`}
									onClick={() => setSidebarOpen(false)}>
									{item.icon}
									<span>
										{item.label}
									</span>
								</Link>
							</li>
						)}
					</ul>
				</nav>

				{/* Sidebar footer */}
				<div className="p-4 border-t border-gray-700">
					<button
						onClick={handleLogout}
						className="flex items-center space-x-3 p-3 w-full rounded-lg hover:bg-red-500/20 transition-colors text-red-400 hover:text-white">
						<LogOut size={20} />
						<span>Logout</span>
					</button>
				</div>
			</div>

			{/* Main content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Page header */}
				<header className="bg-white shadow-sm z-10">
					<div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
						<h1 className="text-2xl font-bold text-darkBlue">
							{title}
						</h1>
					</div>
				</header>

				{/* Page content */}
				<main className="flex-1 overflow-y-auto bg-gray-100 p-4">
					<div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
						{children}
					</div>
				</main>
			</div>

			{/* Mobile overlay */}
			{sidebarOpen &&
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>}
		</div>
	);
}

export default AdminLayout;
