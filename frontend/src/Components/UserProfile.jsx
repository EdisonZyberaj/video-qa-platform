import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

function UserProfile() {
	// duhet te merren te dhenat e userit nga databaza postgres
	const [user, setUser] = useState({
		user_id: 1,
		name: "Alex",
		last_name: "Johnson",
		email: "alex.johnson@example.com",
		role: "ADMIN",
		created_at: "2023-09-15T10:30:00Z",
		surveysCount: 12,
		questionsCount: 45,
		answersCount: 128,
		surveyVideosCount: 8
	});

	const [activeTab, setActiveTab] = useState("details");
	const [successMessage, setSuccessMessage] = useState(""); // per pergjigjen nga api
	const handleUpdateProfile = e => {
		e.preventDefault();
		// API call per UPDATE
		setSuccessMessage("Profile updated successfully!");
		setTimeout(() => setSuccessMessage(""), 3000);
	};

	const formatDate = dateString => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric"
		});
	};

	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
			<Navbar />

			<main className="container px-4 py-8  flex-grow">
				<div className="mx-15 px-10">
					<div className="bg-white rounded-lg shadow-md p-6 mb-6 border-t-4 border-blue-600">
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

					{/* kontrolli i tabs  */}
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
										/>
									</div>
								</div>
								<div className="flex gap-4">
									<button
										type="submit"
										className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
										Save Changes
									</button>
									<button
										type="button"
										className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition">
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
										{user.surveysCount}
									</div>
									<div className="text-sm text-gray-600">Surveys</div>
								</div>
								<div className="bg-blue-50 rounded-lg p-4 text-center hover:shadow-md transition">
									<div className="text-3xl font-bold text-blue-600 mb-1">
										{user.questionsCount}
									</div>
									<div className="text-sm text-gray-600">Questions</div>
								</div>
								<div className="bg-blue-50 rounded-lg p-4 text-center hover:shadow-md transition">
									<div className="text-3xl font-bold text-blue-600 mb-1">
										{user.answersCount}
									</div>
									<div className="text-sm text-gray-600">Answers</div>
								</div>
								<div className="bg-blue-50 rounded-lg p-4 text-center hover:shadow-md transition">
									<div className="text-3xl font-bold text-blue-600 mb-1">
										{user.surveyVideosCount}
									</div>
									<div className="text-sm text-gray-600">Survey Videos</div>
								</div>
							</div>

							<h4 className="text-lg font-semibold mb-3 text-gray-800">
								Recent Activity
							</h4>
							<div className="space-y-3">
								<div className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
									<p className="text-gray-800">
										Created a new survey: "Customer Feedback"
									</p>
									<p className="text-xs text-gray-500 mt-1">Today, 10:23 AM</p>
								</div>
								<div className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
									<p className="text-gray-800">
										Added 5 new questions to survey
									</p>
									<p className="text-xs text-gray-500 mt-1">
										Yesterday, 2:45 PM
									</p>
								</div>
								<div className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
									<p className="text-gray-800">Uploaded a new survey video</p>
									<p className="text-xs text-gray-500 mt-1">
										Apr 5, 2025, 9:15 AM
									</p>
								</div>
							</div>
						</div>}

					{activeTab === "security" &&
						<div className="bg-white rounded-lg shadow-md p-6 mb-6">
							<h3 className="text-xl font-semibold mb-4 text-gray-800">
								Security Settings
							</h3>
							<div className="space-y-6">
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg">
									<div className="mb-3 sm:mb-0">
										<h4 className="font-medium text-gray-800">
											Change Password
										</h4>
										<p className="text-sm text-gray-600 mt-1">
											Update your account password
										</p>
									</div>
									<button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
										Update Password
									</button>
								</div>
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg">
									<div className="mb-3 sm:mb-0">
										<h4 className="font-medium text-gray-800">
											Account Access
										</h4>
										<p className="text-sm text-gray-600 mt-1">
											Manage login sessions and access
										</p>
									</div>
									<button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition">
										View Details
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
