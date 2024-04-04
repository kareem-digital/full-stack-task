// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const teamRoutes = require("./routes/teamRoutes");
require("dotenv").config();

const app = express();
// app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGOURI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Use routes
app.use("/api", userRoutes);
app.use("/api", teamRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
