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

  const handleSubmit = async () => {
    try {
      // Don't allow empty answers
      if (!answer.trim()) {
        setError("Please provide an answer before submitting");
        return;
      }
      
      if (!surveyId || !questionId) {
        setError("Survey or question information is missing");
        return;
      }

      setSubmitting(true);
      setError(null);

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
        text: answer.trim(),
        surveyId: parseInt(surveyId),
        authorId: parseInt(userId)
      }];

      // Create form data to handle the submission
      const formData = new FormData();
      formData.append("answers", JSON.stringify(formattedAnswers));

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
            <div className="mb-8">
              <button
                onClick={() => navigate(`/responder-survey/${surveyId}`)}
                className="inline-flex items-center text-mediumBlue hover:text-darkBlue transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Survey
              </button>
            </div>
            
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
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <label htmlFor="answer" className="block text-sm font-medium text-darkBlue mb-2">
                Your Answer
              </label>
              <textarea
                id="answer"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full h-40 p-4 border border-lightBlue rounded-lg focus:outline-none focus:ring-2 focus:ring-mediumBlue mb-4"
                disabled={submitting}
              />
              
              <p className="text-sm text-gray-500 mb-4">
                Remember: You can also provide a video response for the entire survey from the survey page.
              </p>
              
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
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default AnswerQuestion;