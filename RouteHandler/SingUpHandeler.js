const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ObjectId = require("mongodb").ObjectID;
const bcrypt = require("bcrypt");
const StudentScheema = require("../Scheema/StudentScheema");
const Students = new mongoose.model("student", StudentScheema);
const ResultSchema = require("../Scheema/ResultScheema");
const AddNumberScheema = require("../Scheema/AddNumberScheema");
const Marks= new mongoose.model("marks", AddNumberScheema);
const User = new mongoose.model("User", StudentScheema);
const jwt = require("jsonwebtoken");
const Result = new mongoose.model("Result", ResultSchema);
const PublisedResultScheema = require('../Scheema/PublisedResultScheema')
const PublisedResultModel= new mongoose.model("publisedresultscheema", PublisedResultScheema);
const CheakLoginControler = require("../MiddleWears/CheakLoginControler");
const saltRounds = 10
router.post("/user", async (req, res) => {
   
    const hashpassword = await bcrypt.hash(req.body.password_1, saltRounds);

    try {
      
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
    } catch (error) {
    
        res.status(200).json({
            message: "username and email should be uniqe",
        });
    }
});
router.get("/result", async (req, res) => {
    try {
     
        const user = await Marks.find({
            Roll: req.query.StudentsID,
        });

     
        if (user) {
            res.send(user);
        }
    } catch (error) {
        res.status(200).json({
            error: "Wrong Username and password",
        });
    }
});
router.post("/login", async (req, res) => {
    try {
  
        const user = await Students.findOne({ roll: req.body.StudentsID });
 

        if (user) {
            // Check if user.password exists before comparing
            if (user.password) {
                const isvalidPassword = await bcrypt.compare(req.body.password_1, user.password);
           

                if (isvalidPassword) {
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
                    "error": "User password is not defined"
                });
            }
        } else {
          
            res.status(200).json({
                "error": "User not found"
            });
        }
    } catch (error) {
   
        res.status(500).json({
            "error": "Internal server error"
        });
    }
});

router.put("/UpdateUserProfile/:id", async (req, res) => {
    const result = User.findByIdAndUpdate({
            _id: ObjectId(req.params.id),
        }, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                mobile: req.body.mobie,
                address: req.body.address,
            },
        }, {
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

});

router.get("/Profile", CheakLoginControler, async (req, res) => {
    try {
        const user = await Students.findOne({
            roll: req.query.StudentsID,
        });
        if (user) {
            res.send(user);
        }
    } catch (error) {
        res.status(200).json({
            error: "Wrong Username and password",
        });
    }
});
router.get("/Alluserprofile", async (req, res) => {
    try {
        const user = await User.find({});
        if (user && user.length > 0) {
            res.send(user);
        }
    } catch (error) {
        res.status(200).json({
            error: "Wrong Username and password",
        });
    }
});
router.get("/PublisedResult", async (req, res) => {
    try {
        const user = await PublisedResultModel.find({
            roll: req.query.StudentsID,
        });
        if (user && user.length > 0) {
            res.send(user);
        }
    } catch (error) {
        res.status(200).json({
            error: "Wrong Username and password",
        });
    }
});

module.exports = router;