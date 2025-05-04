import React, { useState, useEffect } from "react";
import { Edit, Trash2, Search, X, AlertCircle } from "lucide-react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

function AdminUsers() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [editingUser, setEditingUser] = useState(null);
	const [confirmDelete, setConfirmDelete] = useState(null);

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const token = sessionStorage.getItem("token");

			const response = await axios.get(
				"http://localhost:5000/api/admin/users",
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);

			setUsers(response.data);
			setError(null);
		} catch (error) {
			console.error("Error fetching users:", error);
			setError("Failed to load users. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateRole = async (userId, newRole) => {
		try {
			const token = sessionStorage.getItem("token");

			await axios.patch(
				`http://localhost:5000/api/admin/users/${userId}/role`,
				{ role: newRole },
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);

			setUsers(
				users.map(
					user => (user.user_id === userId ? { ...user, role: newRole } : user)
				)
			);

			setEditingUser(null);
		} catch (error) {
			console.error("Error updating user role:", error);
			alert("Failed to update user role. Please try again.");
		}
	};

	const handleDeleteUser = async userId => {
		try {
			const token = sessionStorage.getItem("token");

			await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			setUsers(users.filter(user => user.user_id !== userId));
			setConfirmDelete(null);
		} catch (error) {
			console.error("Error deleting user:", error);
			alert("Failed to delete user. Please try again.");
		}
	};

	const formatDate = dateString => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric"
		}).format(date);
	};

	const filteredUsers = users.filter(user => {
		const searchLower = searchTerm.toLowerCase();
		return (
			user.name.toLowerCase().includes(searchLower) ||
			user.last_name.toLowerCase().includes(searchLower) ||
			user.email.toLowerCase().includes(searchLower) ||
			user.role.toLowerCase().includes(searchLower)
		);
	});

	return (
		<AdminLayout title="User Management">
			<div className="bg-white p-4 rounded-lg shadow-md mb-6">
				<div className="flex items-center">
					<div className="relative flex-grow">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Search className="h-5 w-5 text-gray-400" />
						</div>
						<input
							type="text"
							placeholder="Search users..."
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-mediumBlue focus:border-mediumBlue"
						/>
						{searchTerm &&
							<button
								onClick={() => setSearchTerm("")}
								className="absolute inset-y-0 right-0 pr-3 flex items-center">
								<X className="h-4 w-4 text-gray-400" />
							</button>}
					</div>
				</div>
			</div>

			<div className="bg-white overflow-hidden rounded-lg shadow-md">
				{loading
					? <div className="flex justify-center items-center h-64">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mediumBlue" />
						</div>
					: error
						? <div className="flex justify-center items-center h-64">
								<div className="text-center">
									<AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
									<p className="text-red-500">
										{error}
									</p>
									<button
										onClick={fetchUsers}
										className="mt-4 px-4 py-2 bg-mediumBlue text-white rounded-md hover:bg-hoverBlue">
										Try Again
									</button>
								</div>
							</div>
						: <div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												User
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Email
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Role
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Joined
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Activity
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{filteredUsers.length > 0
											? filteredUsers.map(user =>
													<tr key={user.user_id} className="hover:bg-gray-50">
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="flex items-center">
																<div className="flex-shrink-0 h-10 w-10 bg-mediumBlue rounded-full flex items-center justify-center text-white font-bold">
																	{user.name.charAt(0)}
																	{user.last_name.charAt(0)}
																</div>
																<div className="ml-4">
																	<div className="text-sm font-medium text-gray-900">
																		{user.name} {user.last_name}
																	</div>
																	<div className="text-sm text-gray-500">
																		ID: {user.user_id}
																	</div>
																</div>
															</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="text-sm text-gray-900">
																{user.email}
															</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															{editingUser === user.user_id
																? <div className="flex items-center space-x-2">
																		<select
																			defaultValue={user.role}
																			onChange={e =>
																				handleUpdateRole(
																					user.user_id,
																					e.target.value
																				)}
																			className="text-sm text-gray-900 border border-gray-300 rounded-md p-1">
																			<option value="ASKER">ASKER</option>
																			<option value="RESPONDER">
																				RESPONDER
																			</option>
																			<option value="ADMIN">ADMIN</option>
																		</select>
																		<button
																			onClick={() => setEditingUser(null)}
																			className="text-gray-400 hover:text-gray-500">
																			<X size={16} />
																		</button>
																	</div>
																: <span
																		className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role ===
																		"ADMIN"
																			? "bg-purple-100 text-purple-800"
																			: user.role === "ASKER"
																				? "bg-blue-100 text-blue-800"
																				: "bg-green-100 text-green-800"}`}>
																		{user.role}
																	</span>}
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="text-sm text-gray-900">
																{formatDate(user.created_at)}
															</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
															<div className="flex space-x-2">
																<span title="Surveys">
																	{user._count.surveys} 📊
																</span>
																<span title="Questions">
																	{user._count.questions} ❓
																</span>
																<span title="Answers">
																	{user._count.answers} ✅
																</span>
																<span title="Videos">
																	{user._count.surveyVideos} 🎥
																</span>
															</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
															{confirmDelete === user.user_id
																? <div className="flex items-center justify-end space-x-2">
																		<button
																			onClick={() =>
																				handleDeleteUser(user.user_id)}
																			className="text-red-600 hover:text-red-900">
																			Confirm
																		</button>
																		<button
																			onClick={() => setConfirmDelete(null)}
																			className="text-gray-600 hover:text-gray-900">
																			Cancel
																		</button>
																	</div>
																: <div className="flex items-center justify-end space-x-2">
																		<button
																			onClick={() =>
																				setEditingUser(user.user_id)}
																			className="text-blue-600 hover:text-blue-900">
																			<Edit size={18} />
																		</button>
																		<button
																			onClick={() =>
																				setConfirmDelete(user.user_id)}
																			className="text-red-600 hover:text-red-900">
																			<Trash2 size={18} />
																		</button>
																	</div>}
														</td>
													</tr>
												)
											: <tr>
													<td
														colSpan="6"
														className="px-6 py-4 text-center text-gray-500">
														No users found matching your search.
													</td>
												</tr>}
									</tbody>
								</table>
							</div>}
			</div>
		</AdminLayout>
	);
}

export default AdminUsers;
