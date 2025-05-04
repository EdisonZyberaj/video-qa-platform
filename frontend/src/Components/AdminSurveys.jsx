import React, { useState, useEffect } from "react";
import { Eye, Trash2, Search, X, AlertCircle, FileText } from "lucide-react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

function AdminSurveys() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  useEffect(() => {
    fetchSurveys();
  }, []);
  
  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      
      const response = await axios.get("http://localhost:5000/api/admin/surveys", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSurveys(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching surveys:", error);
      setError("Failed to load surveys. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteSurvey = async (surveyId) => {
    try {
      const token = sessionStorage.getItem("token");
      
      await axios.delete(`http://localhost:5000/api/admin/surveys/${surveyId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Remove from local state
      setSurveys(surveys.filter(survey => survey.survey_id !== surveyId));
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting survey:", error);
      alert("Failed to delete survey. Please try again.");
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(date);
  };
  
  const filteredSurveys = surveys.filter(survey => {
    const searchLower = searchTerm.toLowerCase();
    return (
      survey.title.toLowerCase().includes(searchLower) ||
      survey.description.toLowerCase().includes(searchLower) ||
      (survey.author?.name + " " + survey.author?.last_name).toLowerCase().includes(searchLower)
    );
  });

  return (
    <AdminLayout title="Survey Management">
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search surveys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-mediumBlue focus:border-mediumBlue"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Surveys */}
      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mediumBlue"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchSurveys}
              className="mt-4 px-4 py-2 bg-mediumBlue text-white rounded-md hover:bg-hoverBlue"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : filteredSurveys.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No surveys found</h3>
          <p className="text-gray-500">No surveys match your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSurveys.map((survey) => (
            <div 
              key={survey.survey_id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="bg-mediumBlue h-2"></div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-darkBlue mb-2 line-clamp-2">
                    {survey.title}
                  </h3>
                  <div className="flex flex-col items-end">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mb-2">
                      {survey._count?.questions || 0} questions
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{survey.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-medium mr-2">
                    {survey.author?.name?.charAt(0) || '?'}{survey.author?.last_name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-medium">{survey.author?.name} {survey.author?.last_name}</p>
                    <p>{formatDate(survey.created_at)}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 border-t pt-4">
                  {confirmDelete === survey.survey_id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteSurvey(survey.survey_id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <a
                        href={`/surveys/${survey.survey_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-3 py-1 bg-mediumBlue text-white text-sm rounded hover:bg-hoverBlue"
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </a>
                      <button
                        onClick={() => setConfirmDelete(survey.survey_id)}
                        className="flex items-center px-3 py-1 bg-red-100 text-red-600 text-sm rounded hover:bg-red-200"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminSurveys;