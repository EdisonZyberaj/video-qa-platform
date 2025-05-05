import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FileVideo, Check, ArrowLeft, User, Calendar, HelpCircle, ChevronRight } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import VideoRecorder from "./VideoRecorder.jsx";

function ResponderSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [hasVideo, setHasVideo] = useState(false);
  
  const [showVideoRecorder, setShowVideoRecorder] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    const fetchSurveyData = async () => {
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
        
        const surveyResponse = await axios.get(
          `http://localhost:5000/api/surveys/${id}`,
          config
        );
        setSurvey(surveyResponse.data);
        
        const questionsResponse = await axios.get(
          `http://localhost:5000/api/surveys/${id}/questions`,
          config
        );
        setQuestions(questionsResponse.data);
        
        try {
          const userAnswersResponse = await axios.get(
            `http://localhost:5000/api/answers/survey/${id}/responder/${userId}`,
            config
          );
          setUserAnswers(userAnswersResponse.data);
        } catch (answerErr) {
          console.log("No previous answers found");
        }
        
        try {
          const videoResponse = await axios.get(
            `http://localhost:5000/api/answers/survey/${id}/video/${userId}`,
            config
          );
          setHasVideo(Boolean(videoResponse.data));
        } catch (videoErr) {
          if (videoErr.response && videoErr.response.status !== 404) {
            console.error("Error fetching video data:", videoErr);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching survey data:", err);
        setError("Failed to load survey data");
        setLoading(false);
        
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate("/login");
        }
      }
    };
    
    fetchSurveyData();
  }, [id, navigate]);

  const handleVideoRecorded = (blob) => {
    handleVideoUpload(blob);
  };
  
  const handleVideoUpload = async (blob) => {
    if (!blob) {
      return;
    }
    
    setUploading(true);
    
    try {
      const token = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("user_id");
      
      if (!token || !userId) {
        navigate("/login");
        return;
      }
      
      const dummyAnswer = {
        questionId: questions[0]?.question_id || 0,
        text: "Video response provided",
        surveyId: parseInt(id),
        authorId: parseInt(userId)
      };
      
      const formData = new FormData();
      formData.append("answers", JSON.stringify([dummyAnswer]));
      
      const videoFile = new File(
        [blob], 
        `survey_${id}_user_${userId}_${Date.now()}.webm`, 
        { type: "video/webm" }
      );
      formData.append("video", videoFile);
      
      await axios.post(
        "http://localhost:5000/api/answers/submit",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setHasVideo(true);
      setShowVideoRecorder(false);
      toast.success("Video uploaded successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Failed to upload video. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-lightBlue/30 to-lightBlue/50">
      <Navbar />
      <ToastContainer />
      <main className="container mx-auto flex-grow py-12 px-10 max-w-5xl">
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
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-darkBlue mb-3">{survey.title}</h1>
                  <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">{survey.description}</p>
                </div>
                
                {hasVideo && (
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg">
                      <p className="flex items-center whitespace-nowrap">
                        <Check size={20} className="mr-2" />
                        Video Response Submitted
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md mb-10">
              <h2 className="text-xl font-semibold text-darkBlue mb-6 border-b pb-3">
                Survey Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-lightBlue/10 p-6 rounded-lg">
                  <div className="flex items-center mb-2">
                    <User className="w-5 h-5 mr-2 text-mediumBlue" />
                    <span className="text-sm text-gray-600">Created by</span>
                  </div>
                  <p className="text-lg font-medium text-darkBlue">
                    {survey.author?.name} {survey.author?.last_name}
                  </p>
                </div>

                <div className="bg-lightBlue/10 p-6 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 mr-2 text-mediumBlue" />
                    <span className="text-sm text-gray-600">Created on</span>
                  </div>
                  <p className="text-lg font-medium text-darkBlue">
                    {new Date(survey.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="bg-lightBlue/10 p-6 rounded-lg">
                  <div className="flex items-center mb-2">
                    <HelpCircle className="w-5 h-5 mr-2 text-mediumBlue" />
                    <span className="text-sm text-gray-600">Questions</span>
                  </div>
                  <p className="text-lg font-medium text-darkBlue">
                    {questions.length} {questions.length === 1 ? 'Question' : 'Questions'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-darkBlue mb-4">Questions</h2>
              
              {questions.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {questions.map(question => (
                    <div 
                      key={question.question_id} 
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-darkBlue mb-2">
                              {question.title}
                            </h3>
                            <span className="inline-block bg-lightBlue/30 text-darkBlue text-xs font-medium py-1 px-2 rounded-full">
                              {question.category ? question.category.replace(/_/g, " ") : "Uncategorized"}
                            </span>
                          </div>
                          <Link
                            to={`/survey/${id}/question/${question.question_id}/answer`}
                            className="ml-4 bg-mediumBlue hover:bg-hoverBlue text-white py-2 px-4 rounded-full transition-colors duration-200 text-sm font-medium flex items-center"
                          >
                            Answer
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-4 rounded-lg">
                  <p className="text-sm">This survey has no questions yet.</p>
                </div>
              )}
            </div>
            
            {!hasVideo && !showVideoRecorder && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
                <div className="p-8">
                  <div className="flex flex-col justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-darkBlue flex items-center">
                      <FileVideo className="w-5 h-5 mr-2" />
                      Video Response
                    </h2>
                    <button
                      onClick={() => setShowVideoRecorder(true)}
                      className="bg-mediumBlue mt-7 hover:bg-hoverBlue text-white py-2 px-6 rounded-lg transition-colors duration-200 font-medium"
                    >
                      Record Video Response
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {!hasVideo && showVideoRecorder && (
              <div className="mb-10 mx-auto max-w-2xl">
                {uploading ? (
                  <div className="bg-white p-10 rounded-xl shadow-md text-center">
                    <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-mediumBlue mx-auto mb-6"></div>
                    <p className="text-darkBlue font-medium text-lg">Uploading your video...</p>
                    <p className="text-gray-500 mt-2">This may take a moment depending on your connection speed.</p>
                  </div>
                ) : (
                  <VideoRecorder 
                    onVideoRecorded={handleVideoRecorded} 
                    onCancel={() => setShowVideoRecorder(false)}
                  />
                )}
              </div>
            )}
            
            {hasVideo && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
                <div className="bg-gray-900 p-8 flex items-center justify-center text-white">
                  <div className="text-center py-10">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileVideo className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Video Response Submitted</h3>
                    <p className="text-gray-300 max-w-md mx-auto">
                      Your video has been uploaded successfully and will be reviewed.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-center mt-10 mb-6">
              <Link
                to="/responder-surveys"
                className="bg-mediumBlue hover:bg-hoverBlue text-white py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300 font-medium"
              >
                Back to Surveys
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default ResponderSurvey;