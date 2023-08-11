const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const bcrypt = require("bcrypt");
const TeacherScheema = require("../Scheema/TeacherScheema");
const Teachers= new mongoose.model("teacher", TeacherScheema);
const jwt = require("jsonwebtoken");
const CheakLoginControler = require('../MiddleWears/CheakLoginControler')
const saltRounds = 10;
router.post("/login", async(req,res)=>{
    try {
 console.log(req.body)
       const user = await Teachers.find({ username: req.body.name });
      console.log(user)
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
 router.get("/Profile",CheakLoginControler,async(req,res)=>{
    //  console.log( req.query.Department);
      try {  
        
          const user = await Teachers.find({username: req.query.username  });
        
          if(user&&user.length>0){
              res.send(user)
             console.log(user)
          }
          
      } catch (error) {
          res.status(200).json({
              "error": "Wrong Username and password"
          }); 
      }
    
       
   })
module.exports = router;