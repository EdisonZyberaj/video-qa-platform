import React, { useState } from "react";
import Question from "./Question.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

function Questions() {
	const questions = [
		{
			id: 1,
			user: "Alice",
			question: "What is React?",
			questionType: "text",
			answer: "React is a JavaScript library for building user interfaces.",
			answerUser: "Bob",
			answerType: "text"
		},
		{
			id: 2,
			user: "Charlie",
			question: "How do you use state in React?",
			questionType: "text",
			answer:
				"You use the useState hook to manage state in functional components.",
			answerUser: "David",
			answerType: "text"
		},
		{
			id: 3,
			user: "Eve",
			question: "What is JSX?",
			questionType: "text",
			answer:
				"JSX is a syntax extension for JavaScript that looks similar to XML or HTML.",
			answerUser: "Frank",
			answerType: "text"
		},
		{
			id: 4,
			user: "Grace",
			question: "How does useEffect work?",
			questionType: "video",
			questionVideo: "video1.mp4",
			answer: "Here's a video explanation of useEffect.",
			answerUser: "Hank",
			answerType: "video",
			answerVideo: "video2.mp4"
		}
	];

	const [hoveredId, setHoveredId] = useState(null);

	return (
		<div className="bg-gray-100 min-h-screen">
			<Navbar />
			<div className="flex flex-wrap justify-between p-6">
				<div className="w-full lg:w-2/3 p-4 bg-white rounded-lg shadow-md">
					<h1 className="text-2xl font-bold mb-6 text-gray-800">
						Questions & Answers
					</h1>
					<div className="space-y-6">
						{questions.map(q =>
							//  best practise
							<Question
								key={q.id}
								user={q.user}
								question={q.question}
								questionType={q.questionType}
								questionVideo={q.questionVideo}
								answer={q.answer}
								answerUser={q.answerUser}
								answerType={q.answerType}
								answerVideo={q.answerVideo}
								hoveredId={hoveredId === q.id}
								setHoveredId={id => setHoveredId(id ? q.id : null)}
							/>
						)}
					</div>
				</div>
				<div className="w-full lg:w-1/3 bg-gray-200 p-6 mt-6 lg:mt-0 rounded-lg shadow-lg">
					<div className="mb-6">
						<h2 className="text-xl font-bold mb-2 flex items-center text-gray-800">
							<span className="w-10 h-10 bg-blue-500 rounded-full mr-2" />
							Interactive Q&A platform
						</h2>
						<p className="text-sm text-gray-600 mb-4">
							Passionate about revolutionizing the way people engage and share
							knowledge, our interactive video Q&A platform bridges the gap
							between curiosity and expertise. Designed for startups, educators,
							and communities, it fosters collaboration, innovation, and
							learning in a dynamic and engaging way.
						</p>
						<div className="flex items-center mb-4">
							<span className="mr-2">📍</span>
						</div>
					</div>
					<div className="border-t pt-4 border-gray-300">
						<h3 className="font-semibold mb-2 text-gray-800">Followers</h3>
						<p className="text-gray-600">249</p>
					</div>
					<div className="border-t pt-4 mt-4 border-gray-300">
						<h3 className="font-semibold mb-2 text-gray-800">Connect</h3>
						<div className="flex space-x-4">
							<a href="#" className="text-blue-600 hover:text-gray-800">
								✉️
							</a>
							<a href="#" className="text-blue-600 hover:text-gray-800">
								X
							</a>
							<a href="#" className="text-blue-600 hover:text-gray-800">
								📘
							</a>
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
}

export default Questions;
