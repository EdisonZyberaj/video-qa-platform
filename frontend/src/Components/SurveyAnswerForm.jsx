import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

function SurveyAnswerForm() {
  const { id: surveyId } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [surveyTitle, setSurveyTitle] = useState("");

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
        
        // Fetch survey details
        const surveyResponse = await axios.get(
          `http://localhost:5000/api/surveys/${surveyId}`,
          config
        );
        
        setSurveyTitle(surveyResponse.data.title);
        
        // Fetch questions
        const questionsResponse = await axios.get(
          `http://localhost:5000/api/surveys/${surveyId}/questions`,
          config
        );
        
        setQuestions(questionsResponse.data);
        
        // Initialize answers object
        const initialAnswers = {};
        questionsResponse.data.forEach(question => {
          initialAnswers[question.question_id] = "";
        });
        
        setAnswers(initialAnswers);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching survey details:", err);
        setError("An error occurred while fetching survey details");
        setLoading(false);
        
        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          navigate("/login");
        }
      }
    };
    
    fetchSurveyDetails();
  }, [surveyId, navigate]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleVideoChange = e => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        setError("Video file size exceeds 100MB limit");
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const clearVideo = () => {
    setVideoFile(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoPreview(null);
  };

  const handleSubmit = async () => {
    // Check if there are any questions to answer
    if (Object.keys(answers).length === 0) {
      setError("No questions found to answer");
      return;
    }
    
    // Check if all questions have been answered
    const unansweredQuestions = Object.entries(answers).filter(([_, value]) => !value || !value.trim());
    
    if (unansweredQuestions.length > 0) {
      setError(`Please answer all questions before submitting`);
      return;
    }
    
    // Check if surveyId is available
    if (!surveyId) {
      setError("Survey information is missing");
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

      // Create array of answer objects for all questions
      const answersArray = Object.entries(answers).map(([questionId, text]) => ({
        text,
        authorId: parseInt(userId),
        surveyId: parseInt(surveyId),
        questionId: parseInt(questionId),
        created_at: new Date()
      }));

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      };

      // Create form data to handle file upload
      const formData = new FormData();
      formData.append("answers", JSON.stringify(answersArray));
      
      // Append video if present
      if (videoFile) {
        formData.append("video", videoFile);
      }

      await axios.post(
        "http://localhost:5000/api/answers/submit",
        formData,
        config
      );

      navigate(`/responder-surveys`);
    } catch (err) {
      console.error("Error submitting answers:", err);
      setError(err.response?.data?.error || "An error occurred while submitting your answers");
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
              Answer Survey: {surveyTitle}
            </h1>
            
            {questions.map((question, index) => (
              <div key={question.question_id} className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold text-darkBlue mb-2">
                  {index + 1}. {question.title}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Category: {question.category.replace(/_/g, " ")}
                </p>
                <textarea
                  value={answers[question.question_id] || ""}
                  onChange={e => handleAnswerChange(question.question_id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full h-32 p-4 border border-lightBlue rounded-lg focus:outline-none focus:ring-2 focus:ring-mediumBlue mb-4"
                  disabled={submitting}
                />
              </div>
            ))}

            {/* Video Upload Section */}
            <div className="mb-6 border border-lightBlue rounded-lg p-4 bg-white">
              <h3 className="text-lg font-semibold text-darkBlue mb-2">
                Add Video Response (Optional)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                You can upload one video to accompany all your answers for this survey.
              </p>

              {videoPreview ? (
                <div className="mb-4">
                  <video
                    src={videoPreview}
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
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        MP4, WebM, or other video formats (max 100MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="video/*"
                      onChange={handleVideoChange}
                      disabled={submitting}
                    />
                  </label>
                </div>
              )}
            </div>

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
                "Submit All Answers"
              )}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default SurveyAnswerForm;