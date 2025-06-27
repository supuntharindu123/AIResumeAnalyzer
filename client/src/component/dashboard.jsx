import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiUpload, FiFileText, FiUsers, FiActivity } from "react-icons/fi";
import { useAuth } from "../context/authcontext";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalResumes: 0,
    analyzedResumes: 0,
    pendingReviews: 0,
    recentActivity: [],
  });
  const { user } = useAuth();

  const DashboardCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/upload-resume"
            className="bg-blue-600 text-white rounded-lg p-6 hover:bg-blue-700 transition"
          >
            <div className="flex items-center">
              <FiUpload className="text-2xl mr-4" />
              <div>
                <h3 className="font-bold text-lg">Upload New Resume</h3>
                <p className="text-blue-100">
                  Get instant feedback on your resume
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/my-reviews"
            className="bg-green-600 text-white rounded-lg p-6 hover:bg-green-700 transition"
          >
            <div className="flex items-center">
              <FiFileText className="text-2xl mr-4" />
              <div>
                <h3 className="font-bold text-lg">View My Reviews</h3>
                <p className="text-green-100">
                  Check your resume analysis history
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Total Resumes"
            value={stats.totalResumes}
            icon={<FiFileText className="text-2xl" />}
            color="bg-blue-100 text-blue-600"
          />
          <DashboardCard
            title="Analyzed"
            value={stats.analyzedResumes}
            icon={<FiActivity className="text-2xl" />}
            color="bg-green-100 text-green-600"
          />
          <DashboardCard
            title="Pending Reviews"
            value={stats.pendingReviews}
            icon={<FiUsers className="text-2xl" />}
            color="bg-yellow-100 text-yellow-600"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          {stats.recentActivity.length > 0 ? (
            <div className="divide-y">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-gray-500">
                        {activity.timestamp}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        activity.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : activity.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
