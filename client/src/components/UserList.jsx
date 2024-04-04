import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  setCurrentPage,
  setSearchQuery,
  setFilter,
  selectUser,
  deselectUser,
  clearSelectedUsers,
  createTeam,
  fetchTeamById,
} from "../redux/userSlice";
import UserCard from "./UserCard";
import Pagination from "./Pagination";

const UserList = () => {
  const domains = [
    "Sales",
    "Finance",
    "Marketing",
    "IT",
    "Management",
    "UI Designing",
    "Business Development",
  ];

  const genders = [
    "Male",
    "Female",
    "Agender",
    "Bigender",
    "Polygender",
    "Non-binary",
    "Genderqueer",
  ];

  const dispatch = useDispatch();
  const {
    users,
    currentPage,
    totalPages,
    isLoading,
    error,
    searchQuery,
    filters,
    selectedUsers,
    teamDetails,
  } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, query: searchQuery, filters }));
    dispatch(clearSelectedUsers());
  }, [dispatch, currentPage, searchQuery, filters]);

  const handlePrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };

  const handleNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleFilterChange = (filterName, value) => {
    dispatch(setFilter({ filterName, value }));
  };

  const handleUserClick = (user) => {
    const isSelected = selectedUsers.find(
      (selectedUser) => selectedUser.id === user.id
    );
    const isDomainUnique = !selectedUsers.some(
      (selectedUser) => selectedUser.domain === user.domain
    );
    const isAvailabilityUnique = !selectedUsers.some(
      (selectedUser) => selectedUser.available === user.available
    );

    if (!isSelected && isDomainUnique && isAvailabilityUnique) {
      dispatch(selectUser(user));
    } else {
      if (!isDomainUnique) {
        alert("Users should have unique domains");
      } else if (!isAvailabilityUnique) {
        alert("Users should have unique availability");
      } else {
        dispatch(deselectUser(user.id));
      }
    }
  };

  const isUserSelected = (user) => {
    return selectedUsers.find((selectedUser) => selectedUser.id === user.id);
  };

  const handleCreateTeam = () => {
    // Check if selected users have unique domains and availability
    const uniqueDomains = new Set();
    const uniqueAvailability = new Set();

    for (const user of selectedUsers) {
      if (uniqueDomains.has(user.domain)) {
        alert("Users should have unique domains");
        return;
      }
      uniqueDomains.add(user.domain);

      if (uniqueAvailability.has(user.available)) {
        alert("Users should have unique availability");
        return;
      }
      uniqueAvailability.add(user.available);
    }

    // If all selected users have unique domains and availability, create the team
    dispatch(
      createTeam({
        name: "New Team", // Set the desired team name here
        userIds: selectedUsers.map((user) => user.id),
      })
    ).then((result) => {
      if (!result.error) {
        // Fetch team details after creating team
        dispatch(fetchTeamById(result.payload._id));
      } else {
        alert("Failed to create team"); // Display error message if team creation fails
      }
    });
  };

  const isButtonDisabled =
    selectedUsers.length === 0 ||
    selectedUsers.some((user) => user.domain === "") ||
    selectedUsers.some((user) => user.available === "");

  return (
    <div className="flex flex-wrap justify-center">
      <input
        type="text"
        placeholder="Search by name..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="mt-4 p-2 border rounded h-12"
      />
      <div className="mt-4 flex items-center">
        <select
          className="p-2 border rounded mr-4 h-12"
          value={filters.domain}
          onChange={(e) => handleFilterChange("domain", e.target.value)}
        >
          <option value="">All Domains</option>
          {domains.map((domain) => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </select>
        <select
          className="p-2 border rounded mr-4 h-12"
          value={filters.gender}
          onChange={(e) => handleFilterChange("gender", e.target.value)}
        >
          <option value="">All Genders</option>
          {genders.map((gender) => (
            <option key={gender} value={gender}>
              {gender}
            </option>
          ))}
        </select>
        <select
          className="p-2 border rounded h-12"
          value={filters.available}
          onChange={(e) => handleFilterChange("available", e.target.value)}
        >
          <option value="">All Availability</option>
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>
        <button
          className={`ml-4 px-4 py-2 bg-blue-500 text-white rounded h-12 ${
            isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleCreateTeam}
          disabled={isButtonDisabled}
        >
          Create Team
        </button>
      </div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {!isLoading && !error && (
        <>
          <div className="flex flex-wrap justify-center w-full">
            {users?.map((user) => (
              <div key={user.id} className="w-1/3 p-4">
                <div
                  className={`rounded-lg p-4 cursor-pointer ${
                    isUserSelected(user)
                      ? "shadow-md bg-gray-200"
                      : "shadow-sm bg-white"
                  }`}
                  onClick={() => handleUserClick(user)}
                >
                  <UserCard user={user} />
                </div>
              </div>
            ))}
          </div>
          <Pagination
            pageCount={totalPages}
            page={currentPage}
            handlePrevPageBtn={handlePrevPage}
            handleNextPageBtn={handleNextPage}
            setPage={handlePageChange}
          />
        </>
      )}
      {teamDetails && (
        <div className="mt-4">
          <h2>Team Details</h2>
          <p>Name: {teamDetails.name}</p>
          <p>Selected Users:</p>
          <ul>
            {teamDetails.users.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserList;
