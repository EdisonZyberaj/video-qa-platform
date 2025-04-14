import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import Intro from "../assets/intro.jpg";
import SignUp from "../assets/sign-up-icon.png";
import LinkImg from "../assets/shareable-link.png";
import qaImg from "../assets/q&a.png";

function Home() {
	return (
		<div className="bg-white min-h-screen">
			<Navbar />
			<section className="flex-col-reverse md:flex-row
                                flex bg-white text-black text-center py-25 	">
				<div className="container flex-col mx-auto px-6 mt-110 py-20 pl-20">
					<h1 className="text-4xl font-bold mb-10">
						Engage with Experts via Video Q&A
					</h1>
					<p className="text-lg mb-20 font-serif text-center md:text-left">
						"Skip the generic answers and connect face-to-face with experts.
						Submit your questions and receive personalized video responses,
						allowing you to learn directly from their experience. Get the
						insights you need, delivered in a clear and engaging format."
					</p>
					<Link
						to="/"
						className="bg-mediumBlue text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-hoverBlue">
						Get Started
					</Link>
				</div>
				<div className="w-full md:w-1/2 flex justify-center">
					<img
						src={Intro}
						alt="Intro"
						className="w-4/5 md:w-full max-w-sm md:max-w-md"
					/>
				</div>
			</section>
			<h1 className="border border-gray-50" />

			<h1 className="text-4xl py-5 text-darkBlue font-bold mb-10 text-center bg-white ">
				It's easy to start
			</h1>
			<section
				id="how-it-works"
				className="flex flex-col sm:flex-row bg-white text-black px-6 mt-110 py-20 pl-20">
				<div className="w-full md:w-1/2 max-w-md px-6 text-center md:text-left">
					<div className="text-mediumBlue font-semibold mb-4">STEP 1</div>
					<div className="flex flex-col items-center">
						<img
							className="w-[155px] h-[155px] object-contain mb-4"
							src={SignUp}
							alt="Sign Up Icon"
						/>
						<h2 className="text-2xl font-bold mb-6 text-darkBlue">
							Set up your profile
						</h2>
					</div>
					<p className="text-base mb-6 font-serif text-center md:text-left">
						Sign up, add your prices and you're ready to go! Now you can offer
						your followers personal feedback, advice, mentorship and answer
						their questions.
					</p>
				</div>

				<div className="w-full md:w-1/2 max-w-md px-6 text-center md:text-left">
					<div className="text-mediumBlue font-semibold mb-4">STEP 2</div>
					<div className="flex flex-col items-center">
						<img
							className="w-[155px] h-[155px] object-contain mb-4"
							src={LinkImg}
							alt="Link Icon"
						/>
						<h2 className="text-2xl font-bold mb-6 text-darkBlue">
							Get a shareable link
						</h2>
					</div>
					<p className="text-base mb-6 font-serif text-center md:text-left">
						Mention it in your videos, posts and everywhere else. The more you
						mention it, the more requests you get.
					</p>
				</div>

				<div className="w-full md:w-1/2 max-w-md px-6 text-center md:text-left">
					<div className="text-mediumBlue font-semibold mb-4">STEP 3</div>
					<div className="flex flex-col items-center">
						<img
							className="w-[155px] h-[155px] object-contain mb-4"
							src={qaImg}
							alt="Q&A Icon"
						/>
						<h2 className="text-2xl font-bold mb-6 text-darkBlue">
							Share your questions, get and give answers
						</h2>
					</div>
					<p className="text-base mb-6 font-serif text-center md:text-left">
						A platform where you can both seek knowledge and share your wisdom
						through video Q&A, interaction better than ever.
					</p>
				</div>
			</section>

			<section className="bg-gray-100">
				<h2 className="text-xl font-bold text-center mb-10 py-6">
					Why Choose our platform?
				</h2>
				<div className="grid py-6 md:grid-cols-3 gap-10 text-center mr-6 ">
					<div className="p-6 ml-6 bg-white shadow-lg rounded-lg">
						<h3 className="text-xl font-semibold mb-2">
							!？ Ask Video-Based Questions
						</h3>
						<p>Record and submit your questions easily.</p>
					</div>
					<div className="p-6 ml-6 bg-white shadow-lg rounded-lg">
						<h3 className="text-xl font-semibold mb-2"> ⌕ Expert Responses</h3>
						<p>Receive insightful video answers from experts.</p>
					</div>
					<div className="p-6 ml-6 bg-white shadow-lg rounded-lg">
						<h3 className="text-xl font-semibold mb-2">
							{" "}𒀭Seamless Experience
						</h3>
						<p>Fast and user-friendly video Q&A interaction.</p>
					</div>
				</div>
			</section>

			<section className="bg-gray-200 py-16">
				<h2 className="text-3xl text-darkBlue text-center mb-10">
					What Users Say
				</h2>
				<div className="container mx-auto text-center px-6 mt-110 pl-20 md:text-left">
					<p className="italic py-2">
						"This platform changed how I get expert advice. The video responses
						feel so personal and helpful!" - Dr. James Rodriguez, Research
						Scientist
					</p>
					<p className="italic py-2">
						"The video Q&A platform transformed my learning experience. Instead
						of dry text explanations, I get real people breaking down complex
						topics with visual demonstrations." - Elena, 22, College Student
					</p>
					<p className="italic py-2">
						"I've used the platform to get feedback on my design portfolio.
						Video critiques are so much more detailed and constructive than
						written comments." - Carlos, 29, Graphic Designer
					</p>
				</div>
			</section>
			<Footer />
		</div>
	);
}

export default Home;
