import React from 'react';
import { FiCheck, FiX, FiAlertCircle, FiAward, FiUser, FiBriefcase, FiBook, FiAward as FiCertificate } from 'react-icons/fi';

const AnalysisResults = ({ analysis, matchScore, resumeData }) => {
  return (
    <div className="bg-white rounded-xl shadow-xl p-8">
      {/* Match Score Section */}
      <div className="text-center mb-12">
        <div className="relative inline-block">
          <div className="text-6xl font-bold mb-2">
            {matchScore}%
          </div>
          <FiAward className="absolute -top-4 -right-4 text-4xl text-blue-500" />
        </div>
        <div className="text-gray-600">Match Score</div>
      </div>

      {/* Resume Structure Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <span className="bg-purple-100 p-2 rounded-lg mr-2">
            <FiUser className="text-purple-600" />
          </span>
          Resume Structure
        </h3>

        {/* Personal Information */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-2">Personal Information</h4>
          <div className="bg-purple-50 p-4 rounded-lg">
            {resumeData?.personalInfo?.name && (
              <p className="text-gray-700"><span className="font-medium">Name:</span> {resumeData.personalInfo.name}</p>
            )}
            {resumeData?.personalInfo?.email && (
              <p className="text-gray-700"><span className="font-medium">Email:</span> {resumeData.personalInfo.email}</p>
            )}
            {resumeData?.personalInfo?.phone && (
              <p className="text-gray-700"><span className="font-medium">Phone:</span> {resumeData.personalInfo.phone}</p>
            )}
            {resumeData?.personalInfo?.location && (
              <p className="text-gray-700"><span className="font-medium">Location:</span> {resumeData.personalInfo.location}</p>
            )}
          </div>
        </div>

        {/* Education */}
        {resumeData?.education?.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">Education</h4>
            <div className="space-y-3">
              {resumeData.education.map((edu, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-lg">
                  {edu.degree && <p className="font-medium text-blue-700">{edu.degree}</p>}
                  {edu.institution && <p className="text-gray-700">{edu.institution}</p>}
                  {edu.year && <p className="text-gray-600">{edu.year}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {resumeData?.experience?.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">Experience</h4>
            <div className="space-y-3">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="bg-green-50 p-4 rounded-lg">
                  {exp.title && <p className="font-medium text-green-700">{exp.title}</p>}
                  {exp.company && <p className="text-gray-700">{exp.company}</p>}
                  {exp.date && <p className="text-gray-600">{exp.date}</p>}
                  {exp.responsibilities && (
                    <ul className="list-disc list-inside mt-2">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx} className="text-gray-600">{resp}</li>
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
            <h4 className="font-semibold text-gray-700 mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span key={index} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {resumeData?.certifications?.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">Certifications</h4>
            <div className="space-y-2">
              {resumeData.certifications.map((cert, index) => (
                <div key={index} className="bg-yellow-50 p-3 rounded-lg text-gray-700">
                  {cert}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Keywords Analysis */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <span className="bg-blue-100 p-2 rounded-lg mr-2">
            <FiCheck className="text-blue-600" />
          </span>
          Keyword Analysis
        </h3>
        <div className="grid gap-2">
          {analysis.keywords.map((keyword, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-between p-3 rounded-lg ${
                keyword.matches 
                  ? 'bg-green-50 border border-green-100' 
                  : 'bg-red-50 border border-red-100'
              }`}
            >
              <div className="flex items-center">
                {keyword.matches ? (
                  <FiCheck className="text-green-500 mr-2" />
                ) : (
                  <FiX className="text-red-500 mr-2" />
                )}
                <span className={keyword.matches ? 'text-green-700' : 'text-red-700'}>
                  {keyword.word}
                </span>
              </div>
              <span className="text-gray-500 text-sm">
                Found: {keyword.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Format Issues */}
      {analysis.formatIssues.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span className="bg-yellow-100 p-2 rounded-lg mr-2">
              <FiAlertCircle className="text-yellow-600" />
            </span>
            Format Issues
          </h3>
          <div className="space-y-2">
            {analysis.formatIssues.map((issue, index) => (
              <div key={index} className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <p className="text-yellow-700">{issue}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <span className="bg-indigo-100 p-2 rounded-lg mr-2">
            <FiAward className="text-indigo-600" />
          </span>
          Improvement Suggestions
        </h3>
        <div className="space-y-2">
          {analysis.suggestions.map((suggestion, index) => (
            <div key={index} className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <p className="text-indigo-700">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const getResumeData = async (resumeId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/resume/${resumeId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch resume data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export default AnalysisResults;