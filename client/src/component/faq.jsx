import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiHelpCircle,
  FiFileText,
  FiShield,
  FiDollarSign,
  FiSettings,
  FiMail,
  FiPhone,
  FiMessageCircle,
  FiClock,
  FiUsers,
  FiTarget,
  FiZap,
} from "react-icons/fi";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItems, setOpenItems] = useState({});

  const categories = [
    { id: "all", name: "All Questions", icon: FiHelpCircle },
    { id: "general", name: "General", icon: FiFileText },
    { id: "upload", name: "Upload & Analysis", icon: FiTarget },
    { id: "privacy", name: "Privacy & Security", icon: FiShield },
    { id: "pricing", name: "Pricing", icon: FiDollarSign },
    { id: "technical", name: "Technical Support", icon: FiSettings },
  ];

  const faqData = [
    // ... [Keep the same faqData you had] ...
  ];

  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFAQs = faqData.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-600 to-rose-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FiHelpCircle className="text-6xl mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-amber-100 mb-8">
            Find answers to common questions about AI Resume Analyzer
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-amber-300 shadow-lg"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Categories
              </h3>
              <ul className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const count =
                    category.id === "all"
                      ? faqData.length
                      : faqData.filter((faq) => faq.category === category.id)
                          .length;

                  return (
                    <li key={category.id}>
                      <button
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition duration-300 ${
                          selectedCategory === category.id
                            ? "bg-amber-100 text-amber-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center">
                          <Icon className="mr-3" />
                          <span>{category.name}</span>
                        </div>
                        <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                          {count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            {filteredFAQs.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <FiSearch className="text-gray-400 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No results found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search terms or browse different categories
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="text-amber-600 hover:text-amber-800 font-medium"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mb-6">
                  <p className="text-gray-700">
                    Showing {filteredFAQs.length}{" "}
                    {filteredFAQs.length === 1 ? "question" : "questions"}
                    {selectedCategory !== "all" && (
                      <span className="ml-2">
                        in{" "}
                        <span className="font-medium">
                          {
                            categories.find((c) => c.id === selectedCategory)
                              ?.name
                          }
                        </span>
                      </span>
                    )}
                  </p>
                </div>

                {filteredFAQs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full p-6 text-left hover:bg-gray-50 transition duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 pr-4">
                          {faq.question}
                        </h3>
                        <div className="flex-shrink-0">
                          {openItems[faq.id] ? (
                            <FiChevronUp className="text-gray-400 text-xl" />
                          ) : (
                            <FiChevronDown className="text-gray-400 text-xl" />
                          )}
                        </div>
                      </div>
                    </button>

                    {openItems[faq.id] && (
                      <div className="px-6 pb-6">
                        <div className="border-t border-gray-100 pt-4">
                          <p className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-xl text-gray-700">
              We're here to help you succeed in your career journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiZap className="text-amber-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Instant Analysis
              </h3>
              <p className="text-gray-700 mb-4">
                Get comprehensive resume feedback in under 30 seconds
              </p>
              <Link
                to="/upload-resume"
                className="text-amber-600 hover:text-amber-800 font-medium"
              >
                Try Now →
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="text-rose-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Expert Support
              </h3>
              <p className="text-gray-700 mb-4">
                Our team is available 24/7 to help with any questions
              </p>
              <a
                href="mailto:support@airesume-analyzer.com"
                className="text-amber-600 hover:text-amber-800 font-medium"
              >
                Contact Support →
              </a>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTarget className="text-amber-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Proven Results
              </h3>
              <p className="text-gray-700 mb-4">
                95% of users see improved job application success rates
              </p>
              <Link
                to="/about"
                className="text-amber-600 hover:text-amber-800 font-medium"
              >
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Need Personal Help?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMail className="text-amber-600 text-xl" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">
                Email Support
              </h3>
              <p className="text-gray-700 text-sm mb-3">
                Get detailed help via email
              </p>
              <a
                href="mailto:support@airesume-analyzer.com"
                className="text-amber-600 hover:text-amber-800 text-sm font-medium"
              >
                support@airesume-analyzer.com
              </a>
            </div>

            <div className="p-6">
              <div className="bg-rose-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMessageCircle className="text-rose-600 text-xl" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Live Chat</h3>
              <p className="text-gray-700 text-sm mb-3">
                Chat with our support team
              </p>
              <button className="text-amber-600 hover:text-amber-800 text-sm font-medium">
                Start Chat
              </button>
            </div>

            <div className="p-6">
              <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiClock className="text-amber-600 text-xl" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">
                Response Time
              </h3>
              <p className="text-gray-700 text-sm mb-3">
                We typically respond within
              </p>
              <span className="text-amber-600 text-sm font-medium">
                2-4 hours
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
