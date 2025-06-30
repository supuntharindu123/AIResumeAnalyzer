import React, { useState } from "react";
import {
  FiCheck,
  FiX,
  FiAlertCircle,
  FiAward,
  FiUser,
  FiBriefcase,
  FiFileText,
  FiEye,
  FiDownload,
  FiTarget,
  FiTrendingUp,
  FiAlertTriangle,
  FiCheckCircle,
  FiExternalLink,
  FiCalendar,
  FiMail,
  FiStar,
} from "react-icons/fi";
import Image from "../assets/IMG05.jpg";

const AnalysisResults = ({ data }) => {
  if (!data) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(249, 250, 251, 0.9), rgba(254, 242, 242, 0.9)), url(${Image})`,
        }}
      >
        <div className="text-center">
          <FiAlertCircle className="text-gray-600 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Analysis Data
          </h2>
          <p className="text-gray-600">Unable to load analysis results.</p>
        </div>
      </div>
    );
  }

  const {
    id,
    fileName,
    fileOriginalName,
    uploadDate,
    owner,
    jobDescription,
    analysis,
    matchScore,
    feedback,
    content,
  } = data;

  console.log("fileOriginalName", fileOriginalName);

  // Helper function to get score color
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  // Helper function to get score background
  const getScoreBg = (score) => {
    if (score >= 80) return "bg-green-50 border-green-200 text-green-700";
    if (score >= 60) return "bg-amber-50 border-amber-200 text-amber-700";
    if (score >= 40) return "bg-orange-50 border-orange-200 text-orange-700";
    return "bg-red-50 border-red-200 text-red-700";
  };

  // Function to open file in new window
  const openFileInNewWindow = () => {
    if (content) {
      const blob = new Blob([content], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } else {
      // If content is not available, you can show a message or handle differently
      alert("File content not available for viewing");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="min-h-screen py-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(249, 250, 251, 0.9), rgba(254, 242, 242, 0.9)), url(${Image})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-gray-200 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="bg-rose-100 p-3 rounded-lg mr-4">
                    <FiFileText className="text-rose-600 text-2xl" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                      Resume Analysis Results
                    </h1>
                    <p className="text-gray-600">{fileOriginalName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <FiUser className="mr-2 hover:text-rose-600 transition-colors duration-300" />
                    <span>{owner?.name}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiMail className="mr-2 hover:text-rose-600 transition-colors duration-300" />
                    <span>{owner?.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="mr-2 hover:text-rose-600 transition-colors duration-300" />
                    <span>{formatDate(uploadDate)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`http://localhost:5000/api/resume/${fileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg border border-gray-600 hover:border-gray-700 transition-all duration-300 shadow-md group"
                >
                  <FiEye className="mr-2 group-hover:text-yellow-200 transition-colors duration-300" />
                  View Resume
                </a>
                {/* <button className="flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg border border-gray-600 hover:border-gray-700 transition-all duration-300 shadow-md group">
                  <FiDownload className="mr-2 group-hover:text-yellow-200 transition-colors duration-300" />
                  Download
                </button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Match Score Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Overall Score */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-gray-200 shadow-lg text-center">
              <div className="mb-6">
                <div
                  className={`text-6xl font-bold mb-2 ${getScoreColor(
                    matchScore
                  )}`}
                >
                  {matchScore}%
                </div>
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-full border ${getScoreBg(
                    matchScore
                  )}`}
                >
                  <FiTarget className="mr-2" />
                  <span className="font-medium">Match Score</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Keywords Found:</span>
                  <span className="text-gray-800 font-medium">
                    {analysis?.keywords?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Missing Keywords:</span>
                  <span className="text-gray-800 font-medium">
                    {analysis?.missingKeywords?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Format Issues:</span>
                  <span className="text-gray-800 font-medium">
                    {analysis?.formatIssues?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description & Feedback */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
              <div className="flex items-center mb-4">
                <FiBriefcase className="text-gray-600 hover:text-rose-600 transition-colors duration-300 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Job Description
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {jobDescription || "No job description provided"}
              </p>
            </div>

            {/* AI Feedback */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
              <div className="flex items-center mb-4">
                <FiAward className="text-gray-600 hover:text-rose-600 transition-colors duration-300 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  AI Feedback
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {feedback || "No feedback available"}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Keywords Found */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <FiCheckCircle className="text-green-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Keywords Found
              </h3>
              <span className="ml-auto bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm border border-green-200">
                {analysis?.keywords?.length || 0}
              </span>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {analysis?.keywords?.length > 0 ? (
                analysis.keywords.map((keyword, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div className="flex items-center">
                      <FiCheck className="text-green-600 mr-3" />
                      <span className="text-gray-800 font-medium">
                        {typeof keyword === "object"
                          ? keyword.word || keyword.keyword
                          : keyword}
                      </span>
                    </div>
                    {typeof keyword === "object" && keyword.count && (
                      <span className="text-green-600 text-sm">
                        {keyword.count}x
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No keywords found
                </p>
              )}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="bg-red-100 p-2 rounded-lg mr-3">
                <FiX className="text-red-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Missing Keywords
              </h3>
              <span className="ml-auto bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm border border-red-200">
                {analysis?.missingKeywords?.length || 0}
              </span>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {analysis?.missingKeywords?.length > 0 ? (
                analysis.missingKeywords.map((keyword, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-red-50 rounded-lg border border-red-200"
                  >
                    <FiX className="text-red-600 mr-3" />
                    <span className="text-gray-800">{keyword}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No missing keywords
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Format Issues & Suggestions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Format Issues */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="bg-amber-100 p-2 rounded-lg mr-3">
                <FiAlertTriangle className="text-amber-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Format Issues
              </h3>
              <span className="ml-auto bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm border border-amber-200">
                {analysis?.formatIssues?.length || 0}
              </span>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {analysis?.formatIssues?.length > 0 ? (
                analysis.formatIssues.map((issue, index) => (
                  <div
                    key={index}
                    className="flex items-start p-3 bg-amber-50 rounded-lg border border-amber-200"
                  >
                    <FiAlertTriangle className="text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-800 text-sm leading-relaxed">
                      {issue}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No format issues found
                </p>
              )}
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <FiTrendingUp className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Suggestions
              </h3>
              <span className="ml-auto bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200">
                {analysis?.suggestions?.length || 0}
              </span>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {analysis?.suggestions?.length > 0 ? (
                analysis.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <FiStar className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-800 text-sm leading-relaxed">
                      {suggestion}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No suggestions available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="mt-8 text-center bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-gray-200 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to Improve Your Resume?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Use the insights above to enhance your resume and increase your
            chances of landing your dream job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/upload-resume"
              className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 border-2 border-rose-600 hover:border-rose-700 shadow-lg transform hover:scale-105 inline-flex items-center"
            >
              <FiFileText className="mr-2 hover:text-yellow-200 transition-colors duration-300" />
              Upload New Resume
            </a>
            <a
              href="/dashboard"
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 border-2 border-gray-600 hover:border-gray-700 shadow-lg transform hover:scale-105 inline-flex items-center"
            >
              <FiExternalLink className="mr-2 hover:text-yellow-200 transition-colors duration-300" />
              Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
