import React from "react";
import { useState } from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
	return (
		<BrowserRouter>
			<div className="flex flex-col min-h-screen">
				<Navbar />
				<Home />
				<Footer />
				<main className="flex-grow" />
			</div>
		</BrowserRouter>
	);
}

export default App;
