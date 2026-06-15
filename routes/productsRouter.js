const express = require("express");
const router  = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");


router.post("/create", upload.single("image"), async (req, res) => {
    try {
        

        let product = await productModel.create({
            image: req.file.buffer,
            name: req.body.name,
            price: req.body.price,
            discount: req.body.discount,
            bgcolor: req.body.bgcolor,
            panelcolor: req.body.panelcolor,
            textcolor: req.body.textcolor,
        });

         

        res.redirect("/owners/Shop");

    } catch (err) {
       
        res.send(err.message);
    }
});

module.exports = router;
