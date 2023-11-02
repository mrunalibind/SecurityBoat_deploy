// Authentication Midlleware, to access the task routes, user should be logged in

let jwt=require("jsonwebtoken");
// const { BlacklistModel } = require("../models/blacklist_model");

let authentication=async(req,res,next)=>{
    
    let token= req.header('Authorization').split(" ")[1];
    // console.log(req.cookies.token);
    // console.log(token,"token");
    // let isBlacklist=await BlacklistModel.findOne({token});
    if(!token){
        return res.status(400).send({msg:"Access Denied, Login First"})
    }
    jwt.verify(token, "secretKey", function(err, decoded) {
        // console.log(decoded)
        if(decoded){
            req.body.userId=decoded.user._id;
            req.body.team=decoded.user.team;
            next();
        }
        else{
            res.status(500).send({msg:err});
        }
        
    });
      
}
module.exports={authentication};