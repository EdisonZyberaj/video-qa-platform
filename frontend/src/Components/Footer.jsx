import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Footer() {
	return (
		<footer className="bg-darkBlue text-white py-12">
			<div className="container mx-auto px-6 grid md:grid-cols-4 gap-8">
				<div>
					<div className="flex items-center mb-4">
						<img src={logo} alt="VideoQuery Logo" className="h-10 mr-3" />
						<h3 className="text-xl font-bold">Q&A platform</h3>
					</div>
					<p className="text-sm text-gray-300">
						Connect with experts through personalized video Q&A experiences.
					</p>
				</div>
				<div>
					<h4 className="font-semibold mb-4">Quick Links</h4>
					<ul className="space-y-2">
						<li>
							<Link to="/" className="hover:text-mediumBlue">
								Home
							</Link>
						</li>
						<li>
							<Link to="/" className="hover:text-mediumBlue">
								How It Works
							</Link>
						</li>
						<li>
							<Link to="/faqs" className="hover:text-mediumBlue">
								FAQs
							</Link>
						</li>
					</ul>
				</div>
				<div>
					<h4 className="font-semibold mb-4">Legal</h4>
					<ul className="space-y-2">
						<li>
							<Link to="/terms" className="hover:text-mediumBlue">
								Terms of Service
							</Link>
						</li>
						<li>
							<Link to="/privacy" className="hover:text-mediumBlue">
								Privacy Policy
							</Link>
						</li>
					</ul>
				</div>
				<div>
					<h4 className="font-semibold mb-4">Contact Us</h4>
					<ul className="space-y-2">
						<li>support@qaplatform.com</li>
						<div className="flex space-x-4 mt-4">
							<Link to="/linkedin" className="text-white hover:text-mediumBlue">
								LinkedIn
							</Link>
							<Link to="/twitter" className="text-white hover:text-mediumBlue">
								Twitter
							</Link>
							<Link
								to="/instagram"
								className="text-white hover:text-mediumBlue">
								Instagram
							</Link>
						</div>
					</ul>
				</div>
			</div>
			<div className="border-t border-gray-700 mt-8 pt-6 text-center">
				<p className="text-sm text-gray-400">
					© {new Date().getFullYear()} VideoQuery. All Rights Reserved.
				</p>
			</div>
		</footer>
	);
}

export default Footer;
