const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

//import router files
const authRouter = require("./routes/student");
const ProfileRouter = require("./routes/profile");
const CardRouter = require("./routes/card");
const AssignmentRouter = require("./routes/assignment");
const VideoRouter = require("./routes/vedio");
const GetmoduledeatailsRouter = require("./routes/getassigments");
const SerachRouter = require("./routes/search");
const NoteRouter =require("./routes/notes");
const Createquiz =require("./routes/create_quiz");
const SaveQuestionRouter =require("./routes/question");
const ScoreRoute = require("./routes/score");

const app = express();
const PORT = process.env.PORT || 9001;

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
app.use(NoteRouter);
app.use(Createquiz);
app.use(SaveQuestionRouter);
app.use(ScoreRoute);

// server.js or the relevant file
app.use("/Uploads", express.static(path.join(__dirname, "Uploads")));
app.use("/Profileimge", express.static(path.join(__dirname, "Profile")));
app.use("/Assignmentfile", express.static(path.join(__dirname, "Assignments")));
app.use("/VideoFile", express.static(path.join(__dirname, "Vedios")));
app.use("/NotesFile", express.static(path.join(__dirname, "Notes")));

mongoose
  .connect("mongodb://localhost:27017/lerning_managment_system", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to mongodb successfully");

    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));
app.use("/api/auth", authRouter);
