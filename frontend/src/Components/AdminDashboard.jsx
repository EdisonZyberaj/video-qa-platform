import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, FileText, HelpCircle, Video, Activity, Clipboard } from "lucide-react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = sessionStorage.getItem("token");
        
        const response = await axios.get("http://localhost:5000/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setError("Failed to load dashboard statistics");
        setLoading(false);
      }
    };
    
    fetchDashboardStats();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mediumBlue"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold text-darkBlue">
                {stats.counts.users}
              </h3>
              <div className="flex text-xs text-gray-500 mt-1 space-x-2">
                <span>{stats.usersByRole?.ASKER || 0} Askers</span>
                <span>•</span>
                <span>{stats.usersByRole?.RESPONDER || 0} Responders</span>
                <span>•</span>
                <span>{stats.usersByRole?.ADMIN || 0} Admins</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Surveys</p>
              <h3 className="text-2xl font-bold text-darkBlue">
                {stats.counts.surveys}
              </h3>
              <div className="text-xs text-gray-500 mt-1">
                With {stats.counts.questions} questions
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg">
              <Clipboard className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Responses</p>
              <h3 className="text-2xl font-bold text-darkBlue">
                {stats.counts.answers}
              </h3>
              <div className="text-xs text-gray-500 mt-1">
                Including {stats.counts.videos} video responses
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-darkBlue">Recent Responses</h2>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {stats.recentAnswers && stats.recentAnswers.length > 0 ? (
              stats.recentAnswers.map((answer) => (
                <div key={answer.answer_Id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-800">
                      {answer.author.name} {answer.author.last_name}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatDate(answer.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Answered: {answer.question.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                    {answer.text}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent answers found</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-darkBlue">Recent Surveys</h2>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {stats.recentSurveys && stats.recentSurveys.length > 0 ? (
              stats.recentSurveys.map((survey) => (
                <div key={survey.survey_id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-800">{survey.title}</p>
                    <span className="text-xs text-gray-500">
                      {formatDate(survey.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Created by: {survey.author.name} {survey.author.last_name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {survey._count.questions} questions
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent surveys found</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link 
          to="/admin/users"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
        >
          <div className="bg-blue-100 p-3 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="font-semibold text-darkBlue">Manage Users</h3>
            <p className="text-sm text-gray-500">View, edit, or delete users</p>
          </div>
        </Link>
        
        <Link 
          to="/admin/surveys"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
        >
          <div className="bg-green-100 p-3 rounded-lg">
            <FileText className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <h3 className="font-semibold text-darkBlue">Manage Surveys</h3>
            <p className="text-sm text-gray-500">View or delete surveys</p>
          </div>
        </Link>
        
        <Link 
          to="/"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
        >
          <div className="bg-purple-100 p-3 rounded-lg">
            <HelpCircle className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <h3 className="font-semibold text-darkBlue">Return to Site</h3>
            <p className="text-sm text-gray-500">Go back to the main platform</p>
          </div>
        </Link>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;