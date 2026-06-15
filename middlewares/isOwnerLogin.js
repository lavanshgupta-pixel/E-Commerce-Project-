const jwt = require("jsonwebtoken");
const ownerModel = require("../models/owner-model");

module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            req.flash("error", "Please login as admin");
            return res.redirect("/owners/login");
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const owner = await ownerModel.findById(decoded.ownerid);

        if (!owner) {
            req.flash("error", "Unauthorized");
            return res.redirect("/owners/login");
        }

        req.owner = owner;
        next();

    } catch (err) {
        req.flash("error", "Unauthorized");
        return res.redirect("/owners/login");
    }
};