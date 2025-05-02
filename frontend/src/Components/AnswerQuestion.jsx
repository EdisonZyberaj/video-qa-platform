	import React, { useState, useEffect, useRef } from "react";
	import { useParams, useNavigate } from "react-router-dom";
	import axios from "axios";
	import Navbar from "./Navbar.jsx";
	import Footer from "./Footer.jsx";

	function AnswerQuestion() {
		const { id: surveyId, questionId } = useParams();
		const navigate = useNavigate();
		const [answer, setAnswer] = useState("");
		const [questionData, setQuestionData] = useState(null);
		const [loading, setLoading] = useState(true);
		const [submitting, setSubmitting] = useState(false);
		const [error, setError] = useState(null);
		const [hasExistingVideo, setHasExistingVideo] = useState(false);
		
		// Video recording state
		const [recording, setRecording] = useState(false);
		const [paused, setPaused] = useState(false);
		const [videoBlob, setVideoBlob] = useState(null);
		const [videoURL, setVideoURL] = useState(null);
		const [timer, setTimer] = useState(0);
		
		// Refs for video recording
		const webcamRef = useRef(null);
		const mediaRecorderRef = useRef(null);
		const streamRef = useRef(null);
		const chunksRef = useRef([]);

		useEffect(() => {
			const fetchQuestionDetails = async () => {
				try {
					const token = sessionStorage.getItem("token");
					const userId = sessionStorage.getItem("user_id");
					
					if (!token || !userId) {
						navigate("/login");
						return;
					}
					
					const config = {
						headers: {
							Authorization: `Bearer ${token}`
						}
					};
					
					// Fetch question details
					const questionsResponse = await axios.get(
						`http://localhost:5000/api/surveys/${surveyId}/questions`,
						config
					);

					const question = questionsResponse.data.find(
						q => q.question_id === parseInt(questionId)
					);

					if (!question) {
						setError("Question not found");
					} else {
						setQuestionData(question);
					}
					
					// Check if user already has a video for this survey
					try {
						const videoResponse = await axios.get(
							`http://localhost:5000/api/answers/survey/${surveyId}/video/${userId}`,
							config
						);
						
						if (videoResponse.data) {
							setHasExistingVideo(true);
						}
					} catch (videoErr) {
						// 404 means no video found which is expected
						if (videoErr.response?.status !== 404) {
							console.error("Error checking for video:", videoErr);
						}
					}
					
					// Check if this question has already been answered
					try {
						const userAnswersResponse = await axios.get(
							`http://localhost:5000/api/answers/survey/${surveyId}/responder/${userId}`,
							config
						);
						
						const existingAnswer = userAnswersResponse.data.find(
							answer => answer.questionId === parseInt(questionId)
						);
						
						if (existingAnswer) {
							setAnswer(existingAnswer.text);
						}
					} catch (answerErr) {
						console.log("Error checking answers:", answerErr.message);
					}

					setLoading(false);
				} catch (err) {
					console.error("Error fetching question details:", err);
					setError("An error occurred while fetching question details");
					setLoading(false);

					if (
						err.response &&
						(err.response.status === 401 || err.response.status === 403)
					) {
						navigate("/login");
					}
				}
			};

			fetchQuestionDetails();
		}, [surveyId, questionId, navigate]);

		// Timer effect for recording
		useEffect(() => {
			let interval = null;

			if (recording && !paused) {
				interval = setInterval(() => {
					setTimer(t => t + 1);
				}, 1000);
			}

			return () => {
				if (interval) clearInterval(interval);
			};
		}, [recording, paused]);

		const formatTime = seconds => {
			const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
			const secs = (seconds % 60).toString().padStart(2, "0");
			return `${mins}:${secs}`;
		};

		// Video recording functions
		const startRecording = async () => {
			try {
				setVideoURL(null);
				chunksRef.current = [];
				setTimer(0);

				const stream = await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: true
				});

				streamRef.current = stream;
				webcamRef.current.srcObject = stream;

				let recorder;
				try {
					recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
				} catch (e) {
					console.error("WebM not supported, falling back to default format", e);
					recorder = new MediaRecorder(stream);
				}

				mediaRecorderRef.current = recorder;

				recorder.ondataavailable = event => {
					if (event.data && event.data.size > 0) {
						chunksRef.current.push(event.data);
					}
				};

				recorder.start(1000);
				setRecording(true);
				setPaused(false);
			} catch (error) {
				console.error("Failed to start recording:", error);
				alert("Could not access camera. Please check permissions.");
			}
		};

		const stopRecording = () => {
			const mediaRecorder = mediaRecorderRef.current;

			if (!mediaRecorder || mediaRecorder.state === "inactive") {
				return;
			}

			mediaRecorder.onstop = () => {
				const blob = new Blob(chunksRef.current, { type: "video/webm" });
				setVideoBlob(blob);
				const url = URL.createObjectURL(blob);
				setVideoURL(url);

				if (streamRef.current) {
					streamRef.current.getTracks().forEach(track => track.stop());
				}
				
				webcamRef.current.srcObject = null;
			};

			mediaRecorder.stop();
			setRecording(false);
			setPaused(false);
		};

		const pauseRecording = () => {
			if (
				mediaRecorderRef.current &&
				mediaRecorderRef.current.state === "recording"
			) {
				mediaRecorderRef.current.pause();
				setPaused(true);
			}
		};

		const resumeRecording = () => {
			if (
				mediaRecorderRef.current &&
				mediaRecorderRef.current.state === "paused"
			) {
				mediaRecorderRef.current.resume();
				setPaused(false);
			}
		};

		const clearVideo = () => {
			if (videoURL) {
				URL.revokeObjectURL(videoURL);
			}
			setVideoURL(null);
			setVideoBlob(null);
			chunksRef.current = [];
			setTimer(0);
		};

		const handleSubmit = async () => {
			if (!answer.trim()) {
				setError("Answer cannot be empty");
				return;
			}
			
			if (!surveyId || !questionId) {
				setError("Survey or question information is missing");
				return;
			}

			setSubmitting(true);
			setError(null);

			try {
				const token = sessionStorage.getItem("token");
				const userId = sessionStorage.getItem("user_id");

				if (!token || !userId) {
					navigate("/login");
					return;
				}

				const config = {
					headers: {
						Authorization: `Bearer ${token}`
					}
				};

				
				// Format answer in the expected format
				const formattedAnswers = [{
					questionId: parseInt(questionId),
					text: answer,
					surveyId: parseInt(surveyId),
					authorId: parseInt(userId)
				}];

				// Create form data to handle the submission
				const formData = new FormData();
				formData.append("answers", JSON.stringify(formattedAnswers));

				// Append video if present and no existing video
				if (videoBlob && !hasExistingVideo) {
					// Create a File object from the Blob
					const videoFile = new File([videoBlob], `survey_${surveyId}_user_${userId}.webm`, {
						type: "video/webm"
					});
					formData.append("video", videoFile);
				}

				// Submit the answer
				const response = await axios.post(
					"http://localhost:5000/api/answers/submit",
					formData,
					config
				);

				console.log("Submission successful:", response.data);
				navigate(`/responder-survey/${surveyId}`);
			} catch (err) {
				console.error("Error submitting answer:", err);
				const errorMessage = err.response?.data?.error || "An error occurred while submitting your answer";
				setError(errorMessage);
				setSubmitting(false);

				if (
					err.response &&
					(err.response.status === 401 || err.response.status === 403)
				) {
					navigate("/login");
				}
			}
		};

		return (
			<div className="flex flex-col min-h-screen bg-gradient-to-b from-lightBlue/30 to-lightBlue/50">
				<Navbar />
				<main className="container mx-auto flex-grow py-12 px-4 max-w-3xl">
					{loading ? (
						<div className="flex justify-center items-center h-64">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mediumBlue" />
						</div>
					) : error ? (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
							<p>{error}</p>
						</div>
					) : (
						<div>
							<h1 className="text-2xl font-bold text-darkBlue mb-6">
								Answer Question
							</h1>
							<div className="bg-white p-6 rounded-lg shadow-md mb-6">
								<h2 className="text-xl font-semibold text-darkBlue mb-2">
									{questionData.title}
								</h2>
								<p className="text-sm text-gray-600 mb-4">
									Category: {questionData.category ? questionData.category.replace(/_/g, " ") : "Uncategorized"}
								</p>
								{hasExistingVideo && (
									<div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
										<p>You have already uploaded a video for this survey. You can still submit a text answer.</p>
									</div>
								)}
							</div>

							<textarea
								value={answer}
								onChange={e => setAnswer(e.target.value)}
								placeholder="Type your answer here..."
								className="w-full h-40 p-4 border border-lightBlue rounded-lg focus:outline-none focus:ring-2 focus:ring-mediumBlue mb-4"
								disabled={submitting}
							/>

							{/* Video Recording Section */}
							{!hasExistingVideo && (
								<div className="mb-6 border border-lightBlue rounded-lg p-4">
									<h3 className="text-lg font-semibold text-darkBlue mb-2">
										Add Video Response (Optional)
									</h3>
									
									{videoURL ? (
										<div className="mb-4">
											<video
												src={videoURL}
												controls
												className="w-full h-auto rounded"
											/>
											<button
												onClick={clearVideo}
												className="bg-red-500 text-white py-1 px-3 rounded mt-2 hover:bg-red-600">
												Remove Video
											</button>
										</div>
									) : (
										<div className="flex flex-col space-y-4">
											<div className="bg-gray-800 relative rounded overflow-hidden">
												{recording && (
													<div className="absolute top-2 right-2 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
														<span className="inline-block h-2 w-2 rounded-full bg-white mr-1 animate-pulse"></span>
														REC {formatTime(timer)}
													</div>
												)}
												<video 
													ref={webcamRef} 
													autoPlay 
													muted 
													className="w-full h-64 object-cover" 
												/>
											</div>
											
											<div className="flex flex-wrap gap-2 justify-center">
												{!recording && (
													<button
														onClick={startRecording}
														className="bg-mediumBlue hover:bg-hoverBlue text-white py-2 px-4 rounded-md">
														Start Recording
													</button>
												)}
												
												{recording && !paused && (
													<button
														onClick={pauseRecording}
														className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md">
														Pause
													</button>
												)}
												
												{recording && paused && (
													<button
														onClick={resumeRecording}
														className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md">
														Resume
													</button>
												)}
												
												{recording && (
													<button
														onClick={stopRecording}
														className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md">
														Stop Recording
													</button>
												)}
											</div>
										</div>
									)}
								</div>
							)}

							<button
								onClick={handleSubmit}
								disabled={submitting}
								className={`${
									submitting
										? "bg-gray-400"
										: "bg-mediumBlue hover:bg-hoverBlue"
								} text-white font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300 mt-6 flex items-center justify-center w-full`}>
								{submitting ? (
									<div className="flex items-center">
										<span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
										Submitting...
									</div>
								) : (
									"Submit Answer"
								)}
							</button>
						</div>
					)}
				</main>
				<Footer />
			</div>
		);
	}

	export default AnswerQuestion; 