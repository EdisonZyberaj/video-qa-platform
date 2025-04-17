import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchQuestionDetails = async () => {
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
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching question details:", err);
        setError(
          err.response?.data?.error || 
          "An error occurred while fetching question details"
        );
        setLoading(false);
        
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate("/login");
        }
      }
    };

    fetchQuestionDetails();
  }, [surveyId, questionId, navigate]);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      setError("Answer cannot be empty");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const token = sessionStorage.getItem("token");


      if (!token) {
        navigate("/login");
        return;
      }

	  console.log("Ka token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      await axios.post(
        "http://localhost:5000/api/answers/submit",
        {
          text: answer,
          surveyId: parseInt(surveyId),
          questionId: parseInt(questionId)
        },
        config
      );

      navigate(`/surveys/${surveyId}`);
    } catch (err) {
      console.error("Error submitting answer:", err);
      setError(
        err.response?.data?.error || 
        "An error occurred while submitting your answer"
      );
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
          <>
            <h1 className="text-2xl font-bold text-darkBlue mb-6">
              Answer Question
            </h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold text-darkBlue mb-2">
                {questionData.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Category: {questionData.category.replace(/_/g, " ")}
              </p>
            </div>
          </>
        )}

        {!loading && !error && (
          <>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full h-40 p-4 border border-lightBlue rounded-lg focus:outline-none focus:ring-2 focus:ring-mediumBlue"
              disabled={submitting}
            />
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`${
                submitting 
                  ? "bg-gray-400" 
                  : "bg-mediumBlue hover:bg-hoverBlue"
              } text-white font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300 mt-6 flex items-center justify-center`}
            >
              {submitting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Answer"
              )}
            </button>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default AnswerQuestion;