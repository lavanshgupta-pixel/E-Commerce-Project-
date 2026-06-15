const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const { generateToken } = require("../utils/generateToken");








//register user 
module.exports.registerUser = async (req, res) => {
    try {
        let { fullname, email, password } = req.body;

        //check if user already exist 
        let existuser = await userModel.findOne({ email: email });
        if (existuser) return res.status(401).send("You already hava a account. Please login");
        //encryption of password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        let user = await userModel.create({
            fullname,
            email,
            password: hashedPassword,
        })
        let token = generateToken(user);
        res.cookie("token", token);
        res.redirect("/shop");

    } catch (err) {
        console.log(err.message);
    }

}


//login user 
module.exports.loginUser = async (req, res) => {

    let { email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (!user) {
        req.flash("error", "Incorrect password or email");
        return res.redirect("/");
    }

    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch) {
        req.flash("error", "Incorrect password or email");
        return res.redirect("/");
    }

    let token = generateToken(user);

    res.cookie("token", token);

    res.redirect("/shop");
};        

//logout User
module.exports.logoutUser = (req,res)=>{
    res.clearCookie("token");
    res.redirect("/");
}