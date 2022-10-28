const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const bcrypt = require("bcrypt");
const BloodSchema= require("../Scheema/BloodScheema")
const jwt = require("jsonwebtoken");
const Blood = new mongoose.model("BloodSceema",BloodSchema);
const CheakLoginControler = require('../MiddleWears/CheakLoginControler')
const saltRounds = 10;

router.post("/DonateBlood",async(req,res)=>{
    console.log(req.body)
    try {
       console.log(req.body)
        const newDonner = new Blood({
            name: req.body.name,
      
            email: req.body.email,
            phone: req.body.phone,
            city: req.body.city,
            group:req.body.group
          
        });
        await newDonner.save();
        res.status(200).json({
            message: "Registation successful!",
        });
    } catch(error) {
    console.log(error)
        res.status(200).json({
            message: "username and email should be uniqe",
        });
    }
})
router.get("/AllDonner",async(req,res)=>{
    try {  
        const user = await Blood.find({  });
        if(user&&user.length>0){
            res.send(user)
        }
        
    } catch (error) {
        res.status(200).json({
            "error": "No Blood Donner Hire"
        }); 
    }
  
     
 })

 module.exports = router;