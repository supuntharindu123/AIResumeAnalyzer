import React, { useState, useEffect } from "react";
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
  FiBarChart,
  FiLayers,
  FiCpu,
  FiActivity,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Img from "../assets/IMG05.jpg";
import Image from "../assets/IMG02.jpg";
import Images from "../assets/IMG01.jpg";
import Back from "../assets/IMG02.jpg";
import BackImg from "../assets/IMG03.jpg";

const Home = () => {
  // Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Hero background images array
  const heroImages = [
    {
      src: BackImg,
      gradient: "linear-gradient(to bottom right, rgba(55, 65, 81, 0.8))",
      title: "Smart Resume Analysis",
      subtitle:
        "For Job Seeker, Get detailed insights and match scores to improve your job application success rate.",
    },
    {
      src: Images,
      gradient: "linear-gradient(to bottom right, rgba(75, 85, 99, 0.8))",
      title: "Smart Resume Analysis",
      subtitle:
        "For Recruiters, Streamline your hiring process with AI-powered resume screening and candidate matching.",
    },
    {
      src: Image,
      gradient: "linear-gradient(to bottom right, rgba(31, 41, 55, 0.7))",
      title: "Smart Resume Analysis",
      subtitle:
        "For Job Seeker, Get detailed insights and match scores to improve your job application success rate.",
    },
    {
      src: Img,
      gradient: "linear-gradient(to bottom right, rgba(17, 24, 39, 0.7))",
      title: "Smart Resume Analysis",
      subtitle:
        "For Recruiters, Streamline your hiring process with AI-powered resume screening and candidate matching",
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length);
      }, 3000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, heroImages.length]);

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroImages.length) % heroImages.length
    );
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-rose-800">
      {/* Hero Section with Slideshow */}
      <section className="relative overflow-hidden text-white min-h-96">
        {/* Background Image Slideshow */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `${image.gradient}, url(${image.src})`,
              }}
            />
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white scale-125 shadow-lg"
                  : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* Auto-play Control */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="absolute top-6 right-6 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all duration-300 border border-white/20 hover:border-white/40"
        >
          {isAutoPlaying ? (
            <div className="w-4 h-4 bg-white rounded-sm opacity-80"></div>
          ) : (
            <div className="w-0 h-0 border-l-4 border-white border-t-2 border-b-2 border-t-transparent border-b-transparent opacity-80"></div>
          )}
        </button>

        {/* Hero Content - Centered */}
        <div className="relative max-w-4xl mx-auto px-6 py-20 lg:py-40 z-10 text-center">
          {/* Dynamic Title with Slide Animation */}
          <h1
            key={currentSlide} // Force re-render on slide change
            className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-white animate-slide-in-up"
          >
            {heroImages[currentSlide].title.split(" ").map((word, index) => {
              if (
                word === "AI" ||
                word === "Smart" ||
                word === "AI-Powered" ||
                word === "Professional" ||
                word === "Next-Gen"
              ) {
                return (
                  <span key={index} className="text-rose-100">
                    {word}{" "}
                  </span>
                );
              }
              return word + " ";
            })}
          </h1>

          {/* Dynamic Subtitle with Slide Animation */}
          <p
            key={`subtitle-${currentSlide}`}
            className="text-xl lg:text-2xl mb-8 text-rose-100 leading-relaxed animate-slide-in-up animation-delay-300 max-w-2xl mx-auto"
          >
            {heroImages[currentSlide].subtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-slide-in-up animation-delay-500">
            <Link
              to="/upload-resume"
              className="hover:bg-rose-300/10 text-black hover:text-gray-200 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center bg-white"
            >
              <FiUpload className="mr-2 group-hover:animate-bounce" />
              Analyze Resume
            </Link>
            <Link
              to="/register"
              className=" hover:bg-rose-300/10 text-black hover:text-gray-200 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center bg-white"
            >
              Get Started Free
              <FiArrowRight className="ml-2 group-hover:animate-pulse" />
            </Link>
          </div>

          {/* Feature Points */}
          <div className="flex items-center justify-center space-x-8 text-sm text-rose-100 animate-slide-in-up animation-delay-700">
            <div className="flex items-center group">
              <FiCheckCircle className="mr-2 group-hover:animate-spin transition-colors duration-300" />
              <span>Free Analysis</span>
            </div>
            <div className="flex items-center group">
              <FiShield className="mr-2 group-hover:animate-pulse transition-colors duration-300" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center group">
              <FiZap className="mr-2 group-hover:animate-bounce transition-colors duration-300" />
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </section>
      {/* Key Features Section with Background */}
      <section
        className="py-20 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `linear-gradient(rgba(249, 250, 251, 0.8), rgba(254, 242, 242, 0.8)), url(${Image})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Powerful AI Features
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Everything you need to optimize your resume and accelerate your
              job search
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Resume Upload & Analysis */}
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-rose-300 group">
              <div className="bg-rose-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FiUpload className="text-rose-800 text-2xl hover:text-amber-100 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Smart Resume Upload
              </h3>
              <p className="text-gray-700 mb-4">
                Drag & drop PDF resumes with instant text extraction and
                formatting analysis.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• PDF format support</li>
                <li>• 10MB file size limit</li>
                <li>• Instant processing</li>
              </ul>
            </div>

            {/* Job Description Analysis */}
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-rose-300 group">
              <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FiBriefcase className="text-gray-800 text-2xl hover:text-amber-100 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Job Match Analysis
              </h3>
              <p className="text-gray-700 mb-4">
                Paste job descriptions and get instant compatibility scoring
                with detailed breakdown.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Skill requirement matching</li>
                <li>• Experience level analysis</li>
                <li>• Education compatibility</li>
              </ul>
            </div>

            {/* AI Match Scoring */}
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-rose-300 group">
              <div className="bg-rose-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FiTarget className="text-rose-800 text-2xl hover:text-amber-100 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                AI Match Scoring
              </h3>
              <p className="text-gray-700 mb-4">
                Get precise percentage scores showing how well your resume
                matches job requirements.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Color-coded scoring</li>
                <li>• Detailed breakdown</li>
                <li>• Improvement suggestions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* How It Works with Background */}
      <section
        className="py-20 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url(${Images})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Get professional resume analysis in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="text-center group relative">
              <div className="bg-gradient-to-r from-rose-100 to-rose-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg border border-rose-300">
                <FiUpload className="text-rose-800 text-3xl hover:text-amber-100 transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                1. Upload Resume
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Simply drag and drop your PDF resume or click to browse. Our AI
                instantly extracts and analyzes your content.
              </p>
              <div className="hidden md:block absolute top-10 -right-8 text-rose-300">
                <FiArrowRight className="text-2xl" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center group relative">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg border border-rose-300">
                <FiBriefcase className="text-gray-800 text-3xl hover:text-amber-100 transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                2. Add Job Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Paste the job description you're targeting. Our AI analyzes
                requirements, skills, and qualifications.
              </p>
              <div className="hidden md:block absolute top-10 -right-8 text-rose-300">
                <FiArrowRight className="text-2xl" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="bg-gradient-to-r from-rose-100 to-rose-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg border border-rose-300">
                <FiTarget className="text-rose-800 text-3xl hover:text-amber-100 transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                3. Get Results
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Receive detailed analysis with match scores, missing keywords,
                and actionable improvement suggestions.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Feature Showcase with Background */}
      {/* Why Choose Us Section with Background */}
      <section
        className="py-20 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `linear-gradient(rgba(31, 41, 55, 0.8), rgba(159, 18, 57, 0.3)), url(${Img})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Designed for both job seekers and recruiters to make hiring
              smarter and careers brighter
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* For Job Seekers */}
            <div
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition duration-300 border border-rose-300"
              style={{
                backgroundImage: `linear-gradient(rgba(249, 250, 251, 0.9), rgba(254, 242, 242, 0.9)), url(${Image})`,
              }}
            >
              <h3 className="text-2xl font-semibold text-rose-800 mb-6 flex items-center">
                <FiUsers className="mr-3 text-rose-800 hover:text-amber-100 transition-colors duration-300" />
                For Job Seekers
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-rose-800 mr-3 mt-1">✔</span>
                  <div>
                    <span className="text-gray-800 font-medium">
                      Cut Through the Noise:
                    </span>
                    <span className="ml-1 text-gray-700">
                      Stop guessing! Know exactly how well your resume matches
                      the job.
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-rose-800 mr-3 mt-1">✔</span>
                  <div>
                    <span className="text-gray-800 font-medium">
                      Optimize for Success:
                    </span>
                    <span className="ml-1 text-gray-700">
                      Get insights to tailor your resume and land more
                      interviews.
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-rose-800 mr-3 mt-1">✔</span>
                  <div>
                    <span className="text-gray-800 font-medium">
                      Save Time:
                    </span>
                    <span className="ml-1 text-gray-700">
                      Focus on jobs where you truly fit.
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* For Recruiters */}
            <div
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition duration-300 border border-rose-300"
              style={{
                backgroundImage: `linear-gradient(rgba(249, 250, 251, 0.9), rgba(254, 242, 242, 0.9)), url(${Image})`,
              }}
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <FiBriefcase className="mr-3 text-gray-800 hover:text-amber-100 transition-colors duration-300" />
                For Recruiters
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-gray-800 mr-3 mt-1">✔</span>
                  <div>
                    <span className="text-gray-800 font-medium">
                      Accelerate Hiring:
                    </span>
                    <span className="ml-1 text-gray-700">
                      Instantly filter and rank candidates by relevance.
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-800 mr-3 mt-1">✔</span>
                  <div>
                    <span className="text-gray-800 font-medium">
                      Hire Smarter:
                    </span>
                    <span className="ml-1 text-gray-700">
                      Leverage AI for unbiased, semantic matching, finding
                      hidden talent.
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-800 mr-3 mt-1">✔</span>
                  <div>
                    <span className="text-gray-800 font-medium">
                      Reduce Cost:
                    </span>
                    <span className="ml-1 text-gray-700">
                      Efficient screening means less time wasted on manual
                      reviews.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section
        className="py-20 bg-white"
        style={{
          backgroundImage: `linear-gradient(rgba(249, 250, 251, 0.9), rgba(254, 242, 242, 0.9)), url(${Image})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-700">
              See how our AI has helped their dream jobs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Software Engineer at Google",
                content:
                  "The AI analysis showed me exactly what keywords I was missing. Got 5 interviews in 2 weeks!",
                score: "89% match score",
                avatar: "SJ",
              },
              {
                name: "Michael Chen",
                role: "Product Manager at Microsoft",
                content:
                  "Amazing tool! The detailed feedback helped me tailor my resume perfectly for PM roles.",
                score: "94% match score",
                avatar: "MC",
              },
              {
                name: "Emily Parker",
                role: "Data Scientist at Netflix",
                content:
                  "Love the instant analysis feature. Saved me hours of guessing what recruiters want to see.",
                score: "91% match score",
                avatar: "EP",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-rose-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-rose-800 to-gray-700 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex text-yellow-400"></div>
                  <span className="text-sm font-medium text-rose-800">
                    {testimonial.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section with Background
      <section
        className="py-20 text-white bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `linear-gradient(rgba(31, 41, 55, 0.9), rgba(159, 18, 57, 0.9)), url(${Img})`,
        }}
      >
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl lg:text-2xl mb-8 text-rose-100">
            Join thousands of professionals who've optimized their resumes and
            accelerated their careers with AI
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-rose-300">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <FiZap className="text-rose-100 text-3xl mx-auto mb-2 hover:text-amber-100 transition-colors duration-300" />
                <div className="font-semibold text-white">Instant Analysis</div>
                <div className="text-rose-100 text-sm">
                  Results in 30 seconds
                </div>
              </div>
              <div>
                <FiTarget className="text-rose-100 text-3xl mx-auto mb-2 hover:text-amber-100 transition-colors duration-300" />
                <div className="font-semibold text-white">Perfect Matching</div>
                <div className="text-rose-100 text-sm">95% accuracy rate</div>
              </div>
              <div>
                <FiShield className="text-rose-100 text-3xl mx-auto mb-2 hover:text-amber-100 transition-colors duration-300" />
                <div className="font-semibold text-white">100% Secure</div>
                <div className="text-rose-100 text-sm">Your data protected</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/upload-resume"
              className="bg-white hover:bg-gray-200 text-gray-800 px-8 py-4 rounded-xl font-semibold text-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              <FiUpload className="mr-2" />
              Start Free Analysis
            </Link>
            <Link
              to="/register"
              className="border-2 border-rose-300 hover:bg-rose-300/10 text-white hover:text-gray-200 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
            >
              Create Free Account
              <FiUsers className="ml-2" />
            </Link>
          </div>

          <p className="text-rose-100 text-sm mt-6">
            ✓ No credit card required ✓ Free analysis ✓ Secure & confidential ✓
            Instant results
          </p>
        </div>
      </section> */}
    </div>
  );
};

export default Home;
