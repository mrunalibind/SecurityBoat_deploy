// Backend deployment Link : https://wandering-tick-suit.cyclic.app/

let express=require("express");
let cors=require("cors");
const { connection } = require("./db");
let cookie=require("cookie-parser");
const { userRouter } = require("./routes/user_route");
const { taskRouter } = require("./routes/task_route");
let app=express();

app.use(express.json());
app.use(cookie());
app.use(cors());
app.use("/user",userRouter);
app.use("/task",taskRouter);

app.get("/",(req,res)=>{
    res.end("Hello, it's working");
})

app.listen(8050,async()=>{
    try {
        await connection;
        console.log("Connected to mongoDB");
    } catch (error) {
        console.log(error);
    }
    console.log("Server is running on port",8050)
})