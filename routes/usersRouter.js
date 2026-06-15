const express = require("express");
const router = express.Router();
const {generateToken} = require("../utils/generateToken");
const {registerUser , loginUser , logoutUser} = require("../controllers/authController");
const {isLoggedIn} = require("../middlewares/isLoggedIn");
const flash = require("connect-flash");
const expressSession = require("express-session");


//Register Route
router.post("/register",registerUser)


//Login Route 
router.post("/login", loginUser);



//Logout Route
router.get("/logout",logoutUser);


module.exports = router;