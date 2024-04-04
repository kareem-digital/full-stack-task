// routes/teamRoutes.js
const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");

router.post("/team", teamController.createTeam);
router.get("/team/:id", teamController.getTeamById);

module.exports = router;
