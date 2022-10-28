const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const bcrypt = require("bcrypt");
const userSchema = require("../Scheema/UserScheema");
const PaymentSchema= require("../Scheema/Payment")
const User= new mongoose.model("User", userSchema);
const jwt = require("jsonwebtoken");
const Payment = new mongoose.model("Payment",PaymentSchema)
const CheakLoginControler = require('../MiddleWears/CheakLoginControler')
const saltRounds = 10;


router.post("/payment",async(req,res)=>{
  try {
     console.log(req.body)
      const newUser = new Payment({
          username: req.body.username,
          doctor: req.body.doctorname,
          payment: req.body.payment,
      });
      await newUser.save();
      res.status(200).json({
          message: "Congratulation Your Payment Is Successfully",
      });
  } catch(error) {
      console.log(error)
          res.status(200).json({
              message: "Someting is wrong please try again",
          });
      }
})
module.exports = router;