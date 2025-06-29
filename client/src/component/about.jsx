import React from "react";
import { Link } from "react-router-dom";
import {
  FiTarget,
  FiUsers,
  FiZap,
  FiShield,
  FiAward,
  FiTrendingUp,
  FiCheckCircle,
  FiHeart,
  FiGlobe,
  FiStar,
  FiCpu,
  FiBookOpen,
  FiMail,
  FiLinkedin,
  FiTwitter,
} from "react-icons/fi";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-500">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            About AI Resume Analyzer
          </h1>
          <p className="text-xl lg:text-2xl text-rose-100 leading-relaxed max-w-4xl mx-auto">
            Empowering careers through intelligent resume analysis and
            optimization. We're bridging the gap between talent and opportunity
            with cutting-edge AI technology.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-rose-300/30">
            <div className="flex items-center mb-6">
              <FiTarget className="text-3xl text-rose-100 hover:text-amber-100 transition-colors duration-300 mr-4" />
              <h2 className="text-3xl font-bold text-white">Our Mission</h2>
            </div>
            <p className="text-lg text-rose-100 mb-6 leading-relaxed">
              To democratize access to professional resume optimization through
              artificial intelligence, ensuring every job seeker has the tools
              they need to present their best professional self and secure
              meaningful employment opportunities.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-rose-100">
                <FiCheckCircle className="text-green-400 mr-3 hover:text-amber-100 transition-colors duration-300" />
                Make resume optimization accessible to everyone
              </li>
              <li className="flex items-center text-rose-100">
                <FiCheckCircle className="text-green-400 mr-3 hover:text-amber-100 transition-colors duration-300" />
                Reduce hiring bias through objective analysis
              </li>
              <li className="flex items-center text-rose-100">
                <FiCheckCircle className="text-green-400 mr-3 hover:text-amber-100 transition-colors duration-300" />
                Bridge the gap between talent and opportunity
              </li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-rose-300/30">
            <div className="flex items-center mb-6">
              <FiGlobe className="text-3xl text-rose-100 hover:text-amber-100 transition-colors duration-300 mr-4" />
              <h2 className="text-3xl font-bold text-white">Our Vision</h2>
            </div>
            <p className="text-lg text-rose-100 mb-6 leading-relaxed">
              A world where career advancement is based purely on merit and
              potential, where every professional has access to intelligent
              tools that help them showcase their unique value proposition to
              employers.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-rose-100">
                <FiStar className="text-amber-400 mr-3 hover:text-amber-100 transition-colors duration-300" />
                Leading AI-powered career platform globally
              </li>
              <li className="flex items-center text-rose-100">
                <FiStar className="text-amber-400 mr-3 hover:text-amber-100 transition-colors duration-300" />
                Transforming how recruitment works
              </li>
              <li className="flex items-center text-rose-100">
                <FiStar className="text-amber-400 mr-3 hover:text-amber-100 transition-colors duration-300" />
                Creating equal opportunities for all
              </li>
            </ul>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            How We're Different
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-lg text-center border border-rose-300/30 hover:bg-white/20 transition-all duration-300">
              <div className="bg-rose-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCpu className="text-3xl text-rose-100 hover:text-amber-100 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                Advanced AI Technology
              </h3>
              <p className="text-rose-100 leading-relaxed">
                Our proprietary algorithms use natural language processing and
                machine learning to understand job requirements and match them
                with resume content at a semantic level.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-lg text-center border border-rose-300/30 hover:bg-white/20 transition-all duration-300">
              <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiZap className="text-3xl text-green-300 hover:text-amber-100 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                Real-Time Analysis
              </h3>
              <p className="text-rose-100 leading-relaxed">
                Get instant, comprehensive feedback with detailed match scores,
                keyword analysis, and actionable recommendations to improve your
                resume's effectiveness.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-lg text-center border border-rose-300/30 hover:bg-white/20 transition-all duration-300">
              <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiShield className="text-3xl text-blue-300 hover:text-amber-100 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                Privacy & Security
              </h3>
              <p className="text-rose-100 leading-relaxed">
                Your personal data is protected with enterprise-grade security.
                We never store or share your resume content, ensuring complete
                confidentiality.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-8 mb-16 border border-rose-300/30">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Get In Touch
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <FiMail className="text-3xl text-rose-100 hover:text-amber-100 transition-colors duration-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Email Us
              </h3>
              <p className="text-rose-100">support@airesume.com</p>
            </div>
            <div>
              <FiLinkedin className="text-3xl text-rose-100 hover:text-amber-100 transition-colors duration-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                LinkedIn
              </h3>
              <p className="text-rose-100">@ai-resume-analyzer</p>
            </div>
            <div>
              <FiTwitter className="text-3xl text-rose-100 hover:text-amber-100 transition-colors duration-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Twitter</h3>
              <p className="text-rose-100">@AIResumeAnalyzer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
