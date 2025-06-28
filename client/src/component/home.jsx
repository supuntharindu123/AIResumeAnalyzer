import React from "react";
import { Link } from "react-router-dom";
import {
  FiUpload,
  FiFileText,
  FiSearch,
  FiTarget,
  FiCheckCircle,
  FiStar,
  FiShield,
  FiClock,
  FiArrowRight,
  FiBriefcase,
  FiAward,
  FiZap,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-rose-700 via-rose-600 to-amber-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Boost Your Resume with{" "}
                <span className="text-amber-300">AI Insights</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-amber-200 leading-relaxed">
                Instantly analyze and optimize your resume to match your dream
                jobs using cutting-edge AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/upload-resume"
                  className="bg-amber-400 hover:bg-amber-300 text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  <FiUpload className="mr-2" />
                  Analyze My Resume
                </Link>
                <Link
                  to="/register"
                  className="border-2 border-white hover:bg-white hover:text-rose-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center hover:shadow-lg"
                >
                  Get Started Free
                  <FiArrowRight className="ml-2" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center shadow-md">
                    <FiCheckCircle className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Instant Analysis</h3>
                    <p className="text-amber-200 text-sm">Results in seconds</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-md">
                    <FiTarget className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Tailored Match</h3>
                    <p className="text-amber-200 text-sm">Optimized for jobs</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center shadow-md">
                    <FiTrendingUp className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Career Growth</h3>
                    <p className="text-amber-200 text-sm">Faster success</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-rose-800 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-rose-600 max-w-3xl mx-auto">
              Our platform makes resume improvement effortless
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiUpload className="text-rose-600 text-3xl" />,
                title: "Upload Resume",
                description: "Easily upload your resume in PDF format.",
                bg: "bg-rose-100",
              },
              {
                icon: <FiSearch className="text-amber-600 text-3xl" />,
                title: "AI Review",
                description: "Analyze skills and keywords instantly.",
                bg: "bg-amber-100",
              },
              {
                icon: <FiTarget className="text-rose-700 text-3xl" />,
                title: "Get Feedback",
                description: "Receive actionable improvement tips.",
                bg: "bg-rose-200",
              },
            ].map((step) => (
              <div key={step.title} className="text-center group">
                <div
                  className={`${step.bg} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition duration-300 shadow-md`}
                >
                  {step.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-rose-800">
                  {step.title}
                </h3>
                <p className="text-rose-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-br from-rose-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-rose-800 mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-rose-600 max-w-3xl mx-auto">
              Designed for both job seekers and recruiters to make hiring
              smarter and careers brighter
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* For Job Seekers */}
            <div className="bg-white rounded-2xl p-8 shadow hover:shadow-lg transition duration-300 border border-rose-100">
              <h3 className="text-2xl font-semibold text-rose-700 mb-6 flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-rose-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 11c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zm0 0v6m4-10h.01M4 6h16M4 18h16M4 12h16"></path>
                </svg>
                For Job Seekers
              </h3>
              <ul className="space-y-4">
                <li className="flex">
                  <span className="text-rose-600 mr-3">✔</span>
                  <span className="text-rose-800 font-medium">
                    Cut Through the Noise:
                  </span>
                  <span className="ml-1 text-rose-700">
                    Stop guessing! Know exactly how well your resume matches the
                    job.
                  </span>
                </li>
                <li className="flex">
                  <span className="text-rose-600 mr-3">✔</span>
                  <span className="text-rose-800 font-medium">
                    Optimize for Success:
                  </span>
                  <span className="ml-1 text-rose-700">
                    Get insights to tailor your resume and land more interviews.
                  </span>
                </li>
                <li className="flex">
                  <span className="text-rose-600 mr-3">✔</span>
                  <span className="text-rose-800 font-medium">Save Time:</span>
                  <span className="ml-1 text-rose-700">
                    Focus on jobs where you truly fit.
                  </span>
                </li>
              </ul>
            </div>

            {/* For Recruiters */}
            <div className="bg-white rounded-2xl p-8 shadow hover:shadow-lg transition duration-300 border border-amber-100">
              <h3 className="text-2xl font-semibold text-amber-700 mb-6 flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 5h18M9 3v2m6-2v2m-9 4h12l-1.5 13h-9L6 9z"></path>
                </svg>
                For Recruiters
              </h3>
              <ul className="space-y-4">
                <li className="flex">
                  <span className="text-amber-600 mr-3">✔</span>
                  <span className="text-amber-800 font-medium">
                    Accelerate Hiring:
                  </span>
                  <span className="ml-1 text-amber-700">
                    Instantly filter and rank candidates by relevance.
                  </span>
                </li>
                <li className="flex">
                  <span className="text-amber-600 mr-3">✔</span>
                  <span className="text-amber-800 font-medium">
                    Hire Smarter:
                  </span>
                  <span className="ml-1 text-amber-700">
                    Leverage AI for unbiased, semantic matching, finding hidden
                    talent.
                  </span>
                </li>
                <li className="flex">
                  <span className="text-amber-600 mr-3">✔</span>
                  <span className="text-amber-800 font-medium">
                    Reduce Cost:
                  </span>
                  <span className="ml-1 text-amber-700">
                    Efficient screening means less time wasted on manual
                    reviews.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-rose-700 to-amber-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl mb-8 text-amber-200">
            Join professionals who have optimized their resumes and accelerated
            their job search
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/upload-resume"
              className="bg-amber-400 hover:bg-amber-300 text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              <FiUpload className="mr-2" />
              Start Free Analysis
            </Link>
            <Link
              to="/register"
              className="border-2 border-white hover:bg-white hover:text-rose-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center hover:shadow-lg"
            >
              Create Account
              <FiUsers className="ml-2" />
            </Link>
          </div>
          <p className="text-amber-300 text-sm mt-6">
            No credit card required • Free analysis • Secure & private
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
