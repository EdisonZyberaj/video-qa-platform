import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

function UserProfile() {
	const [user, setUser] = useState(null);
	const [activeTab, setActiveTab] = useState("details");
	const [successMessage, setSuccessMessage] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: ""
	});
	const [passwordError, setPasswordError] = useState(null);
	const [passwordSuccess, setPasswordSuccess] = useState("");

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				setLoading(true);
				const token = sessionStorage.getItem("token");

				if (!token) {
					setError("You are not authenticated. Please log in.");
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
				setError("Failed to fetch user profile. Please try again later.");
				setLoading(false);
			}
		};

		fetchUserProfile();
	}, []);

	const handleUpdateProfile = async e => {
		e.preventDefault();
		try {
			setLoading(true);
			const token = sessionStorage.getItem("token");

			if (!token) {
				setError("You are not authenticated. Please log in.");
				setLoading(false);
				return;
			}

			const response = await axios.put(
				"http://localhost:5000/api/user/update-profile",
				{
					name: user.name,
					last_name: user.last_name,
					email: user.email
				},
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			if (response.data.user) {
				setUser({
					...user,
					...response.data.user
				});
			}

			setSuccessMessage("Profile updated successfully!");
			setTimeout(() => setSuccessMessage(""), 3000);
			setLoading(false);
		} catch (error) {
			console.error("Error updating profile:", error);
			if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				setError(error.response.data.message);
			} else {
				setError("Failed to update profile. Please try again later.");
			}

			setLoading(false);
		}
	};

	const handlePasswordChange = e => {
		const { name, value } = e.target;
		setPasswordData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleChangePassword = async e => {
		e.preventDefault();
		setPasswordError(null);
		setPasswordSuccess("");

		if (passwordData.newPassword !== passwordData.confirmPassword) {
			setPasswordError("New passwords do not match");
			return;
		}

		try {
			setLoading(true);
			const token = sessionStorage.getItem("token");

			if (!token) {
				setPasswordError("You are not authenticated. Please log in.");
				setLoading(false);
				return;
			}

			await axios.post(
				"http://localhost:5000/api/user/change-password",
				passwordData,
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);

			setPasswordData({
				currentPassword: "",
				newPassword: "",
				confirmPassword: ""
			});

			setPasswordSuccess("Password changed successfully!");
			setTimeout(() => setPasswordSuccess(""), 3000);
			setLoading(false);
		} catch (error) {
			console.error("Error changing password:", error);

			if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				setPasswordError(error.response.data.message);
			} else {
				setPasswordError("Failed to change password. Please try again later.");
			}

			setLoading(false);
		}
	};

	const formatDate = dateString => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric"
		});
	};

	if (error) {
		return (
			<div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
				<Navbar />
				<main className="container px-4 py-8 flex-grow">
					<div className="text-center text-red-500">
						{error}
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	if (!user || loading) {
		return (
			<div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
				<Navbar />
				<main className="container px-4 py-8 flex-grow">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto" />
						<p className="mt-4 text-gray-600">Loading...</p>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white ">
			<Navbar />

			<main className=" mx-auto container px-4 py-8 flex-grow">
				<div className="mx-auto max-w-4xl">
					<div className="mx-auto bg-white rounded-lg shadow-md p-6 mb-6 border-t-4 border-blue-600">
						<div className="flex items-center justify-between mb-6">
							<h1 className="text-3xl font-bold text-gray-800">Your Profile</h1>
							{successMessage &&
								<div className="bg-green-100 text-green-700 px-4 py-2 rounded-md">
									{successMessage}
								</div>}
						</div>

						<div className="flex flex-col md:flex-row items-start md:items-center gap-4 py-2">
							<div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-600 text-white text-xl font-bold">
								{user.name.charAt(0)}
								{user.last_name.charAt(0)}
							</div>
							<div className="flex-grow">
								<h2 className="text-2xl font-bold text-gray-800">
									{user.name} {user.last_name}
								</h2>
								<div className="flex flex-wrap items-center gap-3 mt-2">
									<span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 font-medium rounded-full text-sm">
										{user.role}
									</span>
									<span className="text-gray-600">
										Member since {formatDate(user.created_at)}
									</span>
								</div>
								<p className="text-gray-600 mt-1">
									{user.email}
								</p>
							</div>
						</div>
					</div>

					<div className="flex border-b border-gray-200 mb-6">
						<button
							className={`px-4 py-2 font-medium ${activeTab === "details"
								? "text-blue-600 border-b-2 border-blue-600"
								: "text-gray-600 hover:text-blue-600"}`}
							onClick={() => setActiveTab("details")}>
							Profile Details
						</button>
						<button
							className={`px-4 py-2 font-medium ${activeTab === "activity"
								? "text-blue-600 border-b-2 border-blue-600"
								: "text-gray-600 hover:text-blue-600"}`}
							onClick={() => setActiveTab("activity")}>
							Activity
						</button>
						<button
							className={`px-4 py-2 font-medium ${activeTab === "security"
								? "text-blue-600 border-b-2 border-blue-600"
								: "text-gray-600 hover:text-blue-600"}`}
							onClick={() => setActiveTab("security")}>
							Security
						</button>
					</div>

					{activeTab === "details" &&
						<div className="bg-white rounded-lg shadow-md p-6 mb-6">
							<h3 className="text-xl font-semibold mb-4 text-gray-800">
								Edit Profile
							</h3>
							<form onSubmit={handleUpdateProfile}>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											First Name
										</label>
										<input
											type="text"
											value={user.name}
											onChange={e => setUser({ ...user, name: e.target.value })}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
											required
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Last Name
										</label>
										<input
											type="text"
											value={user.last_name}
											onChange={e =>
												setUser({ ...user, last_name: e.target.value })}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
											required
										/>
									</div>
									<div className="md:col-span-2">
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Email
										</label>
										<input
											type="email"
											value={user.email}
											onChange={e =>
												setUser({ ...user, email: e.target.value })}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
											required
										/>
									</div>
								</div>
								<div className="flex gap-4">
									<button
										type="submit"
										disabled={loading}
										className={`px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition ${loading
											? "opacity-70 cursor-not-allowed"
											: ""}`}>
										{loading ? "Saving..." : "Save Changes"}
									</button>
									<button
										type="button"
										className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
										onClick={() => window.location.reload()}>
										Cancel
									</button>
								</div>
							</form>
						</div>}

					{activeTab === "activity" &&
						<div className="bg-white rounded-lg shadow-md p-6 mb-6">
							<h3 className="text-xl font-semibold mb-4 text-gray-800">
								Activity Summary
							</h3>
							<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
								<div className="bg-blue-50 rounded-lg p-4 text-center hover:shadow-md transition">
									<div className="text-3xl font-bold text-blue-600 mb-1">
										{user.surveysCount || 0}
									</div>
									<div className="text-sm text-gray-600">Surveys</div>
								</div>
								<div className="bg-blue-50 rounded-lg p-4 text-center hover:shadow-md transition">
									<div className="text-3xl font-bold text-blue-600 mb-1">
										{user.questionsCount || 0}
									</div>
									<div className="text-sm text-gray-600">Questions</div>
								</div>
								<div className="bg-blue-50 rounded-lg p-4 text-center hover:shadow-md transition">
									<div className="text-3xl font-bold text-blue-600 mb-1">
										{user.answersCount || 0}
									</div>
									<div className="text-sm text-gray-600">Answers</div>
								</div>
								<div className="bg-blue-50 rounded-lg p-4 text-center hover:shadow-md transition">
									<div className="text-3xl font-bold text-blue-600 mb-1">
										{user.surveyVideosCount || 0}
									</div>
									<div className="text-sm text-gray-600">Survey Videos</div>
								</div>
							</div>

							<h4 className="text-lg font-semibold mb-3 text-gray-800">
								Recent Activity
							</h4>
							{user.recentActivity && user.recentActivity.length > 0
								? <div className="space-y-3">
										{user.recentActivity.map((activity, index) =>
											<div
												key={index}
												className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
												<p className="text-gray-800">
													{activity.description}
												</p>
												<p className="text-xs text-gray-500 mt-1">
													{formatDate(activity.date)}
												</p>
											</div>
										)}
									</div>
								: <div className="p-3 bg-gray-50 rounded-lg text-center">
										<p className="text-gray-600">
											No recent activity to display
										</p>
									</div>}
						</div>}

					{activeTab === "security" &&
						<div className="bg-white rounded-lg shadow-md p-6 mb-6">
							<h3 className="text-xl font-semibold mb-4 text-gray-800">
								Security Settings
							</h3>

							{/* Password Change Form */}
							<div className="border border-gray-200 rounded-lg p-4 mb-6">
								<h4 className="font-medium text-gray-800 mb-4">
									Change Password
								</h4>

								{passwordSuccess &&
									<div className="bg-green-100 text-green-700 px-4 py-2 rounded-md mb-4">
										{passwordSuccess}
									</div>}

								{passwordError &&
									<div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4">
										{passwordError}
									</div>}

								<form onSubmit={handleChangePassword} className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Current Password
										</label>
										<input
											type="password"
											name="currentPassword"
											value={passwordData.currentPassword}
											onChange={handlePasswordChange}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
											required
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											New Password
										</label>
										<input
											type="password"
											name="newPassword"
											value={passwordData.newPassword}
											onChange={handlePasswordChange}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
											required
											minLength="6"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Confirm New Password
										</label>
										<input
											type="password"
											name="confirmPassword"
											value={passwordData.confirmPassword}
											onChange={handlePasswordChange}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
											required
											minLength="6"
										/>
									</div>

									<button
										type="submit"
										disabled={loading}
										className={`px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition ${loading
											? "opacity-70 cursor-not-allowed"
											: ""}`}>
										{loading ? "Updating..." : "Update Password"}
									</button>
								</form>
							</div>

							{/* Additional Security Options (can be added later) */}
							<div className="border border-gray-200 rounded-lg p-4">
								<h4 className="font-medium text-gray-800 mb-2">
									Account Security
								</h4>
								<p className="text-gray-600 text-sm mb-4">
									Manage your account security settings
								</p>

								<div className="flex items-center justify-between py-2 border-b border-gray-100">
									<div>
										<p className="font-medium text-gray-700">
											Two-Factor Authentication
										</p>
										<p className="text-sm text-gray-500">
											Add an extra layer of security to your account
										</p>
									</div>
									<button
										className="px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition"
										disabled>
										Coming Soon
									</button>
								</div>

								<div className="flex items-center justify-between py-2">
									<div>
										<p className="font-medium text-gray-700">Login History</p>
										<p className="text-sm text-gray-500">
											View your recent login activity
										</p>
									</div>
									<button
										className="px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition"
										disabled>
										Coming Soon
									</button>
								</div>
							</div>
						</div>}
				</div>
			</main>
			<Footer />
		</div>
	);
}

export default UserProfile;
