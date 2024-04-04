import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "http://localhost:3000/api";

const initialState = {
  users: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  searchQuery: "",
  filters: {
    domain: "",
    gender: "",
    available: "",
  },
  selectedUsers: [],
  teamDetails: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ page, query, filters }) => {
    try {
      const url = `${BASE_URL}/users?query=${query}&page=${page}&domain=${filters.domain}&gender=${filters.gender}&available=${filters.available}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw Error(error.message);
    }
  }
);

export const createTeam = createAsyncThunk(
  "users/createTeam",
  async ({ name, userIds }) => {
    try {
      const response = await fetch(`${BASE_URL}/team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, userIds }),
      });
      if (!response.ok) {
        throw new Error("Failed to create team");
      }
      const data = await response.json();
      console.log(name, userIds);
      console.log(data);
      return data;
    } catch (error) {
      throw Error(error.message);
    }
  }
);

export const fetchTeamById = createAsyncThunk(
  "teams/fetchTeamById",
  async (teamId) => {
    try {
      const response = await fetch(`${BASE_URL}/team/${teamId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch team details");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw Error(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setFilter(state, action) {
      const { filterName, value } = action.payload;
      state.filters[filterName] = value;
    },
    selectUser(state, action) {
      const user = action.payload;
      state.selectedUsers.push(user);
    },
    deselectUser(state, action) {
      const userId = action.payload;
      state.selectedUsers = state.selectedUsers.filter(
        (user) => user.id !== userId
      );
    },
    clearSelectedUsers(state) {
      state.selectedUsers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.totalPages = action.payload.pagination.pageCount;
        state.currentPage = action.payload.pagination.currentPage;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTeamById.fulfilled, (state, action) => {
        state.teamDetails = action.payload;
      })
      .addCase(createTeam.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle successful team creation if needed
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        // Handle error message from failed team creation
      });
  },
});

export const {
  setCurrentPage,
  setSearchQuery,
  setFilter,
  selectUser,
  deselectUser,
  clearSelectedUsers,
} = userSlice.actions;

export default userSlice.reducer;
