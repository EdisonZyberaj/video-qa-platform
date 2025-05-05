import React, { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";

function AdminRouteGuard() {
	const [isAdmin, setIsAdmin] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkAdminAccess = async () => {
			try {
				const token = sessionStorage.getItem("token");

				if (!token) {
					setIsAdmin(false);
					setLoading(false);
					return;
				}

				// shkojm tek endpointi i adminit , nqs kalon admin middleware ather po dmth jemi te loguar si admin
				await axios.get("http://localhost:5000/api/admin/stats", {
					headers: {
						Authorization: `Bearer ${token}`
					}
				});

				setIsAdmin(true);
			} catch (error) {
				console.error("Admin access check failed:", error);
				setIsAdmin(false);
			} finally {
				setLoading(false);
			}
		};

		checkAdminAccess();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mediumBlue" />
			</div>
		);
	}

	return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
}

export default AdminRouteGuard;
