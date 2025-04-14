import React from "react";
import { Link, useNavigate } from "react-router-dom";

function ProtectedLink({ to, children, className }) {
	const navigate = useNavigate();

	const handleClick = e => {
		const token = sessionStorage.getItem("token");
		if (!token) {
			e.preventDefault();
			navigate("/login");
		}
	};

	return (
		<Link to={to} onClick={handleClick} className={className}>
			{children}
		</Link>
	);
}

export default ProtectedLink;
