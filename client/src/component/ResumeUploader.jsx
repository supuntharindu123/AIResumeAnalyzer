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
    const allowedTypes = ["application/pdf"];
    const file = acceptedFiles[0];

    if (!allowedTypes.includes(file?.type)) {
      setError("Please upload a PDF file");
      return;
    }

    setFiles([
      {
        file,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2), // MB
      },
    ]);
    setError("");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const openFileInBrowser = () => {
    if (files[0]?.url) {
      window.open(files[0].url, "_blank", "noopener,noreferrer");
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
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

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      navigate(`/analysis/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-rose-600 mb-4">
            Resume Match Analysis
          </h1>
          <p className="text-lg text-rose-700">
            Upload your resume and job description to see how well they match
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Resume Upload */}
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <FiFile className="text-2xl text-rose-600 mr-3" />
              <h2 className="text-2xl font-semibold text-rose-700">
                Upload Resume
              </h2>
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-rose-400 bg-rose-50"
                  : "border-rose-300 hover:border-rose-400"
              }`}
            >
              <input {...getInputProps()} />
              <FiUpload className="mx-auto text-3xl text-rose-300 mb-4" />
              <p className="text-rose-600">
                {isDragActive
                  ? "Drop your resume here"
                  : "Drag & drop your resume PDF, or click to select"}
              </p>
              <p className="text-sm text-rose-400 mt-2">
                Maximum file size: 10MB
              </p>
            </div>

            {files.length > 0 && (
              <button onClick={openFileInBrowser} className="w-full mt-4">
                <div className="flex items-center justify-between p-3 bg-rose-50 rounded-lg cursor-pointer hover:bg-rose-100 transition">
                  <div className="flex items-center">
                    <FiFile className="text-rose-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-rose-700">
                        {files[0].name}
                      </p>
                      <p className="text-xs text-rose-400">
                        {files[0].size} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-1 hover:bg-rose-200 rounded-full transition-colors"
                    aria-label="Remove file"
                  >
                    <FiX className="text-rose-500" />
                  </button>
                </div>
              </button>
            )}
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <FiBriefcase className="text-2xl text-rose-600 mr-3" />
              <h2 className="text-2xl font-semibold text-rose-700">
                Job Description
              </h2>
            </div>

            <div className="relative">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-[300px] p-4 border-2 border-rose-200 rounded-lg focus:border-rose-500 focus:ring-rose-500 resize-none"
              />
              <div className="absolute bottom-4 right-4 text-rose-400 text-sm select-none">
                {jobDescription.length} characters
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-rose-100 border border-rose-300 rounded-lg">
            <p className="text-rose-700">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={files.length === 0 || !jobDescription || uploading}
            className={`px-8 py-4 rounded-xl flex items-center space-x-3 ${
              files.length === 0 || !jobDescription || uploading
                ? "bg-rose-200 cursor-not-allowed text-rose-400"
                : "bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-lg transform transition hover:scale-105"
            } font-medium text-lg`}
          >
            {uploading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
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
