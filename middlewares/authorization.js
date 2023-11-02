// Authorization Middleware, user have a admin role, can do crud operation on every task
let jwt=require("jsonwebtoken");
const { TaskModel } = require("../models/task_model");

let authorization=()=>{
    return async(req,res,next)=>{
        
        let token=req.header('Authorization').split(" ")[1] | req.cookies.token;
        let {id}=req.params;
        jwt.verify(token, "secretKey", async function(err, decoded) {
            console.log(decoded)
            if(decoded){                    
                if(decoded.user.role=="Admin"){
                    next();
                }
                else if(decoded.user.role=="User"){
                    let task=await TaskModel.findOne({_id:id});
                    if(task.userId==decoded.user._id){
                        next();
                    }
                    else{
                        res.status(500).send({msg:"You can't delete and update others Tasks"})
                    }
                }
            }    
            
        });


        
        
    }
}

module.exports={authorization};
