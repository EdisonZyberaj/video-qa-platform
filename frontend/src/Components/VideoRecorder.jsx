import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, StopCircle, X } from "lucide-react";

function VideoRecorder({ onVideoRecorded, onCancel }) {
	const [recording, setRecording] = useState(false);
	const [paused, setPaused] = useState(false);
	const [videoBlob, setVideoBlob] = useState(null);
	const [videoURL, setVideoURL] = useState(null);
	const [timer, setTimer] = useState(0);

	const webcamRef = useRef(null);
	const mediaRecorderRef = useRef(null);
	const streamRef = useRef(null);
	const chunksRef = useRef([]);
	const timerRef = useRef(null);

	const formatTime = seconds => {
		const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
		const secs = (seconds % 60).toString().padStart(2, "0");
		return `${mins}:${secs}`;
	};

	useEffect(
		() => {
			return () => {
				if (timerRef.current) {
					clearInterval(timerRef.current);
				}

				if (streamRef.current) {
					streamRef.current.getTracks().forEach(track => track.stop());
				}

				if (videoURL) {
					URL.revokeObjectURL(videoURL);
				}
			};
		},
		[videoURL]
	);

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
			if (webcamRef.current) {
				webcamRef.current.srcObject = stream;
			}

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

			timerRef.current = setInterval(() => {
				setTimer(prev => prev + 1);
			}, 1000);
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

			if (webcamRef.current) {
				webcamRef.current.srcObject = null;
			}

			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
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

			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		}
	};

	const resumeRecording = () => {
		if (
			mediaRecorderRef.current &&
			mediaRecorderRef.current.state === "paused"
		) {
			mediaRecorderRef.current.resume();
			setPaused(false);

			timerRef.current = setInterval(() => {
				setTimer(prev => prev + 1);
			}, 1000);
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
	const handleUseVideo = () => {
		if (videoBlob) {
			onVideoRecorded(videoBlob);
		}
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<div className="flex justify-between items-center mb-4">
				<h3 className="font-medium text-darkBlue">Video Response</h3>
				<button
					onClick={onCancel}
					className="text-gray-500 hover:text-gray-700"
					aria-label="Close">
					<X size={20} />
				</button>
			</div>

			{videoURL
				? <div className="mb-4">
						<h4 className="font-medium text-darkBlue mb-2">
							Preview Your Recording
						</h4>
						<video
							src={videoURL}
							controls
							className="w-full h-auto rounded-lg mb-3 bg-gray-900 max-h-[300px]"
						/>
						<div className="flex flex-wrap gap-2">
							<button
								onClick={clearVideo}
								className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors text-sm">
								Discard & Re-record
							</button>
							<button
								onClick={handleUseVideo}
								className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors text-sm">
								Use This Video
							</button>
						</div>
					</div>
				: <div>
						<div className="bg-gray-900 relative rounded-lg overflow-hidden">
							{recording &&
								<div className="absolute top-2 right-2 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
									<span className="inline-block h-2 w-2 rounded-full bg-white mr-1 animate-pulse" />
									REC {formatTime(timer)}
								</div>}
							<video
								ref={webcamRef}
								autoPlay
								muted
								className="w-full h-auto max-h-[300px] object-cover"
							/>
						</div>

						<div className="flex flex-wrap gap-2 justify-center mt-4">
							{!recording &&
								<button
									onClick={startRecording}
									className="bg-mediumBlue hover:bg-hoverBlue text-white py-2 px-4 rounded-md flex items-center text-sm">
									<Play className="w-4 h-4 mr-2" />
									Start Recording
								</button>}

							{recording &&
								!paused &&
								<button
									onClick={pauseRecording}
									className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md flex items-center text-sm">
									<Pause className="w-4 h-4 mr-2" />
									Pause
								</button>}

							{recording &&
								paused &&
								<button
									onClick={resumeRecording}
									className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center text-sm">
									<Play className="w-4 h-4 mr-2" />
									Resume
								</button>}

							{recording &&
								<button
									onClick={stopRecording}
									className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center text-sm">
									<StopCircle className="w-4 h-4 mr-2" />
									Stop Recording
								</button>}
						</div>
					</div>}
		</div>
	);
}

export default VideoRecorder;
