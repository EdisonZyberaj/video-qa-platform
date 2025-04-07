import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

const VideoRecorder = () => {
	const webcamRef = useRef(null);
	const mediaRecorderRef = useRef(null);
	const streamRef = useRef(null);

	const [recording, setRecording] = useState(false);
	const [paused, setPaused] = useState(false);
	const [chunks, setChunks] = useState([]);
	const [videoURL, setVideoURL] = useState(null);
	const [timer, setTimer] = useState(0);

	useEffect(
		() => {
			let interval = null;

			if (recording && !paused) {
				interval = setInterval(() => {
					setTimer(t => t + 1);
				}, 1000);
			}

			return () => {
				if (interval) clearInterval(interval);
			};
		},
		[recording, paused]
	);

	const formatTime = seconds => {
		const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
		const secs = (seconds % 60).toString().padStart(2, "0");
		return `${mins}:${secs}`;
	};

	const startRecording = async () => {
		try {
			setVideoURL(null);
			setChunks([]);
			setTimer(0);

			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: false
			});

			streamRef.current = stream;

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
					setChunks(prev => [...prev, event.data]);
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
			const blob = new Blob(chunks, { type: "video/webm" });
			const url = URL.createObjectURL(blob);
			setVideoURL(url);

			if (streamRef.current) {
				streamRef.current.getTracks().forEach(track => track.stop());
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

	const downloadVideo = () => {
		if (!videoURL) return;

		const a = document.createElement("a");
		a.href = videoURL;
		a.download = `video-${Date.now()}.webm`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	const deleteVideo = () => {
		if (videoURL) {
			URL.revokeObjectURL(videoURL);
		}
		setVideoURL(null);
		setChunks([]);
		setTimer(0);
	};

	return (
		<div className="flex flex-col items-center gap-6 p-6 bg-lightBlue min-h-screen">
			<div className="bg-softBlue w-full max-w-3xl p-4 rounded-2xl shadow-lg">
				<h2 className="text-2xl font-bold mb-4 text-center text-darkBlue">
					CAMERA SECTION
				</h2>

				<Webcam
					audio={false}
					ref={webcamRef}
					mirrored={true}
					screenshotFormat="image/jpeg"
					className="w-full rounded-xl border border-mediumBlue"
					videoConstraints={{ facingMode: "user" }}
				/>

				<div className="text-right mt-2 text-lg font-semibold text-darkBlue">
					⏱️ Timer: {formatTime(timer)}
				</div>
			</div>
			<div className="flex flex-wrap gap-4 justify-center">
				{!recording &&
					<button
						onClick={startRecording}
						className="px-6 py-3 bg-mediumBlue hover:bg-hoverBlue text-white text-lg font-medium rounded-xl shadow-md">
						Start Recording
					</button>}

				{recording &&
					!paused &&
					<button
						onClick={pauseRecording}
						className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white text-lg font-medium rounded-xl shadow-md">
						Pause
					</button>}

				{recording &&
					paused &&
					<button
						onClick={resumeRecording}
						className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-medium rounded-xl shadow-md">
						Resume
					</button>}

				{recording &&
					<button
						onClick={stopRecording}
						className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-lg font-medium rounded-xl shadow-md">
						Stop Recording
					</button>}

				<button
					onClick={downloadVideo}
					className="px-6 py-3 bg-darkBlue hover:bg-hoverBlue text-white text-lg font-medium rounded-xl shadow-md"
					disabled={!videoURL}>
					Download Video
				</button>
			</div>

			{videoURL &&
				<div className="mt-6 w-full max-w-3xl">
					<h3 className="text-xl font-semibold mb-2 text-center text-darkBlue">
						Recorded Video Preview
					</h3>

					<video
						src={videoURL}
						controls
						className="w-full rounded-xl border border-mediumBlue mb-2"
					/>

					<div className="flex justify-center">
						<button
							onClick={deleteVideo}
							className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg">
							Delete Video
						</button>
					</div>
				</div>}
		</div>
	);
};

export default VideoRecorder;
