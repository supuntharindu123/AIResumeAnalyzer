import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiFileText, FiEye, FiTrash2 } from "react-icons/fi";

const Resumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false); // Changed to false for testing

  // Simplified mock data
  useEffect(() => {
    const mockResumes = [
      {
        id: 1,
        fileName: "john_doe_resume.pdf",
        uploadDate: "2025-01-15",
        matchScore: 89,
        jobTitle: "Senior Frontend Developer",
        company: "Google",
        status: "analyzed",
        skills: ["React", "JavaScript", "Node.js"],
      },
      {
        id: 2,
        fileName: "sarah_smith_cv.pdf",
        uploadDate: "2025-01-14",
        matchScore: 94,
        jobTitle: "Data Scientist",
        company: "Microsoft",
        status: "analyzed",
        skills: ["Python", "Machine Learning", "SQL"],
      },
    ];

    setResumes(mockResumes);
  }, []);

  const getMatchScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const handleDeleteResume = (id) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      setResumes(resumes.filter((resume) => resume.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Resumes</h1>
          <p className="text-gray-600 mt-2">
            Manage and analyze your resume collection
          </p>
        </div>

        {/* Debug Info */}
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800">Debug: Found {resumes.length} resumes</p>
        </div>

        {/* Resume Grid */}
        {resumes.length === 0 ? (
          <div className="text-center py-12">
            <FiFileText className="text-gray-400 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No resumes found
            </h3>
            <p className="text-gray-500 mb-6">
              Upload your first resume to get started
            </p>
            <Link
              to="/upload-resume"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 inline-flex items-center"
            >
              <FiFileText className="mr-2" />
              Upload Resume
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition duration-300 border border-gray-200"
              >
                <div className="p-6">
                  {/* File Info */}
                  <div className="flex items-center mb-4">
                    <div className="bg-red-100 p-2 rounded-lg mr-3">
                      <FiFileText className="text-red-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 truncate">
                        {resume.fileName}
                      </h3>
                      <p className="text-sm text-gray-600">{resume.jobTitle}</p>
                    </div>
                  </div>

                  {/* Match Score */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">Match Score</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getMatchScoreColor(
                        resume.matchScore
                      )}`}
                    >
                      {resume.matchScore}%
                    </span>
                  </div>

                  {/* Company */}
                  <p className="text-sm text-gray-500 mb-4">{resume.company}</p>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {resume.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/analysis/${resume.id}`}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-300 text-center text-sm"
                    >
                      <FiEye className="inline mr-1" />
                      View
                    </Link>
                    <button
                      onClick={() => handleDeleteResume(resume.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition duration-300"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resumes;
