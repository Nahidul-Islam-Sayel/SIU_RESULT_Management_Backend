const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ControlerSchema = require('../Scheema/ControlerSchema')
const Controler= new mongoose.model("controler", ControlerSchema);
const AddNumberScheema = require("../Scheema/AddNumberScheema");
const PublisedResultScheema = require('../Scheema/PublisedResultScheema')
const AssignCourseScheema = require("../Scheema/AssignCourseSchema");
const Marks= new mongoose.model("marks", AddNumberScheema);
const CheakLoginControler = require('../MiddleWears/CheakLoginControler')
const StudentScheema = require("../Scheema/StudentScheema");
const Students= new mongoose.model("student", StudentScheema);
const CourseScheema = require("../Scheema/CourseList");
const AssignCourseModel= new mongoose.model("assigncourse", AssignCourseScheema);
const PublisedResultModel= new mongoose.model("publisedresultscheema", PublisedResultScheema);
const CourseList= new mongoose.model("course", CourseScheema);
const saltRounds = 10;
router.post("/login", async(req,res)=>{
    try {

       const user = await Controler.find({ name: req.body.name });
       if (user&&user.length>0) {
            const isvalidPassword=  await bcrypt.compare(req.body.password, user[0].password);
             if(isvalidPassword) {
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

 router.get("/AllResult", CheakLoginControler, async (req, res) => {
  try {
    const { roll, Semester } = req.query;




    const results = await Marks.find({ Roll: roll, Semester: Semester });

    if (results && results.length > 0) {
      res.json(results);
    } else {
      res.status(404).json({ error: "No matching records found" });
    }
  } catch (error) {

    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
});


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
 router.get("/SingleStudents", CheakLoginControler, async (req, res) => {
    try {
      const roll = req.query.roll;
    
  
      const user = await Students.findOne({ roll: roll });
   
      if (user) {
        res.send(user);
      } else {
        res.status(404).json({ error: "Student not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

router.post("/AddCourse",CheakLoginControler, async(req,res)=>{
   
    try {
        const Course = new CourseList({
            CourseName: req.body.CourseName,
            CourseTitle: req.body.CourseTitle,
            CreditHours: req.body.CreditHours,
            semister:req.body.semister
        });
        await Course.save();
        res.status(200).json({
            message: "Course add successful!",
        });
    } catch(error) {
  
        res.status(200).json({
            message: "someting is wrong",
        });
    }
})
router.post("/PublisedResult",CheakLoginControler, async(req,res)=>{
   
    try {
        
        const PublisedResult = new PublisedResultModel({
            name: req.body[0].Name,
            roll:req.body[0].Roll,
            reg: req.body[0].Reg,
            semester: req.body[0].Semester
        });
        await PublisedResult.save();
        res.status(200).json({
            message: "Result Publised successful!",
        });
    } catch(error) {
  
        res.status(200).json({
            message: "someting is wrong",
        });
    }
})

router.delete("/HideResult/:roll/:semester", async (req, res) => {
    try {
      const result = await PublisedResultModel.deleteMany({
        roll: req.params.roll,
        semester: req.params.semester,
      });
  
      if (result.deletedCount === 0) {
        res.status(200).json({
          message: "No matching data found to delete",
        });
      } else {
        res.status(200).json({
          message: "Deleted Successfully",
        });
      }
    } catch (error) {
    
      res.status(500).json({
        error: "There was a server-side error!",
      });
    }
  });
  router.put("/UpdatedStudents/:id", async (req, res) => {
    try {
      const roll = req.params.id;
      const student = await Students.findOne({ roll });
    
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
  
      if (student.current_semister < 8) {
        student.current_semister += 1;
        await student.save();
  
        return res.status(200).json({
          message: "Student's semester updated successfully",
          updatedStudent: student,
        });
      } else {
        return res.status(200).json({ error: "Student has already completed semester 8" });
      }
    } catch (error) {
    
      return res.status(500).json({
        error: "There was a server-side error",
      });
    }
  });
  
  
module.exports = router;