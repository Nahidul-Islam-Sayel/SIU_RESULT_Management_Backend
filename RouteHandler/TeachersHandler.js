const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const bcrypt = require("bcrypt");
const TeacherScheema = require("../Scheema/TeacherScheema");
const Teachers= new mongoose.model("teacher", TeacherScheema);
const AddNumberScheema = require("../Scheema/AddNumberScheema");
const StudentScheema = require("../Scheema/StudentScheema");
const Students= new mongoose.model("student", StudentScheema);
const jwt = require("jsonwebtoken");
const AssignCourseScheema = require("../Scheema/AssignCourseSchema");
const AssignRetakeReffredCourseScheema = require("../Scheema/AssignRetakeReffredSchema");
const AssignCourseModel= new mongoose.model("assigncourse", AssignCourseScheema);
const Marks= new mongoose.model("marks", AddNumberScheema);
const AssingRetakeReffredModel= new mongoose.model("assignretakereffredcourse", AssignRetakeReffredCourseScheema);
const CheakLoginControler = require('../MiddleWears/CheakLoginControler')
const saltRounds = 10;
router.post("/login", async(req,res)=>{
    try {

       const user = await Teachers.find({ username: req.body.name });
 
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
   
   router.get('/AssignCourse', CheakLoginControler, async (req, res) => {
    try {
      const teacherNameToSearch = req.query.teachername; // The search query parameter
  console.log(teacherNameToSearch)
      const courses = await AssignCourseModel.find({
        teachersName: { $regex: new RegExp(teacherNameToSearch, 'i') }
      });
  console.log(courses)
      if (courses && courses.length > 0) {
        res.send(courses);
      } else {
        res.status(404).json({
          error: 'No courses found for the specified teacher name.'
        });
      }
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while fetching data.'
      });
    }
  });
  router.get("/Students",CheakLoginControler,async(req,res)=>{
      try {  
          const user = await Students.find({ current_semister: req.query.semester  });
        
          if(user&&user.length>0){
              res.send(user)
             // console.log(user)
          }
          
      } catch (error) {
          res.status(200).json({
              "error": "Wrong Username and password"
          }); 
      }       
   })
   router.post("/Marks", async (req, res) => {
    try {
        console.log(req.body);
        const Sessional = parseInt(req.body.Sessional);
        const Midterm = parseInt(req.body.Midterm);
        const Final = parseInt(req.body.Final);
        
        const MarksAdd = new Marks({
            Sessional: Sessional,
            Midterm: Midterm,
            Final: Final,
            Total: Sessional + Midterm + Final,
            Roll: req.body.Roll,
            CourseCode: req.body.CourseCode,
            Semester: req.body.semester,
            Name: req.body.name,
            Reg: req.body.registation
        });
        
        await MarksAdd.save();
        
        res.status(200).json({
            message: "Marks Added Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(200).json({
            message: "Something Is Wrong, Please Try Again",
        });
    }
});
    router.get("/ResultList",CheakLoginControler,async(req,res)=>{
  
         try {  
           console.log(req.query.course )
             const user = await Marks.find({ CourseCode: req.query.course });
           
             if(user&&user.length>0){
                 res.send(user)
                 
             }
             
         } catch (error) {
             res.status(200).json({
                 "error": "Wrong Username and password"
             }); 
         }
       
          
      })
      router.put('/EditNumber/:id', async (req, res) => {
        try {
          const user = await Marks.find({ _id: req.params.id });
          console.log(user)
            let Total =0;
            if(req.body.Sessional)
               Total+=parseInt(req.body.Sessional);
            else Total+=parseInt(user[0].Sessional);
            if(req.body.Midterm)
               Total+=parseInt(req.body.Midterm);
            else Total+=parseInt(user[0].Midterm);
            if(req.body.Final)
               Total+= parseInt(req.body.Final)
            else Total+=parseInt(user[0].Final)
            const updatedData = {
                Total: Total
            };
            if (req.body.Midterm) {
              updatedData.Midterm = req.body.Midterm;
          }
          if (req.body.Sessional) {
            updatedData.Sessional = req.body.Sessional;
        }

          if (req.body.Final) {
              updatedData.Final = req.body.Final;
          }
          
            const result = await Marks.findByIdAndUpdate(req.params.id, updatedData, {
                new: true
            });
    
            if (!result) {
                return res.status(404).json({
                    message: 'Document not found'
                });
            }
    
            res.status(200).json({
                message: 'Updated successfully',
                updatedData: result
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: 'There was an error'
            });
        }
    });
module.exports = router;