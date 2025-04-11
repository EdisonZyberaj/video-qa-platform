import React from "react";
import { Link } from "react-router-dom";
import { Linkedin, Twitter, Instagram } from "lucide-react";
import logo from "../assets/logo.png";

function Footer() {
	return (
		<footer className="bg-darkBlue text-white py-12">
			<div className="container mx-auto px-6 grid md:grid-cols-4 gap-8">
				<div>
					<div className="flex items-center mb-4">
						<img src={logo} alt="VideoQuery Logo" className="h-10 mr-3" />
						<h3 className="text-xl font-bold">Q&A Platform</h3>
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
					</ul>
					<div className="flex space-x-4 mt-4">
						<a
							href="https://www.linkedin.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-white hover:text-mediumBlue">
							<Linkedin className="w-6 h-6" />
						</a>
						<a
							href="https://www.twitter.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-white hover:text-mediumBlue">
							<Twitter className="w-6 h-6" />
						</a>
						<a
							href="https://www.instagram.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-white hover:text-mediumBlue">
							<Instagram className="w-6 h-6" />
						</a>
					</div>
				</div>
			</div>
			<div className="border-t border-gray-700 mt-8 pt-6 text-center">
				<p className="text-sm text-gray-400">
					© {new Date().getFullYear()} Q&A Platfrom. All Rights Reserved.
				</p>
			</div>
		</footer>
	);
}

export default Footer;
