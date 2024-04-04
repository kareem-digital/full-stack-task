import React from "react";

const UserCard = ({ user }) => {
  return (
    <div className="bg-white p-4 shadow-md rounded-md">
      <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2">
        {user.first_name} {user.last_name}
      </h2>
      <p className="text-sm md:text-base lg:text-lg text-gray-500 mb-2">
        {user.email}
      </p>
      <p className="text-sm md:text-base lg:text-lg text-gray-500">
        Gender: {user.gender}
      </p>
      <p className="text-sm md:text-base lg:text-lg text-gray-500">
        Domain: {user.domain}
      </p>
      <p className="text-sm md:text-base lg:text-lg text-gray-500">
        Availability: {user.available ? "Available" : "Not Available"}
      </p>
    </div>
  );
};

export default UserCard;
