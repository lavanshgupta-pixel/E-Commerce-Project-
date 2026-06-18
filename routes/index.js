const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const isOwnerLogin = require("../middlewares/isOwnerLogin");

//user route 
router.get("/", (req, res) => {
    let error = req.flash("error");
    res.render("index", { error, islogin: null });
})

//admin route 
router.get("/owners/login", (req, res) => {
    res.render("owner-login", { islogin: null });
})


//shop route
router.get("/shop", isLoggedIn, async (req, res) => {
    let products = await productModel.find();
    let success = req.flash("success");
    res.render("shop", { products, islogin: true, success });
});


//add to cart 
router.get("/addtocart/:productid", isLoggedIn, async (req, res) => {
    const productid = req.params.productid;

    let user = await userModel.findOne({ email: req.user.email });

    const existingItem = user.cart.find(
        item => item.product.toString() === productid
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        user.cart.push({
            product: productid,
            quantity: 1
        });
    }

    await user.save();

    req.flash("success", "Added to Cart");
    res.redirect("/shop");
});


//card route
router.get("/cart", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate("cart.product");
    res.render("cart", { user, islogin: true });

})


//remove item 
router.get("/removefromcart/:productid", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.pull(req.params.productid);
    await user.save();
    res.redirect("/cart");
});

module.exports = router;

//payment route 
router.get("/checkout", isLoggedIn, async (req, res) => {
    res.render("paymentComingSoon");
})


//+ product count 
router.get("/cart/increase/:id", isLoggedIn, async (req, res) => {

    const user = await userModel.findById(req.user.id);

    const item = user.cart.find(
        item => item.product.toString() === req.params.id
    );

    if(item){
        item.quantity += 1;
    }

    await user.save();

    res.redirect("/cart");
});

//- product count 
router.get("/cart/decrease/:id",isLoggedIn, async (req, res) => {

    const user = await userModel.findById(req.user.id);

    const item = user.cart.find(
        item => item.product.toString() === req.params.id
    );

    if(item){

        item.quantity -= 1;

        if(item.quantity <= 0){
            user.cart = user.cart.filter(
                cartItem =>
                    cartItem.product.toString() !== req.params.id
            );
        }
    }

    await user.save();

    res.redirect("/cart");
});