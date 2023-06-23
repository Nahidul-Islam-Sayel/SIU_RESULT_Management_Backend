const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const bcrypt = require("bcrypt");
const DepartmentSchema= require("../Scheema/DepartmentSchema")
const jwt = require("jsonwebtoken");
const Department = new mongoose.model("Department",DepartmentSchema);
const CheakLoginControler = require('../MiddleWears/CheakLoginControler')
const saltRounds = 10;
// router.post("/doctor",async(req,res)=>{
//     console.log(req.body)
//     const hashpassword =  await bcrypt.hash(req.body.password, saltRounds);
//     console.log(hashpassword);
//     try {
//        console.log(req.body)
//         const newDoctor = new Doctor({
//             name: req.body.doctorname,
//             username: req.body.username,
//             email: req.body.email,
//             phone: req.body.phone,
//             chamber: req.body.chamber,
//             password: hashpassword,
//         });
//         await newDoctor.save();
//         res.status(200).json({
//             message: "Signup was successful!",
//         });
//     } catch(error) {
//     console.log(error)
//         res.status(200).json({
//             message: "username and email should be uniqe",
//         });
//     }
// })
router.post("/login",async(req,res)=>{
    try {
       const user = await Department.find({ username: req.body.username });
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
 
//  router.get("/DocProfile",CheakLoginControler,async(req,res)=>{
//     try {  
//         const user = await Doctor.find({ username: req.query.username  });
//         if(user&&user.length>0){
//             res.send(user)
//         }
        
//     } catch (error) {
//         res.status(200).json({
//             "error": "Wrong Username and password"
//         }); 
//     }
  
     
//  })

//  router.get("/AllDoctors",CheakLoginControler,async(req,res)=>{
//     try {  
//         const user = await Doctor.find({  });
//         if(user&&user.length>0){
//             res.send(user)
//         }
        
//     } catch (error) {
//         res.status(200).json({
//             "error": "Wrong Username and password"
//         }); 
//     }
  
     
//  })
//  router.delete('/delete/:id',async(req,res)=>{
//     console.log(req.params.id)
//     Doctor.deleteOne({_id: req.params.id},
//         (err) => {
//             if (err) {
//               res.status(500).json({
//                 error: "There was a server side error!",
//               });
//             } else {
//               res.status(200).json({
              
//                 message: "Delete SUccessfully",
//               });
//             }
//           }
//         )
//   })


 module.exports = router;