import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

function ResponderSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [hasVideo, setHasVideo] = useState(false);

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

  const isQuestionAnswered = (questionId) => {
    return userAnswers.some(answer => answer.questionId === questionId);
  };

  const allQuestionsAnswered = () => {
    if (questions.length === 0) return false;
    return questions.every(question => isQuestionAnswered(question.question_id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-lightBlue/30 to-lightBlue/50">
      <Navbar />
      <main className="container mx-auto py-12 px-4 flex-grow">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mediumBlue"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        ) : (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-darkBlue mb-2">{survey.title}</h1>
                <p className="text-gray-600">{survey.description}</p>
              </div>
              
              {hasVideo && (
                <div className="mt-4 md:mt-0 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
                  <p>You have uploaded a video for this survey</p>
                </div>
              )}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold text-darkBlue mb-4">Survey Information</h2>
              <p className="mb-2"><span className="font-medium">Created by:</span> {survey.author?.name} {survey.author?.last_name}</p>
              <p className="mb-2"><span className="font-medium">Created on:</span> {new Date(survey.created_at).toLocaleDateString()}</p>
              <p><span className="font-medium">Number of questions:</span> {questions.length}</p>
            </div>
            
            <h2 className="text-2xl font-bold text-darkBlue mb-6">Questions</h2>
            
            {questions.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {questions.map(question => (
                  <div key={question.question_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-darkBlue mb-2">
                        {question.title}
                      </h3>
                      
                      <div className="flex items-center mb-4">
                        <span className="bg-lightBlue/50 text-darkBlue text-xs font-medium py-1 px-2 rounded">
                          {question.category ? question.category.replace(/_/g, " ") : "Uncategorized"}
                        </span>
                        
                        {isQuestionAnswered(question.question_id) ? (
                          <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium py-1 px-2 rounded">
                            Answered
                          </span>
                        ) : (
                          <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium py-1 px-2 rounded">
                            Needs Answer
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-6">
                        {question.description || "No description provided."}
                      </p>
                      
                      <div className="flex justify-end">
                        {isQuestionAnswered(question.question_id) ? (
                          <button disabled className="bg-gray-300 text-gray-700 py-2 px-4 rounded-full">
                            Already Answered
                          </button>
                        ) : (
                          <Link
                            to={`/survey/${id}/question/${question.question_id}/answer`}
                            className="bg-mediumBlue hover:bg-hoverBlue text-white py-2 px-4 rounded-full transition-colors duration-200"
                          >
                            Answer Question
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                <p>This survey has no questions yet.</p>
              </div>
            )}  
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default ResponderSurvey;