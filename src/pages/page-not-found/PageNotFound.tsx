import React, { useState, useEffect } from "react";
import { updateAdmin, uploadAdminProfile } from "../../services/api-consumer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserEdit, Save2, LogoutCurve } from "iconsax-react";
import { motion } from "framer-motion";  // Import framer-motion

const SettingsPage = ({ userId }) => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    profile: "",
    email: "",
    phoneNumber: "",
    role: "",
  });
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://scholarly-admin-backend.onrender.com/scholarly/api/v1/admin/getOneAdmin/:adminId`
        );
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (profileImage) {
        const formData = new FormData();
        formData.append("file", profileImage);
        await uploadAdminProfile(userId, formData);
      }
      if (newFirstName || newLastName) {
        await updateAdmin(userId, newFirstName || userData.firstName, newLastName || userData.lastName);
      }
      setEditing(false);
      setUserData({
        ...userData,
        firstName: newFirstName || userData.firstName,
        lastName: newLastName || userData.lastName,
      });
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen">
      <div className="w-full max-w-2xl bg-gradient-to-r bg-black rounded-lg p-8 shadow-md text-white">
        <h2 className="text-2xl font-semibold text-gray-100 mb-6">Settings</h2>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <motion.img  // Wrap img with motion for smooth transitions
              src={userData.profile || "/images/no_profile.webp"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <label className="absolute bottom-0 right-0 mb-2 mr-2 text-white bg-gray-700 rounded-full p-2 cursor-pointer hover:bg-gray-600 transition">
              <UserEdit size={20} />
              <input
                type="file"
                className="hidden"
                onChange={handleProfileImageChange}
              />
            </label>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-medium text-gray-200">{userData.firstName} {userData.lastName}</h3>
            {editing ? (
              <motion.div  // Use motion for smooth transitions between edit and view modes
                className="mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400">First Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-lg"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400">Last Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-lg"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                  />
                </div>
              </motion.div>
            ) : (
              <div className="mt-4 text-gray-400">
                <p>Email: {userData.email}</p>
                <p>Phone: {userData.phoneNumber}</p>
                <p>Role: {userData.role}</p>
              </div>
            )}
            <div className="mt-6 flex space-x-4">
              {editing ? (
                <button
                  className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-500 transition"
                  onClick={handleUpdateProfile}
                >
                  Save Changes
                </button>
              ) : (
                <button
                  className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-500 transition"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>
              )}
              <button
                className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-500 transition"
                onClick={handleLogout}
              >
                <LogoutCurve size={20} className="inline-block mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      {showLogoutPopup && (
        <motion.div  // Fade in the logout popup
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <p className="text-white mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition"
                onClick={() => setShowLogoutPopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SettingsPage;
