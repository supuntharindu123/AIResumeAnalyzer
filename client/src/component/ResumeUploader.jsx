import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiFile, FiX, FiBriefcase, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ResumeUploader = () => {
  const [files, setFiles] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    const allowedTypes = ['application/pdf'];
    const file = acceptedFiles[0];

    if (!allowedTypes.includes(file?.type)) {
      setError("Please upload a PDF file");
      return;
    }

    setFiles([
      {
        file,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2), // Convert to MB
      },
    ]);
    setError("");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
  });

  const removeFile = () => {
    setFiles([]);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError("Please upload your resume");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter a job description");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", files[0].file);
      formData.append("jobDescription", jobDescription);

      const response = await fetch("http://localhost:5000/api/resume/analyze", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      navigate(`/analysis/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Resume Match Analysis
          </h1>
          <p className="text-lg text-gray-600">
            Upload your resume and job description to see how well they match
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Resume Upload Section */}
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <FiFile className="text-2xl text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold">Upload Resume</h2>
            </div>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-500"
              }`}
            >
              <input {...getInputProps()} />
              <FiUpload className="mx-auto text-3xl text-gray-400 mb-4" />
              <p className="text-gray-600">
                {isDragActive
                  ? "Drop your resume here"
                  : "Drag & drop your resume PDF, or click to select"}
              </p>
              <p className="text-sm text-gray-500 mt-2">Maximum file size: 10MB</p>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FiFile className="text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium">{files[0].name}</p>
                      <p className="text-xs text-gray-500">{files[0].size} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <FiX className="text-gray-500" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Job Description Section */}
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <FiBriefcase className="text-2xl text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold">Job Description</h2>
            </div>

            <div className="relative">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-[300px] p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500"
              />
              <div className="absolute bottom-4 right-4 text-gray-400 text-sm">
                {jobDescription.length} characters
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Analysis Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <FiSearch className="text-3xl text-blue-600 mb-3" />
            <h3 className="font-semibold mb-2">Keyword Analysis</h3>
            <p className="text-gray-600 text-sm">
              Identifies matching keywords and skills
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <FiFile className="text-3xl text-blue-600 mb-3" />
            <h3 className="font-semibold mb-2">Format Check</h3>
            <p className="text-gray-600 text-sm">
              Ensures your resume follows best practices
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <FiBriefcase className="text-3xl text-blue-600 mb-3" />
            <h3 className="font-semibold mb-2">Match Score</h3>
            <p className="text-gray-600 text-sm">
              Calculate job fit percentage
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={files.length === 0 || !jobDescription || uploading}
            className={`px-8 py-4 rounded-xl flex items-center space-x-3 ${
              files.length === 0 || !jobDescription || uploading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            } text-white font-medium text-lg shadow-lg transform transition hover:scale-105`}
          >
            {uploading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <FiSearch className="text-xl" />
                <span>Analyze Match</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploader;