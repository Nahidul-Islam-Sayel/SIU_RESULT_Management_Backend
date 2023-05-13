const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const bcrypt = require("bcrypt");
const userSchema = require("../Scheema/UserScheema");
const ResultSchema= require("../Scheema/ResultScheema")
const User= new mongoose.model("User", userSchema);
const jwt = require("jsonwebtoken");
const Result = new mongoose.model("Result",ResultSchema)
const CheakLoginControler = require('../MiddleWears/CheakLoginControler')
const saltRounds = 10;

router.post("/user",async(req,res)=>{
    console.log(req.body)
    const hashpassword =  await bcrypt.hash(req.body.password_1, saltRounds);
    console.log(hashpassword);
    try {
       console.log(req.body)
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,

            password: hashpassword,
        });
        await newUser.save();
        res.status(200).json({
            message: "Signup was successful!",
        });
    } catch(error) {
        console.log(error)
            res.status(200).json({
                message: "username and email should be uniqe",
            });
        }
})
router.get("/result", async(req,res)=>{
    try {  
        console.log(req.query.StudentsID)
        const user = await  Result.find({ Roll: req.query.StudentsID });

        console.log(user)
        if(user){
            res.send(user)
        }
        
    } catch (error) {
        res.status(200).json({
            "error": "Wrong Username and password"
        }); 
    }
})
router.post("/login",async(req,res)=>{
   try {
console.log(req.body.StudentsID)
     const user = await User.findOne({ roll: req.body.StudentsID });
      console.log(user)
      if (user) {
            ///const isvalidPassword=  await bcrypt.compare(req.body.password, user[0].password);
           console.log(req.body.password_1==user.password)
           console.log(req.body.password_1)
            if(req.body.password_1==user.password) {
                // generate token

                const token = jwt.sign({
                    username: user.username,
                   
                    userId: user._id,
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
                "error": "Someting is worng try again"
            });
      }
   } catch (error) {
    res.status(200).json({
        "error": "Wrong Username and password"
    });
   }  
})
router.put("/UpdateUserProfile/:id", async (req, res) => {
    const result =  User.findByIdAndUpdate(
      {_id: ObjectId(req.params.id)},
      {
        $set: {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            mobile: req.body.mobie,
            address: req.body.address
        },
      },
      {
        new: true,
        useFindAndModify: false,
      },
      (err) => {
        if (err) {
          res.status(500).json({
            error: "There was a server side error!",
          });
        } else {
          res.status(200).json({
            message: "Todo was updated successfully!",
          });
        }
      }
    );
    console.log(result);
  });

  router.get("/Profile",CheakLoginControler,async(req,res)=>{
    try {  
       
        const user = await  User.findOne({ roll: req.query.StudentsID  });
        if(user){
            res.send(user)
        }
        
    } catch (error) {
        res.status(200).json({
            "error": "Wrong Username and password"
        }); 
    }
  
     
 })
 router.get("/Alluserprofile",async(req,res)=>{
    try {  
        const user = await User.find({ });
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