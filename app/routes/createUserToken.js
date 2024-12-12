const express = require("express");
const router = express.Router();

const {
    createUserToken
} = require("../controllers/createUserToken");


router.route("/createToken").post(createUserToken);

module.exports = router;