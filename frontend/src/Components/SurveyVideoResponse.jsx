import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

function SurveyVideoResponse() {
  const { id: surveyId } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Video recording states
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [timer, setTimer] = useState(0);
  
  // Refs
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    const fetchSurveyDetails = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        const surveyResponse = await axios.get(
          `http://localhost:5000/api/surveys/${surveyId}`,
          config
        );
        
        setSurvey(surveyResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching survey details:", err);
        setError("An error occurred while fetching survey details");
        setLoading(false);
        
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate("/login");
        }
      }
    };
    
    fetchSurveyDetails();
    
    // Clean up function to stop all media tracks when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [surveyId, navigate]);

  // Timer effect
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

  // Format timer display
  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Set up media stream and start recording
  const startRecording = async () => {
    try {
      setVideoURL(null);
      chunksRef.current = [];
      setTimer(0);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true // Enable audio for better survey responses
      });

      streamRef.current = stream;
      
      // Display the stream in the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Create media recorder
      let recorder;
      try {
        recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      } catch (e) {
        console.error("WebM not supported, falling back to default format", e);
        recorder = new MediaRecorder(stream);
      }

      mediaRecorderRef.current = recorder;

      // Collect data chunks as they become available
      recorder.ondataavailable = event => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Start recording
      recorder.start(1000);
      setRecording(true);
      setPaused(false);
    } catch (error) {
      console.error("Failed to start recording:", error);
      setError("Could not access camera or microphone. Please check permissions.");
    }
  };

  // Stop recording and create video blob
  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;

    if (!mediaRecorder || mediaRecorder.state === "inactive") {
      return;
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { 
        type: "video/webm" 
      });
      setVideoBlob(blob);
      const url = URL.createObjectURL(blob);
      setVideoURL(url);

      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Clear the srcObject to hide the camera
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    mediaRecorder.stop();
    setRecording(false);
    setPaused(false);
  };

  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setPaused(true);
    }
  };

  // Resume recording
  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setPaused(false);
    }
  };

  // Delete the recorded video
  const deleteVideo = () => {
    if (videoURL) {
      URL.revokeObjectURL(videoURL);
    }
    setVideoURL(null);
    setVideoBlob(null);
    setTimer(0);
  };

  // Submit the video to the server
  const submitVideo = async () => {
    if (!videoBlob) {
      setError("Please record a video before submitting");
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
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      };

      // Create form data for the video upload
      const formData = new FormData();
      formData.append("surveyId", surveyId);
      
      // Create a File object from the Blob
      const videoFile = new File([videoBlob], `survey-${surveyId}-response-${Date.now()}.webm`, {
        type: videoBlob.type
      });
      formData.append("video", videoFile);

      // Send the video to the server
      await axios.post(
        "http://localhost:5000/api/answers/submit-video",
        formData,
        config
      );

      setSubmitSuccess(true);
      setTimeout(() => {
        navigate(`/surveys/${surveyId}`);
      }, 2000);
    } catch (err) {
      console.error("Error submitting video:", err);
      setError("An error occurred while submitting your video. Please try again.");
      setSubmitting(false);

      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
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
            <h1 className="text-2xl font-bold text-darkBlue mb-4">Video Response</h1>
            
            {/* Survey Info */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold text-darkBlue mb-2">{survey.title}</h2>
              <p className="text-gray-600 mb-4">{survey.description}</p>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="text-sm text-blue-700">
                  <span className="font-bold">Instructions:</span> Please record a video response for this survey. 
                  Make sure to address all questions in your video. Speak clearly and stay within a reasonable time limit.
                </p>
              </div>
            </div>

            {/* Video Recorder */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold text-darkBlue mb-4">Record Your Response</h3>
              
              <div className="bg-gray-100 rounded-lg p-4 mb-4 relative">
                {/* Video Element - Will show camera when recording or video preview when done */}
                <video 
                  ref={videoRef} 
                  className="w-full h-auto rounded-lg border border-gray-300 bg-black" 
                  autoPlay 
                  playsInline
                  muted={recording} // Mute when recording to prevent feedback
                  controls={!recording && videoURL !== null} // Only show controls for playback
                  src={videoURL || null}
                />
                
                {/* Timer Display */}
                {recording && (
                  <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full">
                    <span className="mr-1">⏱️</span>
                    {formatTime(timer)}
                  </div>
                )}
              </div>

              {/* Recording Controls */}
              <div className="flex flex-wrap gap-3 justify-center">
                {!recording && !videoURL && (
                  <button
                    onClick={startRecording}
                    className="px-6 py-3 bg-mediumBlue hover:bg-hoverBlue text-white font-medium rounded-xl shadow-md flex items-center"
                    disabled={submitting}
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                    </svg>
                    Start Recording
                  </button>
                )}

                {recording && (
                  <>
                    {!paused ? (
                      <button
                        onClick={pauseRecording}
                        className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-xl shadow-md flex items-center"
                        disabled={submitting}
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
                        </svg>
                        Pause
                      </button>
                    ) : (
                      <button
                        onClick={resumeRecording}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl shadow-md flex items-center"
                        disabled={submitting}
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                        </svg>
                        Resume
                      </button>
                    )}
                    
                    <button
                      onClick={stopRecording}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-md flex items-center"
                      disabled={submitting}
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd"></path>
                      </svg>
                      Stop Recording
                    </button>
                  </>
                )}

                {videoURL && (
                  <button
                    onClick={deleteVideo}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl shadow-md flex items-center"
                    disabled={submitting}
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                    Delete & Re-record
                  </button>
                )}
              </div>
            </div>

            {/* Submit Section */}
            {videoURL && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-semibold text-darkBlue mb-4">Submit Your Response</h3>
                
                {submitSuccess ? (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                    <p>Your video response has been submitted successfully! Redirecting...</p>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600 mb-4">
                      Please review your recording before submitting. Once submitted, your video will be processed and saved.
                    </p>
                    
                    <button
                      onClick={submitVideo}
                      disabled={submitting}
                      className={`${
                        submitting ? "bg-gray-400" : "bg-mediumBlue hover:bg-hoverBlue"
                      } text-white font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300 w-full flex items-center justify-center`}
                    >
                      {submitting ? (
                        <>
                          <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></span>
                          Uploading Video...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          Submit Video Response
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default SurveyVideoResponse;