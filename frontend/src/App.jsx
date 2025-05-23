import React from "react";
import "./App.css";
import Home from "./Components/Home.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login.jsx";
import Register from "./Components/Register.jsx";
import Questions from "./Components/Questions.jsx";
import UserProfile from "./Components/UserProfile.jsx";
import Surveys from "./Components/Surveys.jsx";
import ResponderSurveys from "./Components/ResponderSurveys.jsx";
import Survey from "./Components/Survey.jsx";
import Answers from "./Components/ResponderAnswers.jsx";
import SurveyResponders from "./Components/SurveyResponders.jsx";
import ResponderAnswers from "./Components/ResponderAnswers.jsx";
import AnswerQuestion from "./Components/AnswerQuestion.jsx";
import ResponderSurvey from "./Components/ResponderSurvey.jsx";
import AddSurvey from "./Components/AddSurvey.jsx";
import EditSurvey from "./Components/EditSurvey.jsx";

import AdminDashboard from "./Components/AdminDashboard.jsx";
import AdminUsers from "./Components/AdminUsers.jsx";
import AdminSurveys from "./Components/AdminSurveys.jsx";
import AdminRouteGuard from "./Components/AdminRouteGuard.jsx";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/questions" element={<Questions />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/userProfile" element={<UserProfile />} />
				<Route path="/surveys" element={<Surveys />} />
				<Route path="/add-survey" element={<AddSurvey />} />
				<Route path="/responder-surveys" element={<ResponderSurveys />} />
				<Route path="/surveys/:id" element={<Survey />} />
				<Route path="/survey/:id/answers" element={<Answers />} />
				<Route path="/survey/:id/responders" element={<SurveyResponders />} />
				<Route path="/responder-survey/:id" element={<ResponderSurvey />} />
				<Route
					path="/survey/:id/responder/:responderId"
					element={<ResponderAnswers />} //shfaq pergjigjet qe ka dhene nje responder
				/>
				<Route
					path="/survey/:id/question/:questionId/answer"
					element={<AnswerQuestion />}
				/>
				<Route path="surveys/:id/update-survey" element={<EditSurvey />} />

				<Route element={<AdminRouteGuard />}>
					<Route path="/admin" element={<AdminDashboard />} />
					<Route path="/admin/users" element={<AdminUsers />} />
					<Route path="/admin/surveys" element={<AdminSurveys />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
