import React from "react";

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-center w-96">
        <h2 className="text-white text-xl font-semibold">Confirm Logout</h2>
        <p className="text-gray-400 mt-2">Are you sure you want to log out?</p>

        <div className="mt-6 flex justify-center space-x-4">
          <button
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
            onClick={onConfirm}
          >
            Yes, Logout
          </button>
          <button
            className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
