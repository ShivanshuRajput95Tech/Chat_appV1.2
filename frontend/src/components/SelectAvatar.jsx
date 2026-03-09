import React, { useEffect, useState } from "react";
import axios from "axios";

const SelectAvatar = ({ setSelectedLink, selectedLink }) => {
  const [avatars, setAvatars] = useState([]);

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await axios.get("/api/avatar/all");
        setAvatars(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAvatars();
  }, []);

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-white">
        Select Avatar
      </label>
      <div className="grid grid-cols-4 gap-4">
        {avatars.map((avatar) => (
          <div
            key={avatar._id}
            className={`cursor-pointer border-2 rounded-lg p-2 ${
              selectedLink === avatar.link
                ? "border-blue-500"
                : "border-gray-600"
            }`}
            onClick={() => setSelectedLink(avatar.link)}
          >
            <img
              src={avatar.link}
              alt="avatar"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectAvatar;