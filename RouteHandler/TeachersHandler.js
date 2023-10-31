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
 router.get("/Profile",CheakLoginControler,async(req,res)=>{
      try {  
          const user = await Teachers.find({username: req.query.username  });
          if(user&&user.length>0){
              res.send(user)
          }   
      } catch (error) {
          res.status(200).json({
              "error": "Wrong Username and password"
          }); 
      }
   })
   
router.get('/AssignCourse', CheakLoginControler, async (req, res) => {
    try {
      const teacherNameToSearch = req.query.teachername; 
      const courses = await AssignCourseModel.find({
        teachersName: { $regex: new RegExp(teacherNameToSearch, 'i') }
      });
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
          }
          
      } catch (error) {
          res.status(200).json({
              "error": "Wrong Username and password"
          }); 
      }       
   })
   router.post("/Marks", async (req, res) => {
    try {
        const Sessional = parseInt(req.body.Sessional);
        const Midterm = parseInt(req.body.Midterm);
        const Final = parseInt(req.body.Final);
        const Total = Sessional + Midterm + Final;

        // Calculate CGPA based on Total
        let CGPA = "";
        if (Total >= 80 && Total <= 100) {
            CGPA = 4.0;
        } else if (Total >= 75 && Total <= 79) {
            CGPA = 3.75;
        } else if (Total >= 70 && Total <= 74) {
            CGPA = 3.5;
        } else if (Total >= 65 && Total <= 69) {
            CGPA = 3.25;
        } else if (Total >= 60 && Total <= 64) {
            CGPA = 3.0;
        } else if (Total >= 55 && Total <= 59) {
            CGPA = 2.75;
        } else if (Total >= 50 && Total <= 54) {
            CGPA = 2.5;
        } else if (Total >= 45 && Total <= 49) {
            CGPA = 2.25;
        } else if (Total >= 40 && Total <= 44) {
            CGPA = 2.0;
        } else if (Total >= 0 && Total <= 39) {
            CGPA = 0.0;
        }

        const MarksAdd = new Marks({
            Sessional: Sessional,
            Midterm: Midterm,
            Final: Final,
            Total: Total,
            CGPA: CGPA, // Add CGPA to the schema
            CourseHoure: req.body.CourseHoure,
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
    
        res.status(200).json({
            message: "Something Is Wrong, Please Try Again",
        });
    }
});

router.get("/ResultList",CheakLoginControler,async(req,res)=>{
         try {  
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
            let Total = 0;
    
            // Calculate the Total based on the request body or existing data
            if (req.body.Sessional) {
                Total += parseInt(req.body.Sessional);
            } else {
                Total += parseInt(user[0].Sessional);
            }
            if (req.body.Midterm) {
                Total += parseInt(req.body.Midterm);
            } else {
                Total += parseInt(user[0].Midterm);
            }
            if (req.body.Final) {
                Total += parseInt(req.body.Final);
            } else {
                Total += parseInt(user[0].Final);
            }
    
            // Calculate CGPA based on Total
            let CGPA = "";
            if (Total >= 80 && Total <= 100) {
                CGPA = 4.0;
            } else if (Total >= 75 && Total <= 79) {
                CGPA = 3.75;
            } else if (Total >= 70 && Total <= 74) {
                CGPA = 3.5;
            } else if (Total >= 65 && Total <= 69) {
                CGPA = 3.25;
            } else if (Total >= 60 && Total <= 64) {
                CGPA = 3.0;
            } else if (Total >= 55 && Total <= 59) {
                CGPA = 2.75;
            } else if (Total >= 50 && Total <= 54) {
                CGPA = 2.5;
            } else if (Total >= 45 && Total <= 49) {
                CGPA = 2.25;
            } else if (Total >= 40 && Total <= 44) {
                CGPA = 2.0;
            } else if (Total >= 0 && Total <= 39) {
                CGPA = 0.0;
            }
    
            // Create an updatedData object with Total and CGPA
            const updatedData = {
                Total: Total,
                CGPA: CGPA, // Add CGPA field
            };
    
            // Check if Midterm, Sessional, and Final are in the request body and update them accordingly
            if (req.body.Midterm) {
                updatedData.Midterm = req.body.Midterm;
            }
            if (req.body.Sessional) {
                updatedData.Sessional = req.body.Sessional;
            }
            if (req.body.Final) {
                updatedData.Final = req.body.Final;
            }
    
            // Use Mongoose's findByIdAndUpdate to update the document
            const result = await Marks.findByIdAndUpdate(req.params.id, updatedData, {
                new: true,
            });
    
            if (!result) {
                return res.status(404).json({
                    message: 'Document not found',
                });
            }
    
            res.status(200).json({
                message: 'Updated successfully',
                updatedData: result,
            });
        } catch (error) {
            res.status(500).json({
                error: 'There was an error',
            });
        }
    });
    
module.exports = router;