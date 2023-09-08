const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ControlerSchema = require('../Scheema/ControlerSchema')
const Controler= new mongoose.model("controler", ControlerSchema);
const AddNumberScheema = require("../Scheema/AddNumberScheema");
const Marks= new mongoose.model("marks", AddNumberScheema);
const CheakLoginControler = require('../MiddleWears/CheakLoginControler')
const StudentScheema = require("../Scheema/StudentScheema");
const Students= new mongoose.model("student", StudentScheema);

const saltRounds = 10;
router.post("/login", async(req,res)=>{
    try {

       const user = await Controler.find({ name: req.body.name });

       if (user&&user.length>0) {
            //  const isvalidPassword=  await bcrypt.compare(req.body.password, user[0].password);
            const isvalidPassword=  await bcrypt.compare(req.body.password, user[0].password);
           console.log('isvalidpass',isvalidPassword)
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

 router.get("/AllResult",CheakLoginControler,async(req,res)=>{
    try {  

        const number = await Marks.find({ Roll: req.query.roll });
       console.log(number)
        if(number&&number.length>0){
            res.send(number)
        }
        
    } catch (error) {
        res.status(200).json({
            "error": "Someting Is Wrong Please Try again"
        }); 
    }
  
     
 })
 router.get("/Students",CheakLoginControler,async(req,res)=>{
    try {  
        const user = await Students.find({  });
      
        if(user&&user.length>0){
            res.send(user)
       
        }
        
    } catch (error) {
        res.status(200).json({
            "error": "Wrong Username and password"
        }); 
    }       
 })
module.exports = router;