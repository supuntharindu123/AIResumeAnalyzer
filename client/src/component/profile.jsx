import { useState, useEffect } from "react";
import { useAuth } from "../context/authcontext";
import { FiEdit2, FiUpload, FiUser, FiMail } from "react-icons/fi";

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
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        avatar: user.avatar || null,
      });
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Use updateProfile from auth context instead of direct action
      const result = await updateProfile(formData);
      if (result.success) {
        setSuccess(result.message);
        setEditMode(false);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-blue-600">
            <div className="absolute -bottom-12 left-8">
              <div className="relative">
                <img
                  src={formData.avatar || "/default-avatar.png"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white object-cover"
                />
                {editMode && (
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer shadow-lg">
                    <FiUpload className="w-4 h-4 text-gray-600" />
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
            <button
              onClick={() => setEditMode(!editMode)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <FiEdit2 className="w-4 h-4" />
              {editMode ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {/* Profile Content */}
          <div className="pt-16 pb-8 px-8">
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!editMode}
                      className="pl-10 block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="pl-10 block w-full rounded-md border-gray-300 bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <div className="mt-1">
                  <textarea
                    name="bio"
                    rows="4"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>

              {editMode && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
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
