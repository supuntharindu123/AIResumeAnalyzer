import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiFile, FiX, FiBriefcase, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Image from "../assets/IMG03.jpg";

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
    if (files[0]?.file) {
      const url = URL.createObjectURL(files[0].file);
      window.open(url, "_blank", "noopener,noreferrer");
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
    <div
      className="min-h-screen p-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(249, 250, 251, 0.9), rgba(254, 242, 242, 0.9)), url(${Image})`,
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-start mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            Resume Match Analysis
          </h1>
          <p className="text-lg text-gray-600">
            Upload your resume and job description to see how well they match
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Resume Upload */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-gray-200">
            <div className="flex items-center mb-6">
              <FiFile className="text-2xl text-rose-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Upload Resume
              </h2>
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-rose-400 bg-rose-50"
                  : "border-gray-300 hover:border-rose-400 hover:bg-rose-50"
              }`}
            >
              <input {...getInputProps()} />
              <FiUpload className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-600 font-medium">
                {isDragActive
                  ? "Drop your resume here"
                  : "Drag & drop your resume PDF, or click to select"}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Maximum file size: 10MB • PDF files only
              </p>
            </div>

            {files.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div
                    className="flex items-center flex-1 cursor-pointer hover:text-rose-600 transition-colors"
                    onClick={openFileInBrowser}
                  >
                    <FiFile className="text-rose-600 mr-3 text-xl" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {files[0].name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {files[0].size} MB • Click to preview
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors ml-3"
                    aria-label="Remove file"
                  >
                    <FiX className="text-gray-500 hover:text-red-500" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-gray-200">
            <div className="flex items-center mb-6">
              <FiBriefcase className="text-2xl text-rose-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Job Description
              </h2>
            </div>

            <div className="relative">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-[300px] p-4 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 resize-none transition-colors"
              />
              <div className="absolute bottom-4 right-4 text-gray-400 text-sm select-none bg-white px-2 py-1 rounded">
                {jobDescription.length} characters
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <FiX className="text-red-500 mr-2" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={files.length === 0 || !jobDescription.trim() || uploading}
            className={`px-8 py-4 rounded-xl flex items-center space-x-3 font-semibold text-lg transition-all duration-300 ${
              files.length === 0 || !jobDescription.trim() || uploading
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-lg transform hover:scale-105"
            }`}
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span>Analyzing Resume...</span>
              </>
            ) : (
              <>
                <FiSearch className="text-xl" />
                <span>Analyze Resume Match</span>
              </>
            )}
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            How it works:
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div className="flex items-start">
              <div className="bg-rose-100 text-rose-600 rounded-full p-2 mr-3">
                <FiUpload className="text-lg" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">1. Upload Resume</h4>
                <p>Upload your resume in PDF format</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-rose-100 text-rose-600 rounded-full p-2 mr-3">
                <FiBriefcase className="text-lg" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">
                  2. Add Job Description
                </h4>
                <p>Paste the job description you're applying for</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-rose-100 text-rose-600 rounded-full p-2 mr-3">
                <FiSearch className="text-lg" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">3. Get Analysis</h4>
                <p>Receive detailed match analysis and suggestions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploader;
