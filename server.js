const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require("path");
const expressSession = require("express-session");
const flash = require("connect-flash");


//importing mongodb connection 
const connectDB = require("./config/mongoose-connection");
connectDB();

//importing routes 
const ownerRouter = require("./routes/ownerRouter");
const usersRouter = require("./routes/usersRouter");
const productsRouter = require("./routes/productsRouter");
const index = require("./routes/index");

//staring server 
app.listen(3000);




app.use(express.json());
app.use(express.urlencoded({extened:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine" ,"ejs");
//flash and session 
app.use(
    expressSession({
        resave:false,
        saveUninitialized:false,
        secret: process.env.EXPRESS_SESSION_SECRET,
    })
);
app.use(flash())


//describing routes
app.use("/owners", ownerRouter);
app.use("/users", usersRouter);
app.use("/products",productsRouter);
app.use("/",index);




                          