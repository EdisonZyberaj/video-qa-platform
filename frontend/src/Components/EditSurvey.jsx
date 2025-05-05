import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

const CATEGORIES = [
 	"TECHNOLOGY",
	"PROGRAMMING",
	"WEB_DEVELOPMENT",
	"MOBILE_DEVELOPMENT",
	"DATA_SCIENCE",
	"ARTIFICIAL_INTELLIGENCE",
	"MACHINE_LEARNING",
	"CYBERSECURITY",
	"CLOUD_COMPUTING",
	"DEVOPS",
	"DATABASES",
	"BLOCKCHAIN",
	"HEALTH_AND_MEDICINE",
	"MENTAL_HEALTH",
	"PHYSICAL_FITNESS",
	"NUTRITION",
	"BUSINESS",
	"ENTREPRENEURSHIP",
	"MARKETING",
	"FINANCE",
	"INVESTING",
	"CAREER_ADVICE",
	"EDUCATION",
	"LANGUAGES",
	"MATHEMATICS",
	"SCIENCE",
	"PHYSICS",
	"CHEMISTRY",
	"BIOLOGY",
	"ASTRONOMY",
	"ENVIRONMENTAL_SCIENCE",
	"HISTORY",
	"POLITICS",
	"LAW",
	"PHILOSOPHY",
	"PSYCHOLOGY",
	"SOCIOLOGY",
	"ARTS_AND_CULTURE",
	"MUSIC",
	"LITERATURE",
	"FILM_AND_TELEVISION",
	"GAMING",
	"TRAVEL",
	"COOKING",
	"FASHION",
	"RELATIONSHIPS",
	"PARENTING",
	"HOME_IMPROVEMENT",
	"GARDENING",
	"PETS",
	"AUTOMOTIVE",
	"SPORTS",
	"DIY_AND_CRAFTS",
	"PHOTOGRAPHY"
];

function EditSurvey() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [originalSurveyData, setOriginalSurveyData] = useState(null);
  const [originalQuestions, setOriginalQuestions] = useState([]);
  const [surveyData, setSurveyData] = useState({
    title: "",
    description: "",
    authorId: null
  });
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [newQuestions, setNewQuestions] = useState([]);
  const [removedQuestionIds, setRemovedQuestionIds] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchSurvey();
  }, [id, navigate]);

  const fetchSurvey = () => {
    const token = sessionStorage.getItem("token");
    
    axios.get(  
      `http://localhost:5000/api/surveys/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(response => {
      const { questions, ...surveyBasicData } = response.data;
      setOriginalSurveyData(surveyBasicData);
      setOriginalQuestions(questions || []);
      
      setSurveyData(surveyBasicData);
      setCurrentQuestions(questions ? [...questions] : []);
      
      setFetchingData(false);
    })
    .catch(error => {
      console.error("Error fetching survey:", error);
      toast.error("Failed to load survey data. Please try again.");
      setFetchingData(false);
    });
  };

  const handleSurveyChange = e => {
    const { name, value } = e.target;
    setSurveyData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    setCurrentQuestions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };
      return updated;
    });
  };

  const handleNewQuestionChange = (index, e) => {
    const { name, value } = e.target;
    setNewQuestions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };
      return updated;
    });
  };

  const addQuestion = () => {
    const authorId = parseInt(sessionStorage.getItem("user_id"), 10);
    setNewQuestions(prev => [
      ...prev,
      { 
        title: "", 
        category: "TECHNOLOGY",
        surveyId: parseInt(id, 10),
        authorId: authorId
      }
    ]);
    toast.info("Question added. Remember to save your changes.");
  };

  const removeQuestion = index => {
    const questionToRemove = currentQuestions[index];
    setRemovedQuestionIds(prev => [...prev, questionToRemove.question_id]);
    
    setCurrentQuestions(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    
    toast.warning("Question removed. Remember to save your changes.");
  };

  const removeNewQuestion = index => {
    setNewQuestions(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    
    toast.warning("Question removed. Remember to save your changes.");
  };

  const hasSurveyDataChanged = () => {
    return (
      surveyData.title !== originalSurveyData.title ||
      surveyData.description !== originalSurveyData.description
    );
  };

  const hasQuestionsChanged = () => {
    if (newQuestions.length > 0 || removedQuestionIds.length > 0) {
      return true;
    }
    
    if (currentQuestions.length !== originalQuestions.length) {
      return true;
    }
    
    for (let i = 0; i < currentQuestions.length; i++) {
      const current = currentQuestions[i];
      const original = originalQuestions.find(
        q => q.question_id === current.question_id
      );
      
      if (!original || current.title !== original.title || current.category !== original.category) {
        return true;
      }
    }
    
    return false;
  };

  const processApiCalls = (calls, index, onComplete) => {
    if (index >= calls.length) {
      onComplete();
      return;
    }

    const currentCall = calls[index];
    currentCall(() => {
      processApiCalls(calls, index + 1, onComplete);
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    
    if (!hasSurveyDataChanged() && !hasQuestionsChanged()) {
      toast.error("YOU DIDN'T CHANGE ANYTHING");
      return;
    }
    
    setLoading(true);

    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("You are not authenticated. Please log in.");
      navigate("/login");
      return;
    }

    const apiCalls = [];

    if (hasSurveyDataChanged()) {
      apiCalls.push((next) => {
        axios.patch(
          `http://localhost:5000/api/surveys/${id}/update-survey`,
          {
            title: surveyData.title,
            description: surveyData.description,
            authorId: surveyData.authorId
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => next())
        .catch(error => {
          console.error("Error updating survey:", error);
          const errorMessage =
            error.response?.data?.message || error.message || "An error occurred while updating the survey";
          toast.error(errorMessage);
          setLoading(false);
        });
      });
    }

    currentQuestions.forEach(question => {
      const original = originalQuestions.find(
        q => q.question_id === question.question_id
      );
      
      if (original && (question.title !== original.title || question.category !== original.category)) {
        apiCalls.push((next) => {
          axios.patch(
            `http://localhost:5000/api/questions/${question.question_id}`,
            {
              title: question.title,
              category: question.category
            },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then(() => next())
          .catch(error => {
            console.error("Error updating question:", error);
            const errorMessage =
              error.response?.data?.message || error.message || "An error occurred while updating a question";
            toast.error(errorMessage);
            setLoading(false);
          });
        });
      }
    });

    newQuestions.forEach(question => {
      if (question.title.trim()) { 
        apiCalls.push((next) => {
          axios.post(
            `http://localhost:5000/api/questions`,
            {
              title: question.title,
              category: question.category,
              surveyId: parseInt(id, 10),
              authorId: surveyData.authorId
            },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then(() => next())
          .catch(error => {
            console.error("Error adding question:", error);
            const errorMessage =
              error.response?.data?.message || error.message || "An error occurred while adding a question";
            toast.error(errorMessage);
            setLoading(false);
          });
        });
      }
    });

    removedQuestionIds.forEach(questionId => {
      apiCalls.push((next) => {
        axios.delete(
          `http://localhost:5000/api/questions/${questionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => next())
        .catch(error => {
          console.error("Error deleting question:", error);
          const errorMessage =
            error.response?.data?.message || error.message || "An error occurred while deleting a question";
          toast.error(errorMessage);
          setLoading(false);
        });
      });
    });

    processApiCalls(apiCalls, 0, () => {
      setLoading(false);
      toast.success("Survey updated successfully!");
      setTimeout(() => {
        navigate("/surveys");
      }, 2000);
    });
  };

  if (fetchingData) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="container mx-auto flex-grow py-12 px-6 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-darkBlue">Loading survey data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="container mx-auto flex-grow py-12 px-6">
        <ToastContainer 
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className="mb-8">
          <button
            onClick={() => navigate("/surveys")}
            className="flex items-center text-mediumBlue hover:text-darkBlue transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Surveys
          </button>
        </div>
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-darkBlue mb-3">
            Edit Survey
          </h2>
          <div className="h-1 w-20 bg-mediumBlue mx-auto mb-6" />
          <p className="text-darkBlue max-w-2xl mx-auto">
            Update your survey details below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h3 className="text-xl font-semibold text-darkBlue mb-6">
              Survey Details
            </h3>
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-darkBlue mb-2">
                Survey Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={surveyData.title}
                onChange={handleSurveyChange}
                className="w-full p-3 border border-lightBlue rounded-lg focus:outline-none focus:ring-2 focus:ring-mediumBlue"
                placeholder="Enter survey title"
                required
              />
            </div>

            <div className="mb-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-darkBlue mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={surveyData.description}
                onChange={handleSurveyChange}
                className="w-full p-3 border border-lightBlue rounded-lg focus:outline-none focus:ring-2 focus:ring-mediumBlue h-32"
                placeholder="Enter survey description"
                required
              />
            </div>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-darkBlue">
                Survey Questions
              </h3>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center bg-mediumBlue hover:bg-hoverBlue text-white px-4 py-2 rounded-lg transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </button>
            </div>
            
            {currentQuestions.length > 0 && (
              <>
                <h4 className="text-lg font-medium text-darkBlue mb-4">Existing Questions</h4>
                {currentQuestions.map((question, index) => (
                  <div
                    key={question.question_id}
                    className="bg-gray-50 p-6 rounded-lg mb-6 border border-lightBlue">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-darkBlue">
                        Question {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="text-red-500 hover:text-red-700 flex items-center">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </button>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor={`question-${index}`}
                        className="block text-sm font-medium text-darkBlue mb-2">
                        Question Text *
                      </label>
                      <input
                        type="text"
                        id={`question-${index}`}
                        name="title"
                        value={question.title}
                        onChange={e => handleQuestionChange(index, e)}
                        className="w-full p-3 border border-lightBlue rounded-lg focus:outline-none focus:ring-2 focus:ring-mediumBlue"
                        placeholder="Enter question text"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`category-${index}`}
                        className="block text-sm font-medium text-darkBlue mb-2">
                        Category *
                      </label>
                      <select
                        id={`category-${index}`}
                        name="category"
                        value={question.category}
                        onChange={e => handleQuestionChange(index, e)}
                        className="w-full p-3 border border-lightBlue rounded-lg focus:outline-none focus:ring-2 focus:ring-mediumBlue"
                        required>
                        {CATEGORIES.map(category => (
                          <option key={category} value={category}>
                            {category.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </>
            )}
            
            {newQuestions.length > 0 && (
              <>
                <h4 className="text-lg font-medium text-darkBlue mb-4">New Questions</h4>
                {newQuestions.map((question, index) => (
                  <div
                    key={`new-${index}`}
                    className="bg-gray-50 p-6 rounded-lg mb-6 border border-lightBlue border-dashed">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-darkBlue">
                        New Question {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeNewQuestion(index)}
                        className="text-red-500 hover:text-red-700 flex items-center">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </button>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor={`new-question-${index}`}
                        className="block text-sm font-medium text-darkBlue mb-2">
                        Question Text *
                      </label>
                      <input
                        type="text"
                        id={`new-question-${index}`}
                        name="title"
                        value={question.title}
                        onChange={e => handleNewQuestionChange(index, e)}
                        className="w-full p-3 border border-lightBlue rounded-lg focus:outline-none focus:ring-2 focus:ring-mediumBlue"
                        placeholder="Enter question text"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`new-category-${index}`}
                        className="block text-sm font-medium text-darkBlue mb-2">
                        Category *
                      </label>
                      <select
                        id={`new-category-${index}`}
                        name="category"
                        value={question.category}
                        onChange={e => handleNewQuestionChange(index, e)}
                        className="w-full p-3 border border-lightBlue rounded-lg focus:outline-none focus:ring-2 focus:ring-mediumBlue"
                        required>
                        {CATEGORIES.map(category => (
                          <option key={category} value={category}>
                            {category.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </>
            )}
            
            {currentQuestions.length === 0 && newQuestions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="bg-blue-50 text-blue-800 p-4 rounded-lg">
                  No questions yet. Click "Add Question" to create one.
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center mt-8 mb-12">
            <button
              type="submit"
              disabled={loading}
              className="bg-mediumBlue hover:bg-hoverBlue text-white font-medium py-4 px-10 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center text-lg disabled:opacity-70">
              {loading ? (
                "Updating..."
              ) : (
                <div className="flex items-center">
                  <Save className="w-5 h-5 mr-3" />
                  Update Survey
                </div>
              )}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default EditSurvey;