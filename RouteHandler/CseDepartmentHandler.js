const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const CseDepartmentSchema = require('../Scheema/CseDepartmentSchema')
const DepartmentOfCSE= new mongoose.model("DepartmentOfCSE", CseDepartmentSchema);
const bcrypt = require("bcrypt");
const DepartmentSchema= require("../Scheema/DepartmentSchema")
const StudentScheema = require("../Scheema/StudentScheema");
const CourseScheema = require("../Scheema/CourseList");
const AssignCourseScheema = require("../Scheema/AssignCourseSchema");
const AssignRetakeReffredCourseScheema = require("../Scheema/AssignRetakeReffredSchema");
const TeacherScheema = require("../Scheema/TeacherScheema");
const Students= new mongoose.model("student", StudentScheema);
const Teachers= new mongoose.model("teacher", TeacherScheema);
const CourseList= new mongoose.model("course", CourseScheema);
const AssignCourseModel= new mongoose.model("assigncourse", AssignCourseScheema);
const AssingRetakeReffredModel= new mongoose.model("assignretakereffredcourse", AssignRetakeReffredCourseScheema);
const jwt = require("jsonwebtoken");
const Department = new mongoose.model("CSE",DepartmentSchema);
const CheakLoginControler = require('../MiddleWears/CheakLoginControler')
const saltRounds = 10;
router.post("/StudentsRegistration",async(req,res)=>{
 
    const hashpassword =  await bcrypt.hash(req.body.password_1, saltRounds);
    // console.log(hashpassword);
    try {
    //    console.log(req.body)
        const newStudents = new Students({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            batch: req.body.batch,
            department: req.body.Department,
            registration_number: req.body.Registration_Number,
            current_semister: req.body.current_semister,
            roll: req.body.Roll_Number,
            password: hashpassword,
        });
        await newStudents.save();
        res.status(200).json({
            message: "Signup was successful!",
        });
    } catch(error) {
 
        res.status(200).json({
            message: "username and email should be uniqe",
        });
    }
})
router.post("/TeachersRegistration",CheakLoginControler, async(req,res)=>{
    const hashpassword =  await bcrypt.hash(req.body.password_1, saltRounds);

    try {
        const newTeachers = new Teachers({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            position: req.body.position,
            department: req.body.Department,
            password: hashpassword,
        });
        await newTeachers.save();
        res.status(200).json({
            message: "Signup was successful!",
        });
    } catch(error) {
   
        res.status(200).json({
            message: "username and email should be uniqe",
        });
    }
})
router.put("/EditTeachers/:id", CheakLoginControler, async (req, res) => {
  try {
    const result =  Teachers.findByIdAndUpdate(
      { _id: req.params.id },
      {
        
        $set: {
      
          position: req.body.position,
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
   
  } catch (error) {
  
    res.status(200).json({
      message: "username and email should be unique",
    });
  }
});
router.delete("/DeleteTeachers/:id", async (req, res) => {
  try {
    Teachers.deleteOne({_id: req.params.id},
      (err) => {
          if (err) {
            res.status(500).json({
              error: "There was a server side error!",
            });
          } else {
            res.status(200).json({
            
              message: "Delete SUccessfully",
            });
          }
        }
      )
  } catch (error) {

    res.status(200).json({
      message: "username and email should be unique",
    });
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

router.get("/AllTeachers",CheakLoginControler,async(req,res)=>{
    try {  
        const user = await Teachers.find({  });
        if(user&&user.length>0){
            res.send(user)
        }
        
    } catch (error) {
        res.status(200).json({
            "error": "Wrong Username and password"
        }); 
    }
  
     
 })
 router.get("/AllCourse",CheakLoginControler,async(req,res)=>{
    try {  
        const user = await CourseList.find({  });
        if(user&&user.length>0){
            res.send(user)
        }
        
    } catch (error) {
        res.status(200).json({
            "error": "Wrong Username and password"
        }); 
    }
  
     
 })

router.post("/login", async(req,res)=>{
    try {
 
       const user = await Department.find({ username: req.body.username });
      // console.log(user)
       if (user&&user.length>0) {
            //  const isvalidPassword=  await bcrypt.compare(req.body.password, user[0].password);
         
             if(req.body.password_2==user[0].password) {
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
      
        const user = await DepartmentOfCSE.find({Department: req.query.Department  });
      
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
   router.delete("/DeleteCourse/:id", async (req, res) => {
    try {
      AssignCourseModel.deleteOne({_id: req.params.id},
        (err) => {
            if (err) {
              res.status(500).json({
                error: "There was a server side error!",
              });
            } else {
              res.status(200).json({
              
                message: "Delete SUccessfully",
              });
            }
          }
        )
    } catch (error) {

      res.status(200).json({
        message: "username and email should be unique",
      });
    }
  });
 router.get("/SingleTechersCourse", CheakLoginControler, async (req, res) => {
  
    try {  
      const user = await AssignCourseModel.find({  });
      if(user&&user.length>0){
          res.send(user)
      }
      
  } catch (error) {
      res.status(200).json({
          "error": "Wrong Username and password"
      }); 
  }
  });

  router.post("/AssignCourse", CheakLoginControler, async (req, res) => {

    try {
      const assignCourse = new AssignCourseModel({
        courseName: req.body.CourseName,
        teachersName: req.body.TeachersName,
        CourseHoure: req.body.courseHoure,
        semester: req.body.semesters.map((semester) => ({
          batch: semester.batch,
          semester: semester.semester,
        })),
        department: req.body.Department,
      });
  
      await assignCourse.save();
      res.status(200).json({
        message: "Signup was successful!",
      });
    } catch (error) {
  
      res.status(200).json({
        message: "username and email should be unique",
      });
    }
  });
  router.put("/EditCourse/:id", CheakLoginControler, async (req, res) => {

    try {
      const result =  AssignCourseModel.findByIdAndUpdate(
        { _id: req.params.id },
        {
          
          $set: {
        
                teachersName: req.body.TeachersName,
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

    } catch (error) {

      res.status(200).json({
        message: "username and email should be unique",
      });
    }
  });
  router.delete("/DeleteCourse/:id", async (req, res) => {

    try {
      AssignCourseModel.deleteOne({_id: req.params.id},
        (err) => {
            if (err) {
              res.status(500).json({
                error: "There was a server side error!",
              });
            } else {
              res.status(200).json({
              
                message: "Delete SUccessfully",
              });
            }
          }
        )
    } catch (error) {
   
      res.status(200).json({
        message: "username and email should be unique",
      });
    }
  });
  router.get("/AllCourseList",CheakLoginControler,async(req,res)=>{
    try {  
        const user = await AssignCourseModel.find({  });
        if(user&&user.length>0){
            res.send(user)
        }
        
    } catch (error) {
        res.status(200).json({
            "error": "Wrong Username and password"
        }); 
    }
 })
  router.post("/AssignRetakeCourse", CheakLoginControler, async (req, res) => {

    try {
      const assignCourse = new AssingRetakeReffredModel({
        courseName: req.body.CourseName,
        teachersName: req.body.TeachersName,
        semester: req.body.semesters.map((semester) => ({
          batch: semester.batch,
          semester: semester.semester,
          roll: semester.roll,
          registration: semester.registration,
          retakeReferral: semester.retakeReferral
        })),
        department: req.body.Department,
      });
  
      await assignCourse.save();
      res.status(200).json({
        message: "Signup was successful!",
      });
    } catch (error) {
   
      res.status(200).json({
        message: "username and email should be unique",
      });
    }
  });
 



 module.exports = router;