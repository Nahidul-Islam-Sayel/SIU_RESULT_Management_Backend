const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const bcrypt = require("bcrypt");
const AdminSchema= require("../Scheema/AdminSceema")
const jwt = require("jsonwebtoken");
const Admin = new mongoose.model("Singupadmin",AdminSchema);
const CheakLoginControler = require('../MiddleWears/CheakLoginControler')
const saltRounds = 10;
router.post("/login",async(req,res)=>{
    try {
       const user = await Admin.find({ username: req.body.username });
       console.log(user)
       if (user&&user.length>0) {
             const isvalidPassword=  await bcrypt.compare(req.body.password, user[0].password);
             if(isvalidPassword) {
                 // generate token
 
                 const token = jwt.sign({
                     username: user[0].username,
                    
                     userId: user[0]._id,
                 }, process.env.JWT_SECRET, {
                     expiresIn: '1h'
                 });
 
                 res.status(200).json({
                     "access_token": token,
                     "message": "Login successful!"
                 });
             } else {
                 res.status(200).json({
                     "error": "Wrong Username and password"
                 });
             }
         } else {
             res.status(200).json({
                 "error": "Wrong Username and password"
             });
       }
    } catch (error) {
     res.status(200).json({
         "error": "Wrong Username and password"
     });
    }  
 })
 
  
 module.exports = router;