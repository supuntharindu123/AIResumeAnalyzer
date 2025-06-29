import { useState, useEffect } from "react";
import { useAuth } from "../context/authcontext";
import {
  FiEdit2,
  FiUpload,
  FiUser,
  FiMail,
  FiSave,
  FiX,
  FiCamera,
  FiCalendar,
  FiMapPin,
  FiPhone,
  FiLinkedin,
  FiGithub,
  FiGlobe,
} from "react-icons/fi";
import Image from "../assets/IMG06.jpg";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: null,
    bio: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    joinDate: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        phone: user.phone || "",
        location: user.location || "",
        website: user.website || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
        avatar: user.avatar || null,
        joinDate: user.createdAt || new Date().toISOString(),
      });
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setSuccess("Profile updated successfully!");
        setEditMode(false);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        phone: user.phone || "",
        location: user.location || "",
        website: user.website || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
        avatar: user.avatar || null,
        joinDate: user.createdAt || new Date().toISOString(),
      });
      setAvatarPreview(user.avatar);
    }
    setEditMode(false);
    setError("");
    setSuccess("");
  };

  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <div
      className="min-h-screen py-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(249, 250, 251, 0.8), rgba(254, 242, 242, 0.8)), url(${Image})`,
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat">
        <div
          className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-gray-200"
          style={{
            backgroundImage: `linear-gradient(rgba(249, 250, 251, 0.9), rgba(254, 242, 242, 0.9)), url(${Image})`,
          }}
        >
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-gray-500  to-rose-500">
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Profile Picture */}
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <FiUser className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {editMode && (
                  <label className="absolute bottom-2 right-2 bg-rose-600 hover:bg-rose-700 rounded-full p-2 cursor-pointer shadow-lg transition-colors duration-200">
                    <FiCamera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <div className="absolute top-4 right-4 flex gap-2">
              {editMode ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 border border-white/30"
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="profile-form"
                    disabled={loading}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 border border-white/30 disabled:opacity-50"
                  >
                    <FiSave className="w-4 h-4" />
                    {loading ? "Saving..." : "Save"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 border border-white/30"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-8">
            {/* Alerts */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                <FiX className="w-5 h-5 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
                <FiSave className="w-5 h-5 text-green-500" />
                <span>{success}</span>
              </div>
            )}

            {/* Profile Info */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {formData.name || "Your Name"}
              </h1>
              <p className="text-gray-600 mb-4">
                {formData.bio || "Add a bio to tell others about yourself"}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <FiCalendar className="w-4 h-4 mr-2" />
                <span>Member since {formatJoinDate(formData.joinDate)}</span>
              </div>
            </div>

            {/* Profile Form */}
            <form
              id="profile-form"
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FiUser className="w-5 h-5 text-rose-600" />
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!editMode}
                        required
                        className="pl-10 block w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 disabled:bg-gray-100 disabled:text-gray-500 py-3 transition-colors duration-200"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="pl-10 block w-full rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed py-3"
                        placeholder="your@email.com"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="pl-10 block w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 disabled:bg-gray-100 disabled:text-gray-500 py-3 transition-colors duration-200"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMapPin className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="pl-10 block w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 disabled:bg-gray-100 disabled:text-gray-500 py-3 transition-colors duration-200"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    rows="4"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="block w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 disabled:bg-gray-100 disabled:text-gray-500 py-3 px-3 transition-colors duration-200"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FiGlobe className="w-5 h-5 text-rose-600" />
                  Social Links
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiGlobe className="text-gray-400" />
                      </div>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="pl-10 block w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 disabled:bg-gray-100 disabled:text-gray-500 py-3 transition-colors duration-200"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLinkedin className="text-gray-400" />
                      </div>
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="pl-10 block w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 disabled:bg-gray-100 disabled:text-gray-500 py-3 transition-colors duration-200"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiGithub className="text-gray-400" />
                      </div>
                      <input
                        type="url"
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="pl-10 block w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 disabled:bg-gray-100 disabled:text-gray-500 py-3 transition-colors duration-200"
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button (Mobile) */}
              {editMode && (
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 md:hidden">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
