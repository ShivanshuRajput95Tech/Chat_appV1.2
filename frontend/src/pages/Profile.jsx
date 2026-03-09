import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../components/chat/Nav";
import { useAuth } from "../context/AuthContext";
import SelectAvatar from "../components/SelectAvatar";

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [selectedLink, setSelectedLink] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("/api/user/profile/update", {
        ...formData,
        avatarLink: selectedLink,
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setFormData(user);
  }, [user]);

  return (
    <div className="flex h-full min-h-screen bg-zinc-900">
      <Nav />
      <div className="bg-zinc-900 w-full flex items-center justify-center p-8">
        <div className="max-w-xl mx-auto bg-zinc-800 p-6 rounded-lg shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-white">Update Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6">
              <div className="w-full">
                <label
                  htmlFor="firstName"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  className="border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-zinc-700"
                  value={formData?.firstName || ""}
                  placeholder="First Name"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="lastName"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  className="border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-zinc-700"
                  value={formData?.lastName || ""}
                  placeholder="Last Name"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  disabled
                  className="border border-gray-600 text-gray-400 text-sm rounded-lg block w-full p-2.5 bg-zinc-800 cursor-not-allowed"
                  value={user?.email || ""}
                  placeholder="Email"
                  required
                />
              </div>
            </div>
            <SelectAvatar
              setSelectedLink={setSelectedLink}
              selectedLink={selectedLink}
            />
            <div className="flex items-center space-x-4 mt-6">
              <button
                type="submit"
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;