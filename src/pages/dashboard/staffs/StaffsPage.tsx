import React, { useEffect, useState } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
import loadingAnimation from "../../../assets/lottie/loading (2).json";
import UnableToLoad from "../../../assets/lottie/error.json";
import { SearchNormal1, Sort,CloseCircle } from "iconsax-react";
import { useNavigate } from "react-router";
import AdminDetailPage from "./AdminDetail";

const StaffPage: React.FC = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("name");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(
          "https://scholarly-admin-backend.onrender.com/scholarly/api/v1/admin/getAllAdmins"
        );
        setAdmins(response.data.data);
        setFilteredAdmins(response.data.data);
      } catch (error: any) {
        setError("Error fetching staff data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  useEffect(() => {
    let sortedAdmins = [...admins];

    if (sortType === "name") {
      sortedAdmins.sort((a, b) => a.firstName.localeCompare(b.firstName));
    } else if (sortType === "role") {
      sortedAdmins.sort((a, b) => a.role.localeCompare(b.role));
    } else if (sortType === "dateJoined") {
      sortedAdmins.sort(
        (a, b) =>
          new Date(a.dateJoined).getTime() - new Date(b.dateJoined).getTime()
      );
    }

    setFilteredAdmins(sortedAdmins);
  }, [sortType, admins]);

  useEffect(() => {
    setFilteredAdmins(
      admins.filter((admin) =>
        `${admin.firstName} ${admin.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    );
  }, [search, admins]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <Lottie
          animationData={loadingAnimation}
          loop
          autoplay
          style={{ width: 200 }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex justify-center items-center w-full min-h-screen"
        title="Error"
      >
        <Lottie
          animationData={UnableToLoad}
          loop
          autoplay
          style={{ width: 200 }}
        />
      </div>
    );
  }

  const handleAdminClick = (admin: any) => {
    setSelectedAdmin(admin);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAdmin(null);
  };

  return (
    <div className="w-full bg-background px-3 py-4 rounded-[15px] text-[14px] placeholder:text-secondary text-white focus:outline-none min-h-screen p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80 bg-tertiary rounded-lg flex flex-center mt-4 sm:mt-0">
          <input
            type="text"
            placeholder="Search for admins..."
            className="w-full px-4 py-3.5 pl-10 text-secondary text-[13.5px] open-sans rounded-lg outline-none bg-tertiary focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* Search Icon */}
          <SearchNormal1 size={18} className="absolute left-3 text-secondary" />
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="focus:outline-none"
          >
            <Sort size="32" color="#FF8A65" />
          </button>
          {isSortOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg"
            >
              <select
                className="w-full p-2 bg-transparent border-none outline-none cursor-pointer"
                value={sortType}
                onChange={(e) => {
                  setSortType(e.target.value);
                  setIsSortOpen(false);
                }}
              >
                <option value="name">Sort by Name</option>
                <option value="role">Sort by Role</option>
                <option value="dateJoined">Sort by Date Joined</option>
              </select>
            </motion.div>
          )}
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-8 text-purple-500 text-center">
        Admins
      </h1>

      {filteredAdmins.length === 0 ? (
        <p className="text-center text-lg">No admins found</p>
      ) : (
        <div className="overflow-x-auto bg-gradient-to-r from-purple-800 to-black-900 rounded-lg shadow-lg p-6">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-purple-800 text-gray-100 rounded-t-lg">
                <th className="py-4 px-6 text-left font-bold text-lg">Name</th>
                <th className="py-4 px-6 text-left font-bold text-lg">Role</th>
                <th className="py-4 px-6 text-left font-bold text-lg">Email</th>
                <th className="py-4 px-6 text-left font-bold text-lg">
                  Phone Number
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin, index) => (
                <tr
                  key={admin.id}
                  className={`group transition duration-300 ease-in-out cursor-pointer rounded-lg ${
                    index % 2 === 0
                      ? "bg-gray-900 bg-opacity-50"
                      : "bg-gray-800 bg-opacity-50"
                  } hover:bg-purple-700 hover:scale-[1.08] rounded-lg`}
                  onClick={() => handleAdminClick(admin)}
                >
                  <td className="py-6 px-6 flex items-center gap-4">
                    <img
                      src={admin.profilePicUrl || "/images/no_profile.webp"}
                      alt={admin.firstName || "No profile picture"}
                      className="w-12 h-12 rounded-full border-2 border-purple-500"
                    />
                    <span className="font-semibold">{`${admin.firstName} ${admin.lastName}`}</span>
                  </td>
                  <td className="py-6 px-6">{admin.role}</td>
                  <td className="py-6 px-6">{admin.email}</td>
                  <td className="py-6 px-6">{admin.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Admin Details */}
      <AnimatePresence>
        {modalOpen && selectedAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          >
            <motion.div
              className="bg-black rounded-lg p-6 w-3/4 sm:w-1/3"
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{`${selectedAdmin.firstName} ${selectedAdmin.lastName}`}</h2>
                <button
                  onClick={closeModal}
                  className="text-red-500 text-lg"
                >
                  <CloseCircle size="30" color="white"/>
                </button>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className="w-32 h-32 bg-gradient-to-b from-purple-500 to-black rounded-full flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundImage: `url(${
                      selectedAdmin.profilePicUrl || "/images/no_profile.webp"
                    })`,
                    backgroundSize: "cover",
                  }}
                >
                  {!selectedAdmin.profilePicUrl && (
                    <span className="text-white text-3xl">?</span>
                  )}
                </div> 
                <p className="mt-4">Role: {selectedAdmin.role}</p>
                <p>Email: {selectedAdmin.email}</p>
                <p>Phone: {selectedAdmin.phoneNumber}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffPage;
