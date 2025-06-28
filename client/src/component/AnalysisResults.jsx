import React from "react";
import {
  FiCheck,
  FiX,
  FiAlertCircle,
  FiAward,
  FiUser,
  FiBriefcase,
} from "react-icons/fi";

const AnalysisResults = ({ analysis, matchScore, resumeData }) => {
  return (
    <div className="bg-white rounded-xl shadow-xl p-8">
      {/* Match Score Section */}
      <div className="text-center mb-12">
        <div className="relative inline-block">
          <div className="text-6xl font-extrabold mb-2 text-rose-700">
            {matchScore}%
          </div>
          <FiAward className="absolute -top-5 -right-5 text-5xl text-amber-500" />
        </div>
        <div className="text-rose-500 font-semibold tracking-wide">
          Match Score
        </div>
      </div>

      {/* Resume Structure Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-5 flex items-center text-rose-700">
          <span className="bg-rose-100 p-3 rounded-lg mr-3">
            <FiUser className="text-rose-600 text-2xl" />
          </span>
          Resume Structure
        </h3>

        {/* Personal Information */}
        <div className="mb-6">
          <h4 className="font-semibold text-rose-700 mb-3">
            Personal Information
          </h4>
          <div className="bg-rose-50 p-5 rounded-lg border border-rose-100">
            {resumeData?.personalInfo?.name && (
              <p className="text-rose-700">
                <span className="font-semibold">Name:</span>{" "}
                {resumeData.personalInfo.name}
              </p>
            )}
            {resumeData?.personalInfo?.email && (
              <p className="text-rose-700">
                <span className="font-semibold">Email:</span>{" "}
                {resumeData.personalInfo.email}
              </p>
            )}
            {resumeData?.personalInfo?.phone && (
              <p className="text-rose-700">
                <span className="font-semibold">Phone:</span>{" "}
                {resumeData.personalInfo.phone}
              </p>
            )}
            {resumeData?.personalInfo?.location && (
              <p className="text-rose-700">
                <span className="font-semibold">Location:</span>{" "}
                {resumeData.personalInfo.location}
              </p>
            )}
          </div>
        </div>

        {/* Education */}
        {resumeData?.education?.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-amber-700 mb-3">Education</h4>
            <div className="space-y-4">
              {resumeData.education.map((edu, index) => (
                <div
                  key={index}
                  className="bg-amber-50 p-5 rounded-lg border border-amber-100"
                >
                  {edu.degree && (
                    <p className="font-semibold text-amber-700">{edu.degree}</p>
                  )}
                  {edu.institution && (
                    <p className="text-amber-800">{edu.institution}</p>
                  )}
                  {edu.year && <p className="text-amber-600">{edu.year}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {resumeData?.experience?.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-green-700 mb-3">Experience</h4>
            <div className="space-y-4">
              {resumeData.experience.map((exp, index) => (
                <div
                  key={index}
                  className="bg-green-50 p-5 rounded-lg border border-green-100"
                >
                  {exp.title && (
                    <p className="font-semibold text-green-700">{exp.title}</p>
                  )}
                  {exp.company && (
                    <p className="text-green-800">{exp.company}</p>
                  )}
                  {exp.date && <p className="text-green-600">{exp.date}</p>}
                  {exp.responsibilities && (
                    <ul className="list-disc list-inside mt-3 text-green-700">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {resumeData?.skills?.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-indigo-700 mb-3">Skills</h4>
            <div className="flex flex-wrap gap-3">
              {resumeData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {resumeData?.certifications?.length > 0 && (
          <div className="mb-8">
            <h4 className="font-semibold text-yellow-700 mb-3">
              Certifications
            </h4>
            <div className="space-y-3">
              {resumeData.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-yellow-800 font-medium"
                >
                  {cert}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Keywords Analysis */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-5 flex items-center text-blue-700">
          <span className="bg-blue-100 p-3 rounded-lg mr-3">
            <FiCheck className="text-blue-600 text-2xl" />
          </span>
          Keyword Analysis
        </h3>
        <div className="grid gap-3">
          {analysis.keywords.map((keyword, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                keyword.matches
                  ? "bg-rose-50 border-rose-200"
                  : "bg-rose-100 border-rose-300"
              }`}
            >
              <div className="flex items-center">
                {keyword.matches ? (
                  <FiCheck className="text-rose-600 mr-3" />
                ) : (
                  <FiX className="text-rose-700 mr-3" />
                )}
                <span
                  className={
                    keyword.matches
                      ? "text-rose-700 font-semibold"
                      : "text-rose-800 font-semibold"
                  }
                >
                  {keyword.word}
                </span>
              </div>
              <span className="text-rose-500 text-sm">
                Found: {keyword.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Format Issues */}
      {analysis.formatIssues.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-5 flex items-center text-yellow-700">
            <span className="bg-yellow-100 p-3 rounded-lg mr-3">
              <FiAlertCircle className="text-yellow-600 text-2xl" />
            </span>
            Format Issues
          </h3>
          <div className="space-y-4">
            {analysis.formatIssues.map((issue, index) => (
              <div
                key={index}
                className="p-5 bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-700 font-medium"
              >
                {issue}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div>
        <h3 className="text-2xl font-bold mb-5 flex items-center text-indigo-700">
          <span className="bg-indigo-100 p-3 rounded-lg mr-3">
            <FiAward className="text-indigo-600 text-2xl" />
          </span>
          Improvement Suggestions
        </h3>
        <div className="space-y-4">
          {analysis.suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-5 bg-indigo-50 rounded-lg border border-indigo-200 text-indigo-700 font-semibold"
            >
              {suggestion}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
