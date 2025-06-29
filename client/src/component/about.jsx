import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-rose-800 mb-6">
            About AI Resume Analyzer
          </h1>
          <p className="text-xl text-rose-700 leading-relaxed">
            We're revolutionizing the way people optimize their resumes and
            advance their careers through artificial intelligence.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-rose-800 mb-6">Our Mission</h2>
          <p className="text-lg text-rose-700 mb-6">
            At AI Resume Analyzer, we believe everyone deserves a fair chance to
            showcase their talents and land their dream job. Our mission is to
            democratize access to professional resume optimization through
            cutting-edge AI technology.
          </p>
          <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-rose-600 mb-2">50K+</div>
              <div className="text-rose-700">Resumes Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-600 mb-2">95%</div>
              <div className="text-rose-700">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-rose-800">
              AI-Powered Analysis
            </h3>
            <p className="text-rose-700">
              Advanced algorithms analyze your resume for optimal job matching.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-rose-800">
              Instant Results
            </h3>
            <p className="text-rose-700">
              Get comprehensive feedback and suggestions in seconds.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-rose-800">
              Privacy First
            </h3>
            <p className="text-rose-700">
              Your data is secure and processed with enterprise-grade security.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-rose-600 via-amber-600 to-amber-500 text-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-6 text-amber-100">
            Join thousands of professionals improving their careers with AI.
          </p>
          <Link
            to="/upload-resume"
            className="bg-amber-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-amber-300 transition duration-300 inline-block"
          >
            Analyze My Resume
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
