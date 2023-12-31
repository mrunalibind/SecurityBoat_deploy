let express=require("express");
const { TaskModel } = require("../models/task_model");
const { authentication } = require("../middlewares/authentication");
const { authorization } = require("../middlewares/authorization");
let taskRouter=express.Router();

// Post Request, create tasks
taskRouter.post("/create",authentication,async(req,res)=>{
    let {title,task,userId,team}=req.body;
    try {
        let newtask=new TaskModel({title,task,userId,team});
        await newtask.save();
        res.status(200).send({msg:"Task is created"});
    } catch (error) {
        res.status(500).send({msg:error.message});
    }
})


// Get Request, retrieve all tasks
taskRouter.get("/retrieve",authentication,async(req,res)=>{
    try {
        let {team}=req.body;
        
        let tasks=await TaskModel.find({team:team});
        res.status(200).send({msg:tasks});
    } catch (error) {
        res.status(500).send({msg:error.message});
    }
})

// Patch request, update a particular task by passing id on param
taskRouter.patch("/update/:id",authentication,authorization(["User","Admin"]),async(req,res)=>{
    let {id}=req.params;
    let {title,task,userId,team}=req.body;
    try {
        await TaskModel.findByIdAndUpdate({_id:id},{title,task,userId,team});
        res.status(200).send({msg:"Task Updated"});
        
    } catch (error) {
        console.log("err")
        res.status(500).send({msg:error.message});
    }
})

// Delete request, delete a particular task by passing id
taskRouter.delete("/remove/:id",authentication,authorization(["User","Admin"]),async(req,res)=>{
    let {id}=req.params;
    try {
        await TaskModel.findByIdAndDelete({_id:id});
        res.status(200).send({msg:"Task Deleted"});
    } catch (error) {
        res.status(500).send({msg:error.message});
    }
})

// Pagination: Display 5 task per page
taskRouter.get('/pagination', authentication,async(req, res) => {
    try {
        let {team}=req.body;
        console.log(team);
        const page = parseInt(req.query.page) || 1;
        const perPage = 5;
        const skip = (page - 1) * perPage;

        const totalCount = await TaskModel.countDocuments({team});

        const totalPages = Math.ceil(totalCount / perPage);
    
        const items = await TaskModel.find({team})
          .skip(skip)
          .limit(perPage);
        let loginUserID=req.body.userId;
    
        res.status(200).send({ page, items, totalPages, loginUserID });
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
      }
  });


module.exports={taskRouter};