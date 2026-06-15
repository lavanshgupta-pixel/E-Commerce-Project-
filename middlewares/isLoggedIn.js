const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports.isLoggedIn = async  (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
         res.flash("error","you need to login first");
         return res.redirect("/");
    }
    try{
    const data = jwt.verify(
        token,
        process.env.JWT_SECRET
    );
    let user = await userModel.findOne({email:data.email})
    .select("-password");
    req.user = user;
    next();
}catch (err) {
    res.send("Invalid Token");
    res.redirect("/");
}

}
