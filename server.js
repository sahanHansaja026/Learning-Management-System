const express =require("express");
const mongoose = require("mongoose");
const cors =require("cors");
const bodyParser=require("body-parser");

//import router files
const authRouter = require("./routes/student");
const ProfileRouter = require("./routes/profile");
const CardRouter = require("./routes/card");
const AssignmentRouter = require("./routes/assignment");
const VideoRouter=require("./routes/vedio");
const GetmoduledeatailsRouter = require("./routes/getassigments");
const SerachRouter = require("./routes/search");

const app=express();
const PORT=process.env.PORT || 9001;

//middleware

app.use(cors());
app.use(bodyParser.json());

// route middleware
app.use(ProfileRouter);
app.use(CardRouter);
app.use(AssignmentRouter);
app.use(VideoRouter);
app.use(GetmoduledeatailsRouter);
app.use(SerachRouter);

mongoose.connect("mongodb://localhost:27017/lerning_managment_system",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("connected to mongodb successfully");

    app.listen(PORT, () =>{
        console.log(`server is running on port ${PORT}`);
    });
}).catch((err)=> console.error("Failed to connect to MongoDB",err));
app.use("/api/auth",authRouter);
