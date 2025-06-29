import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiUpload,
  FiFileText,
  FiThumbsUp,
  FiAlertTriangle,
  FiThumbsDown,
  FiEye,
  FiClock,
} from "react-icons/fi";
import { useAuth } from "../context/authcontext";
import { GetAllResume } from "../actions/resumeAction";
import Image from "../assets/IMG05.jpg";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalResumes: 0,
    goodResume: 0,
    fairResume: 0,
    poorResume: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const response = await GetAllResume();

      if (response?.success) {
        const resumeData = response.data || response.resume?.data || [];

        const goodResumeCount = resumeData.filter(
          (resume) => resume.status === "Good Match"
        ).length;

        const fairResumeCount = resumeData.filter(
          (resume) => resume.status === "Fair Match"
        ).length;

        const poorResumeCount = resumeData.filter(
          (resume) => resume.status === "Poor Match"
        ).length;

        setStats({
          totalResumes: resumeData.length,
          goodResume: goodResumeCount,
          fairResume: fairResumeCount,
          poorResume: poorResumeCount,
          recentActivity: resumeData.slice(0, 6) || [],
        });
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const DashboardCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-3xl font-extrabold mt-2 text-gray-700">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-20`}>{icon}</div>
      </div>
    </div>
  );

  // Helper functions for recent activity
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "text-green-700 bg-green-100";
    if (score >= 50) return "text-yellow-700 bg-yellow-100";
    if (score > 0) return "text-red-700 bg-red-100";
    return "text-gray-600 bg-gray-100";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Good Match":
        return "bg-green-100 text-green-700";
      case "Fair Match":
        return "bg-yellow-100 text-yellow-700";
      case "Poor Match":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-rose-50 p-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(249, 250, 251, 0.9), rgba(254, 242, 242, 0.9)), url(${Image})`,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {/* <h1 className="text-4xl font-extrabold text-rose-700">Dashboard</h1> */}
          <p className=" mt-2 text-xl">Welcome back, {user?.name}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/upload-resume"
            className="bg-gradient-to-r from-gray-600 to-rose-500 text-white rounded-xl p-6 hover:from-rose-600 hover:to-gray-600 transition shadow-lg"
          >
            <div className="flex items-center">
              <FiUpload className="text-3xl mr-4" />
              <div>
                <h3 className="font-extrabold text-xl">Upload New Resume</h3>
                <p className="text-amber-100 mt-1">
                  Get instant feedback on your resume
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/my-reviews"
            className="bg-gradient-to-l from-gray-500 to-rose-500 text-white rounded-xl p-6 hover:from-rose-600 hover:to-gray-600 transition shadow-lg"
          >
            <div className="flex items-center">
              <FiFileText className="text-3xl mr-4" />
              <div>
                <h3 className="font-extrabold text-xl">View My Reviews</h3>
                <p className="text-green-100 mt-1">Check your resume history</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Total Resumes"
            value={stats.totalResumes}
            icon={<FiFileText className="text-3xl text-gray-600" />}
            color="text-rose-600"
          />
          <DashboardCard
            title="Good Resumes"
            value={stats.goodResume}
            icon={<FiThumbsUp className="text-3xl text-green-700" />}
            color="text-green-700"
          />
          <DashboardCard
            title="Fair Resumes"
            value={stats.fairResume}
            icon={<FiAlertTriangle className="text-3xl text-yellow-600" />}
            color="text-yellow-600"
          />
          <DashboardCard
            title="Poor Resumes"
            value={stats.poorResume}
            icon={<FiThumbsDown className="text-3xl text-red-700" />}
            color="text-red-700"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-gray-700">
              Recent Resume Activity
            </h2>
            <Link
              to="/my-reviews"
              className="text-gray-600 hover:text-rose-800 text-sm font-semibold"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-gray-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading...</p>
            </div>
          ) : stats.recentActivity.length > 0 ? (
            <div
              className="space-y-5 bg-cover bg-center bg-no-repeat p-3"
              style={{
                backgroundImage: `linear-gradient(rgba(249, 250, 251, 0.9), rgba(254, 242, 242, 0.9)), url(${Image})`,
              }}
            >
              {stats.recentActivity.map((resume, index) => (
                <Link to={`/analysis/${resume.id}`}>
                  <div
                    key={resume.id || index}
                    className="border border-gray-200 bg-white rounded-xl p-5 hover:bg-gray-100 transition duration-200 mb-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <FiFileText className="text-gray-300 text-2xl" />
                          <div>
                            <h3 className="font-semibold text-gray-700">
                              {resume.fileName || "Unknown File"}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {resume.jobDescription ||
                                "No description available"}
                            </p>
                            <div className="flex items-center space-x-5 mt-2 text-xs text-gray-400">
                              <span className="flex items-center">
                                <FiClock className="mr-1" />
                                Uploaded: {formatDate(resume.uploadDate)}
                              </span>
                              <span>{formatTimeAgo(resume.uploadDate)}</span>
                              {resume.lastModified && (
                                <span>
                                  Modified: {formatDate(resume.lastModified)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                            resume.matchScore
                          )}`}
                        >
                          {resume.matchScore > 0
                            ? `${resume.matchScore}% Match`
                            : "Pending"}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                            resume.status
                          )}`}
                        >
                          {resume.status || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <FiFileText className="mx-auto text-rose-300 text-5xl mb-4" />
              <p className="text-rose-500">No recent resume activity</p>
              <Link
                to="/upload-resume"
                className="text-rose-600 hover:text-rose-800 text-sm font-semibold mt-3 inline-block"
              >
                Upload your first resume →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
