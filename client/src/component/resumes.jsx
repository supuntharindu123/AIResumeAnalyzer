import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiFileText,
  FiEye,
  FiX,
  FiCalendar,
  FiClock,
  FiTarget,
  FiDownload,
  FiFilter,
  FiSearch,
  FiRefreshCw,
  FiThumbsDown,
  FiAlertTriangle,
  FiThumbsUp,
  FiUpload,
} from "react-icons/fi";
import { GetAllResume, DeleteResume } from "../actions/resumeAction";
import Image from "../assets/IMG05.jpg";

const Resumes = () => {
  const [resumes, setResumes] = useState([]);
  const [filteredResumes, setFilteredResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    fetchResumes();
  }, []);

  useEffect(() => {
    filterAndSortResumes();
  }, [resumes, searchTerm, filterStatus, sortBy]);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const response = await GetAllResume();

      // Handle different response structures
      let resumeData = [];
      if (response?.success) {
        resumeData = response.data || response.resume?.data || [];
      } else if (response?.resume?.data) {
        resumeData = response.resume.data;
      } else if (Array.isArray(response)) {
        resumeData = response;
      }

      setResumes(resumeData);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortResumes = () => {
    let filtered = [...resumes];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (resume) =>
          resume.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resume.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resume.jobDescription
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((resume) => {
        const status = getStatusFromScore(resume.matchScore);
        return status === filterStatus;
      });
    }

    // Sort
    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
    } else if (sortBy === "highscore") {
      filtered.sort((a, b) => b.matchScore - a.matchScore);
    } else if (sortBy === "lowscore") {
      filtered.sort((a, b) => a.matchScore - b.matchScore);
    }

    setFilteredResumes(filtered);
  };

  const getStatusFromScore = (score) => {
    if (score >= 80) return "high";
    if (score >= 50) return "medium";
    return "low";
  };

  // Fixed: Add the missing getMatchScoreColor function
  const getMatchScoreColor = (score) => {
    if (score >= 80)
      return "bg-green-500 text-green-100 border border-green-300/30";
    if (score >= 60)
      return "bg-amber-500 text-amber-100 border border-amber-300/30";
    if (score >= 40)
      return "bg-red-500 text-orange-100 border border-orange-300/30";
    return "bg-red-500 text-red-100 border border-red-300/30";
  };

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

  const handleDeleteResume = async (id) => {
    if (window.confirm("Are you sure you want to remove this resume?")) {
      setLoading(true);
      try {
        await DeleteResume(id);
        setResumes(resumes.filter((resume) => resume.id !== id));
      } catch (error) {
        console.error("Error removing resume:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen  flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(249, 250, 251, 0.9), rgba(254, 242, 242, 0.9)), url(${Image})`,
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-800 to-rose-800 py-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(249, 250, 251, 0.9), rgba(254, 242, 242, 0.9)), url(${Image})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-700">My Resumes</h1>
          <p className="text-gray-600 mt-2">
            Manage and analyze your resume collection
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-xl shadow-gray-00">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search resumes..."
                  className="w-full px-4 py-3 pr-10 bg-white/10 backdrop-blur-sm border border-gray-600 rounded-lg focus:outline-none focus:border-rose-800 text-gray-800 placeholder-gray-700 transition-all duration-300"
                />
                <FiSearch className="absolute right-3 top-3.5 text-gray-600 hover:text-gray-400 transition-colors duration-300" />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-gray-700 rounded-lg focus:outline-none focus:border-rose-700 text-gray transition-all duration-300"
              >
                <option value="all" className="bg-gray-800 text-white">
                  All Statuses
                </option>
                <option value="high" className="bg-gray-800 text-white">
                  High Match (80%+)
                </option>
                <option value="medium" className="bg-gray-800 text-white">
                  Medium Match (50-79%)
                </option>
                <option value="low" className="bg-gray-800 text-white">
                  Low Match (&lt;50%)
                </option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-gray-700 rounded-lg focus:outline-none focus:border-rose-700 text-gray transition-all duration-300"
              >
                <option value="recent" className="bg-gray-800 text-white">
                  Most Recent
                </option>
                <option value="oldest" className="bg-gray-800 text-white">
                  Oldest First
                </option>
                <option value="highscore" className="bg-gray-800 text-white">
                  Highest Score
                </option>
                <option value="lowscore" className="bg-gray-800 text-white">
                  Lowest Score
                </option>
              </select>

              {/* Refresh Button */}
              <button
                onClick={fetchResumes}
                disabled={loading}
                className="flex items-center px-6 py-3 bg-white/20 hover:bg-gray-300 text-gray rounded-lg border border-gray-700  transition-all duration-300 backdrop-blur-sm group"
              >
                <FiRefreshCw
                  className={`mr-2 ] transition-colors duration-300 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6  shadow-md shadow-gray-400 text-center">
            <FiFileText className="text-3xl text-gray-700 transition-colors duration-300 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray">{resumes.length}</div>
            <div className="text-gray-700 text-sm">Total Resumes</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6  shadow-md shadow-gray-400 text-center">
            <FiThumbsUp className="text-3xl text-green-700  transition-colors duration-300 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">
              {resumes.filter((r) => r.matchScore >= 80).length}
            </div>
            <div className="text-green-800 text-sm">High Matches</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6  shadow-md shadow-gray-400 text-center">
            <FiAlertTriangle className="text-3xl text-amber-500  transition-colors duration-300 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-500">
              {
                resumes.filter((r) => r.matchScore >= 50 && r.matchScore < 80)
                  .length
              }
            </div>
            <div className="text-amber-500 text-sm">Medium Matches</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6  shadow-md shadow-gray-400 text-center">
            <FiThumbsDown className="text-3xl text-red-600  transition-colors duration-300 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">
              {resumes.filter((r) => r.matchScore < 50).length}
            </div>
            <div className="text-red-700 text-sm">Low Matches</div>
          </div>
        </div>

        {/* Resume Grid */}
        {filteredResumes.length === 0 ? (
          <div className="text-center py-16 bg-white/10 backdrop-blur-sm rounded-xl border border-gray-300">
            <FiFileText className="text-gray-100 text-6xl mx-auto mb-6 hover:text-gray-100 transition-colors duration-300" />
            <h3 className="text-2xl font-semibold text-gray mb-4">
              {resumes.length === 0
                ? "No resumes found"
                : "No matching resumes"}
            </h3>
            <p className="text-gray-100 mb-8 max-w-md mx-auto">
              {resumes.length === 0
                ? "Upload your first resume to get started with AI-powered analysis"
                : "Try adjusting your search or filters to find resumes"}
            </p>
            <Link
              to="/upload-resume"
              className="bg-white/20 hover:bg-white/90 text-gray-800 px-8 py-4 rounded-xl font-semibold transition-all duration-300 border-2 border-gray-700 hover:border-gray-900 backdrop-blur-sm shadow-lg transform hover:scale-105 inline-flex items-center"
            >
              <FiUpload className="mr-2 hover:text-gray-800 transition-colors duration-300" />
              Upload Resume
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-500 hover:bg-gray-100 group"
              >
                <div className="p-6">
                  {/* File Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center flex-1 min-w-0">
                      <div className=" p-3 rounded-lg mr-4 flex-shrink-0">
                        <FiFileText className="text-gray-500 transition-colors duration-300 text-xl" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-semibold text-gray-700 truncate  transition-colors duration-300">
                          {resume.fileName || "Untitled Resume"}
                        </h2>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleDeleteResume(resume.id)}
                      className="p-2 text-gray-700 hover:text-red-700 rounded-lg transition-all duration-300 flex-shrink-0 group"
                      title="Remove Resume"
                    >
                      <FiX className="text-lg" />
                    </button>
                  </div>

                  {/* Match Score */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-800">Match Score</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getMatchScoreColor(
                        resume.matchScore || 0
                      )}`}
                    >
                      {resume.matchScore || 0}%
                    </span>
                  </div>

                  {/* Job Description Preview */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                      {resume.jobDescription || "No job description available"}
                    </p>
                  </div>

                  {/* Date Information */}
                  <div className="flex items-center text-xs text-gray-700 mb-4 space-x-4">
                    <span className="flex items-center">
                      <FiCalendar className="mr-1  transition-colors duration-300" />
                      {formatDate(resume.uploadDate)}
                    </span>
                    <span className="flex items-center">
                      <FiClock className="mr-1  transition-colors duration-300" />
                      {formatTimeAgo(resume.uploadDate)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3">
                    <Link
                      to={`/analysis/${resume.id}`}
                      className="flex-1 bg-gray-400 hover:bg-gray-500  px-4 py-3 rounded-lg border hover:border-gray-300 transition-all duration-300 text-center text-sm font-medium backdrop-blur-sm group"
                    >
                      <FiEye className="inline mr-2  transition-colors duration-300" />
                      View Analysis
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Info */}
        {filteredResumes.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-rose-100">
              Showing {filteredResumes.length} of {resumes.length} resume
              {resumes.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resumes;
