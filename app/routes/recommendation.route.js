const { createRecomendation } = require("../controllers/recomendation.controller");
const express = require("express");
const router = express.Router();

router.route("/createRecomendation").post(createRecomendation);

module.exports = router;
